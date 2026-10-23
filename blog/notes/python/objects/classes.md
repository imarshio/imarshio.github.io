---
title: "类、实例与属性"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 1
article: false
---

# 类、实例与属性

函数描述行为；类把一组状态与相关行为放在一起。类对象用于创建实例，实例属性保存每个对象自己的数据。`self` 是方法接收实例的常用参数名，不是关键字。

## 从一个普通类开始

```python
# 可独立运行
class Account:
    kind = "basic"

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("充值金额必须大于零")
        self._balance += amount

account = Account("alice")
account.deposit(10)
assert account.balance == 10
assert account.kind == "basic"
```

`__init__` 初始化已经创建出的实例。创建过程还涉及 `__new__`，先会使用普通类即可，稍后在[对象协议](./data-model.md)中展开。

## 实例属性与类属性

写在 `__init__` 中的 `self.name` 通常属于实例；写在类体中的名字属于类。类属性中的可变对象可能被多个实例共享，不适合直接保存每个实例独有的列表。

## 三种方法

| 形式 | 自动绑定的首参数 | 适用范围 |
|---|---|---|
| 普通实例方法 | 实例 `self` | 操作实例状态 |
| `@classmethod` | 类 `cls` | 替代构造入口、需要跟随子类的逻辑 |
| `@staticmethod` | 无 | 放在类命名空间内的普通辅助函数 |

`@property` 则让方法以属性形式访问，可以把读取和校验逻辑封装在统一接口后。

```python
# 可独立运行
class User:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_mapping(cls, data):
        return cls(data["name"])

    @staticmethod
    def valid_name(name):
        return isinstance(name, str) and bool(name.strip())

assert User.from_mapping({"name": "alice"}).name == "alice"
assert User.valid_name("alice")
```

## dataclass

主要用于保存数据的类，可以让 `dataclass` 生成初始化、表示与比较等方法。可变字段使用 `default_factory` 为每个实例创建新对象。

```python
# 可独立运行
from dataclasses import dataclass, field

@dataclass
class Notebook:
    name: str
    tags: list[str] = field(default_factory=list)

first = Notebook("python")
second = Notebook("sql")
first.tags.append("basic")
assert second.tags == []
```

下一篇：[继承、命名约定与抽象基类](./inheritance-abc.md)。

---

[上一篇](/notes/python/basics/exceptions-io.md) · [下一篇](/notes/python/objects/inheritance-abc.md) · [学习目录](/notes/python/README.md)
