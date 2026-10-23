---
title: "线程、进程与协程"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 3
article: false
---

# 线程、进程与协程

先区分目标：并发让多个任务在一段时间内推进；并行要求多个执行单元同时工作。选择模型时，先判断程序在等待 IO，还是忙于 CPU 计算。

## 三种模型

| 模型 | 共享与开销 | 通常适合 |
|---|---|---|
| 线程 | 同进程共享内存，需要同步 | 阻塞 IO、与同步库协作 |
| 进程 | 地址空间独立，需要序列化或 IPC | 隔离、CPU 计算 |
| 协程 | 在事件循环中协作调度 | 有异步接口的高并发 IO |

这里以 CPython 3.12 的常规 GIL 构建为基线。GIL 限制同一进程内多个线程同时执行 Python 字节码，但部分 C 扩展会释放它；不能由此推导“线程没有用”或“所有共享操作都线程安全”。

## 线程池与资源上限

```python
# 可独立运行
from concurrent.futures import ThreadPoolExecutor

def work(value):
    return value * value

with ThreadPoolExecutor(max_workers=2) as pool:
    result = list(pool.map(work, [1, 2, 3]))
assert result == [1, 4, 9]
```

这个例子只展示线程池 API，没有声称纯 Python 计算会因此更快。真实任务还要限制队列、连接和超时，避免并发数增长后把下游压垮。

## async、await 与任务

调用 `async def` 函数得到协程对象，调用本身不等于已经执行或调度。`await` 等待可等待对象；`create_task` 或 `TaskGroup` 可以让多个协程被并发调度。[任务与取消语义](https://docs.python.org/3.12/library/asyncio-task.html)定义了这些 API 的行为。

```python
# 可独立运行
import asyncio

async def work(value):
    await asyncio.sleep(0)
    return value * 2

async def main():
    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(work(value)) for value in [1, 2, 3]]
    assert [task.result() for task in tasks] == [2, 4, 6]

asyncio.run(main())
```

## 阻塞调用与取消

在事件循环线程里直接调用 `time.sleep()`、同步网络库或长时间 CPU 计算，会阻塞其他任务推进。可用 `asyncio.to_thread` 转移合适的阻塞 IO，但取消等待不代表线程中的操作已被强行终止。

`CancelledError` 不应被随意吞掉；清理工作放进 `finally`，让取消继续向外传播。异步锁与线程锁的作用范围不同，不能互相替代。先运行这个[官方示例体系](https://docs.python.org/3.12/library/asyncio-task.html)，再进入[内存生命周期](../runtime/lifecycle.md)。

---

[上一篇](/notes/python/advanced/decorators.md) · [下一篇](/notes/python/runtime/lifecycle.md) · [学习目录](/notes/python/README.md)
