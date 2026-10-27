---
title: "变量、类型与运算"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 1
article: false
---

# 变量、类型与运算

先理解一个动作：`name = value` 把名字绑定到对象。对象有类型、值和身份；变量名本身没有固定类型。把这一点想清楚，再看可变性、函数传参和内存回收，会容易很多。

```python
# 可独立运行
first = [1, 2]
second = first
second.append(3)
assert first == [1, 2, 3]
second = [9]
assert first == [1, 2, 3]
assert second == [9]
```

重新绑定 `second` 不会改写 `first`。这个例子只涉及名字和对象，还没有发生对象复制。Python 对象的身份、类型与值可参阅[数据模型](https://docs.python.org/3.12/reference/datamodel.html#objects-values-and-types)。

## 名字与对象的关系

Python 的变量是**名字（标签）**，绑定到对象上；赋值是让名字指向另一个对象，不是把值拷进一个盒子。`a = [1]; b = a` 后 a 和 b 指向同一个列表。

## 常用数据类型

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

## 强类型与动态类型

**强类型 + 动态类型**。

- 动态：变量没有类型，值才有类型，运行时才确定（Java 是静态类型）；
- 强类型：不会隐式乱转换，`"1" + 1` 直接报错（JavaScript 是弱类型，`"1" + 1 == "11"`）。

## 可变性与可哈希性

- 不可变对象「修改」时是创建新对象，id 会变：`s = "a"; s += "b"` 后 s 是一个新字符串。
- 可变对象原地修改，id 不变：`lst.append(1)`。
- 重要性：
  1. 只有**可哈希**的对象能做 dict 的键、放进 set；tuple 还要求每个元素可哈希，不能把「不可变」直接当作充分条件；
  2. 函数参数传可变对象，函数里原地修改外面能看到；
  3. 默认参数用可变对象是经典坑。

### 默认参数为什么不建议直接用可变对象

假设希望每次调用都往一个新列表里添加元素，直接把 `[]` 写成默认值，可能得到意料之外的结果：

```python
# 可独立运行
def add(value, items=[]):
    items.append(value)
    return items

print(add(1))  # [1]
print(add(2))  # [1, 2]，而不是预想的 [2]
```

**默认参数表达式在函数定义时求值，而不是在每次调用时重新求值。** 上面的 `[]` 在定义 `add` 时只创建一次。两次调用都没有传入 `items`，因此使用的是同一个列表；第一次调用添加的 `1` 留在列表里，第二次调用再追加 `2`，就变成了 `[1, 2]`。

如果希望每次未传入 `items` 时都创建新列表，通常用 `None` 作为默认值，把创建列表的动作放到函数体内：

```python
# 可独立运行
def add(value, items=None):
    if items is None:
        items = []  # 每次未传入 items 时，在这里创建新列表
    items.append(value)
    return items

print(add(1))  # [1]
print(add(2))  # [2]
```

列表、字典和集合等可变对象都可能出现这种共享状态。这里的“经典坑”，就是把“只创建一次的默认对象”误以为“每次调用都会创建的新对象”。如果调用者显式传入列表，`items` 仍会指向传入的列表，函数里的 `append` 会修改它。

## 整数与任意精度

Python 的 int 底层是变长的「数字数组」，数字大了就多用几个单元存，只受内存限制。代价是比固定长度的整数慢。所以 Python 里 `2 ** 1000` 能直接算出来。

## 浮点数与十进制金额

浮点数用二进制存储，0.1 在二进制里是无限循环小数，只能近似存储，`0.1 + 0.2` 实际是 `0.30000000000000004`。

- 比较用 `math.isclose(a, b)`；
- **金额计算用** `decimal.Decimal`（用字符串构造：`Decimal("0.1")`，用 float 构造会把误差带进去）；数据库里用 `numeric`。
- 这个问题所有语言都有（Java 的 double 一样），金额 Java 用 BigDecimal。

## 除法、整除与取余

`/` 永远返回 float（`4 / 2 == 2.0`）；`//` 是向下取整除（`-7 // 2 == -4`，注意是**向下**不是向零）；`%` 取余，结果符号跟除数一致（`-7 % 2 == 1`）。Java 的 `/` 对整数是向零截断，`-7 / 2 == -3`。

## 文本与字节

- `str` 是 Unicode 字符序列（人看的文本），`bytes` 是原始字节（网络传输、文件存储用的）。
- `"中文".encode("utf-8")` → `b'\xe4\xb8\xad\xe6\x96\x87'`；`b.decode("utf-8")` → `"中文"`。
- 常见基本汉字在 UTF-8 中通常占 3 个字节；有些扩展汉字需要 4 个字节：`len("中") == 1`，`len("中".encode()) == 3`。
- 网络、文件、Redis 拿到的默认是 bytes（redis-py 设 `decode_responses=True` 自动解码）。

## 字符串的不可变性

不可变的好处：可以哈希（做 dict 键）、线程安全、可以缓存和复用（字符串驻留）。
拼接大量字符串：**用** `"".join(list)`，不要在循环里 `s += x`（每次都创建新字符串，O(n²)；CPython 对某些情况有优化，但不能依赖）。Java 里对应用 StringBuilder。

## 字符串操作

`split`、`join`、`strip`（去两端空白）、`replace`、`startswith` / `endswith`、`find`（找不到返回 -1）/ `index`（找不到抛异常）、`upper` / `lower`、`isdigit`、`format` / f-string、切片 `s[::-1]`（反转）。

## 真值判断

`None`、`False`、`0`、`0.0`、`""`、`[]`、`{}`、`set()`、`()`，以及定义了 `__bool__` 返回 False 或 `__len__` 返回 0 的对象。其余都是 True。
所以 `if not lst:` 判断空列表；但判断「是不是 None」要写 `if x is None`（因为 0 和空字符串也是 False）。

## 身份与值的比较

`is` 比较身份（是不是同一个对象，`id()` 相同）；`==` 比较值（调用 `__eq__`）。判断缺失值通常用 `x is None`；布尔条件直接使用真值，不要用 `is True` 替代一般的真值判断。

## 缓存与驻留的边界

`-5 ~ 256` 的整数预先创建好、全局复用；短的、像标识符的字符串会被驻留。所以 `a = 256; b = 256; a is b` 是 True，257 就不一定。**结论：比较值永远用** `==`。

## 类型转换

`int("12")`、`float("1.5")`、`str(12)`、`list("abc")` → `['a','b','c']`、`tuple([1,2])`、`set([1,1,2])` → `{1,2}`、`dict([("a",1)])`、`bool(x)`。`int("1.5")` 会报错，要先 `float` 再 `int`。
## 小练习

尝试解释：两个相等列表为什么不一定 `is` 相同；为什么 `if value is None` 不会把合法的 `0` 当作缺参。然后进入 [容器与数据操作](./containers.md)。

---

[上一篇](/notes/python/uv.md) · [下一篇](/notes/python/basics/containers.md) · [学习目录](/notes/python/README.md)
