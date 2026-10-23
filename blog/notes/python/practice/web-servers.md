---
title: "WSGI、ASGI 与服务器"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 2
article: false
---

# WSGI、ASGI 与服务器

先分清层次：Flask、FastAPI 帮我们写 Web 应用；Gunicorn、Uvicorn 等服务器接收连接并调用应用；WSGI、ASGI 约定服务器与应用之间的接口。反向代理还可能位于服务器前面。

## WSGI 的同步调用形状

WSGI 应用接收 `environ` 和 `start_response`，返回可迭代的字节块。`environ` 不全是字符串：它还可以包含输入流、版本元组和布尔值。

```python
# 可独立运行
from wsgiref.util import setup_testing_defaults
from wsgiref.validate import validator

def application(environ, start_response):
    body = b"Hello, WSGI!"
    start_response("200 OK", [
        ("Content-Type", "text/plain; charset=utf-8"),
        ("Content-Length", str(len(body))),
    ])
    return [body]

environ = {}
setup_testing_defaults(environ)
seen = {}

def start_response(status, headers, exc_info=None):
    seen["status"] = status
    return lambda data: None

result = validator(application)(environ, start_response)
try:
    assert b"".join(result) == b"Hello, WSGI!"
finally:
    result.close()
assert seen["status"] == "200 OK"
```

## ASGI 的事件交互

ASGI 的异步应用通常接收 `scope`、`receive`、`send`：先知道连接范围，再接收事件和发送事件。HTTP 请求体可分多段到达；WebSocket 和 lifespan 也有各自的事件约定。只处理一次 HTTP 请求的教学函数不能代表完整服务器。

## 进程和 worker

Gunicorn 的 master 管理 worker，应用代码通常由 worker 执行；预加载会改变应用导入的位置，随后仍由 worker 处理请求。不能把“Gunicorn 进程 + Flask 进程”简单理解成固定两个进程。进程数和 worker 模型由配置决定。

## 从开发到部署

本地开发服务器用于调试。部署还要考虑并发模型、代理转发、超时、连接池和优雅停机；使用 Flask 的异步视图，也不会自动把整个 WSGI 部署改成 ASGI 模型。

详细协议与调用过程可以继续看[已有 WSGI 学习材料](/posts/interview/Backend/Flask.md#wsgi-notes)。下一篇是[Flask 应用实践](./flask.md)。

---

[上一篇](/notes/python/practice/project-quality.md) · [下一篇](/notes/python/practice/flask.md) · [学习目录](/notes/python/README.md)
