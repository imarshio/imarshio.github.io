---
title: "作用域、模块与导入"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 5
article: false
redirectFrom:
  - /notes/python/python-global-key-word.html
---

# 作用域、模块与导入

名字在哪里定义，决定它在哪里可见。通常按 Local、Enclosing、Global、Built-in 的顺序查找，也就是 LEGB。类体等特殊作用域还有额外规则，不能把 LEGB 当成每一种语法结构的完整解释。

## 局部、global 与 nonlocal

函数内赋值的名字通常被视为局部名字。`global` 指向当前模块的绑定，`nonlocal` 指向最近的、已经存在的外层函数绑定。

```python
# 可独立运行
current_date = "2024-09-03"

def update_date():
    global current_date
    current_date = "2024-09-05"

update_date()
assert current_date == "2024-09-05"

def make_counter():
    value = 0
    def count():
        nonlocal value
        value += 1
        return value
    return count

counter = make_counter()
assert (counter(), counter()) == (1, 2)
```

`global` 不表示跨进程共享。多个 worker 的模块级变量属于各自进程；需要共同状态时，要设计进程间通信或外部存储。

## UnboundLocalError

```python
# 可独立运行
value = 10

def broken():
    value += 1

try:
    broken()
except UnboundLocalError:
    pass
else:
    raise AssertionError("局部 value 在赋值前被读取")
```

原因是整个函数体里存在对 `value` 的赋值，编译时已将它判为局部名字；执行到 `+=` 时需要先读取局部值，但尚未绑定。

## 模块与导入

一个 `.py` 文件通常对应一个模块。首次导入会执行模块顶层代码；导入系统会利用 `sys.modules` 缓存已加载模块。`from module import name` 把当时取出的对象绑定到当前名字，不会随着来源模块后来的重新赋值自动改变。

普通包可用 `__init__.py` 组织；命名空间包则不要求每级都有这个文件。入口代码放进 `if __name__ == "__main__":`，可减少导入时发生的副作用。

## 下划线与公开接口

`_name` 表达内部使用约定，`__all__` 描述星号导出的名字；类内 `__name` 还涉及名称改写。这些都不是通用的访问控制机制。类里的命名规则放在[继承与抽象基类](../objects/inheritance-abc.md)继续学习。

## 继续阅读

- [官方模块教程](https://docs.python.org/3.12/tutorial/modules.html)
- [执行模型与名字绑定](https://docs.python.org/3.12/reference/executionmodel.html)

---

[上一篇](/notes/python/basics/functions.md) · [下一篇](/notes/python/basics/exceptions-io.md) · [学习目录](/notes/python/README.md)
