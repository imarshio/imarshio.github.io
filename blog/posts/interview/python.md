---
icon: fa-solid fa-face-smile-wink
order: 15
title: Python 面试题
---

> 由浅入深 · 基础 → 进阶 → 项目 → Agent / RAG
>
> - 【基础】语言机制、语法、内置数据结构，适合开场热身
> - 【进阶】并发、内存、框架、设计模式，考察真实项目经验
> - 【高级】LLM / Agent / RAG 架构、微调、评估，鉴别项目深度

---

## 第一章 Python 语言基础

### 1.1 语言概述

**Q：Python 有哪些特点与优点？** 【基础】

> 语法简洁、动态类型、丰富标准库/生态、跨平台、易与 C 扩展集成，适合脚本、Web、ML 等多种场景。

**Q：Python 解释型语言与编译型语言的区别？** 【基础】

> 解释型走「源码/字节码 + 解释器」路线，跨平台好、改代码即跑；编译型先编成机器码，运行期通常更快。CPython 先把源码编译为 `.pyc` 字节码再由解释器执行。

**Q：Python 有哪些局限性？** 【基础】

> GIL 限制多线程 CPU 密集并行；包分发与二进制体积问题；真移动原生弱；动态类型需测试兜底。

**Q：Python 有哪些常见应用场景？** 【基础】

> Web 开发、脚本自动化/运维、数据科学/AI/ML、测试开发、小工具、嵌入式（MicroPython）等。

**Q：Python 的代码执行过程？** 【基础】

> 读源码 → 词法/语法分析 → 编译为字节码（`.pyc` 可缓存） → PVM（Python 虚拟机）逐条执行；`import` 会缓存已加载模块，避免重复执行。

**Q：Python2 与 Python3 的主要区别？** 【基础】

> `print` 变函数；`str` 统一为文本（Unicode）；`/` 变真除；`xrange` → `range`；`dict.keys()` 等返回视图；默认编码为 UTF-8。

---

### 1.2 基本语法

**Q：Python 中 `is` 和 `==` 的区别？** 【基础】

> `==` 比较值是否相等，调用 `__eq__`；`is` 比较是否为同一对象（身份），本质比较 `id()`。注意小整数（-5~256）和短字符串驻留机制，`is` 可能意外为 `True`；`None` 推荐用 `is None`；`NaN != NaN` 是特例。

**Q：`is not` 和 `!=` 的区别？** 【基础】

> `!=` 值不相等；`is not` 非同一对象。比较 `None` 应用 `is not None`，不用 `!= None`。

**Q：Python 是否区分大小写？** 【基础】

> 是，标识符与多数字面量都区分大小写。

**Q：标识符命名规则？为何不总用下划线开头？** 【基础】

> 字母或下划线开头，含数字/字母/下划线，不能是关键字，PEP 8 推荐蛇形命名。单 `_x` 表内部使用；`__x` 触发类内名字改写防冲突；`__x__` 是魔法协议保留形式。

**Q：多变量声明与赋值的写法？** 【基础】

> `a = b = 0` 连续赋同值；`a, b = 1, 2` 元组解包；`*rest, last = seq` 扩展解包。

**Q：三元表达式如何写？** 【基础】

> `a if cond else b`；勿滥用嵌套，可读性优先。

**Q：如何使用多进制字面量？** 【基础】

> `0b` 二进制、`0o` 八进制、`0x` 十六进制；`int(s, 0)` 可自动识别前缀。

**Q：`//`、`%`、`**` 的含义？** 【基础】

> `//` 整除（向负无穷取整）；`%` 取模；`**` 幂运算。负数整除/取模注意向负无穷取整语义。

**Q：Python 的逻辑运算符、关系运算符、位运算符？** 【基础】

> 逻辑：`and` `or` `not`，短路求值；关系：`==` `!=` `<` `>` `<=` `>=`，支持链式比较如 `0 < a < 10`；位运算：`&` `|` `^` `~` `<<` `>>`，与逻辑运算符不同，不短路。

**Q：`in` / `not in`（成员运算符）的作用？** 【基础】

> 检查元素是否在可迭代对象/映射键中，`dict` 中查键，`set` 查值，`list` 线性扫描。

**Q：`pass` 的作用？** 【基础】

> 空语句块合法占位，用于待实现的函数/类体、`except` 补全语法，无任何操作。

**Q：`break` / `continue` / `pass` 的区别？** 【基础】

> `break` 跳出最内层循环；`continue` 跳过本轮直接进入下一轮；`pass` 不做任何事，仅占位。

**Q：如何实现 `switch` 语句？** 【基础】

> `if/elif/else`；Python 3.10+ 用 `match/case`；或用字典映射/策略模式。

**Q：如何注释代码？** 【基础】

> `#` 行注释；多行用每行 `#` 或模块字符串；Python 没有 C 式块注释符。

---

### 1.3 字符串与序列

**Q：单引号与双引号的区别？** 【基础】

> 完全等效；方便嵌套时交替使用；Python 没有 `char` 类型，单个字符也是字符串。

**Q：用索引反转字符串？** 【基础】

> `s[::-1]`；或 `''.join(reversed(s))`。

**Q：删除字符串前置/后置空格？** 【基础】

> `strip()` 去两端；`lstrip()` 去左端；`rstrip()` 去右端；`strip(chars)` 指定字符集。

**Q：转小写的方法？** 【基础】

> `lower()`；`casefold()` 更彻底，适合大小写不敏感的国际化比较。

**Q：字符串替换的方式？** 【基础】

> `str.replace(old, new)`；`re.sub(pattern, repl, s)` 正则替换；`str.translate(str.maketrans(...))` 批量字符映射。

