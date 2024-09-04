---
icon: fa-brands fa-python
category:
  - python
title: Python 装饰模式
order: 24
---

```python
import time


def retry(retry_times: int = 3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i in range(retry_times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"{str(func).split(' ')[1]} retry {i + 1} times cause exception {e}")
                    if i == retry_times - 1:
                        raise e

        return wrapper

    return decorator


def timer():
    def decorator(func):
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return func(*args, **kwargs)
            except Exception as e:
                raise e
            finally:
                end = time.perf_counter()
                print(f"{func.__name__} cost {end - start} seconds")

        return wrapper

    return decorator

```
