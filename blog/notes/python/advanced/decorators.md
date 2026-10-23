---
title: "装饰器与函数包装"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 2
article: false
redirectFrom:
  - /notes/python/python-decorator.html
---

# 装饰器与函数包装

装饰器接收函数，返回一个替代对象。`@decorate` 写在函数定义上方，大体等价于定义完成后执行 `function = decorate(function)`。先掌握高阶函数和闭包，再看这层语法。

## 一个可观测的包装器

```python
# 可独立运行
from functools import wraps

def record_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@record_call
def add(a, b):
    """把两个数相加。"""
    return a + b

assert add(1, 2) == 3
assert add.calls == 1
assert add.__name__ == "add"
assert add.__wrapped__(2, 3) == 5
```

`wraps` 保留名称、文档等元数据，并设置 `__wrapped__`，方便调试与工具检查原函数。相关行为见[functools.wraps](https://docs.python.org/3.12/library/functools.html#functools.wraps)。

## 带参数的装饰器

带参数时，多一层工厂函数：外层接收配置，中层接收被装饰函数，内层处理实际调用。

```python
# 可独立运行
from functools import wraps

def retry(times=3, exceptions=(TimeoutError,)):
    if times < 1:
        raise ValueError("times 必须至少为 1")
    def decorate(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except exceptions:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorate

attempts = []

@retry(times=2)
def fetch():
    attempts.append(1)
    if len(attempts) == 1:
        raise TimeoutError("temporary")
    return "ok"

assert fetch() == "ok"
assert len(attempts) == 2
```

重试会再次执行函数，必须考虑副作用和幂等性。支付、发消息、写数据库等操作不能仅因为捕获了异常就一律重试；生产重试还需要超时、退避和上限。

## 计时与异常传播

```python
# 可独立运行
from functools import wraps
from time import perf_counter

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        started = perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            wrapper.last_seconds = perf_counter() - started
    wrapper.last_seconds = 0.0
    return wrapper

@timer
def compute():
    return sum(range(10))

assert compute() == 45
assert compute.last_seconds >= 0
```

`finally` 记录耗时，同时让原来的异常自然传播。多个装饰器按从下向上包装、从外向内调用的关系执行。异步函数需要异步包装器，只有在包装器中 `await` 原协程，才能正确覆盖它的实际执行区间。

下一篇：[线程、进程与协程](./concurrency.md)。

---

[上一篇](/notes/python/advanced/iterators.md) · [下一篇](/notes/python/advanced/concurrency.md) · [学习目录](/notes/python/README.md)
