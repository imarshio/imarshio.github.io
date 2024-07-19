---
icon: fa-brands fa-python
order: 99
category:
  - python
title: ModuleNotFoundError No module named '_ctypes'
tag:
- python
- 小技巧
---

## 背景

在 Linux 上运行 celery，执行 `celery -A _celery worker -l INFO` 的时候报错

```log
/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/platforms.py:829: SecurityWarning: You're running the worker with superuser privileges: this is
absolutely not recommended!

Please specify a different user using the --uid option.

User information: uid=0 euid=0 gid=0 egid=0

  warnings.warn(SecurityWarning(ROOT_DISCOURAGED.format(
 
 -------------- celery@DESKTOP-I2O884V v5.4.0 (opalescent)
--- ***** ----- 
-- ******* ---- Linux-5.15.153.1-microsoft-standard-WSL2-x86_64-with-glibc2.34 2024-07-18 10:32:43
- *** --- * --- 
- ** ---------- [config]
- ** ---------- .> app:         spiders:0x7f0aa7fda520
- ** ---------- .> transport:   redis://localhost:6379/0
- ** ---------- .> results:     redis://
- *** --- * --- .> concurrency: 16 (prefork)
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** ----- 
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery


[tasks]
  . _celery.tasks.add
  . _celery.tasks.multiplication
  . _celery.tasks.xsum

[2024-07-18 10:32:43,612: CRITICAL/MainProcess] Unrecoverable error: ModuleNotFoundError("No module named '_ctypes'")
Traceback (most recent call last):
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/worker/worker.py", line 202, in start
    self.blueprint.start(self)
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/bootsteps.py", line 116, in start
    step.start(parent)
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/bootsteps.py", line 365, in start
    return self.obj.start()
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/concurrency/base.py", line 130, in start
    self.on_start()
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/concurrency/prefork.py", line 109, in on_start
    P = self._pool = Pool(processes=self.limit,
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/concurrency/asynpool.py", line 464, in __init__
    super().__init__(processes, *args, **kwargs)
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/billiard/pool.py", line 1045, in __init__
    self._create_worker_process(i)
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/celery/concurrency/asynpool.py", line 482, in _create_worker_process
    return super()._create_worker_process(i)
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/billiard/pool.py", line 1141, in _create_worker_process
    on_ready_counter = self._ctx.Value('i')
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/billiard/context.py", line 177, in Value
    from .sharedctypes import Value
  File "/root/.pyenv/versions/3.8.0/envs/python-3.8.0/lib/python3.8/site-packages/billiard/sharedctypes.py", line 10, in <module>
    import ctypes
  File "/root/.pyenv/versions/3.8.0/lib/python3.8/ctypes/__init__.py", line 7, in <module>
    from _ctypes import Union, Structure, Array
ModuleNotFoundError: No module named '_ctypes'
```

## 解决

这个错误通常表明Python环境中缺少了 _ctypes 模块。_ctypes 是一个 Python 标准库中的模块，用于与C语言编写的库进行交互，是 ctypes 库的一个关键部分。如果这个模块没有正确安装或者损坏，当尝试导入 ctypes 或者依赖它的任何模块时，就会抛出 ModuleNotFoundError 异常。

下载一个 `eventlet`

```sh
apt-get update
apt-get install libffi-dev
```