**Q：`join` 和 `split` 的用法？** 【基础】

> `sep.join(iterable_of_str)` 拼接字符串，避免循环 `+`；`s.split(sep)` 按分隔符切成列表，默认按空白切并合并连续空白。

**Q：负索引的含义？** 【基础】

> `seq[-1]` 表最后一个元素；`seq[-n]` 表倒数第 n 个；切片同样支持负下标。

**Q：`read` / `readline` / `readlines` 的区别？** 【基础】

> `read(n)` 读 n 字节或全文件；`readline()` 读一行；`readlines()` 返回行列表。大文件避免一次性 `read()` 进内存，用 `for line in f` 迭代。

---

### 1.4 列表、字典、集合

**Q：`append` / `insert` / `extend` 的区别？** 【基础】

> `append(x)` 尾部追加单个元素；`insert(i, x)` 在位置 i 插入；`extend(iterable)` 迭代追加多个元素。`append` 可迭代对象会当单个元素整体追加。

**Q：`remove` / `del` / `pop` 的区别？** 【基础】

> `remove(值)` 删首个匹配值；`pop(i)` 删并返回（默认最后一个）；`del` 按索引/切片/变量名删除。

**Q：如何改变列表中元素的类型？** 【基础】

> `[int(x) for x in lst]` 或 `list(map(int, lst))`，均返回新列表。

**Q：什么是字典？常见用法？** 【基础】

> 可变的键值映射，键必须可哈希；增删改查、`get(key, default)`、`setdefault`、`defaultdict`；Python 3.7+ 保持插入顺序。

**Q：如何获取字典所有键？** 【基础】

> `d.keys()` 返回视图（随 dict 变化）；`list(d)` 直接得键列表；迭代 `for k in d` 默认迭代键。

**Q：Python 的内置数据结构有哪些？** 【基础】

> `list`、`tuple`、`dict`、`set`、`str`、`bytes`、`bytearray`；标准库 `collections` 提供 `defaultdict`、`Counter`、`deque` 等特化结构。

---

### 1.5 控制流与推导式

**Q：`range` 怎么用？** 【基础】

> `range(stop)` / `range(start, stop, step)`，惰性等差整数序列；常与 `for` 配合，比列表省内存。

**Q：`any` 和 `all` 的作用？** 【基础】

> `any(iterable)` 有任一真即为 `True`；`all(iterable)` 全为真才为 `True`；均短路求值。空可迭代：`any` 为 `False`，`all` 为 `True`。

**Q：`enumerate` 的用法？** 【基础】

> `enumerate(iterable, start=0)` 同时产出索引和元素，避免手写 `i += 1`。

**Q：`zip` 的用法？** 【基础】

> 多个可迭代对象拉链组合，以最短为准截断；`zip(*matrix)` 实现矩阵转置；`itertools.zip_longest` 补全到最长。

---

## 第二章 Python 面向对象

### 2.1 类与对象基础

**Q：类与对象的关系？** 【基础】

> 类是属性与方法的蓝本（模板）；对象是类的实例，各有独立状态（实例属性）。

**Q：`self` 的作用？** 【基础】

> 约定名，指向当前实例；实例方法第一个参数必须显式声明，类方法用 `cls`，静态方法无需。

**Q：`__init__` 的作用？** 【基础】

> 对象创建后的初始化方法，用于设置实例属性；并非真正的构造函数（分配内存是 `__new__`）。

**Q：`__init__` 与 `__new__` 的区别？** 【基础】

> `__new__` 创建并返回新实例（类方法），控制对象分配，用于单例/不可变子类；`__init__` 初始化实例属性。执行顺序：`__new__` → `__init__`。

**Q：Python 知道哪些魔术方法？** 【进阶】

> `__init__` / `__new__`：创建初始化；`__str__` / `__repr__`：字符串表示；`__len__` / `__getitem__` / `__setitem__`：容器协议；`__enter__` / `__exit__`：上下文管理；`__eq__` / `__lt__`：比较运算符；`__call__`：可调用对象。

**Q：Python 为何没有函数重载？** 【基础】

> 动态类型不绑定签名，靠默认参数、`*args`/`**kwargs`、多态、`functools.singledispatch` 实现类似效果；或直接用不同函数名。

---

### 2.2 继承与多态

**Q：面向对象继承的特点？** 【基础】

> 子类复用/扩展父类属性和方法；支持多重继承，解析顺序用 MRO（C3 线性化）；`super()` 按 MRO 调用父类。

**Q：Python 支持多重继承吗？MRO 是什么？** 【进阶】

> 支持多重继承；MRO 用 C3 线性化算法确定方法查找顺序，`super()` 沿 MRO 传播；用 `ClassName.__mro__` 查看顺序；菱形继承时需谨慎设计。

**Q：封装的特性？** 【基础】

> 属性/方法受控访问；`_x` 约定内部；`__x` 名字改写防子类冲突；`property` 描述符控制 getter/setter；最小暴露面原则。

**Q：多态的特性？** 【基础】

> 同一接口不同类有不同实现，运行时按实际类型分派；Python 用鸭子类型实现，不要求类型继承关系。

**Q：什么是鸭子类型？** 【基础】

> 不看出身看行为——只要对象有相应方法/属性即可使用，无需显式继承；`Protocol`（PEP 544）可静态补约束，适合大型项目。

**Q：面向对象中的抽象特性？** 【进阶】

> 用 `abc.ABC` + `@abstractmethod` 定义接口，子类必须实现；`Protocol` 支持结构化子类型（鸭子类型的静态版）；隐藏实现细节，对外暴露稳定接口。

