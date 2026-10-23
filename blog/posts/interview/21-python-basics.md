---
title: "Python 基础"
lang: zh-CN
date: 2026-10-23
order: 121
category:
  - 面试准备
tag:
  - 面试准备
---

# Python 基础

> 这份单独学习 Python 基础，先读类型与对象，再读内置容器，最后读抽象基类。★ 表示高频题。
> 代码与实现细节以项目使用的 CPython 3.12 为基线；语言规则与 CPython 实现细节要分开理解。
> 本文从 [10-基础打底.md](/posts/interview/10-foundation-notes.md) 拆出，不把搬迁的内容重复累加进分级题数。

目录：一、Python 基础类型与对象 → 二、Python 内置数据结构 → 三、abc 与抽象基类 → 四、自查清单与后续阅读。

---

## 一、Python 基础类型与对象

### 1. ★ Python 有哪些基本数据类型？

| 类别 | 类型 | 可变？ | 说明 |
| --- | --- | --- | --- |
| 数值 | `int` | 不可变 | **任意精度**，不会溢出（Java 的 int 是 32 位） |
| | `float` | 不可变 | 双精度浮点（IEEE 754），等同 Java 的 double |
| | `complex` | 不可变 | 复数 `1+2j`，基本不用 |
| | `bool` | 不可变 | `True` / `False`，**是 int 的子类**（`True + 1 == 2`） |
| 文本 | `str` | 不可变 | Unicode 字符串 |
| 二进制 | `bytes` | 不可变 | 字节序列 |
| | `bytearray` | 可变 | 可变字节序列 |
| 空值 | `NoneType` | — | 只有一个值 `None`（单例） |
| 容器 | `list`、`dict`、`set` | 可变 | |
| | `tuple`、`frozenset` | 不可变 | |

### 2. ★ 可变类型和不可变类型有什么区别？为什么重要？

- 不可变对象「修改」时是创建新对象，id 会变：`s = "a"; s += "b"` 后 s 是一个新字符串。
- 可变对象原地修改，id 不变：`lst.append(1)`。
- 重要性：
  1. 只有**可哈希**的对象能做 dict 的键、放进 set；tuple 还要求每个元素可哈希，不能把「不可变」直接当作充分条件；
  2. 函数参数传可变对象，函数里原地修改外面能看到；
  3. 默认参数用可变对象是经典坑。

### 3. ★ `int` 为什么不会溢出？

Python 的 int 底层是变长的「数字数组」，数字大了就多用几个单元存，只受内存限制。代价是比固定长度的整数慢。所以 Python 里 `2 ** 1000` 能直接算出来。

### 4. ★ `0.1 + 0.2 == 0.3` 为什么是 False？

浮点数用二进制存储，0.1 在二进制里是无限循环小数，只能近似存储，`0.1 + 0.2` 实际是 `0.30000000000000004`。

- 比较用 `math.isclose(a, b)`；
- **金额计算用** `decimal.Decimal`（用字符串构造：`Decimal("0.1")`，用 float 构造会把误差带进去）；数据库里用 `numeric`。
- 这个问题所有语言都有（Java 的 double 一样），金额 Java 用 BigDecimal。

### 5. `int` 和 `float` 的除法？

`/` 永远返回 float（`4 / 2 == 2.0`）；`//` 是向下取整除（`-7 // 2 == -4`，注意是**向下**不是向零）；`%` 取余，结果符号跟除数一致（`-7 % 2 == 1`）。Java 的 `/` 对整数是向零截断，`-7 / 2 == -3`。

### 6. ★ `str` 和 `bytes` 的区别？怎么互转？

- `str` 是 Unicode 字符序列（人看的文本），`bytes` 是原始字节（网络传输、文件存储用的）。
- `"中文".encode("utf-8")` → `b'\xe4\xb8\xad\xe6\x96\x87'`；`b.decode("utf-8")` → `"中文"`。
- 一个中文字符在 UTF-8 里占 3 个字节：`len("中") == 1`，`len("中".encode()) == 3`。
- 网络、文件、Redis 拿到的默认是 bytes（redis-py 设 `decode_responses=True` 自动解码）。

