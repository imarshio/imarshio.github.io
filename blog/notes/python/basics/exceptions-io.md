---
title: "异常、文件与资源管理"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 6
article: false
---

# 异常、文件与资源管理

函数除了正常返回，还可能失败。异常表达失败原因，`with` 管理资源的使用区间。把两者配合好，比依赖对象恰好在某个时刻销毁更清楚。

## try、except、else 与 finally

`except` 捕获指定类型的异常；`else` 只在 `try` 正常完成时运行；`finally` 在正常返回和异常退出时都会执行。不要在 `finally` 里随意 `return`，它可能覆盖返回值或异常。

```python
# 可独立运行
def parse_quantity(text):
    try:
        value = int(text)
    except ValueError as error:
        raise ValueError("数量必须是整数") from error
    else:
        if value < 0:
            raise ValueError("数量不能为负")
        return value

assert parse_quantity("3") == 3
try:
    parse_quantity("abc")
except ValueError as error:
    assert error.__cause__ is not None
```

捕获你能处理的失败。普通业务异常通常继承 `Exception`；`KeyboardInterrupt` 等继承层次不同，避免用裸 `except` 把退出信号也吞掉。

## with 与上下文管理器

进入 `with` 时调用 `__enter__`，退出时调用 `__exit__`。`__enter__` 正常返回后，退出流程会把异常信息交给 `__exit__`；返回真值可以抑制该异常，因此默认不应随意返回 `True`。

```python
# 可独立运行
from contextlib import contextmanager

@contextmanager
def managed(events):
    events.append("open")
    try:
        yield "resource"
    finally:
        events.append("close")

events = []
try:
    with managed(events) as resource:
        assert resource == "resource"
        raise RuntimeError("demo")
except RuntimeError:
    pass
assert events == ["open", "close"]
```

## 文本、二进制与 JSON

文本文件明确指定编码；二进制文件使用 `rb`、`wb`。JSON 适合交换基础数据结构，不保留任意 Python 对象的类型与行为。不要把不可信数据交给 `pickle.loads`。

```python
# 可独立运行
import json
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as directory:
    path = Path(directory) / "settings.json"
    path.write_text(json.dumps({"name": "笔记"}, ensure_ascii=False), encoding="utf-8")
    restored = json.loads(path.read_text(encoding="utf-8"))
    assert restored == {"name": "笔记"}
```

练习时先用临时目录验证读写，再连接真实业务文件。接下来学习[类与实例](../objects/classes.md)。

---

[上一篇](/notes/python/basics/scope-modules.md) · [下一篇](/notes/python/objects/classes.md) · [学习目录](/notes/python/README.md)
