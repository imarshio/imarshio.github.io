---
title: "对象协议与特殊方法"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 3
article: false
---

# 对象协议与特殊方法

Python 的很多语法最终会连接到对象协议：`len(x)`、`x[key]`、`for x in items` 和 `obj()` 都各有对应行为。特殊方法让自定义类参与这些语法；无需一开始就把所有方法都重写。

## object 与继承体系

有，Python 3 的顶层基类叫 **`object`，小写 o**。除 object 自身外，普通类都直接或间接继承它；不写父类时默认继承 object。

```python
class User:
    pass

class ExplicitUser(object):
    pass

class Admin(User):
    pass

assert User.__bases__ == (object,)
assert issubclass(User, object)
assert issubclass(Admin, object)
assert isinstance(User(), object)
assert isinstance(123, object)
assert isinstance("abc", object)
```

`class User:` 与 `class User(object):` 表达相同的默认基类关系；上面用两个类名只是方便对照，它们仍是两个不同的类。Python 的 int、bool、str 等也是对象，没有 Java 基本类型值与引用类型的同一种划分。

| Java 中的概念 | Python 中的对应理解 |
|---|---|
| 顶层基类 Object | 顶层基类 object |
| toString() | 类似用途的 __str__；调试表示还有 __repr__ |
| equals() | __eq__ 参与 == 比较 |
| hashCode() | __hash__ 参与 hash(obj) |
| getClass() | type(obj) |

不要把 object 与 type 混成同一职责：object 是实例继承关系的顶层基类，type 通常是创建类的默认元类。普通的 `type(obj)` 查询类型，不等于调用 obj 的某个 getClass 方法。

## object 提供的方法和钩子

以项目的 **CPython 3.12** 为准，object 直接提供下列 **22 个方法/钩子**。它们多数通过语法或内置函数参与调用，不需要日常逐个手写。

| 分类 | 方法 | 用途/触发方式 |
|---|---|---|
| 创建 | __new__ | 创建并返回实例；通常继承默认实现 |
| 初始化 | __init__ | 初始化已经创建的实例，不是创建对象本身 |
| 显示 | __str__ | str(obj)、print(obj)，偏向用户展示 |
| 调试表示 | __repr__ | repr(obj)，偏向调试；容器显示元素常使用它 |
| 相等 | __eq__、__ne__ | 参与 ==、!= |
| 大小 | __lt__、__le__、__gt__、__ge__ | 参与 <、<=、>、>= 的比较协议 |
| 哈希 | __hash__ | hash(obj)，用于字典键/set 等 |
| 读取属性 | __getattribute__ | 参与 obj.name 这类正常属性读取 |
| 设置属性 | __setattr__ | 参与 obj.name = value |
| 删除属性 | __delattr__ | 参与 del obj.name |
| 查看属性名 | __dir__ | dir(obj) |
| 格式化 | __format__ | format(obj, spec)、f-string 格式化 |
| 自身大小 | __sizeof__ | 报告自身大小，供 sys.getsizeof 等使用，不递归统计所有关联对象 |
| 子类创建 | __init_subclass__ | 创建子类时的定制钩子 |
| 子类判断 | __subclasshook__ | 可参与 issubclass 判断，常见于抽象基类；需按继承/元类机制使用 |
| 序列化 | __getstate__、__reduce__、__reduce_ex__ | 支持 pickle 对象状态与重建协议；默认 __getstate__ 自 3.11 加入 |

可以查看 object 本类直接定义的名字：

```python
object_names = set(object.__dict__)
assert "__new__" in object_names
assert "__getstate__" in object_names
assert "__class__" in object_names  # 是属性，不是本表的方法
assert "__doc__" in object_names    # 文档属性，也不是方法
```

重写 __str__ 与 __repr__ 的完整例子：

```python
class NamedUser:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"用户：{self.name}"

    def __repr__(self):
        return f"NamedUser(name={self.name!r})"

u = NamedUser("张三")
assert str(u) == "用户：张三"
assert repr(u) == "NamedUser(name='张三')"
assert str([u]) == "[NamedUser(name='张三')]"
```

三个边界要记住：

- object 提供大小比较钩子，不代表默认支持按大小排序。`object() < object()` 会抛 TypeError，具体类需定义有意义的顺序。
- 普通类只定义 __eq__、不显式提供 __hash__ 时，通常会变得不可哈希。按值比较的类若需要作键，应保证相等对象哈希相同，且键存活期间相关哈希/相等语义稳定。
- __class__、__doc__ 是属性；__len__、__iter__、__getitem__、__call__、__getattr__、__del__ 等**不是 object 默认提供的这些方法**。继承 object 不等于自动能求长度、迭代或像函数一样调用。

## 可调用对象与协议

可调用对象是可以写 `obj(...)` 的对象，函数是其中一种，定义了 __call__ 的普通类实例也可以。__call__ 不在 object 的默认方法表里，需要具体类型提供。

```python
class Greeter:
    def __call__(self, name):
        return f"你好，{name}"

greeter = Greeter()
assert callable(greeter)
assert greeter("张三") == "你好，张三"
assert not callable(object())
```

Flask 类型实现了 WSGI 调用入口，所以它的 app 实例能被服务器按 `app(environ, start_response)` 调用。服务器和 app 是 Python 函数/对象的调用关系，不因此产生一个额外的 Flask 进程，详见 [Flask 文档的 WSGI 学习笔记](/posts/interview/Backend/Flask.md#wsgi-notes)。

依据：[Python 3.12 数据模型](https://docs.python.org/3.12/reference/datamodel.html#basic-customization)、[pickle 对象协议](https://docs.python.org/3.12/library/pickle.html#object.__getstate__)。方法清单已在本机 CPython 3.12.11 对照 object.__dict__ 核对。
## 描述符与属性查找

描述符通过 `__get__`、`__set__`、`__delete__` 参与属性访问。`property`、函数变成绑定方法等行为，都可以从这个机制理解。数据描述符、实例字典和非数据描述符的查找优先级不同，排查“实例赋值为什么没有覆盖属性”时需要考虑它。

## 比较与哈希

定义按值相等的对象时，还要考虑哈希约定：相等对象的哈希必须相等。自定义 `__eq__` 且未显式保留或定义哈希时，类通常会变为不可哈希。不要用会参与哈希的可变字段去做集合键。

## __slots__ 的适用边界

`__slots__` 可以限制实例属性布局，并减少某些对象的实例字典开销。继承自带有实例字典的父类、需要弱引用、子类没有继续声明 slots 时，实际效果会不同。先测量对象规模，再决定是否使用。

原理参见[数据模型](https://docs.python.org/3.12/reference/datamodel.html)。后续用[迭代与生成器](../advanced/iterators.md)练习协议如何落到具体代码。

---

[上一篇](/notes/python/objects/inheritance-abc.md) · [下一篇](/notes/python/advanced/iterators.md) · [学习目录](/notes/python/README.md)