---

## 第三章 Python 进阶特性

### 3.1 函数高阶特性

**Q：装饰器的原理与使用？** 【进阶】

> `@deco` 等价于 `func = deco(func)`；带参数的装饰器需三层嵌套（工厂→装饰器→包装器）；用 `functools.wraps` 保留被装饰函数的元信息（`__name__`、`__doc__`）。

**Q：什么是闭包？常见陷阱？** 【进阶】

> 内层函数引用外层非全局自由变量，调用结束后变量仍被保留。陷阱：循环变量延迟绑定（用默认参数 `lambda i=i: i` 提前捕获）；可变默认参数共享。

**Q：`*args` 和 `**kwargs` 的作用？** 【基础】

> `*args` 收集多余位置参数为元组；`**kwargs` 收集多余关键字参数为字典；装饰器/函数转发/API 扩展常用；调用时 `*list` / `**dict` 解包传参。

**Q：`lambda` 与 `def` 的区别？** 【基础】

> `lambda` 是匿名单行表达式，不能含语句；适合 `sorted(key=lambda x: x[1])` 等简单场景；PEP 8 建议复杂逻辑用 `def`，`lambda` 赋变量无意义。

**Q：`map` / `filter` / `reduce` 的用法？** 【基础】

> `map(f, iterable)` 惰性映射；`filter(pred, iterable)` 保留真值；`functools.reduce(f, iterable, init)` 两两归约；多数场景列表推导更可读。

**Q：变量作用域（LEGB 规则）？** 【进阶】

> Local → Enclosing → Global → Built-in；`global` 声明修改全局变量；`nonlocal` 声明修改闭包外层变量；Python 3 列表推导有独立作用域，不会泄漏变量。

---

### 3.2 迭代与生成器

**Q：`iterable` 与 `iterator` 的区别？** 【进阶】

> 可迭代（iterable）：实现 `__iter__`，返回迭代器；迭代器（iterator）：实现 `__iter__` + `__next__`，调用 `next()` 逐个产出值，通常一次性耗尽。

**Q：`yield` 和生成器的用法？** 【进阶】

> 函数中含 `yield` 即成生成器函数，调用返回生成器对象（惰性、省内存）；每次 `next()` 执行到下一个 `yield` 暂停，保留局部状态；适合大文件逐行处理、数据流管道。

**Q：迭代器与生成器的区别？** 【进阶】

> 生成器是迭代器的一种实现（`yield` 自动提供 `__iter__`/`__next__`）；迭代器是协议；可迭代是工厂（每次 `iter()` 产新迭代器）。

**Q：什么是元组解封装？** 【基础】

> `a, b = t` 解包元组；`*rest, last = seq` 扩展解包；函数多返回值本质是元组解包。

---

### 3.3 拷贝与序列化

**Q：深拷贝与浅拷贝的区别？** 【进阶】

> 浅拷贝（`copy.copy`/切片）只拷外层容器，内层对象仍共享引用；深拷贝（`copy.deepcopy`）递归独立复制所有层级。嵌套结构必须用 deepcopy。

**Q：`pickle` 序列化与反序列化？** 【进阶】

> `pickle.dumps/loads` 序列化几乎所有 Python 对象；**安全风险：反序列化不可信数据会导致 RCE**，严禁用于网络传输；跨版本需保持 protocol 一致，大型项目考虑 msgpack/protobuf。

---

### 3.4 内存管理

**Q：Python 是如何管理内存的？** 【进阶】

> 引用计数：引用降为 0 立即释放（最快路径）；循环引用由分代 GC（gc 模块）周期检测回收；优化：`__slots__` 减少实例字典开销、生成器避免大列表、必要时对象池。

**Q：程序退出时是否释放所有内存？** 【进阶】

> 解释器会尝试回收多数对象，进程退出后 OS 回收页；但不保证析构时序/立即归还；C 扩展和悬挂引用可能泄漏到进程结束。

---

### 3.5 并发与 GIL

**Q：什么是 GIL？对多线程有何影响？** 【进阶】

> GIL（全局解释器锁）保证同一时刻只有一个线程执行 Python 字节码；CPU 密集型任务多线程无法真正并行；I/O 密集型线程等待时释放 GIL，多线程仍有效。

**Q：如何实现多线程？** 【进阶】

> `threading.Thread(target=f, args=(...)).start()`；共享状态用 `Lock`/`RLock` 等同步原语；GIL 下适合 I/O 密集场景。

**Q：多线程 vs 多进程 vs 异步，如何选型？** 【进阶】

> I/O 密集：优先 `asyncio`，其次 `ThreadPoolExecutor`；CPU 密集：`multiprocessing` 或进程池绕过 GIL；ONNX/C++ 扩展内部不受 GIL 约束，可用 ORT 线程池并行。

**Q：线程池的原理与使用？** 【进阶】

> `concurrent.futures.ThreadPoolExecutor` 维护工作线程池 + 任务队列，复用线程减少创建开销；`submit()` 返回 `Future`，`as_completed()` 按完成顺序处理；`max_workers` 按场景调整。

---

### 3.6 标准库与工具

**Q：`help` 和 `dir` 的作用？** 【基础】

> `help(obj)` 查文档/签名；`dir(obj)` 列属性名列表（不传参看当前作用域符号）；REPL 调试常用。

**Q：常用标准库模块？** 【进阶】

> `os`/`pathlib`（文件系统）、`sys`（解释器）、`json`（序列化）、`re`（正则）、`collections`（高效容器）、`itertools`/`functools`（函数工具）、`datetime`（时间）、`typing`（类型注解）。

**Q：正则 `match` 与 `search` 的区别？** 【进阶】

