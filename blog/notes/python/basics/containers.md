---
title: "容器与数据操作"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 2
article: false
---

# 容器与数据操作

容器的选择先看数据含义：列表保存可变序列，元组表达固定组合，字典建立键到值的映射，集合表达去重和成员关系。先把常用写法练熟，再看底层实现与复杂度。

## 四类常用容器

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

## 元组与固定组合

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

## 索引与切片

`a[start:stop:step]`，左闭右开；`a[-1]` 最后一个；`a[::-1]` 反转；`a[:]` 浅拷贝。切片越界不报错（索引越界才报错）。

## 字典的常见操作

```python
d = {"a": 24, "g": 52, "i": 12, "k": 33}
sorted(d.items(), key=lambda kv: kv[1])              # 按 value 排序
sorted(d.items(), key=lambda kv: kv[1], reverse=True)[:2]   # value 最大的两个
merged = {**d1, **d2}         # 合并（d2 覆盖 d1）；3.9+ 也可以 d1 | d2
d.get("x", 0)                 # 取不到返回默认值，不报 KeyError
d.setdefault("x", []).append(1)
{v: k for k, v in d.items()}  # 键值互换
```

## 集合与集合运算

去重、成员判断、集合运算：`a | b`（并）、`a & b`（交）、`a - b`（差）、`a ^ b`（对称差）。
**去重并保持顺序**：`list(dict.fromkeys(lst))`（利用 dict 有序且键唯一）；`list(set(lst))` 会打乱顺序。

## 嵌套列表与共享引用

```python
grid = [[0] * 3] * 3      # 错！三行是同一个列表对象
grid[0][0] = 1            # [[1,0,0],[1,0,0],[1,0,0]]
grid = [[0] * 3 for _ in range(3)]   # 对：每行是新列表
```

## 浅拷贝与深拷贝

```python
import copy
a = [[1, 2], [3]]
b = a[:]                  # 浅拷贝：新的外层列表，里面的元素还是同一批对象
b[0].append(9)            # a 也变成 [[1, 2, 9], [3]]
c = copy.deepcopy(a)      # 深拷贝：递归复制，互不影响
```

浅拷贝的方式：`list(a)`、`a[:]`、`a.copy()`、`copy.copy(a)`、`dict(d)`、`{**d}`。

## 推导式与转换

`[f(x) for x in xs if cond(x)]` 通常比 `list(map(f, filter(cond, xs)))` 更易读。生成器表达式 `(...)` 不立即生成，适合大数据量或只遍历一次。

## 原地排序与返回新列表

`lst.sort()` 原地排序、返回 None；`sorted(iterable)` 返回新列表，适用于任何可迭代对象。
算法是 **Timsort**（归并 + 插入排序的混合），**稳定排序**，最好 O(n)（已基本有序时）、最坏 O(n log n)。Java 对象数组的 `Arrays.sort` 也用 Timsort。
多字段排序：`sorted(users, key=lambda u: (-u.score, u.name))`（分数降序、同分按名字升序）。

## 常用内置函数

`enumerate`（带下标遍历）、`zip`（并行遍历，3.10+ 可 `strict=True`）、`any` / `all`、`min` / `max(key=...)`、`sum`、`reversed`、`range`、`isinstance`、`itertools.chain` / `groupby` / `islice` / `product`、`functools.reduce` / `lru_cache` / `partial`。

## collections 中的工具

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

## 堆与有序插入

- `heapq`：**小顶堆**（在普通 list 上操作）。`heappush`、`heappop`（O(log n)）、`heapify`（O(n)）、`nlargest(k, xs)` / `nsmallest`。要大顶堆就存负数。用途：Top K、优先队列、合并 K 个有序列表、定时任务调度。
- `bisect`：在有序列表里二分查找插入位置，`bisect_left` / `bisect_right` / `insort`。

## 列表的底层与扩容

list 是**动态数组**：底层是一块连续的指针数组（存的是对象的引用，不是对象本身）。

- 容量不够时扩容，每次**多分配一些**（大约 1.125 倍 + 常数），所以大多数 append 不用扩容，**均摊 O(1)**；
- `insert(0, x)` / `pop(0)` 要移动后面所有元素，O(n) → 两端操作用 `collections.deque`。
- **对比 Java**：类似 ArrayList（Java 扩容 1.5 倍）。

## 操作的复杂度

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

## 字典的底层与顺序

- 哈希表。键先算 `hash(key)`，用哈希值找到槽位；冲突时用**开放寻址**（探测下一个位置，Python 用的是伪随机探测）。
- 3.6 起是「**紧凑字典**」：一个稀疏的小索引数组 + 一个按插入顺序排列的紧凑条目数组（哈希值、键、值）。省内存，并且天然保留插入顺序，3.7 起写进语言规范。
- 装填超过 2/3 时扩容并重新插入。
- **键必须可哈希**：要有 `__hash__`，且 `a == b` 时 `hash(a) == hash(b)`。
- **对比 Java HashMap**：Java 用**链地址法**（数组 + 链表，链表长度超过 8 且数组长度 ≥ 64 时转红黑树），负载因子 0.75，扩容 2 倍；Python 用开放寻址。

## 遍历时修改的边界

不能增删键（报 `RuntimeError: dictionary changed size during iteration`）。要删就先 `list(d.keys())` 复制一份再遍历，或者用推导式生成新字典。
## 练习：统计与排序

```python
# 可独立运行
from collections import Counter

names = ["redis", "python", "redis", "sql"]
counts = Counter(names)
ranking = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
assert ranking == [("redis", 2), ("python", 1), ("sql", 1)]
original = [[1], [2]]
shallow = original.copy()
shallow[0].append(3)
assert original[0] == [1, 3]
```

把“是否创建新容器”和“是否复制内部对象”分开判断。接着读 [控制流](./control-flow.md)。

---

[上一篇](/notes/python/basics/types.md) · [下一篇](/notes/python/basics/control-flow.md) · [学习目录](/notes/python/README.md)
