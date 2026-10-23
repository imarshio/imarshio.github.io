"""笔记的 WSGI 示例、教学提交模型，以及本机 Gunicorn 两 worker / preload 实验。"""
import io
import os
import re
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
import json

ROOT = Path(__file__).resolve().parents[1]
notes = (ROOT/'09-Flask专题.md').read_text().split('## 〇附、WSGI 学习笔记',1)[1].split('## 一、基础',1)[0]
codes = re.findall(r'```python\n(.*?)```',notes,re.S)
assert len(codes)==1
ns = {}
exec(compile(codes[0],'<document-wsgi-example>','exec'),ns)
application=ns['application']
environ={}
setup_testing_defaults(environ)
environ['QUERY_STRING']=''
assert isinstance(environ['wsgi.input'].read(0),bytes)
assert isinstance(environ['wsgi.version'],tuple)
assert not isinstance(environ['wsgi.multithread'],str)
assert bool(environ['wsgi.multithread']) is False
seen={}
def start_response(status,headers,exc_info=None):
    seen.update(status=status,headers=dict(headers))
    return lambda data:None
result=validator(application)(environ,start_response)
try:
    assert b''.join(result)==b'Hello, WSGI!'
finally:
    result.close()
assert seen['status']=='200 OK' and seen['headers']['Content-Type']=='text/plain; charset=utf-8'

# 仅模拟本笔记讨论的提交/清理边界，不声称这是完整 WSGI 或 HTTP 服务器。
class TeachingGateway:
    def __init__(self):
        self.pending=None
        self.sent=False
        self.committed=None
        self.body=[]
    def start_response(self,status,headers,exc_info=None):
        try:
            if exc_info is not None:
                if self.sent:
                    raise exc_info[1].with_traceback(exc_info[2])
            elif self.pending is not None:
                raise AssertionError('重复登记必须提供 exc_info')
            self.pending=(status,headers)
        finally:
            exc_info=None
        return self.write
    def write(self,data):
        assert isinstance(data,bytes) and self.pending is not None
        if not self.sent:
            self.committed=self.pending
            self.sent=True
        self.body.append(data)
    def run(self,app,limit=None):
        result=app(environ,self.start_response)
        try:
            for index,data in enumerate(result,1):
                if data:
                    self.write(data)
                if limit is not None and index>=limit:
                    break
            if not self.sent:
                self.write(b'')
        finally:
            if hasattr(result,'close'):
                result.close()

h=[('Content-Type','text/plain')]
g=TeachingGateway()
assert callable(g.start_response('200 OK',h)) and not g.sent
try:
    raise ValueError('before commit')
except ValueError:
    g.start_response('500 Internal Server Error',h,sys.exc_info())
assert not g.sent
g.write(b'error')
assert g.committed[0]=='500 Internal Server Error'
g=TeachingGateway()
g.start_response('200 OK',h)
g.write(b'partial')
try:
    raise ValueError('after commit')
except ValueError:
    info=sys.exc_info()
    try:
        g.start_response('500 Internal Server Error',h,info)
    except ValueError as raised:
        assert raised is info[1]
    else:
        raise AssertionError('提交头后应重抛原异常')
    finally:
        info=None
assert g.committed[0]=='200 OK'

closed=[]
g=TeachingGateway()
def lazy(env,start):
    def chunks():
        try:
            start('200 OK',h)
            yield b''
            assert not g.sent
            yield b'lazy'
        finally:
            closed.append('normal')
    return chunks()
g.run(lazy)
assert closed==['normal'] and g.body==[b'lazy']

class Body:
    def __init__(self,fail=False):
        self.index=0
        self.closed=False
        self.fail=fail
    def __iter__(self):return self
    def __next__(self):
        self.index+=1
        if self.index==1:return b'first'
        if self.fail:raise RuntimeError('iteration failed')
        if self.index==2:return b'second'
        raise StopIteration
    def close(self):self.closed=True
for fail,limit in [(False,None),(False,1),(True,None)]:
    body=Body(fail)
    def app(env,start):
        start('200 OK',h)
        return body
    try:
        TeachingGateway().run(app,limit)
    except RuntimeError:
        assert fail
    else:
        assert not fail
    assert body.closed
empty=TeachingGateway()
def empty_app(env,start):
    start('200 OK',h)
    return []
empty.run(empty_app)
assert empty.sent and empty.body==[b'']
print('文档 WSGI 示例、environ 类型、延迟头/exc_info 与正常/提前/异常 close 校验通过')

# 独立的最小 Flask 模块。不会导入项目 app.py，不连接任何业务服务。
source='''import os
from flask import Flask, jsonify
loaded_pid=os.getpid()
app=Flask(__name__)
@app.get('/pid')
def pid():
    return jsonify(pid=os.getpid(),ppid=os.getppid(),loaded_pid=loaded_pid,callable_app=callable(app))
'''
opener=build_opener(ProxyHandler({}))
for preload in [False,True]:
    with tempfile.TemporaryDirectory(prefix='interview_wsgi_notes_') as folder:
        folder=Path(folder)
        (folder/'pid_app.py').write_text(source)
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0))
            port=sock.getsockname()[1]
        args=[sys.executable,'-I','-m','gunicorn','--chdir',str(folder),
              '--bind',f'127.0.0.1:{port}','--workers','2','--worker-class','sync',
              '--access-logfile','-', 'pid_app:app']
        if preload:args.insert(-1,'--preload')
        log_path=folder/'server.log'
        with log_path.open('w') as log:
            proc=subprocess.Popen(args,cwd=folder,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:
                deadline=time.monotonic()+12
                while True:
                    if proc.poll() is not None:
                        raise AssertionError(log_path.read_text())
                    workers=set(map(int,re.findall(r'Booting worker with pid: (\d+)',log_path.read_text())))
                    if len(workers)==2:
                        try:
                            with opener.open(f'http://127.0.0.1:{port}/pid',timeout=1) as response:
                                data=json.load(response)
                            break
                        except (URLError,TimeoutError,ConnectionError):
                            pass
                    if time.monotonic()>deadline:
                        raise AssertionError('本机 worker 启动超时：'+log_path.read_text())
                    time.sleep(0.05)
                assert data['pid'] in workers and data['ppid']==proc.pid and data['callable_app']
                assert data['loaded_pid']==(proc.pid if preload else data['pid'])
                # 只检查本次 master 的直接子进程数量，不打印系统其他进程信息。
                output=subprocess.check_output(['ps','-axo','pid=,ppid='],text=True)
                children={int(pid) for pid,ppid in (line.split() for line in output.splitlines()) if int(ppid)==proc.pid}
                assert children==workers,children
            finally:
                if proc.poll() is None:os.killpg(proc.pid,signal.SIGTERM)
                try:proc.wait(timeout=6)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid,signal.SIGKILL)
                    proc.wait(timeout=3)
        print(f'Gunicorn 两 worker / preload={preload} 的 PID 与加载进程断言通过；已停止临时进程')