> `match` 从字符串首部匹配；`search` 在整个字符串中找第一处匹配。注意 `re.M` 多行模式对 `^` 的影响。

**Q：`re` 中 `split` / `sub` / `subn` 的区别？** 【进阶】

> `split(pattern, s)` 按模式切分；`sub(pattern, repl, s)` 替换（repl 可为函数）；`subn` 同 sub 但额外返回替换次数。

**Q：`namedtuple` 的用途？** 【进阶】

> `collections.namedtuple` 创建具名字段的轻量不可变记录，支持类属性访问；`dataclass` 可替代（支持可变/类型注解）。

**Q：`random` 模块常用方法？** 【基础】

> `random()` 返回 [0,1) 浮点；`randint(a, b)` 整数；`shuffle(lst)` 原地洗牌；`sample(pop, k)` 不重复抽样。

**Q：如何分析 Python 执行性能？** 【进阶】

> `timeit` 微基准；`cProfile`/`profile` 函数级热点；`line_profiler` 逐行耗时；`py-spy` 低开销采样分析。

**Q：4G 内存如何读取 8G 文件？** 【进阶】

> `for line in f` 逐行迭代不一次性 `readlines()`；二进制文件 `while chunk := f.read(65536)` 分块读取；必要时 `mmap` 映射文件。

**Q：Python 为何常被认为慢？如何改进？** 【进阶】

> GIL + 动态类型 + 解释执行；改进：NumPy/Numba/Cython/Rust 扩展热点、多进程/异步 IO、PyPy JIT。

**Q：什么是猴子补丁？** 【进阶】

> 运行时动态替换模块/类/函数，无需修改源码；常用于单测 mock、热修复；风险是破坏封装、调试困难，应限制范围并注释。

**Q：`KeyError` / `TypeError` / `ValueError` 分别何时出现？** 【基础】

> `KeyError`：字典访问不存在的键；`TypeError`：类型不兼容操作；`ValueError`：值合法但在此上下文不允许，如 `int('abc')`。

**Q：模块和包的区别？** 【基础】

> `.py` 文件为模块，是命名空间；包是含 `__init__.py` 的目录 + 子模块；`sys.path`/`PYTHONPATH` 控制搜索路径。

**Q：了解哪些编码规范？** 【基础】

> PEP 8（命名/缩进/空格）、类型注解（PEP 484+）、`black`/`ruff` 格式化、docstring 约定（Google/NumPy 风格）、import 顺序（标准库→第三方→本地）。

**Q：什么是 Flask？** 【基础】

> 轻量 WSGI 微框架，提供路由 + 请求上下文 + Jinja2 模板；适合中小 API/原型；扩展用蓝本（Blueprint）和插件生态。

---

## 第四章 数据库与向量库

### 4.1 关系数据库

**Q：SQL 优化的常见手段？** 【进阶】

> 建立合适索引（覆盖索引、联合索引前缀）；用 `EXPLAIN` 分析执行计划；避免 N+1 查询（用 JOIN 或批量查询）；游标分页替代大 OFFSET；只查需要的列。

**Q：Python 如何与数据库交互？** 【基础】

> 使用 DB-API 2.0 兼容驱动（如 `psycopg2`、`pymysql`）；ORM 层用 SQLAlchemy 或 Django ORM；异步场景用 `asyncpg`/`databases`。

---

### 4.2 向量库原理与选型

**Q：向量库与关系型数据库的区别？** 【基础】

> 关系型数据库：精确匹配、结构化 SQL 查询，适合事务性数据；向量库：ANN（近似最近邻）相似度查询，支持稠密/稀疏向量；Chroma 默认使用 SQLite + HNSW 索引文件，`persist_directory` 配置持久路径。

**Q：了解哪些向量库？怎么选型？** 【进阶】

> Milvus（大规模生产）、Qdrant（Rust 高性能）、Weaviate（多模态）、pgvector（PostgreSQL 扩展）、Chroma（本地轻量）；选型看规模、过滤需求、运维成本、是否需云托管。

**Q：向量库的工作流程？** 【进阶】

> 写入：解析→分块→嵌入→upsert（带 metadata）；查询：embed query→ANN search→后处理（过滤/重排）；维护：增量更新/删除旧 chunk 与重建索引策略。

**Q：HNSW、LSH、PQ 各是什么？** 【进阶】

> HNSW：分层小世界图，查询精度高，内存占用大；LSH：哈希分桶近似算法，速度快精度相对低；PQ（积量化）：子向量量化大幅压缩内存，常与 IVF 组合（IVF-PQ）。

**Q：余弦、欧氏、曼哈顿距离的区别？** 【进阶】

> 余弦：衡量方向夹角，不受向量长度影响，适合文本语义检索；欧氏（L2）：绝对空间距离，适合图像/推荐；曼哈顿（L1）：各维差值之和，对异常值更鲁棒。

**Q：Chroma + BM25 混合检索如何融合？** 【进阶】

> RRF（Reciprocal Rank Fusion）：`score = Σ 1/(k + rank_i)`，k 常取 60；或归一化各路分数后加权求和；LangChain 提供 `EnsembleRetriever` 封装；Chroma 本身不自带混合检索。

**Q：知识库如何实现去重与增量更新？** 【高级】

> 对文档内容/路径计算哈希，变更时删除旧 chunk_id 再重新嵌入；维护 SQL 表记录文档→chunk_id 映射，保持 SQL 与向量库一致性；推荐增量策略，避免全量重建。

**Q：多知识库切换的技术方案？** 【高级】

