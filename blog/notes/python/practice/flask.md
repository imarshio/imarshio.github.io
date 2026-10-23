---
title: "Flask 应用与测试"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 3
article: false
redirectFrom:
  - /notes/python/flask.html
---

# Flask 应用与测试

先写一个最小应用，再把初始化收进工厂函数。这样配置、扩展与路由的注册有明确入口，测试可以分别创建应用实例。[应用工厂](https://flask.palletsprojects.com/en/stable/tutorial/factory/)也是 Flask 官方教程使用的组织方式。

## 从路由到响应

下面的示例接收一个查询参数，返回 JSON，并通过测试客户端验证正常请求和错误请求。它不需要启动监听端口。

```python
# 可独立运行；需要 Flask
from flask import Flask, request

def create_app(test_config=None):
    app = Flask(__name__)
    if test_config:
        app.config.update(test_config)

    @app.get("/hello")
    def hello():
        name = request.args.get("name", "world").strip()
        if not name:
            return {"error": "name 不能为空"}, 400
        return {"message": f"Hello, {name}!"}

    return app

app = create_app({"TESTING": True})
with app.test_client() as client:
    assert client.get("/hello?name=Python").json == {"message": "Hello, Python!"}
    assert client.get("/hello?name=").status_code == 400
```

## 应用上下文与请求上下文

`request` 对应当前请求，`current_app` 指向当前应用。它们是上下文代理，不是普通的进程全局业务对象。请求结束后，后台工作不应继续依赖原来的请求代理；应提取必要数据并明确传递。

## Blueprint 与扩展

路由增多后可以用 Blueprint 按功能组织，再由工厂注册。扩展若支持 `init_app`，可以先创建未绑定实例，再在工厂中绑定，减少模块导入时就初始化外部连接的副作用。

## 从测试走到部署

测试客户端验证应用层请求响应，不覆盖真实反向代理、连接中断和多进程配置。接下来先比较 [FastAPI](./fastapi.md)，再学习[数据库会话](./sqlalchemy.md)和[后台任务](./celery.md)。

---

[上一篇](/notes/python/practice/web-servers.md) · [下一篇](/notes/python/practice/fastapi.md) · [学习目录](/notes/python/README.md)
