---
title: "FastAPI 请求与校验"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 4
article: false
---

# FastAPI 请求与校验

FastAPI 用函数签名描述路径参数、查询参数和请求体，再把校验与文档生成连接起来。先分清输入在哪里，再考虑异步与部署。

## 最小接口

```python
# 可独立运行；需要 FastAPI 和 httpx
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str
    quantity: int = Field(ge=0)

app = FastAPI()

@app.post("/items")
def create_item(item: Item):
    return item.model_dump()

with TestClient(app) as client:
    response = client.post("/items", json={"name": "book", "quantity": 2})
    assert response.status_code == 200
    assert response.json()["quantity"] == 2
    assert client.post("/items", json={"name": "book", "quantity": -1}).status_code == 422
```

这个示例按 Pydantic v2 写。字段约束明确要求非负整数，但默认校验仍可能进行类型转换；需要严格输入语义时，应另外配置相应规则。框架的基础调用方式见[官方入门](https://fastapi.tiangolo.com/tutorial/first-steps/)。

## 同步与异步函数

有可等待的异步 IO 时，使用 `async def` 并 `await` 对应接口。不要在异步视图里直接运行长时间阻塞调用；普通 `def` 路由和异步路由的执行方式不同，选择要和依赖库一致。

## 依赖与生命周期

可复用的请求依赖适合用 `Depends` 表达。数据库会话等需要清理的资源，应有明确的创建和关闭区间；进程启动和关闭阶段的共享资源可由生命周期管理。后台任务不应继续使用已经结束请求的会话。

下一篇：[SQLAlchemy 会话与事务](./sqlalchemy.md)。

---

[上一篇](/notes/python/practice/flask.md) · [下一篇](/notes/python/practice/sqlalchemy.md) · [学习目录](/notes/python/README.md)
