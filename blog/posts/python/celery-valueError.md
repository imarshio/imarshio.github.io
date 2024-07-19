---
icon: fa-brands fa-python
order: 99
category:
  - python
title: not enough values to unpack (expected 3, got 0)
tag:
- python
- 小技巧
---

## 背景

在 Windows 上运行 celery，执行 `res.get(timeout=10)` 的时候报错

```log
res.get(timeout=10)
Traceback (most recent call last):
  File "C:\Apps\JetBrains\PyCharm 2023.3.3\plugins\python\helpers\pydev\pydevconsole.py", line 364, in runcode
    coro = func()
  File "<input>", line 1, in <module>
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\celery\result.py", line 251, in get
    return self.backend.wait_for_pending(
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\celery\backends\asynchronous.py", line 223, in wait_for_pending
    return result.maybe_throw(callback=callback, propagate=propagate)
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\celery\result.py", line 365, in maybe_throw
    self.throw(value, self._to_remote_traceback(tb))
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\celery\result.py", line 358, in throw
    self.on_ready.throw(*args, **kwargs)
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\vine\promises.py", line 235, in throw
    reraise(type(exc), exc, tb)
  File "C:\Tools\miniconda3\envs\python3.8\lib\site-packages\vine\utils.py", line 27, in reraise
    raise value
ValueError: not enough values to unpack (expected 3, got 0)
```

## 解决

下载一个 `eventlet`

```sh
pip install eventlet
```