### 7. ★ 字符串为什么是不可变的？拼接大量字符串怎么写？

不可变的好处：可以哈希（做 dict 键）、线程安全、可以缓存和复用（字符串驻留）。
拼接大量字符串：**用** `"".join(list)`，不要在循环里 `s += x`（每次都创建新字符串，O(n²)；CPython 对某些情况有优化，但不能依赖）。Java 里对应用 StringBuilder。

### 8. 字符串常用方法？

`split`、`join`、`strip`（去两端空白）、`replace`、`startswith` / `endswith`、`find`（找不到返回 -1）/ `index`（找不到抛异常）、`upper` / `lower`、`isdigit`、`format` / f-string、切片 `s[::-1]`（反转）。

### 9. ★ 哪些值在布尔判断里是 False？

`None`、`False`、`0`、`0.0`、`""`、`[]`、`{}`、`set()`、`()`，以及定义了 `__bool__` 返回 False 或 `__len__` 返回 0 的对象。其余都是 True。
所以 `if not lst:` 判断空列表；但判断「是不是 None」要写 `if x is None`（因为 0 和空字符串也是 False）。

### 10. ★ `is` 和 `==` 的区别？

`is` 比较身份（是不是同一个对象，`id()` 相同）；`==` 比较值（调用 `__eq__`）。`None`、`True`、`False` 是单例，用 `is` 比较。

### 11. 小整数池和字符串驻留？

`-5 ~ 256` 的整数预先创建好、全局复用；短的、像标识符的字符串会被驻留。所以 `a = 256; b = 256; a is b` 是 True，257 就不一定。**结论：比较值永远用** `==`。

### 12. 类型转换？

`int("12")`、`float("1.5")`、`str(12)`、`list("abc")` → `['a','b','c']`、`tuple([1,2])`、`set([1,1,2])` → `{1,2}`、`dict([("a",1)])`、`bool(x)`。`int("1.5")` 会报错，要先 `float` 再 `int`。

### 13. ★ Python 是强类型还是弱类型？静态还是动态？

**强类型 + 动态类型**。

- 动态：变量没有类型，值才有类型，运行时才确定（Java 是静态类型）；
- 强类型：不会隐式乱转换，`"1" + 1` 直接报错（JavaScript 是弱类型，`"1" + 1 == "11"`）。

### 14. 变量到底是什么？

Python 的变量是**名字（标签）**，绑定到对象上；赋值是让名字指向另一个对象，不是把值拷进一个盒子。`a = [1]; b = a` 后 a 和 b 指向同一个列表。


### 15. ★ Python 有没有 Java Object 那样的顶层基类？

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

### 16. ★ object 有哪些方法？如何重写？

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

### 17. ★ 可调用对象是什么？为什么 Flask app 可以像函数一样调用？

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

