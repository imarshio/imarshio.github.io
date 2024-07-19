---
icon: fa-brands fa-python
category:
  - python
title: Python Celery
order: 24
tag:
- celery

---

## 简介

不多说，直接开干

## 下载

在 [pipy](https://pypi.org/project/celery/5.4.0/) 获取下载链接。

```sh
pip install celery==5.4.0
```

此时，你进入终端输入 `celery` 就可以获取一系列提示，表明你已经成功安装了 celery。

## Redis or MQ

我选择 Redis，官方主推 MQ

### Redis

```sh
docker run -d -p 6379:6379 redis
```

## 案例

```md
py-spider
└── _celery
    ├── celery.py
    ├── tasks.py
    └── __init__.py
└── main.py
```

### `celery.py`

实例化一个 `celery` 的 `worker`。

```py
from celery import Celery

App = Celery('spiders',
             broker='redis://localhost:6379/0',
             # 后续任务状态跟踪以及结果处理
             backend='',
             #
             include=['_celery.tasks'])

# Optional configuration, see the application user guide.
App.conf.update(
    result_expires=3600,
)

```

### `tasks.py`

```py
from .celery import App


@App.task
def add(x, y):
    return x + y


@App.task
def multiplication(x, y):
    # 乘法
    return x * y


@App.task
def xsum(numbers):
    return sum(numbers)

```

### 启动 `worker`

```sh
# 进入 _celery 模块的上一级执行如下命令
celery -A _celery worker -l INFO

# 你会得到如下一系列输出
 -------------- celery@DESKTOP-I2O884V v5.4.0 (opalescent)
--- ***** -----
-- ******* ---- Windows-10-10.0.19045-SP0 2024-07-18 09:48:14
- *** --- * ---
- ** ---------- [config]
- ** ---------- .> app:         spiders:0x174e438d5e0
- ** ---------- .> transport:   redis://localhost:6379/0
- ** ---------- .> results:     disabled://
- *** --- * --- .> concurrency: 16 (prefork)
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** -----
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery


[tasks]
  . _celery.tasks.add
  . _celery.tasks.multiplication
  . _celery.tasks.xsum


```

### 调用任务

```py

```
