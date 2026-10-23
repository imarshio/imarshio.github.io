---
title: "继承与抽象基类"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 2
article: false
---

# 继承与抽象基类

先有能独立工作的类，再考虑多个类是否需要共享实现或表达统一接口。组合通常更容易限制耦合；继承还会带来方法查找顺序和初始化协作的问题。

## 下划线命名与名称改写

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

## 继承、重写与 super

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

> Web 基础名词另见 [09-Flask专题.md](/posts/interview/Backend/Flask.md) 开头的「WSGI、ASGI、Gunicorn、Uvicorn 与周边组件」，先分清接口规范、服务器、框架、worker 和反向代理。

## 用 abc 声明抽象接口

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
## 阅读顺序

先跟着示例运行单继承，再看 MRO 与菱形继承，最后比较“共享实现”和“要求接口”这两个用途。下一篇是[对象协议与特殊方法](./data-model.md)。

---

[上一篇](/notes/python/objects/classes.md) · [下一篇](/notes/python/objects/data-model.md) · [学习目录](/notes/python/README.md)