Flask 类型实现了 WSGI 调用入口，所以它的 app 实例能被服务器按 `app(environ, start_response)` 调用。服务器和 app 是 Python 函数/对象的调用关系，不因此产生一个额外的 Flask 进程，详见 [Flask 文档的 WSGI 学习笔记](/posts/interview/09-flask.md#wsgi-notes)。

依据：[Python 3.12 数据模型](https://docs.python.org/3.12/reference/datamodel.html#basic-customization)、[pickle 对象协议](https://docs.python.org/3.12/library/pickle.html#object.__getstate__)。方法清单已在本机 CPython 3.12.11 对照 object.__dict__ 核对。

### 18. ★ `_fun`、`__fun`、`__fun__` 有什么区别？是私有方法吗？

**先分清“内部使用约定”和“访问权限”：单下划线不会把函数限制在模块或类内部，双下划线也不是 Java 的 private。** 这些规则同样适用于普通属性名。

| 名字 | 模块顶层 | 类内部 |
|---|---|---|
| `fun` | 普通名字，适合作为公开接口 | 普通方法名，适合作为公开接口 |
| `_fun` | 约定为内部使用；外部仍能显式导入、调用 | 约定为内部使用；外部和子类仍能访问、重写 |
| `__fun` | 不触发名称改写；没有额外私有权限，一般没必要这样命名 | 触发名称改写，主要避免子类无意中覆盖基类内部名字 |
| `__fun__` | 这类名字留给 Python 定义的特殊用途，如模块的 __name__ | 特殊方法命名形式，如 __init__、__str__；按已有协议实现，不自创业务名 |

**模块级：可以说 `_fun` 是“内部接口”，不要说“只能在模块范围内访问”。** 未定义 `__all__` 时，`from module import *` 不导入下划线开头的名字，单下划线和双下划线都包括在内。显式导入和 `module._fun()` 仍可用；定义 `__all__` 后，星号导入由该列表决定，它也不是权限控制。

下面用内存模块演示，不需要创建实际文件：

```python
import sys
from types import ModuleType

module_name = "_interview_underscore_demo"
module = ModuleType(module_name)
exec("def public(): return 'public'\n"
     "def _helper(): return 'single'\n"
     "def __helper(): return 'double'\n", module.__dict__)
assert module_name not in sys.modules
sys.modules[module_name] = module
try:
    imported = {}
    exec(f"from {module_name} import *", imported)
    assert "public" in imported
    assert "_helper" not in imported and "__helper" not in imported
    exec(f"from {module_name} import _helper, __helper", imported)
    assert imported["_helper"]() == "single"
    assert imported["__helper"]() == "double"
    assert module._helper() == "single"
    module.__all__ = ["_helper", "__helper"]
    exported = {}
    exec(f"from {module_name} import *", exported)
    assert exported["__helper"]() == "double"
    assert "public" not in exported
finally:
    del sys.modules[module_name]
```

**类级：`Base` 内的 `__fun` 通常改写为 `_Base__fun`。** 改写依据是定义代码所在的类，不是实例运行时属于哪个子类。因此父类和子类分别定义的 `__fun` 会变成不同名字。

```python
class Base:
    def _helper(self):
        return "base-single"

    def __helper(self):
        return "base-double"

    def run(self):
        return self._helper(), self.__helper()

class Child(Base):
    def _helper(self):
        return "child-single"

    def __helper(self):
        return "child-double"

c = Child()
assert c.run() == ("child-single", "base-double")
assert c._helper() == "child-single"                 # 单下划线不禁止访问
assert c._Base__helper() == "base-double"            # 改写后仍可访问
assert c._Child__helper() == "child-double"          # 子类是另一个名字
assert not hasattr(c, "__helper")
```

上例中的 `self` 始终是 Child 实例，但 Base.run 中的 `self.__helper()` 已按 Base 的名字改写，所以不会自动转去调用 Child 定义的同名方法。外部通常不应依赖 `_Base__helper` 这种实现细节；子类仍能故意使用改写后的名字，名称改写不是安全边界。

精确条件是：在类定义相关代码中，名字以至少两个下划线开头，结尾不满两个下划线时，才属于名称改写规则。类名本身开头的下划线会先去掉；类名全是下划线时不改写。`__init__` 前后都有双下划线，不走这套改写。

**怎么选：公开接口用 `fun`，内部辅助用 `_fun`；基类确实需要避免子类重名冲突时，再考虑 `__fun`。** 如果希望子类重写某个扩展方法，一般用普通名字或单下划线名字。

依据：[PEP 8 命名与继承约定](https://peps.python.org/pep-0008/#designing-for-inheritance)、[名称改写规则](https://docs.python.org/3.12/reference/expressions.html#private-name-mangling)、[import 与 __all__](https://docs.python.org/3.12/reference/simple_stmts.html#the-import-statement)。

### 19. ★ Python 的继承和 Java 有什么区别？

两者都有基类、子类、方法重写和多态；区别集中在多继承、访问控制、初始化和方法查找。以下 Python 按 Python 3，Java 按普通类说明。

| 对比点 | Python | Java |
|---|---|---|
| 写法 | `class Child(Parent):` | `class Child extends Parent` |
| 顶层基类 | object | Object |
| 类的继承数量 | 可以继承多个基类：`class C(A, B):` | 一个类只能有一个直接父类，但可以实现多个接口 |
| 访问控制 | 下划线主要表达约定；双下划线有名称改写 | public、protected、private 和包访问权限由语言检查 |
| 方法重写 | 子类定义同名方法即可参与动态查找，不要求写装饰器 | 实例方法按语言规则重写；常写 @Override 让编译器检查，static 是隐藏而非实例方法重写 |
| 初始化 | __init__ 是可继承的初始化方法；自己重写后不会自动把父类初始化方法再执行一遍 | 构造器不被继承；构造器通过 this(...) 或 super(...) 形成初始化调用链，适用时省略 super() 会隐式调用无参父构造器 |
| super | 按实际实例的 MRO，从当前类之后继续查找 | `super.method()` 通常访问父类实现；接口默认方法另有 `InterfaceName.super.method()` 语法 |
| 同名不同参数 | 重复 def 同一名字通常会替换前一个绑定，不按签名自动保留多份实现 | 支持按参数列表声明多个重载方法 |
| 禁止继承或重写 | typing.final 给类型检查器提示，不在运行时阻止 | final 类禁止被继承，final 方法禁止被重写；sealed 还能限制允许的直接子类 |

Java 的接口还可以有 default 方法，因此“Java 不能多继承类”不等于“Java 不能从多个接口获得默认实现”。接口默认方法冲突需按 Java 规则解决，不能套用 Python 的 MRO。

**例一：Python 子类可以直接继承父类的 __init__；重写后，需要自己决定是否调用 super。**

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "声音"

class Cat(Animal):
    pass

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name}：汪"

class UninitializedAnimal(Animal):
    def __init__(self):
        self.ready = True             # 未调用父类初始化，不会自动设置 name

assert Cat("小猫").name == "小猫"
dog = Dog("小狗", "柴犬")
assert dog.speak() == "小狗：汪"
assert dog.breed == "柴犬"
assert isinstance(dog, Animal) and issubclass(Dog, Animal)
assert not hasattr(UninitializedAnimal(), "name")
```

不要为了“补初始化”无条件再手写一次父类调用：如果子类未重写 __init__，正常方法查找已经找到并执行继承来的版本。需要继承初始化逻辑时，优先使用配合 MRO 的 super，而不是到处硬编码父类名。

**例二：多继承中的 super 不一定调用当前类的直接父类。**

```python
class Root:
    def route(self):
        return ["Root"]

class Left(Root):
    def route(self):
        return ["Left"] + super().route()

class Right(Root):
    def route(self):
        return ["Right"] + super().route()

class Leaf(Left, Right):
    def route(self):
        return ["Leaf"] + super().route()

assert Leaf.__mro__ == (Leaf, Left, Right, Root, object)
assert Leaf().route() == ["Leaf", "Left", "Right", "Root"]
assert Left().route() == ["Left", "Root"]
```

MRO 是“方法解析顺序”，可以用 `类.__mro__` 或 `类.mro()` 查看。Leaf 实例调用到 Left.route 时，其中的 super 下一站是 Right，而 Left 的直接父类其实是 Root。它按 Leaf 的 C3 MRO 继续查找；不能把多继承理解成不去重的简单深度优先搜索。

super 本身不会替你运行全部父类方法。上例各层都主动调用 super、方法签名兼容、Root 负责结束，才形成合作调用链。混入类（Mixin）常用这种方式提供可复用能力；实际业务也应考虑组合，避免堆出难维护的继承层次。

**再记两个常见误区：**

- **重写不等于重载。** 子类提供同名方法是重写；在一个 Python 类体里连续写两个同名 def，后者通常覆盖前者。常用默认参数或可变参数处理不同调用方式；typing.overload 主要描述给类型检查器看的多种签名，运行时仍需要实际实现。
- **Python 的多态不强制要求继承同一个业务基类。** 一段代码只调用对象的 send 方法时，不同类型只要提供符合约定的 send 就可能使用，这叫鸭子类型。需要明确契约时，可用 ABC/abstractmethod 或 typing.Protocol；它们与 Java interface 的规则不完全相同。

依据：[Python 继承与多继承](https://docs.python.org/3.12/tutorial/classes.html#inheritance)、[super 官方说明](https://docs.python.org/3.12/library/functions.html#super)、[__init__ 数据模型](https://docs.python.org/3.12/reference/datamodel.html#object.__init__)、[typing.final](https://docs.python.org/3.12/library/typing.html#typing.final)、[Java 类、重写、重载和构造器规范](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html)。


---

> Web 基础名词另见 [09-Flask专题.md](/posts/interview/09-flask.md) 开头的「WSGI、ASGI、Gunicorn、Uvicorn 与周边组件」，先分清接口规范、服务器、框架、worker 和反向代理。

## 二、Python 内置数据结构

### 1. ★ list、tuple、dict、set 的区别？

| | list | tuple | dict | set |
| ---------- | -------- | ---------- | ------------- | ----------------- |
| 写法 | `[1, 2]` | `(1, 2)` | `{"a": 1}` | `{1, 2}` |
| 可变 | 是 | 否 | 是 | 是 |
| 有序 | 是 | 是 | 是（3.7+ 按插入顺序） | 否 |
| 可重复 | 是 | 是 | 键不可重复 | 不可重复 |
| 能否做 dict 键 | 否 | 是（元素都可哈希时） | 否 | 否（`frozenset` 可以） |
| 底层 | 动态数组 | 定长数组 | 哈希表 | 哈希表 |
| 查找 `x in` | O(n) | O(n) | O(1) | O(1) |

**空集合怎么写？** `set()`，`{}` 是空字典。**单元素元组？** `(1,)`，`(1)` 只是数字 1。

### 2. ★ tuple 是什么？为什么需要它？什么情况下使用？

**tuple 叫元组，是有序、可包含重复值、创建后不能增删或替换元素的容器。** 可以按索引访问，也支持遍历、切片和解包。元素可以是不同类型。

```python
person = ("张三", 28)
point = (10, 20)
print(person[0])   # 张三
print(point[1])    # 20
single = (1,)     # 单元素元组需要逗号；(1) 是整数
empty = ()        # 空元组
```

**为什么已经有 list，还需要 tuple？** tuple 能表达「这几个值组成结构固定的组合，不应被随意增删或替换」，并且元素都可哈希时可以作为字典键或 set 元素。并非所有场景必须用 tuple；应按数据含义选，不为笼统的「一定更快」强行替换 list。

| 场景 | 常见选择 | 原因 |
|---|---|---|
| 购物车商品、不断追加的任务 | list | 内容和数量需要变化 |
| 坐标、宽高、RGB 颜色 | tuple | 每个位置有固定含义，作为一组值使用 |
| 函数返回宽和高等多个值 | tuple | 打包返回，调用方可解包 |
| 用「用户 + 学科」共同查分数 | tuple 作为 dict 键 | 将多个可哈希值组合成一个键 |

**场景一：函数返回多个值，实际返回一个元组。**

```python
def get_size():
    return 1920, 1080       # 相当于 return (1920, 1080)

size = get_size()           # (1920, 1080)
width, height = get_size()  # 解包：1920、1080
```

**场景二：作为字典键或 set 元素，表示组合身份。**

```python
scores = {("张三", "数学"): 95, ("张三", "英语"): 88}
score = scores[("张三", "数学")]  # 95
visited = {(0, 0), (1, 2)}       # 记录访问过的坐标
```

**坑一：不可变不等于内部所有数据都冻结。** 元组不能替换元素引用，但被引用的可变对象仍可修改。

```python
data = ([1, 2], "完成")
data[0].append(3)    # 可以：修改内部列表，data 变成 ([1, 2, 3], "完成")
# data[0] = []      # TypeError：不能替换元组的第一个元素
# data.append(4)    # AttributeError：元组没有 append 方法
```

**坑二：不是所有 tuple 都能当字典键。** `(1, 2)` 可以；`([1, 2], "完成")` 含不可哈希的 list，不能作为 dict 键或 set 元素。不可变和可哈希不能简单画等号。

字段很多、位置不易记时，可考虑 `namedtuple` 或其他带字段名的结构，避免代码里到处写 `record[5]`。入门先掌握「固定组合用 tuple，需增删的集合通常用 list」，不是只背括号写法。

### 3. ★ list 的底层实现？append 为什么是 O(1)？

list 是**动态数组**：底层是一块连续的指针数组（存的是对象的引用，不是对象本身）。

- 容量不够时扩容，每次**多分配一些**（大约 1.125 倍 + 常数），所以大多数 append 不用扩容，**均摊 O(1)**；
- `insert(0, x)` / `pop(0)` 要移动后面所有元素，O(n) → 两端操作用 `collections.deque`。
- **对比 Java**：类似 ArrayList（Java 扩容 1.5 倍）。

### 4. ★ 各操作的时间复杂度（必背）

| 操作 | list | dict / set |
| --- | --- | --- |
| 按索引取 / 改 `a[i]` | O(1) | — |
| 末尾追加 / 弹出 `append` / `pop()` | O(1) 均摊 | — |
| 头部或中间插入 / 删除 `insert(i)` / `pop(i)` | O(n) | — |
| 查找 `x in` | **O(n)** | **O(1)** 平均（最坏 O(n)，所有键哈希冲突时） |
| 增 / 删 / 改键 | — | O(1) 平均 |
| 排序 `sort()` | O(n log n) | — |
| 切片 `a[i:j]` | O(j − i) | — |
| 长度 `len` | O(1) | O(1) |
| 集合并 `s \| t` / 交 `s & t` | — | O(len(s) + len(t)) / O(min(len(s), len(t))) |

面试技巧：**「在列表里频繁查是否存在」→ 改用 set**，是最常见的性能优化点。

### 5. ★ dict 是怎么实现的？

- 哈希表。键先算 `hash(key)`，用哈希值找到槽位；冲突时用**开放寻址**（探测下一个位置，Python 用的是伪随机探测）。
- 3.6 起是「**紧凑字典**」：一个稀疏的小索引数组 + 一个按插入顺序排列的紧凑条目数组（哈希值、键、值）。省内存，并且天然保留插入顺序，3.7 起写进语言规范。
- 装填超过 2/3 时扩容并重新插入。
- **键必须可哈希**：要有 `__hash__`，且 `a == b` 时 `hash(a) == hash(b)`。
- **对比 Java HashMap**：Java 用**链地址法**（数组 + 链表，链表长度超过 8 且数组长度 ≥ 64 时转红黑树），负载因子 0.75，扩容 2 倍；Python 用开放寻址。

### 6. dict 遍历时能修改吗？

不能增删键（报 `RuntimeError: dictionary changed size during iteration`）。要删就先 `list(d.keys())` 复制一份再遍历，或者用推导式生成新字典。

### 7. ★ 常见 dict 操作题

```python
d = {"a": 24, "g": 52, "i": 12, "k": 33}
sorted(d.items(), key=lambda kv: kv[1])              # 按 value 排序
sorted(d.items(), key=lambda kv: kv[1], reverse=True)[:2]   # value 最大的两个
merged = {**d1, **d2}         # 合并（d2 覆盖 d1）；3.9+ 也可以 d1 | d2
d.get("x", 0)                 # 取不到返回默认值，不报 KeyError
d.setdefault("x", []).append(1)
{v: k for k, v in d.items()}  # 键值互换
```

### 8. ★ set 的用法？

去重、成员判断、集合运算：`a | b`（并）、`a & b`（交）、`a - b`（差）、`a ^ b`（对称差）。
**去重并保持顺序**：`list(dict.fromkeys(lst))`（利用 dict 有序且键唯一）；`list(set(lst))` 会打乱顺序。

### 9. ★ collections 模块常用类型

| 类型 | 用途 | 例子 |
| --- | --- | --- |
| `deque` | 双端队列，两端增删 O(1)；`maxlen` 自动丢弃旧元素 | 队列、BFS、保留最近 N 条 |
| `defaultdict` | 访问不存在的键自动用工厂函数生成默认值 | `defaultdict(list)` 分组 |
| `Counter` | 计数 | `Counter(words).most_common(3)` |
| `OrderedDict` | 有序字典，有 `move_to_end`、`popitem(last=False)` | **实现 LRU 缓存** |
| `namedtuple` | 带字段名的元组，不可变、省内存 | `Point = namedtuple("Point", "x y")` |
| `ChainMap` | 多个字典按顺序查找 | 配置的多层覆盖 |

```python
from collections import defaultdict, Counter, deque
groups = defaultdict(list)
for user in users:
    groups[user.org_id].append(user)        # 不用先判断键存不存在

Counter("hello")                            # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})

q = deque(maxlen=3)
for i in range(5): q.append(i)              # deque([2, 3, 4])
```

### 10. ★ heapq 和 bisect

- `heapq`：**小顶堆**（在普通 list 上操作）。`heappush`、`heappop`（O(log n)）、`heapify`（O(n)）、`nlargest(k, xs)` / `nsmallest`。要大顶堆就存负数。用途：Top K、优先队列、合并 K 个有序列表、定时任务调度。
- `bisect`：在有序列表里二分查找插入位置，`bisect_left` / `bisect_right` / `insort`。

### 11. ★ 二维列表的坑

```python
grid = [[0] * 3] * 3      # 错！三行是同一个列表对象
grid[0][0] = 1            # [[1,0,0],[1,0,0],[1,0,0]]
grid = [[0] * 3 for _ in range(3)]   # 对：每行是新列表
```

### 12. ★ 切片

`a[start:stop:step]`，左闭右开；`a[-1]` 最后一个；`a[::-1]` 反转；`a[:]` 浅拷贝。切片越界不报错（索引越界才报错）。

### 13. ★ 浅拷贝和深拷贝

```python
import copy
a = [[1, 2], [3]]
b = a[:]                  # 浅拷贝：新的外层列表，里面的元素还是同一批对象
b[0].append(9)            # a 也变成 [[1, 2, 9], [3]]
c = copy.deepcopy(a)      # 深拷贝：递归复制，互不影响
```

浅拷贝的方式：`list(a)`、`a[:]`、`a.copy()`、`copy.copy(a)`、`dict(d)`、`{**d}`。

### 14. 列表推导式和 map / filter？

`[f(x) for x in xs if cond(x)]` 通常比 `list(map(f, filter(cond, xs)))` 更易读。生成器表达式 `(...)` 不立即生成，适合大数据量或只遍历一次。

### 15. ★ `sort()` 和 `sorted()` 的区别？用的什么算法？

`lst.sort()` 原地排序、返回 None；`sorted(iterable)` 返回新列表，适用于任何可迭代对象。
算法是 **Timsort**（归并 + 插入排序的混合），**稳定排序**，最好 O(n)（已基本有序时）、最坏 O(n log n)。Java 对象数组的 `Arrays.sort` 也用 Timsort。
多字段排序：`sorted(users, key=lambda u: (-u.score, u.name))`（分数降序、同分按名字升序）。

### 16. 其他常用内置函数

`enumerate`（带下标遍历）、`zip`（并行遍历，3.10+ 可 `strict=True`）、`any` / `all`、`min` / `max(key=...)`、`sum`、`reversed`、`range`、`isinstance`、`itertools.chain` / `groupby` / `islice` / `product`、`functools.reduce` / `lru_cache` / `partial`。

---

## 三、abc 与抽象基类

### 1. ★ Python 的 abc 是什么？与普通父类有什么区别？

**abc 是 Python 标准库模块，全称 Abstract Base Classes，用来定义抽象基类。** 可以先类比 Java 的 abstract class：基类规定需要哪些操作，具体子类实现它们。

| 名字 | 作用 |
|---|---|
| `ABC` | 用来继承的辅助基类，背后使用 ABCMeta 提供抽象基类机制 |
| `@abstractmethod` | 标记抽象方法；类仍有未实现的抽象方法时，不能创建实例 |
| `ABCMeta` | 实现该机制的元类；入门通常继承 ABC 即可，不必直接写元类 |

例如，要求不同的消息发送器提供 send：

```python
from abc import ABC, abstractmethod

class Sender(ABC):
    @abstractmethod
    def send(self, message):
        pass

class EmailSender(Sender):
    def send(self, message):
        return f"发送邮件：{message}"

class IncompleteSender(Sender):
    pass

assert EmailSender().send("你好") == "发送邮件：你好"
for cls in (Sender, IncompleteSender):
    try:
        cls()
    except TypeError:
        pass
    else:
        raise AssertionError(f"{cls.__name__} 仍有抽象方法，应禁止实例化")
```

**允许子类暂时不实现，但这样的子类仍是抽象的。** 报错发生在实例化时，不是定义子类时；实现也可以来自继承链，不必每一层子类都重复写一份。

普通父类定义方法或抛 NotImplementedError，通常要等到调用该方法时才发现缺少实现；abc 则可以在实例化时发现抽象方法还没补齐。适合多个支付渠道统一 pay、多个存储实现统一 save/load、多个模型客户端统一 generate 等场景。这里是通用例子，不表示项目当前一定使用这些抽象类。

还要分清以下边界：

- 仅继承 ABC、没有未实现的抽象方法，仍可实例化。ABC 本身不是“一继承就禁止创建实例”的开关。
- 抽象基类可以同时提供普通方法，具体子类可直接复用，不要求全部方法都抽象。
- Python 抽象方法本身也可以有实现；子类提供具体实现后，仍可通过 super 调用基类的那段实现。
- abc 不会自动核对方法签名、参数/返回类型和业务结果；覆盖了名字不等于实现正确，还需要类型检查或测试。
- 希望子类实现的抽象方法通常用 send 或 _send；慎用 __send，否则父类和子类各自名称改写，子类同名方法可能无法满足父类抽象要求。
- ABC 通过继承组织契约与复用；鸭子类型允许不继承共同业务基类的对象按同一调用约定使用。typing.Protocol 还可描述供类型检查器使用的结构契约，不需要为同一组方法强行增加共同父类。

依据：[abc 官方文档](https://docs.python.org/3.12/library/abc.html)、[抽象方法规则](https://docs.python.org/3.12/library/abc.html#abc.abstractmethod)、[typing.Protocol](https://docs.python.org/3.12/library/typing.html#typing.Protocol)。

---

## 四、自查清单与后续阅读

> 基础内容能用自己的话解释，并能读懂对应代码后再打勾；并发和工程化内容按下面的链接继续学。

- [ ] 基本数据类型、可变 / 不可变
- [ ] list / tuple / dict / set 的区别和复杂度
- [ ] dict 的底层实现（哈希表、开放寻址、紧凑字典、为什么有序）
- [ ] 深拷贝 / 浅拷贝
- [ ] `is` 和 `==`
- [ ] 装饰器（手写带参数的）
- [ ] 生成器、迭代器、`yield`
- [ ] GIL 及其影响
- [ ] 线程 / 进程 / 协程，asyncio vs gevent
- [ ] tuple 的定义与场景、单元素逗号、内部可变对象、组合键的可哈希条件
- [ ] object 顶层继承、22 个默认方法/钩子、__new__/__init__、__str__/__repr__ 与 __call__
- [ ] 模块/类的单下划线约定、双下划线名称改写、__all__ 与特殊方法命名
- [ ] Python/Java 继承差异、__init__ 继承与显式调用、MRO/super、多态与重写/重载
- [ ] 垃圾回收（CPython 3.12：引用计数 + 分代循环 GC），并区分对象回收与 RSS；详见 [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md)
- [ ] 可变默认参数的坑
- [ ] abc、ABC、abstractmethod，抽象类不能实例化的条件，以及名称改写对抽象方法的影响

后续阅读：

- [02-后端八股.md](/posts/interview/02-backend-fundamentals.md)：Python 分级题，以及装饰器、生成器、并发和工程化等后续内容。
- [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md)：引用计数、循环 GC、堆、内存池、编译与执行。
- [09-Flask专题.md](/posts/interview/09-flask.md)：WSGI/ASGI、服务器与框架，以及 Flask 请求处理。
- [10-基础打底.md](/posts/interview/10-foundation-notes.md)：算法、手撕代码、SQL、操作系统与网络的综合复习。
