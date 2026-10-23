---
title: "语言与并发"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 2
redirectFrom:
  - /posts/interview/02-backend-fundamentals.html
---

# Python 语言、并发与工程化

按入门、中等、高难复习。实现细节以各题标注的 Python 版本为准。

---

## 一、Python 语言

### 入门
1. **可变与不可变类型？** 不可变：`int`、`float`、`str`、`tuple`、`frozenset`、`bytes`；可变：`list`、`dict`、`set`、`bytearray`、自定义对象。不可变对象「修改」实际是创建新对象。dict 键必须可哈希，不能简单等同于不可变；例如 tuple 内含 list 就不可哈希。
2. **list 和 tuple 的区别？tuple 什么时候用？** list 适合需增删的序列；tuple 是有序、可重复、不能增删或替换元素的元组，适合坐标/尺寸等固定组合和函数多值返回；元素都可哈希时还能当字典键或 set 元素。`(1,)` 才是单元素元组，`(1)` 是整数；tuple 内的 list 仍可被修改。选型先看语义，不笼统保证 tuple 一定更快或整体占用一定更小。详见 [Python 基础的 tuple 专题](/posts/interview/Python/Basics.md#二、python-内置数据结构)。
3. **Python 是值传递还是引用传递？** 都不是，是「**传对象引用**」：函数拿到的是同一个对象的引用。对可变对象原地修改（`lst.append`）外面能看到；在函数里重新赋值（`lst = []`）不影响外面。
4. **`is` 和 `==`？** `is` 比较是不是同一个对象（`id`），`==` 比较值（调 `__eq__`）。判断 None 用 `is None`。
5. **小整数缓存？** `-5 ~ 256` 的整数是预先创建好的单例，所以 `a = 256; b = 256; a is b` 是 True，257 就不一定。字符串也有驻留（interning）。这就是为什么比较值要用 `==`。
6. **列表推导式、生成器表达式？**
   ```python
   squares = [x * x for x in range(10) if x % 2]      # 立即生成列表
   gen = (x * x for x in range(10**9))                 # 惰性，几乎不占内存
   d = {k: v for k, v in pairs}                        # 字典推导
   ```
7. **`*args` 和 `**kwargs`？** 收集多余的位置参数（tuple）和关键字参数（dict）。调用时 `f(*lst, **dct)` 是展开。
8. **作用域规则 LEGB？** 查找变量的顺序：Local（函数内）→ Enclosing（外层函数）→ Global（模块）→ Built-in。函数里给外层变量赋值要声明 `nonlocal`（外层函数的）或 `global`（模块的）。
9. **异常处理的完整结构？**
   ```python
   try:
       ...
   except (ValueError, KeyError) as e:   # 可以捕获多个
       ...
   else:                                 # 没有异常时执行
       ...
   finally:                              # 一定执行，用于释放资源
       ...
   ```
   自定义异常继承 `Exception`（不要继承 `BaseException`，那会把 `KeyboardInterrupt` 也包进去）。`raise NewError(...) from e` 保留异常链。
10. **f-string、海象运算符、match？** `f"{name!r:>10}"`；`if (n := len(items)) > 10:`（3.8）；`match cmd: case {"type": "tool", "name": n}: ...`（3.10 结构化模式匹配）。
11. **可变默认参数的坑** → 默认值只在定义时创建一次，用 `None` 代替。
12. **深拷贝 / 浅拷贝** → `copy.copy` 只复制外层，`copy.deepcopy` 递归复制。

13. **★ bool 和 int 有什么关系？** Python 中 bool 是 int 的子类，True == 1，因此 dict/set 里它们可能对应同一个相等键。业务要求严格布尔或整数时需明确校验，不能只靠 isinstance(x, int)。
14. **★ None、空列表和 0 怎么判断？** 都是假值，但语义不同。需要区分「未提供」与「提供了零/空值」时用 is None；不要用 if not value 把合法的 0 和空集合都当成缺参。

### 中等
13. **dict 是怎么实现的？为什么 3.7 后有序？** 哈希表，开放寻址解决冲突。3.6 起改成「紧凑字典」：一个稀疏的索引数组 + 一个按插入顺序存放的紧凑条目数组，既省内存又保留了插入顺序，3.7 起成为语言规范。平均 `O(1)` 查找；装填因子超过 2/3 扩容。
14. **set 和 dict 的关系？** set 也是哈希表，只有键没有值。`in` 判断 `O(1)`，list 的 `in` 是 `O(N)`。
15. **装饰器**（必考，要能手写三种）：
    ```python
    import functools, time

    # 1. 不带参数
    def timing(func):
        @functools.wraps(func)                 # 保留原函数名、文档
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return func(*args, **kwargs)
            finally:
                print(func.__name__, time.perf_counter() - start)
        return wrapper

    # 2. 带参数：多包一层
    def retry(times=3, exceptions=(Exception,)):
        def deco(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                for i in range(times):
                    try:
                        return func(*args, **kwargs)
                    except exceptions:
                        if i == times - 1:
                            raise
            return wrapper
        return deco

    # 3. 类装饰器（用 __call__）
    class CountCalls:
        def __init__(self, func):
            functools.update_wrapper(self, func)
            self.func, self.n = func, 0
        def __call__(self, *args, **kwargs):
            self.n += 1
            return self.func(*args, **kwargs)
    ```
    `@retry(times=3)` 展开就是 `f = retry(times=3)(f)`。多个装饰器从下往上包装、从上往下执行。
16. **迭代器和可迭代对象？** 可迭代对象实现 `__iter__`（返回迭代器）；迭代器实现 `__iter__` 和 `__next__`（没有元素时抛 `StopIteration`）。`for` 循环内部就是不断调 `next()`。
17. **生成器的 `send`、`yield from`？**
    - `gen.send(value)`：把值送进生成器，成为 `yield` 表达式的结果（协程的前身）；
    - `yield from sub_gen`：把子生成器的所有值逐个产出，并拿到子生成器的 `return` 值。我们子 agent 的事件就是这样冒泡到主 agent 的事件流里的。
18. **上下文管理器的两种写法？**
    ```python
    class Timer:
        def __enter__(self): self.t = time.time(); return self
        def __exit__(self, exc_type, exc, tb):
            print(time.time() - self.t)
            return False             # 返回 True 会吞掉异常

    from contextlib import contextmanager
    @contextmanager
    def timer():
        t = time.time()
        try:
            yield
        finally:
            print(time.time() - t)
    ```
19. **`@property`、`@classmethod`、`@staticmethod`？** property 把方法变成属性访问（可以加 setter 做校验）；classmethod 第一个参数是类（常用于替代构造函数 `User.from_dict(d)`）；staticmethod 就是放在类里的普通函数。
20. **常用魔术方法？** `__init__` / `__new__`（`__new__` 创建对象，`__init__` 初始化；单例、不可变类型子类化要重写 `__new__`）、`__repr__` / `__str__`、`__eq__` / `__hash__`、`__len__`、`__getitem__`、`__contains__`、`__call__`、`__enter__` / `__exit__`、`__getattr__`（找不到属性时才调用）/ `__getattribute__`（每次访问都调用）。 object 只默认提供其中部分，__len__/__call__/__getattr__ 等不是它的默认方法；顶层继承与 22 个方法表见 [Python 基础](/posts/interview/Python/Basics.md)。
21. **多重继承和 MRO？** 方法解析顺序用 **C3 线性化**算法，`Class.__mro__` 可查看。`super()` 不是「调用父类」，而是「调用 MRO 里的下一个」。Mixin 是多重继承的常见用法（我们 `ContextBuilder` 里就有 `_BuilderMixin`）。
22. **抽象类？** `from abc import ABC, abstractmethod`，有未实现的抽象方法的类不能实例化。我们的文档解析 `BasePipeline(ABC)` 和模型后端基类都是这样。
23. **dataclass？** `@dataclass(frozen=True, slots=True)` 自动生成 `__init__`、`__repr__`、`__eq__`；`field(default_factory=list)` 解决可变默认值。我们的 `ToolSpec`、`AgentContext` 都是 dataclass。
24. **类型标注进阶？** `Optional[X]` = `X | None`；`Union`；泛型 `list[int]`、`TypeVar`、`Generic`；`Protocol`（结构化子类型，鸭子类型的静态版本）；`TypedDict`（给 dict 标注键）；`Literal["a", "b"]`；`Callable[[int], str]`；`Any` vs `object`。运行时不检查，靠 mypy / pyright 检查。
25. **枚举？** `class Status(str, Enum)`，继承 str 方便 JSON 序列化和与字符串比较。我们 AI 配置的 profile / prompt code 统一用枚举消除了大小写硬编码。

### 高难
26. **描述符（descriptor）是什么？** 实现了 `__get__` / `__set__` / `__delete__` 的类，作为另一个类的**类属性**时，会接管这个属性的访问。`property`、`classmethod`、`staticmethod`、方法绑定都是描述符实现的；**SQLAlchemy 的 `Column` / `mapped_column` 也是**：`User.name` 返回 SQL 表达式（用于写查询），`user.name` 返回值。
27. **元类（metaclass）？** 类是元类的实例（默认元类是 `type`）。元类在**类定义时**介入，可以修改类的属性、自动注册。ORM 的 `DeclarativeBase` 用它在你写下 `class User(Base)` 时收集所有列生成表结构。日常用 `__init_subclass__` 就能实现大部分需求（比如子类自动注册到注册表），更简单。
28. **`__slots__`？** 声明固定的属性列表，实例不再有 `__dict__`，省内存（大量小对象时明显）、属性访问更快；代价是不能动态加属性。
29. **Python 的内存管理和 GC？**
    - 以项目的 **CPython 3.12 常规 GIL 构建**为例：普通对象主要靠引用计数管理生命周期，循环 GC 补充处理不可达引用环；引用计数归零通常触发销毁，但不朽对象、复活等有边界。
    - 3.12 循环 GC 分 0/1/2 三代，主要跟踪可能形成环的对象，不是所有对象都要扫。其他版本尤其 3.14 的不同补丁不能直接套此口径。
    - 默认 pymalloc 优化不超过 512 字节的分配请求，配合对象专用缓存与系统分配器。对象销毁、空闲块复用和 RSS 下降是不同层次。
    - 与 JVM 对比时先限定具体收集器，不能说 Python 的「三代」就是 Java 的堆分区。详见 [20-Python内存与执行原理.md](/posts/interview/Python/Runtime.md)。
30. **Python 内存泄漏怎么查？** 固定负载，对比活分配、引用链与 RSS/PSS；常见持有者有全局缓存、闭包、回调、traceback、暂停生成器和 ORM 对象集合。现代普通 Python 的 `__del__` 引用环通常可回收，不应一律当泄漏。`tracemalloc` 找跟踪到的分配，原生库直接分配等需补其他工具；`py-spy` 主要看执行栈，不是完整堆分析器。Celery 的每子进程回收配置适用于 prefork，不能直接套给项目的 gevent。
31. **CPython 的执行过程？** 源码 → 解析/AST → 作用域分析与代码生成 → code object/字节码 → 解释器执行。`.pyc` 是模块导入常用的磁盘缓存，不是运行必经文件。3.11 起有自适应特化；JIT 能力与启用依版本/构建，项目限定 3.12，不能说项目已有 JIT。性能收益须实测，不把官方平均基准当项目提升。
32. **怎么让 Python 代码变快？** 先 profile（`cProfile`、`py-spy`）；用内置函数和标准库（C 实现）；避免在循环里做重复计算和属性查找；合适的数据结构（set 判断存在）；IO 并发化；CPU 密集用多进程 / NumPy / Cython / Rust 扩展（Pydantic v2、ruff、uv 都是 Rust 写的）。

33. **闭包的延迟绑定陷阱？**
    ```python
    fs = [lambda: i for i in range(3)]
    [f() for f in fs]                 # [2, 2, 2]，不是 [0, 1, 2]
    fs = [lambda i=i: i for i in range(3)]   # 用默认参数在定义时绑定当前值
    ```
    闭包捕获的是**变量**而不是当时的值，循环结束后 i 是 2。JavaScript 里用 `var` 也有同样的问题（`let` 每次迭代新建绑定）。
34. **GIL 什么时候释放？** 遇到阻塞 IO（读写 socket、文件、`time.sleep`）时主动释放；纯计算的线程每隔一段时间（`sys.getswitchinterval()`，默认 5 毫秒）被要求释放，让别的线程有机会运行；很多 C 扩展（NumPy、hashlib 的大块计算）在执行 C 代码时也会主动释放。所以「多线程 + NumPy」有时能真正并行。
35. **`__del__` 有什么问题？弱引用是干什么的？** `__del__` 的调用时机不确定（引用计数归零才调，循环引用里要等 GC），里面的异常会被报告但不会像普通调用那样向外传播，不要依赖它释放资源（用 `with`）。`weakref` 引用对象但不增加引用计数，对象被回收后弱引用自动失效。适合做缓存（`WeakValueDictionary`）和观察者列表，避免「因为被缓存引用着而永远不释放」。
36. **multiprocessing 的 fork、spawn、forkserver 有什么区别？** fork：复制父进程（快，但父进程里的线程、锁、连接状态也被复制过来，容易死锁或串连接）；spawn：启动全新的解释器重新导入模块（慢但干净，macOS 和 Windows 默认）；forkserver：先启一个干净的服务进程，之后从它 fork。Python 3.14 起 Linux 上的默认值也从 fork 改成了 forkserver。我们 gunicorn `--preload` 后 fork 出的 worker 共享数据库连接导致串台，就是 fork 复制状态的典型问题。
37. **asyncio 的事件循环底层是怎么实现的？** 基于 `selectors` 模块（Linux 上是 epoll，macOS 上是 kqueue）：循环里不断调用 `select()` 等待就绪的 socket，把就绪的回调放进就绪队列执行；协程本质是生成器，`await` 一个还没完成的 Future 时协程挂起，Future 完成时通过回调把协程重新放回就绪队列。uvloop 用 libuv 重新实现了这套循环，快 2–4 倍。

---

---

## 二、Python 并发

### 入门
1. **GIL 是什么？** CPython 的全局解释器锁，同一时刻只有一个线程执行字节码。IO 时释放，所以 IO 密集多线程有效，CPU 密集没用。3.13 起有可选的无 GIL 构建（free-threaded），还不是默认。
2. **线程、进程、协程怎么选？**
   | | 适合 | 代表 |
   |---|---|---|
   | 多进程 | CPU 密集 | `multiprocessing`、`ProcessPoolExecutor`、gunicorn 多 worker |
   | 多线程 | IO 密集，且用的是同步库 | `threading`、`ThreadPoolExecutor` |
   | 协程 | 大量 IO 并发（上千连接） | `asyncio`（显式）、gevent（隐式） |
3. **`concurrent.futures` 怎么用？**
   ```python
   with ThreadPoolExecutor(max_workers=8) as pool:
       futures = [pool.submit(fetch, url) for url in urls]
       for f in as_completed(futures):
           print(f.result())
   ```

### 中等
4. **asyncio 的核心概念？** 事件循环、协程（`async def`）、`await`（在这里让出控制权）、Task（`create_task` 把协程调度起来并发跑）、`gather`（并发等多个）、`wait_for` / `asyncio.timeout`（超时）、`Semaphore`（限制并发数）、`Queue`。
5. **gevent 的原理？** greenlet 是用户态的轻量协程；gevent 用 libev / libuv 做事件循环；**monkey-patch** 把标准库里的 `socket`、`time.sleep`、`threading` 等替换成协作式版本，遇到 IO 就自动切到别的 greenlet。所以同步写法的代码也能高并发。
6. **asyncio 和 gevent 对比？**
   | | asyncio | gevent |
   |---|---|---|
   | 切换点 | 显式（`await`） | 隐式（任何被 patch 的 IO） |
   | 代码改造 | 整条调用链都要 async，库也要是异步版本 | 同步代码不用改 |
   | 风险 | async 函数里调同步阻塞函数会卡住循环 | 一个没被 patch 的 C 扩展阻塞调用会卡住整个进程，而且很难发现 |
   | 生态 | 主流方向（FastAPI、httpx、asyncpg） | 老牌，Flask / Celery 常配合使用 |
7. **线程安全的工具？** `Lock`、`RLock`（可重入）、`Semaphore`、`Event`、`Condition`、`queue.Queue`（线程安全队列）。`list.append`、`dict[k] = v` 单个操作在 CPython 里因为 GIL 是原子的，但「读 → 改 → 写」组合不是（`counter += 1` 不安全）。
8. **`threading.local` 和 `contextvars`？** 都是「每个执行单元一份」的变量。threading.local 按线程隔离；contextvars 按上下文隔离，**协程安全**（每个 asyncio Task 有自己的上下文副本）。Flask 新版本的 `request`、`g` 底层就是 contextvars。日志里打 request_id、trace_id 用它。
9. **多进程之间怎么通信？** `multiprocessing.Queue` / `Pipe`、共享内存（`shared_memory`）、`Manager`；更常见的是通过外部系统（Redis、数据库、消息队列）。

### 高难
10. **gevent 下有哪些坑？**（项目真实经验）
    - **patch 时机**：必须在导入任何会用到 socket 的模块之前 patch，否则那些模块拿到的是原版 socket。我们用 `sitecustomize` 在 Python 启动最早期 patch；
    - **CPU 密集会卡死所有协程**：一个协程算 2 秒，这 2 秒内该进程所有请求都停住。所以压缩闸门不用分词器而用字符数粗估；
    - **跨线程复用连接**：redis-py 的 socket 绑在创建它的 hub 上，跨线程复用报 `Cannot switch to a different thread` → 线程局部客户端；
    - **Flask 上下文不继承**：新 greenlet 里要自己 push app context；
    - **C 扩展的阻塞调用**（某些数据库驱动、某些 SDK）patch 不到，要放进线程池（`gevent.threadpool`）。
11. **asyncio 里怎么调用同步阻塞代码？** `await asyncio.to_thread(func, *args)` 或 `loop.run_in_executor(None, func)`。CPU 密集的放进程池。
12. **asyncio 的取消机制？** `task.cancel()` 会在协程下一个 `await` 点抛 `CancelledError`；不要吞掉 CancelledError（3.8 起它继承 `BaseException` 而不是 `Exception`，所以 `except Exception` 不会误吞）；`asyncio.shield()` 保护一段代码不被取消；清理逻辑写在 `finally` 里。
13. **结构化并发？** 3.11 的 `asyncio.TaskGroup`：组内任何一个任务失败，其他任务自动取消，所有异常汇总成 `ExceptionGroup`（用 `except*` 捕获）。比 `gather` 更安全（gather 一个失败时其他的还在后台跑）。
14. **怎么限制并发调用模型的数量？** 单进程：`asyncio.Semaphore(10)`；多进程多副本：必须用 Redis 做全局信号量（我们的做法）。
15. **free-threaded Python（无 GIL）意味着什么？** CPU 密集任务可以真正多线程并行；但大量 C 扩展需要适配，单线程性能略有下降。对 IO 密集的 Web 服务影响不大。

---

---

## 三、Python 工程化

### 入门
1. **虚拟环境？** 隔离每个项目的依赖。`python -m venv .venv`；我们用 uv 自动管理 `.venv`。
2. **pyproject.toml 是什么？** 现代 Python 项目的统一配置文件：项目元数据、依赖、工具配置（ruff、pytest、mypy）。取代了 `setup.py` / `setup.cfg` / `requirements.txt` 的大部分职责。
3. **uv 的优势？** Rust 写的，比 pip 快 10–100 倍；`uv.lock` 锁定所有依赖的精确版本（含间接依赖）保证环境可复现；一个工具管 Python 版本、虚拟环境、依赖、运行脚本。

### 中等
4. **依赖版本怎么约束？** `>=`、`~=`（兼容版本，`~=1.79.0` 表示 `>=1.79.0, <1.80`）、`==`。应用项目靠锁文件保证可复现；库项目约束要宽松，避免和使用方冲突。
5. **供应链安全**（项目真实背景）：2026 年 3 月 PyPI 上 litellm 的两个版本被投毒，我们因为版本约束 `~=1.79.0` 躲过了 —— 但这是运气。防范：锁文件 + 哈希校验、固定版本、及时关注安全公告、减少不必要的依赖（这也是我们去掉 litellm 的原因之一）。
6. **pytest 常用功能？**
   ```python
   @pytest.fixture
   def client(app):                    # fixture：测试的前置准备，可以依赖其他 fixture
       return app.test_client()

   @pytest.mark.parametrize("a,b,expected", [(1, 2, 3), (2, 3, 5)])
   def test_add(a, b, expected):       # 参数化：一个测试跑多组数据
       assert add(a, b) == expected

   def test_call_llm(monkeypatch):     # 替换依赖
       monkeypatch.setattr("core.llm.client.LLMClient.complete", fake_complete)
   ```
   `conftest.py` 放共享 fixture；fixture 的 `scope`（function / module / session）控制复用范围；`unittest.mock.patch` 替换对象。
7. **logging 怎么用好？** 用 `logging.getLogger(__name__)`，不要用 print；日志用结构化的 key=value（我们的日志都是 `agent.compact session_id=%s ...` 这种格式，方便 grep 和检索）；用 `%s` 占位而不是 f-string（日志级别不够时不做格式化）；异常用 `logger.exception()` 自动带堆栈。
8. **代码检查？** ruff（lint + format，替代 flake8 / isort / black）；类型检查 mypy / pyright / ty。

### 高难
9. **静态检查查不出来的问题怎么办？**（项目真实经验）Flask-SQLAlchemy 的 `db.Model` 对类型检查器是 `Any`，`card.extar` 这种拼错的属性名静态检查全放过。我们写了一个 AST 脚本扫所有「模型对象.属性」访问并和模型定义比对。思路：**语言的短板用工具补，而不是靠人记**。
10. **线上 Python 进程卡住了怎么排查？** `py-spy dump --pid <pid>` 不停进程直接打印所有线程的当前调用栈；`py-spy top` 看哪个函数占 CPU；gevent 的话看 hub 有没有被阻塞（我们用这个定位过 patch 没生效的问题）。

---