> 多 Collection 隔离：每个知识库独立 Collection，强隔离无干扰；单 Collection + metadata 过滤：统一存储可跨库联合查询，但大数据量时 ANN 精度受影响；按规模权衡。

---

## 第五章 LLM 工程基础

### 5.1 Embedding 与语义检索

**Q：什么是 Embedding？如何选择？** 【基础】

> 将离散文本映射为稠密向量，语义相近的文本在向量空间中距离更近；中文常用 bge-large-zh、m3e、text-embedding-3-small；选型考量：语言覆盖、维度与成本、上下文长度、是否可私有部署。

**Q：向量库是什么？在 LLM 应用里解决什么？** 【基础】

> 存储稠密向量并提供 ANN 检索；用于语义检索（RAG）、去重/相似度查找、推荐系统。

**Q：什么是 MinerU？** 【进阶】

> PDF 结构化解析工具，支持表格/图片/公式提取，输出 Markdown/JSON；用于清洗文档后再分块，提升 RAG 质量。

---

### 5.2 RAG 核心流程

**Q：什么是 RAG？主流程？** 【基础】

> 检索增强生成（Retrieval-Augmented Generation）：先检索再生成。索引阶段：解析→清洗分块→嵌入→写入向量库；查询阶段：query→（改写）→召回→重排→拼 Prompt→LLM 生成。

**Q：RAG 的分块策略有哪些？chunk_size/overlap 怎么定？** 【进阶】

> `RecursiveCharacterTextSplitter` 按分隔符优先级递归切，最常用；按语义边界（段落/标题）、按 Token 计数、表格单独分块；chunk_size 通常 512~1024 token；overlap 10~20% 防止边界信息丢失；需在验证集上对比实验。

**Q：RAG 中 Rerank 是什么？为什么需要？** 【进阶】

> 对粗排召回的 Top-K 文档用 cross-encoder 精排，输出更准确的相关性分数；向量检索召回快但精度有限，Rerank 计算量大但排序质量高，两者互补；常用 bge-reranker、Cohere Rerank。

**Q：混合检索是什么？解决什么问题？** 【进阶】

> 稠密向量检索 + BM25 等稀疏检索结合；专有名词/关键词精确匹配（BM25）+ 语义理解（向量）互补，提高召回覆盖与鲁棒性。

**Q：RAG 查询扩展是什么？为何需要？** 【进阶】

> 多表述/HyDE（假设文档扩展）/子查询；单句 query 难以覆盖同义词与省略，扩展召回提升命中率。

**Q：什么是自查询（self-query）？** 【进阶】

> LLM 把自然语言 query 解析为「向量子句 + metadata 过滤条件」；适合多字段过滤（如日期、来源、类别）的精准检索场景。

**Q：提示压缩是什么？RAG 为何需要？** 【进阶】

> 对检索到的长文档块做摘要/抽取关键句再拼入 Prompt；省 token、降噪声，注意别丢失关键条件信息。

**Q：什么是父子索引？解决什么问题？** 【高级】

> 小 chunk 用于相似度召回（精准），找到后返回其父级大 chunk 给 LLM 生成（信息完整）；解决小块信息量不足、大块难以精准检索的矛盾。

**Q：多路召回是什么？** 【进阶】

> 多查询变体或 HyDE 生成多个 query，各自召回后合并去重；提高覆盖率，减少单一 query 的召回偏差。

**Q：RAG 完整流程的评估与调优？** 【高级】

> 用 RAGAS（faithfulness、answer_relevancy、context_precision/recall）+ 人工抽检构建评估闭环；线上指标：首解率、引用命中率、时延、成本、投诉率 A/B 对比。

**Q：什么是 Advanced RAG？** 【高级】

> 在基线 RAG 上增加：预检索（query 改写、HyDE、多查询扩展）、后检索（Rerank、提示压缩、自洽性检查、引用标注）等工程化优化层。

**Q：什么是 Modular RAG？** 【高级】

> 检索/重排/生成/规划模块化，各组件可插拔替换与 A/B 测试，利于长期维护与迭代。

**Q：LangChain 里如何搭建文档问答？关键步骤？** 【进阶】

> Loader → Splitter → Embeddings → VectorStore → Retriever（+ 可选 Rerank）→ Memory → LLM；用 Chain 或 Agent 封装；可选 LangSmith 监控。

**Q：LangChain 里 PDF 表格如何保障召回质量？** 【高级】

> 解析层用 MinerU/PDFPlumber 提取表格为 HTML/TSV 保留结构；表格单独分块并添加 metadata；高精度场景对表格建结构化索引，用 Text-to-SQL 查询代替向量检索。

---

### 5.3 Prompt Engineering

**Q：提示工程在 RAG 中的技巧？** 【进阶】

> 系统提示：明确"仅据以下文档回答，无法回答时说明"，防幻觉；少样本（few-shot）示例定义输出格式；分步推理（CoT）复杂问题先推理再作答。

**Q：什么是幻觉？如何缓解？** 【进阶】

> 幻觉：模型生成与事实/检索文档不符的内容。缓解：RAG 引用约束、低 temperature + 拒答提示、工具查实时数据、人工审核；RAGAS faithfulness 评估；无法完全消除只能降低。

**Q：如何构建让 AI 写带校验的 Vue3/React 表单的 Prompt？** 【进阶】

> 明确框架版本（Vue3/React）、组件库、字段与校验规则（必填/格式）、错误展示与禁用提交逻辑、TypeScript 类型、无障碍（a11y）、只输出可运行代码、禁止臆造 API。

---

### 5.4 多轮记忆与上下文

**Q：如何管理多轮对话记忆？** 【进阶】

