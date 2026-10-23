---
title: "SQLAlchemy 会话与事务"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 5
article: false
---

# SQLAlchemy 会话与事务

先把三个对象分开：Engine 管理连接基础设施，Connection 表达数据库连接，Session 跟踪 ORM 对象与事务。不要把一个全局 Session 交给所有请求或线程共享。

## 内存数据库练习

```python
# 可独立运行；需要 SQLAlchemy 2.x
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

class Base(DeclarativeBase):
    pass

class Note(Base):
    __tablename__ = "notes"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
try:
    with Session(engine) as session, session.begin():
        session.add(Note(title="Python"))
    with Session(engine) as session:
        note = session.scalars(select(Note).where(Note.title == "Python")).one()
        assert note.title == "Python"
finally:
    engine.dispose()
```

示例只操作进程内的 SQLite，不连接业务库。`session.begin()` 管理事务区间，成功提交、异常回滚；`flush()` 同步待写入的改变，不等于提交事务。

## 关系加载与连接池

先能正确完成一个事务，再观察关系属性访问是否触发额外查询。解决 N+1 需要结合查询方式选择加载策略；扩大连接池不能代替缩短长事务。

## 会话所有权

Session 不是跨线程共享的工作单元。Web 请求、后台任务和并行线程应分别拥有自己的会话，明确谁负责提交、回滚和关闭。完整参数和边界参阅[SQLAlchemy 会话基础](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)。

---

[上一篇](/notes/python/practice/fastapi.md) · [下一篇](/notes/python/practice/celery.md) · [学习目录](/notes/python/README.md)
