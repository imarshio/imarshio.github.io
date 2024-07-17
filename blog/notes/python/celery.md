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

## 