> 短期：窗口策略（最近 N 轮）或摘要压缩（超长时先摘要再拼接）；长期：外置向量库存储历史摘要，每轮 RAG 拉取相关历史；LangChain 提供 `ConversationBufferMemory`、`ConversationSummaryMemory` 等。

**Q：超长上下文受窗口限制时的工程解法？** 【高级】

> RAG 检索相关段落、Map-reduce 分块摘要再合并、分块 + 滑动窗口、长上下文模型（Gemini 1M token）、记忆外置（向量+KV 存储）、多轮压缩。

**Q：100 万 token 级上下文会让哪些业务质变？** 【高级】

> 整库/整仓单文件读入推理、多文件代码库整体理解、多合同对账比对、减少分块 RAG 的切割损耗；但成本和延迟仍是约束。

---

### 5.5 结构化输出与缓存

**Q：什么是大模型的结构化输出？** 【进阶】

> 模型输出机器可消费的 JSON/函数参数/tool calls，便于下游编排与强类型处理；OpenAI Structured Outputs 通过 JSON Schema 约束，降低 parse 失败率。

**Q：什么是 GPTCache？** 【进阶】

> 按语义/模板缓存 LLM 响应结果，减少延迟与费用；需设置 TTL 和防缓存污染策略；相同语义不同措辞的 query 可命中缓存。

**Q：什么是护栏技术（Guardrails）？** 【进阶】

> 入站/出站内容策略：PII 检测过滤、越狱防护、输出 schema 约束、合规模块与审计日志；确保模型在安全边界内运行。

---

## 第六章 Agent 与工具链

### 6.1 Agent 基础

**Q：什么是 LLM Agent？与传统 AI 的区别？** 【基础】

> LLM Agent：以大模型为决策核心，循环调用工具 + 观察环境反馈，直到完成目标；传统 AI：规则/小模型固定管线，行为由代码逻辑硬编码，灵活性差。

**Q：LLM Agent 的基本组成？** 【进阶】

> 规划（分解目标）、记忆（短期窗口+长期外存）、工具（检索/API/代码执行/浏览器）、感知（观察工具返回）、反思（判断是否需调整）。

**Q：Agent 的工作过程？** 【进阶】

> 目标 → 规划子任务 → 选择工具 → 执行 → 读取反馈 → 判断是否完成 → 循环或终止。

**Q：ReAct 模式是什么？** 【进阶】

> Reasoning + Acting 交替：Thought（分析）→ Action（调用工具）→ Observation（读结果）循环；LLM 根据观察动态修正推理，避免盲目执行。

**Q：Copilot 模式与 Agent 模式的区别？** 【进阶】

> Copilot：人主控，AI 辅助建议，决策权在人；Agent：目标驱动，AI 自主规划多步执行；高风险决策用 Copilot，重复性自动化用 Agent。

**Q：LLM Agent 常见功能？** 【进阶】

> 检索知识库、调用外部 API、代码生成执行、多 Agent 协作、人在回路（HITL）审批。

**Q：如何让 LLM Agent 有长期记忆？** 【高级】

> 外存（向量库/图数据库）+ RAG 按需拉取历史 + 用户画像持久化 + 周期性摘要压缩 + 冲突解决与遗忘策略。

**Q：LLM Agent 如何动态调用外部 API？** 【高级】

> 定义工具 Schema（OpenAPI/JSON Schema）声明入参、描述、返回格式；鉴权注入环境变量；幂等设计 + 超时重试（指数退避）+ 限流保护 + 调用日志可观测。

---

### 6.2 LangChain 与 LangGraph

**Q：LangChain 核心组件？** 【进阶】

> Model I/O（多厂商 LLM 封装/流式/工具绑定）、Prompt、Retrieval（Loader/Splitter/VectorStore）、Memory、Tools、Callbacks/LCEL Runnable 组合链。

**Q：LangChain 与 LangGraph 的区别？** 【进阶】

> LangChain（Chain/LCEL）：DAG 管道，适合线性固定步骤的 RAG/问答；LangGraph：有状态有环图，支持条件分支/循环/HITL/自我纠错；复杂控制流用 LangGraph。

**Q：LangGraph 的编排原理？** 【高级】

> 图状态 + 节点（函数）+ 条件边 + checkpoint（可恢复）；人在回路通过条件边暂停等待人工输入；适合多步 Agent、重试/分支决策。

**Q：什么是 LangChain Agent？** 【进阶】

> 以策略（ReAct/OpenAI Functions 等）选择工具的代理；通过工具调用循环 + 结束条件控制执行流。

**Q：LlamaIndex 如何与 LangChain 结合？** 【高级】

> LlamaIndex 的 Index/QueryEngine/Retriever 作为 LangChain 的 Tool 或 Runnable 检索子模块；互补使用，LlamaIndex 擅长复杂文档索引结构。

**Q：LangChain 里多路召回如何动态调权？** 【高级】

> RRF 融合；或按各路置信度/语料域加权；`EnsembleRetriever` 先融合再 Rerank；可学习融合权重。

---

### 6.3 MCP 协议

**Q：MCP 是什么？在大模型系统中的作用？** 【进阶】

> Model Context Protocol：标准化宿主应用与外部工具/资源连接的通信协议；统一发现与调用，避免为每个工具单独实现集成逻辑。

**Q：MCP 架构核心组件？** 【进阶】

> Host（宿主应用）、Client（连接管理）、Server（工具/资源提供方）、传输层、能力声明（tools/resources/prompts）。

**Q：MCP 支持哪两种传输模式？** 【进阶】

> stdio（本地进程间通信）和 HTTP/SSE（远程可跨网络）。

**Q：MCP 与 Function Calling 的区别？** 【进阶】

