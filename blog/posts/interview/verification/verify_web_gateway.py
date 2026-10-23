"""协议接口断言 + 临时 loopback 服务冒烟；不加载业务应用，不连接数据库。"""
import asyncio
import importlib.util
import os
import signal
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import ProxyHandler, build_opener
from wsgiref.util import setup_testing_defaults
from wsgiref.validate import validator

ROOT = Path(__file__).resolve().parent
source = ROOT/'web_gateway_demo.py'
spec = importlib.util.spec_from_file_location('gateway_demo', source)
demo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(demo)

environ = {}
setup_testing_defaults(environ)
environ['QUERY_STRING'] = ''
response = {}
def start_response(status, headers, exc_info=None):
    response.update(status=status, headers=dict(headers))
chunks = validator(demo.wsgi_app)(environ, start_response)
try:
    assert b''.join(chunks) == b'WSGI OK\n'
finally:
    chunks.close()
assert response['status'] == '200 OK'
assert response['headers']['Content-Length'] == '8'

async def check_asgi():
    sent = []
    events = iter([{'type':'http.request','body':b'a','more_body':True},
                   {'type':'http.request','body':b'b','more_body':False}])
    async def receive():
        return next(events)
    async def send(event):
        sent.append(event)
    await demo.asgi_app({'type':'http'}, receive, send)
    assert [e['type'] for e in sent] == ['http.response.start','http.response.body']
    assert sent[0]['status'] == 200 and sent[1]['body'] == b'ASGI OK\n'
    sent.clear()
    async def disconnected():
        return {'type':'http.disconnect'}
    await demo.asgi_app({'type':'http'}, disconnected, send)
    assert not sent
asyncio.run(check_asgi())
print('WSGI 标准校验与 ASGI 请求分块/断开事件断言通过')

# 忽略代理环境变量，固定连接本机临时端口。应用从临时目录导入。
opener = build_opener(ProxyHandler({}))
def smoke(kind, expected):
    with tempfile.TemporaryDirectory(prefix='interview_web_gateway_') as directory:
        directory = Path(directory)
        (directory/'gateway_demo.py').write_bytes(source.read_bytes())
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0))
            port = sock.getsockname()[1]
        if kind == 'gunicorn':
            args = ['-m','gunicorn','--chdir',str(directory),
                    '--bind',f'127.0.0.1:{port}','--workers','1',
                    '--worker-class','sync','gateway_demo:wsgi_app']
        else:
            args = ['-m','uvicorn','gateway_demo:asgi_app','--app-dir',str(directory),
                    '--host','127.0.0.1','--port',str(port),'--lifespan','off']
        log_path = directory/'server.log'
        with log_path.open('w') as log:
            proc = subprocess.Popen([sys.executable,'-I',*args],cwd=directory,
                                    stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:
                deadline = time.monotonic()+12
                while True:
                    if proc.poll() is not None:
                        raise AssertionError(f'{kind} 启动失败：{log_path.read_text()}')
                    try:
                        with opener.open(f'http://127.0.0.1:{port}/',timeout=1) as reply:
                            assert reply.status==200 and reply.read()==expected
                        break
                    except (URLError,TimeoutError,ConnectionError):
                        if time.monotonic() >= deadline:
                            raise AssertionError(f'{kind} 请求超时：{log_path.read_text()}')
                        time.sleep(0.05)
            finally:
                # 仅停止本次新建的独立进程组，含 Gunicorn worker。
                if proc.poll() is None:
                    os.killpg(proc.pid,signal.SIGTERM)
                try:
                    proc.wait(timeout=6)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid,signal.SIGKILL)
                    proc.wait(timeout=3)
        print(f'{kind} 本机 HTTP 冒烟通过，子进程已停止')
smoke('gunicorn',b'WSGI OK\n')
smoke('uvicorn',b'ASGI OK\n')
