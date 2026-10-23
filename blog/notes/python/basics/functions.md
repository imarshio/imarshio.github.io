---
title: "函数、参数与类型标注"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 4
article: false
---

# 函数、参数与类型标注

函数把一段处理过程命名，明确输入、输出和失败条件。先写普通函数，再学习闭包、装饰器和生成器。

## 参数绑定

位置参数按位置绑定，关键字参数按名字绑定。`/` 前的参数只能按位置传入，`*` 后的参数只能按关键字传入。`*args` 收集额外位置参数为元组，`**kwargs` 收集额外关键字参数为字典。

```python
# 可独立运行
def summarize(values, /, *, prefix="sum"):
    return f"{prefix}: {sum(values)}"

assert summarize([1, 2], prefix="total") == "total: 3"

def capture(*args, **kwargs):
    return args, kwargs

assert capture(1, 2, limit=3) == ((1, 2), {"limit": 3})
```

## 返回值与对象共享

函数没有显式 `return` 时返回 `None`。“返回多个值”通常是在返回一个元组。参数接收的是传入对象的引用：修改可变对象与重新绑定局部名字，是两个动作。

```python
# 可独立运行
def record(value, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(value)
    return bucket

assert record(1) == [1]
assert record(2) == [2]
shared = []
assert record(3, shared) is shared
assert shared == [3]
```

默认参数表达式在函数定义时求值。把 `[]` 直接写成默认值，会让多次调用共享同一个列表；上面的 `None` 写法将创建动作放回调用时。

## 函数也是对象

函数可以赋给变量、作为参数传递，也可以从另一个函数返回。闭包让函数保留对外层绑定的访问；它不等于在定义时复制那个值。

```python
# 可独立运行
def make_multiplier(factor):
    def multiply(value):
        return value * factor
    return multiply

assert make_multiplier(3)(4) == 12
functions = [lambda value=n: value for n in range(3)]
assert [fn() for fn in functions] == [0, 1, 2]
```

循环中需要保存当时的值，可以用默认参数绑定；直接写 `lambda: n`，这些函数会在调用时读取同一个外层绑定。

## 类型标注

标注描述预期类型，帮助编辑器和静态检查器分析代码。普通函数不会因为写了标注就自动校验输入；真正的边界校验需要代码或校验库完成。

```python
# 可独立运行
def total(values: list[int]) -> int:
    return sum(values)

assert total([1, 2, 3]) == 6
```

模块组织与作用域见[作用域与模块](./scope-modules.md)，错误处理见[异常与资源管理](./exceptions-io.md)。

---

[上一篇](/notes/python/basics/control-flow.md) · [下一篇](/notes/python/basics/scope-modules.md) · [学习目录](/notes/python/README.md)
