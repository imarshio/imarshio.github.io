---
title: "迭代器与生成器"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 1
article: false
---

# 迭代器与生成器

容器负责存储数据，迭代协议负责逐项访问。一个对象可以同时是容器和可迭代对象，也可以像文件流那样按需提供下一项。

## 可迭代对象与迭代器

`iter(obj)` 获取迭代器；`next(iterator)` 获取下一项，结束时抛 `StopIteration`。迭代器通常只能往前走，耗尽后需要重新取得迭代器，才能从头遍历可重复迭代的数据源。

```python
# 可独立运行
values = [10, 20]
iterator = iter(values)
assert next(iterator) == 10
assert list(iterator) == [20]
assert list(iterator) == []
assert list(values) == [10, 20]
```

## yield 与暂停状态

函数体里出现 `yield` 后，调用函数通常得到生成器对象。迭代时才执行到下一个暂停点；局部变量和执行位置会保留下来。

```python
# 可独立运行
def batches(values, size):
    if size <= 0:
        raise ValueError("size 必须大于零")
    for start in range(0, len(values), size):
        yield values[start:start + size]

assert list(batches([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
```

## 生成器表达式

`(transform(x) for x in source)` 按需计算；`[transform(x) for x in source]` 会先构造完整列表。把结果再交给 `list()`，仍然会一次性物化全部元素。

## yield from 与 send

`yield from iterable` 把子迭代器的迭代行为委派出去，并处理生成器协议中的通信。`send(value)` 给暂停在 `yield` 的生成器传入值；刚启动的生成器不能直接接收非 `None` 的值。

```python
# 可独立运行
def child():
    yield 1
    yield 2

def parent():
    yield 0
    yield from child()

assert list(parent()) == [0, 1, 2]
```

## 资源与提前退出

暂停的生成器仍可能持有文件、闭包或大对象。资源管理应有明确的关闭路径，不能假设“不再取下一项”就一定立即释放。`close()` 会向生成器注入终止信号，正常的 `finally` 清理可以由此执行。

接着学习[装饰器](./decorators.md)，比较“返回另一个函数”与“返回暂停的执行过程”。

---

[上一篇](/notes/python/objects/data-model.md) · [下一篇](/notes/python/advanced/decorators.md) · [学习目录](/notes/python/README.md)