> Function Calling：模型侧接口形态，LLM 输出结构化调用指令；MCP：应用侧多工具长生命周期集成标准，管理发现/鉴权/版本；两者可结合使用。

**Q：MCP 的工作流程？** 【进阶】

> 发现 Server → 列举能力 → 带鉴权调工具/读资源 → 结果回注对话；支持多轮交互。

**Q：MCP 安全设计的关键要点？** 【高级】

> 用户显式同意机制、能力最小权限白名单、审计日志、防 SSRF/命令注入、数据最小暴露、沙箱隔离运行。

**Q：已有应用如何改造为 MCP 服务？** 【高级】

> 把 REST 能力包装一层 MCP Server、Schema 化 I/O、鉴权映射、限流与版本管理。

**Q：Spring AI 中如何集成 MCP？** 【高级】

> 用 Spring AI MCP 模块注册 client/server bean，配置端点与拦截器；参考官方示例走标准化流程。

---

### 6.4 A2A 协议与 ADK

**Q：A2A 协议是什么？有哪五大设计原则？** 【高级】

> Google 提出的 Agent-to-Agent 通信协议；设计原则（以官方文档为准）：开放互操作、安全、可发现、异步、可扩展。

**Q：A2A 协议与 MCP 的关系？** 【高级】

> MCP 偏工具/资源与宿主应用连接；A2A 偏多 Agent 间协作与任务委托发现；两者可组合：MCP 管工具调用，A2A 管 Agent 间协同。

**Q：什么是 Google ADK？** 【高级】

> 用于在 Google 生态构建 Agent 和工具链的 SDK/开发框架；提供 Agent 编排、工具注册、评估等能力（以官方 ADK 文档为准）。

**Q：什么是 Computer Use？原理？** 【高级】

> 模型输出 UI 操作指令（键鼠坐标、截图理解），由运行时执行；需沙箱环境、权限控制、可回滚机制，防止误操作。

---

## 第七章 大模型微调

### 7.1 微调基础

**Q：大模型微调与预训练的核心区别？** 【基础】

> 预训练：大规模无监督/自监督，学通用语言与世界知识；微调：在下游任务有标注数据上继续训练，对齐具体任务/格式。

**Q：什么时候需要微调，而不是直接用基座模型？** 【进阶】

> 强领域专业性（医疗/法律）、严格输出格式、数据隐私（无法外发 API）、低延迟推理需求；优先考虑 RAG + Prompt + 工具，微调用于以上无法解决时。

**Q：常见微调任务有哪些？** 【基础】

> 指令跟随（SFT/对话）、分类、信息抽取、代码生成、多模态对齐、偏好/安全对齐（RLHF/DPO）。

**Q：如何选择预训练基座进行微调？** 【进阶】

> 语言与领域覆盖、上下文长度、工具调用支持、许可证（商用）、推理成本与生态、是否可私有部署。

---

### 7.2 PEFT 与 LoRA

**Q：什么是 PEFT？为何需要？** 【进阶】

> 参数高效微调：只训练极少量附加参数，冻结大部分权重；省显存（消费级 GPU 可微调 7B+ 模型）、快速迭代、支持多任务适配器切换。

**Q：PEFT 的三种典型方法？** 【进阶】

> LoRA（低秩旁路矩阵）；Adapter（串联小适配模块）；Prefix/Prompt Tuning（软提示前缀，不改权重）。

**Q：PEFT 与全量微调的区别？** 【进阶】

> 全量微调：能力上限高，成本高（显存/时间），风险灾难性遗忘；PEFT：成本低，可塑容量有界，多任务切换方便。

**Q：LoRA 的原理与实践？** 【进阶】

> 在注意力层旁路增加低秩矩阵 `ΔW = A·B`（rank r << d），只训练 A 和 B；参数量约为全参的 0.1%~1%；推理时可将 ΔW 合并回原权重，无额外延迟；关键超参：rank（4~64）、alpha（通常 2×rank）、目标层。

**Q：如何避免微调时的灾难性遗忘？** 【高级】

> 低学习率 + 预热；混合旧任务数据重放；LoRA 旁路参数天然抑制遗忘；EWC 约束；持续评测原任务指标。

---

### 7.3 训练工程

**Q：微调常用的优化器？** 【进阶】

> AdamW 最常见；配合 warmup + 分阶段学习率调度；大模型场景可用 8-bit Adam（省显存）或 Lion；Hugging Face Trainer 一行配置。

**Q：混合精度训练的作用？** 【进阶】

> FP16/BF16 计算 + FP32 存储 master weights；显存减半，速度提升约 2~3 倍；需 GradScaler（loss scaling）防 FP16 梯度下溢；BF16 动态范围更大无需 scaling。

**Q：过拟合如何靠正则化缓解？** 【进阶】

> weight decay、dropout、早停（early stopping）、数据增广、标签平滑（label smoothing）、减小模型容量。

**Q：SFT 指令数据如何构建？** 【高级】

> 多样性：多轮对话/工具调用/拒答/领域专业混合；质量：难例挖掘、格式统一、去毒去错；与线上分布一致；LLM 辅助生成 + 人工审核。

**Q：指令微调（Instruction Tuning）的好处？** 【进阶】

> 模型更听从指令、输出格式稳定、可接工具与结构化输出、减少繁琐 Prompt 长度、对齐人类意图。

**Q：如何判断微调效果是否达标？** 【进阶】

> 验证集业务指标（准确率/F1/人类偏好）持续提升；对基线/旧版本 A/B 对比；人工抽检关键场景；检测遗忘：原通用能力回归测试不显著下降。

**Q：多模态（图文）微调如何保障对齐质量？** 【高级】

> 清洗高质量图文配对数据；难负样本挖掘；对比学习提升对齐；分阶段对齐（先冻结视觉编码器）；人工审核抽测。

**Q：重复输出和幻觉如何靠微调改善？** 【高级】

> 干净指令数据 + 偏好对齐（DPO/RLHF）+ 加拒答/引用样例；解码时加重复惩罚（repetition penalty）；单靠微调不能完全保证，需结合 RAG 和 Prompt 约束。

---

## 第八章 评估与项目综合

### 8.1 RAGAS 评估

**Q：RAGAS 框架有哪些核心指标？** 【进阶】

> `faithfulness`：答案与检索文档的事实一致性（核心防幻觉指标）；`answer_relevancy`：答案与问题的相关程度；`context_precision`/`context_recall`：检索质量；需构建（问题、答案、上下文）三元组测试集，用 LLM 自动打分 + 人工抽检校准。

**Q：RAG 调优后如何评估？真实业务标准？** 【高级】

> RAGAS 指标 + 人工评测 + 线上首解率、引用命中率、时延、成本、投诉率 A/B 对比。

**Q：faithfulness 分数低如何排查？** 【高级】

> 拆解答案为原子 claim，逐条核对是否在检索文档中有依据；常见原因：检索不相关（提升召回）或模型脑补（加强 Prompt 约束）；换更强生成模型、要求逐句引用来源、降低 temperature。

**Q：什么是 LM Evaluation Harness？** 【高级】

> `lm-evaluation-harness` 用于评估基础模型在标准 benchmark（MMLU/HellaSwag 等）上的能力；RAG 场景多用于基座模型选型，而非端到端 RAG 主评。

---

### 8.2 系统设计综合

**Q：电商中哪些场景直接用大模型，哪些必须工程化？** 【高级】

> 大模型适合：商品文案生成、客服草稿、搜索语义扩展；必须工程化：价格库存查询、下单支付、对账——必须强一致 API + 规则 + 对账，禁止纯生成。

**Q：医疗问诊 AI 如何平衡幻觉风险与效率？** 【高级】

> 明确不替代诊断、分诊与免责声明；指南/文献 RAG；工具拉取检验数据；HITL（医生审核）；拒答机制 + 审计日志；监管合规优先。

**Q：智能客服如何用知识库解决长尾问题？** 【高级】

> 沉淀高频工单为 FAQ；向量检索 + 澄清追问（歧义时）；未命中自动升级人工；指标闭环（首解率、人工转接率）驱动知识库迭代。

**Q：模型 API 响应超 1s，前端如何保障用户体验？** 【高级】

> 流式输出（SSE/WebSocket）首 token 即展示；骨架屏 + 渐进披露；请求可取消、去抖；GPTCache 语义缓存秒回相同问题；队列管理与重试。

**Q：RAG 检索准确率从 75% 提升到 90% 的思路？** 【高级】

> 数据层：清洗噪声、表格单独分块、领域 Embedding 微调；检索层：混合检索、query 改写/HyDE、元数据过滤、父子索引；排序层：Rerank；评估闭环：RAGAS 定位瓶颈针对性优化。

**Q：Gradio vs Streamlit？流式输出如何实现？** 【进阶】

> Gradio 偏 ML Demo/流式输出；Streamlit 偏数据面板/复杂 UI；流式实现：LLM 侧 `stream=True` 逐 chunk 接收，Gradio 接口改为生成器 `yield` 累加文本，用户看到打字机效果。

**Q：RAGFlow / Dify 与自研 RAG 如何选择？** 【高级】

> 平台（RAGFlow/Dify）：快速搭建、功能完整，适合 PoC 验证；自研：深度优化每个组件（分块/Rerank/多路召回），适合生产规模调优；建议先平台验证，再针对瓶颈自研。

**Q：自定义多格式文档加载器如何实现？** 【高级】

> 继承 LangChain `BaseLoader`，实现 `load()` 返回 `List[Document]`；PDF 用 PyMuPDF、Word 用 python-docx、CSV 用 pandas；关键是正确设置 metadata（来源/页码/类型）。

**Q：ONNX 转换中常见问题与 ExecutionProvider？** 【高级】

> 常见问题：自定义算子不支持、动态轴配置、opset 版本不兼容；ExecutionProvider：CPUExecutionProvider（默认）、CUDAExecutionProvider、TensorrtExecutionProvider；可做 INT8 量化压缩推理。

**Q：AUC 高但临床要求降低漏诊率怎么处理？** 【高级】

> 降低分类阈值提高敏感性（召回），但特异性下降（假阳率上升）；用 ROC 曲线选 Youden 指数或业务约定的最优工作点；与临床专家权衡假阳性代价。

---

## 附录：综合鉴别题（项目真实性）

> 以下问题用于鉴别候选人项目经验的真实深度。

**Q：你的 GitHub 最近 commit 情况？是迭代还是一次性上传？**

> 考察点：持续迭代的项目更可信；一次性 push 完整项目可能是临时准备。

**Q：项目有真实用户吗？收到过哪些具体反馈？修复过什么 Bug？**

> 考察点：能说出具体 Bug 现象、复现步骤、修复方案的候选人更可信。

**Q：项目中最难解决的技术卡点是什么？耗时多久？**

> 考察点：有真实经历的人能说出具体技术细节和时间，泛泛而谈往往说明项目不够深入。

**Q：你用的哪个 LLM？本地部署还是 API？temperature 怎么设的？**

> 考察点：能说出具体模型名、部署方式（vLLM/Ollama/API）和参数调优依据的候选人更可靠。
