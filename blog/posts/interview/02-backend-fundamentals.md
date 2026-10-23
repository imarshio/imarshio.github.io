---
title: "后端八股"
lang: zh-CN
date: 2026-10-23
order: 102
category:
  - 面试准备
tag:
  - 面试题
---

# 后端八股

> PostgreSQL 和 Redis 已拆成独立专题：[07-PostgreSQL专题.md](/posts/interview/07-postgresql.md)、[08-Redis专题.md](/posts/interview/08-redis.md)；Flask 见 [09-Flask专题.md](/posts/interview/09-flask.md)，FastAPI 见 [03-FastAPI.md](/posts/interview/03-fastapi.md)。
> 本文覆盖：一、Python 语言 → 二、Python 并发 → 三、Python 工程化 → 四、SQLAlchemy 与 Alembic → 五、Celery → 六、网络与 HTTP → 七、系统设计通用题 → 八、安全 → 九、Linux 与容器 → 十、Java / MySQL / Kafka 复习清单
> 每块分 **入门 / 中等 / 高难**。被问深了就往 Java 对比，拉回你熟的地方。

---

## 一、Python 语言

### 入门
1. **可变与不可变类型？** 不可变：`int`、`float`、`str`、`tuple`、`frozenset`、`bytes`；可变：`list`、`dict`、`set`、`bytearray`、自定义对象。不可变对象「修改」实际是创建新对象。dict 键必须可哈希，不能简单等同于不可变；例如 tuple 内含 list 就不可哈希。
2. **list 和 tuple 的区别？tuple 什么时候用？** list 适合需增删的序列；tuple 是有序、可重复、不能增删或替换元素的元组，适合坐标/尺寸等固定组合和函数多值返回；元素都可哈希时还能当字典键或 set 元素。`(1,)` 才是单元素元组，`(1)` 是整数；tuple 内的 list 仍可被修改。选型先看语义，不笼统保证 tuple 一定更快或整体占用一定更小。详见 [Python 基础的 tuple 专题](/posts/interview/21-python-basics.md#二、python-内置数据结构)。
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
20. **常用魔术方法？** `__init__` / `__new__`（`__new__` 创建对象，`__init__` 初始化；单例、不可变类型子类化要重写 `__new__`）、`__repr__` / `__str__`、`__eq__` / `__hash__`、`__len__`、`__getitem__`、`__contains__`、`__call__`、`__enter__` / `__exit__`、`__getattr__`（找不到属性时才调用）/ `__getattribute__`（每次访问都调用）。 object 只默认提供其中部分，__len__/__call__/__getattr__ 等不是它的默认方法；顶层继承与 22 个方法表见 [Python 基础](/posts/interview/21-python-basics.md)。
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
    - 与 JVM 对比时先限定具体收集器，不能说 Python 的「三代」就是 Java 的堆分区。详见 [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md)。
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

## 四、SQLAlchemy 与 Alembic

> 05 文档里有 8 个高难场景（session 脏了、jsonb 不更新、乐观锁、大数据导出、greenlet 共享 session、fork 后连接、属性拼错、读写分离），这里补充其余题目。

### 入门
1. **Engine、Connection、Session 的关系？** Engine 管连接池和方言（一个应用一个）；Connection 是一个数据库连接；Session 是 ORM 的工作单元，按需从 Engine 借连接。
2. **定义模型的 2.0 写法？**
   ```python
   class Base(DeclarativeBase): ...

   class Card(Base):
       __tablename__ = "workspace_cards"
       id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
       title: Mapped[str] = mapped_column(String(200))
       extra: Mapped[dict] = mapped_column(JSONB, default=dict)
       steps: Mapped[list["Step"]] = relationship(back_populates="card")
   ```
3. **增删改查？** `session.add(obj)`、`session.delete(obj)`、改属性后 `commit()`；查 `session.execute(select(Card).where(...)).scalars().all()`、按主键 `session.get(Card, id)`。

### 中等
4. **对象的几种状态？** transient（新建，没加入 session）→ pending（`add` 了，还没 flush）→ persistent（已在数据库且关联 session）→ detached（session 关了或 `expunge`）；还有 deleted。`DetachedInstanceError` 就是访问了 detached 对象未加载的属性。
5. **Identity Map？** 同一个 session 里同一主键的行只对应一个对象，第二次 `get` 直接从内存返回，不发 SQL。也意味着 session 存活越久，缓存的对象越多（长生命周期 session 会内存增长且读到旧数据）。
6. **级联（cascade）？** `relationship(cascade="all, delete-orphan")`：删父对象时连带删子对象、从集合里移除的子对象被删除。数据库层也可以 `ondelete="CASCADE"`。
7. **混合属性 `hybrid_property`？** 一个属性既能在 Python 里算（`user.full_name`），又能在 SQL 里用（`select(User).where(User.full_name == ...)`）。
8. **事件钩子？** `@event.listens_for(Card, "before_update")` 在更新前自动设置 `updated_at`；`engine` 级事件可以记录每条 SQL 耗时（自制慢查询日志）。
9. **执行原生 SQL？** `session.execute(text("SELECT ... WHERE id = :id"), {"id": x})`，参数化防注入。
10. **事务控制？** `with session.begin(): ...` 自动提交 / 回滚；`session.begin_nested()` 是 SAVEPOINT（注意 PG 子事务过多的性能问题，见 07 文档第六节）。
11. **Alembic 常用操作？** `alembic revision --autogenerate -m "add col"` 根据模型差异生成迁移脚本；`alembic upgrade head` / `downgrade -1`；`alembic history` / `current`。
12. **autogenerate 能识别什么、不能识别什么？** 能：增删表、增删列、可空性、大多数索引和外键。不能 / 不可靠：表名或列名**改名**（会生成「删除 + 新增」，数据就丢了）、部分类型变化、CHECK 约束、存储过程、视图、枚举值变化。**生成后必须人工审查**。

### 高难
13. **数据迁移（不只是改结构）怎么做？** 在迁移脚本里用 `op.execute()` 或 `op.get_bind()` 跑 SQL；不要导入应用的 ORM 模型（模型会随代码演进，旧迁移脚本就跑不了了），用 `sa.table()` 在脚本里临时定义需要的列。**项目约定**：改了工具配置这类数据，要连同 alembic 数据迁移一起交付，而不是留一份发版手册让人手动改库。
14. **多人开发 Alembic 出现多个 head 怎么办？** 两个分支各自生成了迁移，`down_revision` 指向同一个父节点 → `alembic merge heads` 生成一个合并迁移。
15. **大表迁移怎么写才安全？** 加索引用 `op.create_index(..., postgresql_concurrently=True)` 并且放在 autocommit 块里（`with op.get_context().autocommit_block():`）；先设 `lock_timeout`；数据回填分批做。见 07 文档的在线 DDL。
16. **多副本部署时迁移谁来跑？** 只有一个服务（backend）设 `NEED_MIGRATE=true`，其他服务关掉，防止并发迁移；加列先迁移再发版，删列先发版再迁移。
17. **async SQLAlchemy 的坑？** 不能懒加载（必须 `selectinload` 预加载或者 `await session.refresh(obj, ["attr"])`）；`AsyncSession` 不能被多个 Task 共享；驱动要用 asyncpg；`expire_on_commit=False` 几乎是必须的（否则 commit 后访问属性会触发隐式 IO）。

---

## 五、Celery

> 05 文档有 6 个高难场景（重复执行、gevent 卡死、内存增长、批量任务饿死别人、beat 单点、任务丢失），这里补充。

### 入门
1. **一个最小的 Celery 应用？**
   ```python
   celery = Celery("app", broker="redis://localhost:6379/0", backend="redis://localhost:6379/1")

   @celery.task
   def parse_document(doc_id: str): ...

   parse_document.delay(doc_id)                                   # 投递
   parse_document.apply_async(args=[doc_id], countdown=10, queue="ontology_doc")
   ```
2. **启动 worker？** `celery -A app.celery worker -P gevent -c 5 -Q celery,ontology_doc --loglevel INFO`（`-P` 并发模型，`-c` 并发数，`-Q` 监听的队列）。
3. **broker 选 Redis 还是 RabbitMQ？** RabbitMQ 是专业消息队列，可靠性和路由能力更强；Redis 简单、已经在用、够用。我们用 Redis。

### 中等
4. **任务状态？** PENDING（其实是「不知道」，任务 ID 不存在也返回 PENDING）→ STARTED（需要 `task_track_started=True`）→ SUCCESS / FAILURE / RETRY / REVOKED。
5. **要不要存任务结果？** 不需要结果就 `ignore_result=True`，否则结果后端会被大量用不到的结果撑大。业务状态（文档解析到哪一步了）应该存在**业务数据库**里，不依赖 Celery 的结果后端。
6. **任务超时？** `soft_time_limit`（抛 `SoftTimeLimitExceeded`，任务可以捕获后清理）+ `time_limit`（硬杀）。
7. **撤销任务？** `app.control.revoke(task_id, terminate=True)`。还没执行的会被跳过；已在执行的要 `terminate`（prefork 模式下杀子进程，gevent 下不可靠）。更稳妥的做法是任务里定期检查业务上的「取消标记」。
8. **定时任务？** beat 读 `beat_schedule` 配置按 cron 投递。动态定时任务（用户自己配的）不适合写死在配置里 → 我们是 PG 存规则 + Redis ZSet 调度。
9. **任务优先级？** Redis broker 下优先级支持有限（通过多个队列模拟）；更实用的是**按优先级分队列 + 给高优先级队列更多 worker**。
10. **chain、group、chord 的使用场景？** 一个文档：解析 → 切分 → 向量化（chain）；一批文档并行解析（group）；一批文档全部解析完后生成汇总 wiki（chord = group + 回调）。注意 chord 依赖结果后端，Redis 下有一些边界问题，复杂编排可以用业务状态机代替。
11. **监控？** Flower（Web 界面看任务、worker）；`celery inspect active` / `reserved` / `stats`；队列长度直接看 Redis（`LLEN celery`）。

### 高难
12. **怎么保证任务「恰好执行一次」？** 消息系统只能做到「至少一次」（acks_late + 重投）或「至多一次」（提前 ack）。「恰好一次」要靠**至少一次 + 幂等**：任务开始时用数据库状态或 Redis `SET NX` 判断是否已处理；写操作用唯一约束 / upsert。
13. **任务里调用另一个任务并等待结果？** 不要在任务里 `.get()` 等子任务（可能死锁：worker 都在等，没有 worker 执行子任务），Celery 默认会报错阻止。用 chain / chord 或者回调。
14. **worker 优雅停机？** 发 SIGTERM 是 warm shutdown：不再取新任务，等当前任务执行完。长任务要配合 `acks_late`（被强杀时任务回到队列）和足够长的容器 `stop_grace_period`。
15. **Celery 和 asyncio？** Celery 本身不支持 async 任务函数（5.x），要在任务里 `asyncio.run(...)`；或者换 arq、Dramatiq、Taskiq 这类原生支持 async 的任务队列。
16. **什么时候不该用 Celery？** 交互式、需要低延迟流式返回的任务（比如我们的对话）：Celery 多一跳 broker、首字延迟大，而且流式结果要再走一层 pub/sub。我们的对话在 Web 进程的后台线程里跑，事件写 Redis Stream；只有长尾的批处理才走 Celery。

---

## 六、网络与 HTTP

### 入门
1. **常用 HTTP 方法和语义？** GET（读，幂等）、POST（创建 / 非幂等操作）、PUT（整体替换，幂等）、PATCH（部分修改）、DELETE（幂等）。
2. **常用状态码？** 200、201（创建成功）、204（无内容）、301 / 302（重定向）、304（未修改，协商缓存命中）、400、401（未认证）、403（无权限）、404、409（冲突）、422（参数校验失败）、429（限流）、500、502（网关收到上游的无效响应）、503（服务不可用）、504（网关等上游超时）。
3. **GET 和 POST 区别？** 语义不同（读 vs 写）；GET 参数在 URL（有长度限制、会被记录在日志和历史里），POST 在请求体；GET 可缓存、幂等。

### 中等
4. **TCP 三次握手、四次挥手？** 握手：SYN → SYN+ACK → ACK（三次是为了双方都确认对方的收发能力，防止历史连接请求）。挥手：FIN → ACK →（服务端发完数据）FIN → ACK，因为 TCP 是全双工，两个方向分别关闭。
5. **TIME_WAIT 是什么？为什么大量出现？** 主动关闭方要等 2MSL 才真正释放，保证最后的 ACK 能到达、防止旧报文干扰新连接。短连接高并发时主动关闭方（通常是客户端或代理）会堆积大量 TIME_WAIT，占用端口。解法：用长连接 / 连接池；`tcp_tw_reuse`。
6. **HTTP/1.1、HTTP/2、HTTP/3？**
   - 1.1：长连接（keep-alive），但一个连接上请求串行（队头阻塞），浏览器对同一域名开 6 个连接；
   - 2：二进制分帧、**多路复用**（一个连接并发多个请求）、头部压缩（HPACK）、服务端推送；但 TCP 层丢包仍会阻塞所有流；
   - 3：基于 QUIC（UDP），解决 TCP 层的队头阻塞，连接建立更快（0-RTT），网络切换时连接不断。
7. **HTTPS 握手过程？** TLS 1.2：客户端发支持的算法 → 服务端发证书 → 客户端验证证书、协商出会话密钥（ECDHE 密钥交换）→ 之后用对称加密通信。TLS 1.3 简化为 1-RTT。证书由 CA 签名，客户端用内置的根证书验证证书链。
8. **长连接、短轮询、长轮询、SSE、WebSocket？**
   | | 方向 | 特点 | 适合 |
   |---|---|---|---|
   | 短轮询 | 客户端拉 | 简单，浪费 | 低频状态查询 |
   | 长轮询 | 客户端拉 | 服务端有数据或超时才返回 | 兼容性要求高的推送 |
   | SSE | 服务端推（单向） | 基于 HTTP、自动重连、文本 | **LLM 流式输出**、通知 |
   | WebSocket | 双向 | 独立协议、全双工 | 聊天、协同编辑、实时游戏 |
   我们对话用 SSE；浏览器扩展、客户机器上的远程节点和后端之间要双向收发指令，用 WebSocket（flask-sock）做中继。
9. **SSE 的格式？** `Content-Type: text/event-stream`，每个事件是若干行 `event: xxx` / `data: xxx` / `id: xxx`，以空行结束。浏览器 `EventSource` 断线自动重连并带上 `Last-Event-ID`。经过 Nginx 要关闭缓冲（`proxy_buffering off` 或 `X-Accel-Buffering: no`）。

### 高难
10. **从浏览器到我们后端，一个请求经过了哪些环节？** DNS → TCP / TLS → Caddy / HAProxy（TLS 终止、按路径分到 web / console / gateway 三个服务、web 侧按用户 ID 做一致性哈希粘性）→ gunicorn master → gevent worker → Flask 路由 → 鉴权 → 业务 → PG / Redis / 模型。能讲清这条链路就能回答大部分「排查慢请求」的问题。
11. **服务停机时怎么做到不丢请求？**（项目真实做法）收到 SIGTERM 后先让健康检查接口返回 503（等约 15 秒，让前面的代理通过健康检查发现它、把流量摘掉），然后才触发 gunicorn 的优雅退出，在 `graceful_timeout` 内等正在处理的请求结束。

---

## 七、系统设计通用题

### 入门（补齐 20 题）

1. **★ 系统设计先问什么？** 先明确用户、核心功能、规模、延迟、可用性和数据约束，再画最小闭环。条件不足时把假设说出来，不直接堆技术名。

2. **QPS 和并发是什么关系？** 稳态下并发约等于吞吐量乘平均处理时长，注意单位。长连接数、模型运行数和数据库并发应分别估算。

3. **★ 平均延迟和 P99 区别？** 平均值会掩盖长尾，P99 表示约 99% 的请求不超过该值。按接口和版本观察，还要关注超时被统计口径漏掉。

4. **吞吐量怎么估算？** 从日活、每人操作数、时间分布估平均与峰值请求，再拆各下游放大量。场景数字应明确是假设，不当已有业务数据。

5. **可用性指标怎么定义？** 按成功请求比例或可用时间定义 SLI，并约定哪些错误算失败；SLO 是目标，不能只用进程存活代表业务可用。

6. **★ 同步和异步如何选择？** 用户需要立即结果的短操作可同步；耗时工作可先持久化意图返回 ID，再异步执行。异步会引入状态查询、重试与一致性成本。

7. **横向扩容和纵向扩容区别？** 前者加实例，后者给单实例加资源。横向扩容依赖状态与共享资源设计，数据库瓶颈不会因为多开 Web 自动消失。

8. **有状态与无状态服务是什么？** 无状态通常指请求不依赖某台实例的本地业务状态，不是整个系统没有数据。会话、文件和任务仍需可靠存储。

9. **★ 缓存为什么不能当唯一真相？** 可能过期、淘汰或丢失，应能从权威数据重建。严格计数/扣款不能只依赖普通缓存读改写。

10. **读多写少如何优化？** 先优化查询和索引，再按允许的新鲜度缓存、复制或预聚合。每加一层都要说明更新延迟与失效方式。

11. **★ 超时为什么要分层？** 连接、读取、总请求和业务执行是不同预算。给下游分配小于上游剩余时间的 deadline，避免上游已退出下游仍长期工作。

12. **重试什么时候有害？** 下游过载时同步重试会放大流量；写操作结果未知时还会重复副作用。只对可恢复错误有限重试，加退避、抖动和幂等。

13. **★ 分页有哪些方式？** offset 简单但深页成本大；游标按稳定排序键继续，适合连续浏览。两者都需唯一并列键与权限过滤。

14. **消息顺序有什么范围？** 通常只能在某个队列/分区/业务键范围约定顺序，不能泛称全系统有序。消费并发和失败重试也可能改变处理顺序。

15. **数据分区解决什么？** 按时间/租户等划分数据，改善维护或查询裁剪；不自动跨机器扩写，也不保证任意条件查询更快。

16. **★ 主从复制等于备份吗？** 不是，误删也可能复制到从库。备份应有独立保留点并验证恢复，明确恢复时间和可接受丢失量。

17. **一致性读指什么？** 要说明是线性一致、读己之写、单调读还是事务快照。不同需求对应不同代价，不能只回答「最终一致」。

18. **★ 热点是什么？** 少数键、用户、分区或资源承受大部分流量。按业务键观测，再做隔离、拆分、缓存与限流，平均 QPS 会掩盖热点。

19. **为什么需要容量余量？** 实例故障、发布重叠和突发流量会暂时增加负载。按最少可用实例承担峰值估算，不能把常态 CPU 用满当最高效率。

20. **★ 如何评价设计的取舍？** 逐项说明满足的约束、增加的复杂度、故障行为与验证方法。没有规模证据时优先可演进的简单方案。

### 中等
1. **幂等怎么设计？** 唯一请求 ID + 去重表 / Redis `SET NX`；数据库唯一约束；状态机（只有「待支付」才能变「已支付」：`UPDATE ... WHERE status = 'pending'`）；乐观锁版本号。
2. **分布式 ID 怎么生成？** UUID（简单，无序）、UUID v7（有序）、雪花算法（时间戳 + 机器号 + 序列号，64 位整数、有序，注意时钟回拨）、数据库号段模式（一次取一段 ID 缓存在本地）、Redis `INCR`。
3. **限流算法？** 固定窗口、滑动窗口、令牌桶、漏桶（见 08 文档第九节）。
4. **熔断、降级、限流的区别？** 限流：控制进来的流量；熔断：下游故障时暂时不调用它（快速失败）；降级：保核心功能、关掉非核心功能或返回兜底结果。我们的模型层三者都有：限流器、熔断器、兜底模型链。
5. **负载均衡算法？** 轮询、加权轮询、最少连接、IP 哈希、**一致性哈希**（节点增减时只影响一小部分 key 的映射，用于缓存、粘性会话）。我们的 HAProxy 按用户 ID 一致性哈希，让同一个用户尽量落到同一个副本。
6. **CAP 和 BASE？** CAP：分区容错（P）必须有，在一致性（C）和可用性（A）之间取舍。CP：ZooKeeper、etcd；AP：Eureka、Cassandra。BASE：基本可用、软状态、最终一致，是对 AP 的工程化描述。
7. **缓存一致性？** 先更新数据库再删缓存 + 过期兜底 + binlog 订阅删缓存（见 08 文档第七节）。
8. **消息队列的作用？** 解耦、异步、削峰。代价：系统复杂度、一致性问题、消息丢失 / 重复 / 乱序要处理。

9. **★ 全局限流如何实现？** 统一入口或共享原子计数器按用户/组织/接口分桶；定义突发额度、时间窗口与依赖故障时的策略，不能把每实例限流相加当固定总额。

10. **租户公平调度怎么做？** 为每租户限制在途数和排队配额，大批量任务分批入队；看最老等待时长，避免大客户占满消费者。

11. **为什么锁要有 owner token？** 解锁必须确认当前持有者，防旧请求误删新锁；长任务还需续租和 fencing，TTL 到期不意味着旧执行已经停止。

12. **★ Outbox 如何领取任务？** 短事务写领取 token/租约并提交，在事务外发消息，再按 token 确认；过期可回收。重复发送由消费者幂等处理。

13. **读写分离怎样保证读己之写？** 写后相关读取暂时走主库，或用复制位点等待等机制。固定睡眠只降低概率，不保证从库已经追上。

14. **★ 游标包含哪些字段？** 包含排序值、唯一 ID 和必要版本，绑定筛选条件；验证格式并防篡改。数据变化的分页语义需要明确。

15. **消息积压看哪些指标？** ready 数、最老消息年龄、在途数、吞吐和失败重试；数量不大但每条执行很久也可能等待超标。

16. **配置中心如何安全变更？** 配置有 schema、版本、灰度和回退；进程加载形成一致快照，避免一次运行里模型与权限分别读到不同版本。

17. **★ 多层重试如何避免叠乘？** 总 deadline 与重试预算下传，明确由哪一层负责；将尝试次数和原因写日志，防 HTTP×工具×模型三层各重试三次。

18. **缓存键怎么设计？** 包含业务输入、租户/权限范围与数据版本，规范化编码防冲突；过期和容量有上限，不能只按 URL 或自然语言问题做私有结果缓存。

19. **批量接口怎样避免放大压力？** 限制条目数、并发与每条成本，独立返回失败或整体原子语义；不能把 1 个 HTTP 请求误当成只有 1 次数据库操作。

20. **★ 灰度应该观察什么？** 按版本比较成功率、延迟、成本与关键业务结果，设置回退阈值；总体平均可能掩盖小流量新版本失败。

### 高难
9. **分布式事务有哪些方案？**
   | 方案 | 原理 | 适合 |
   |---|---|---|
   | 2PC / XA | 协调者先让所有参与者准备，都成功再统一提交 | 强一致，但阻塞、性能差，协调者单点 |
   | TCC | 业务层实现 Try（预留）/ Confirm（确认）/ Cancel（取消） | 强一致要求高、能改业务代码，比如支付 |
   | Saga | 拆成一串本地事务，失败时按反向顺序执行补偿 | 长流程（订单 → 库存 → 物流） |
   | **本地消息表 / Outbox** | 业务写库时在**同一个本地事务**里写一条「待发送消息」，后台任务可靠投递，失败重试 | 最常用，最终一致 |
   | 事务消息 | RocketMQ 的半消息机制 | 用 RocketMQ 的场景 |
   **项目真实做法**：通知用 outbox 模式。业务事务里登记一条投递记录，后台 worker 投递到 Redis 通知 + SSE；行 ID 就是修订号，写 Redis 时用 Lua 原子比较修订号，旧修订丢弃、同修订不重复覆盖。解决了「业务提交了但通知没发出去」和「重复 / 乱序投递」两个问题。
10. **单体 vs 微服务？** 微服务的好处是独立部署、独立扩容、技术异构、故障隔离；代价是分布式复杂度（调用链、一致性、运维）。团队小、业务没拆清楚时单体更合适。我们是「**一份代码、按进程角色拆成三个服务**」（`APP_SCOPE`）：共享代码和模型，独立部署和扩容，console / gateway 进程不加载 AI 重依赖。这是单体和微服务之间的一个务实折中。
11. **可观测性三件套？** 日志（发生了什么）、指标（Prometheus：QPS、延迟、错误率、资源）、链路追踪（OpenTelemetry / Jaeger：一个请求经过了哪些服务、每段多久）。Agent 系统额外要有：每一轮的模型输入输出、token、缓存命中、工具调用记录（我们的 run_log 和请求账本）。
12. **怎么设计一个高可用的系统？** 消除单点（多副本、主从）；故障隔离（不同业务分队列、分资源池）；超时和重试（带退避、有上限）；限流熔断降级；可观测和告警；容量规划和压测；灰度发布和快速回滚。

13. **★ 多地域如何选一致性？** 先按业务拆哪些必须串行、哪些可异步复制，明确分区时拒绝还是接受写。不要同时承诺跨地域低延迟与所有写强一致却不说明代价。

14. **跨服务「恰好一次」怎么实现？** 把目标收窄为业务效果一次，靠原子幂等提交与外部幂等键；消息可能重复。外部结果未知时需要查询/对账，不能只加消费去重表。

15. **★ 数据库提交结果未知怎么处理？** 连接断开不证明提交失败，用稳定操作 ID 重查权威状态，再决定继续或补偿。盲目重试会重复，盲目删除产物也可能破坏已提交结果。

16. **分布式租约怎么防旧持有者写入？** 新领取生成递增版本或 fencing token，写入接收端拒绝旧 token。仅有锁 TTL 和续租线程不能阻止暂停后恢复的旧进程。

17. **★ 大客户突发影响全部用户怎么改？** 按租户限并发/队列，隔离大客户资源并做背压；分别测吞吐和等待公平性。只扩 worker 可能把数据库或模型服务打爆。

18. **扩容后吞吐不涨为什么？** 看共享数据库、锁、连接池、外部配额、网络和 CPU；画每段排队时间。若瓶颈未变，多实例只增加争用与成本。

19. **时钟回拨影响哪些机制？** 影响 ID、过期、调度和业务时间比较。测时长用单调钟，跨系统状态尽量基于同一权威时间源；墙钟时间不能承担全部互斥语义。

20. **★ 缓存击穿怎样避免？** 对热点回源合并请求、设置有限锁与旧值降级，保护数据库；持锁者失败后可恢复。敏感权限不能为了可用性继续返回撤权前旧值。

21. **大规模数据回填如何不停业务？** 分批按稳定键推进、保存水位并幂等，限速观察锁与复制延迟；增量更新有版本比较，避免回填旧值覆盖新写。

22. **★ 补偿一定能恢复原样吗？** 不一定，邮件无法撤回、外部价格可能变化。Saga 补偿是业务动作而非时间倒流；明确不可逆步骤和人工处理路径。

23. **全链路 deadline 如何分配？** 入口给总预算，各下游使用剩余预算扣除处理余量；取消要向下游传播。请求结束后仍运行的工作要显式转可靠后台或清理。

24. **★ 异步状态如何避免倒退？** 状态更新携带业务版本/序号，条件更新拒绝旧事件，终态与重开运行分版本。只按消息到达时间排序不能解决延迟和重投。

25. **热分区怎么迁移？** 先定位键分布与增长，设计双读/双写或路由版本，回填校验后切换并保留旧映射。迁移期间幂等与顺序语义要保持。

26. **★ 怎样证明恢复预案可用？** 在隔离环境从备份恢复并重放增量，验证数据、权限和代表性业务；实测 RPO/RTO。只有备份文件存在不能证明可恢复。

27. **多层缓存如何排错？** 给结果带数据版本/命中层信息，逐层绕过定位；区分浏览器、代理、应用与数据库缓存。不要一遇旧数据就清空全部系统缓存。

28. **★ 如何做故障预算？** 用 SLO 允许的失败量指导发布和可靠性投入，预算消耗快时先处理主因。预算不是允许忽略严重数据泄露或账务错误的理由。


---

## 八、安全

### 入门（补齐 20 题）

1. **★ 认证和授权有什么区别？** 认证确定你是谁，授权决定你能对哪个资源做什么。登录成功不能证明有权读取任意项目，服务端每个入口都要检查。

2. **最小权限是什么？** 账号、工具和进程只获得完成职责所需能力，默认拒绝未明确授权的操作。管理员旁路需显式且可审计，不能靠隐藏按钮实现。

3. **★ 哈希、签名、加密区别？** 哈希是摘要，签名/消息认证验证完整性和来源，加密保护机密。签名 cookie 内容仍可能可读，别把 base64 说成加密。

4. **盐和密钥是什么？** 盐一般不需保密，用来让同密码哈希不同；密钥必须受控保护。密码存储用合适慢哈希及参数，不用自创算法。

5. **★ HTTPS 解决哪些问题？** 保护传输的机密、完整性和对端认证；不防已授权用户滥用、服务端漏洞或错误权限。证书链与主机名校验不能随便关闭。

6. **HttpOnly cookie 防什么？** 阻止普通脚本直接读取 cookie，但恶意脚本仍可代表用户发同源请求。需与输出转义、CSP 和权限检查配合。

7. **Secure cookie 有什么作用？** 要求按浏览器规则通过安全连接传送，减少明文泄露；它不等于 cookie 已加密，也不能替代服务端会话撤销。

8. **★ SameSite 有什么作用？** 控制跨站请求携带 cookie 的条件，帮助降低 CSRF；站点与来源不同概念，不能把它当全部跨域和 CSRF 问题的唯一解。

9. **CORS 是权限系统吗？** 不是，主要约束浏览器跨源读取响应；脚本外客户端不受同样限制，服务端仍需认证和资源授权。

10. **★ 输入校验和输出转义区别？** 前者限制数据符合业务格式，后者按 HTML/URL/JS 等使用上下文安全输出。合法字符串也可能含应被转义的字符。

11. **为什么错误信息要控制？** 内部栈、SQL、路径和密钥可能帮助信息收集；客户端给稳定错误与关联 ID，详情只进受控日志。

12. **★ 为什么日志也可能泄密？** 请求头、cookie、prompt、附件与 SQL 参数可能含私密信息；字段白名单、脱敏、访问权限与保留期限一起设计。

13. **会话过期有哪些方式？** 空闲超时、绝对期限、主动撤销与凭证轮换。只让浏览器删 cookie 不会使已泄露令牌自动失效。

14. **★ ID 难猜能替代授权吗？** 不能，UUID 也可能从分享链接、日志或其他接口泄露。按操作者与目标资源关系检查权限，不能只验证 ID 格式。

15. **上传文件先检查什么？** 大小、类型、数量、用途和目标路径；扩展名与 MIME 都可伪造，解析器也需隔离和资源限制。

16. **下载链接怎样保护？** 读取时重新授权或签发短期限定资源的凭证，避免永久公开地址暴露内部文件；签名 URL 仍可能在有效期内被转发。

17. **★ API key 放哪里？** 留服务端或受控密钥存储，不进浏览器包、源码和日志。限制用途与额度，支持轮换和撤销。

18. **依赖更新为什么与安全有关？** 漏洞可能来自传递依赖；锁版本保证可追溯，定期评估补丁并回归。扫描结果不等于已可利用，也不能一概忽略。

19. **★ 安全测试要覆盖什么？** 未登录、本人、同组织、他人、被移除成员与管理员等身份，覆盖读写和缓存。只测正常登录成功远远不够。

20. **权限检查出错应该怎么办？** 通常拒绝敏感操作并记录原因，不能异常时默认放行；业务恢复/通知投递的失败与明确拒绝要区分，避免误丢任务。

### 中等
1. **SQL 注入？** 拼接字符串构造 SQL 被恶意输入改写语义。防：参数化查询；ORM；动态标识符走白名单。
2. **XSS？** 把用户输入当 HTML / JS 渲染。防：输出转义（React 默认转义）；不用 `dangerouslySetInnerHTML` / `v-html` 渲染不可信内容；CSP；cookie 设 `HttpOnly`。
3. **CSRF？** 利用用户已登录的 cookie，从别的网站发起请求。防：`SameSite` cookie；CSRF token；校验 Origin / Referer；敏感操作用自定义请求头（跨站表单发不了）。
4. **密码怎么存？** 慢哈希 + 盐：bcrypt / scrypt / argon2。绝不能明文或 MD5 / SHA1。
5. **JWT 的优缺点？** 无状态、跨服务验证方便；但签发后无法主动作废（要黑名单或短有效期 + 刷新令牌），payload 只是 base64 不是加密，不要放敏感信息。
6. **OAuth2 和 SSO？** OAuth2 是授权框架（授权码模式最常用），OIDC 在它上面加了身份认证（ID Token）。SSO 是「一次登录多处使用」的效果，可以用 CAS、SAML、OIDC 实现。我们 OEM 合作方走 SSO 免登。

7. **★ RBAC 和 ABAC 区别？** RBAC 按角色授予能力，ABAC 按身份/资源/环境属性判断；共享项目还需关系判断。选能表达业务规则的模型并集中实现。

8. **横向和纵向越权是什么？** 横向是访问别人的同级资源，纵向是获得更高角色能力。资源列表、详情、附件与搜索都要测，不能只守写接口。

9. **★ Refresh Token 怎么轮换？** 刷新时签发新令牌并使旧令牌按策略失效，检测旧令牌重用，限制有效期和客户端存储。具体并发刷新需定义可接受窗口。

10. **双重提交 CSRF token 有何要求？** 不能只比较两个可被攻击者控制的值；采用成熟签名/会话绑定方案，并配合 Origin 等检查。token 不放 URL 或日志。

11. **★ 动态排序怎么防注入？** 值走参数绑定，列名/方向等结构走服务端白名单映射；不能以 ORM 支持 text 就拼用户原文。

12. **命令参数怎样安全传？** 优先直接执行已知程序加参数数组，限制选项与路径；不要把用户原文拼进 shell。禁 shell 仍需防目标程序危险参数。

13. **★ 文件路径检查注意什么？** 检查规范化后和实际解析的根目录归属，考虑 ..、绝对路径、编码、符号链接与竞争；字符串 startswith 不是完整路径授权。

14. **验签为什么使用原始请求体？** 解析再编码可改变字节内容，导致签名不一致。先保留原文校验来源和时间，再解析业务字段；同时防重放。

15. **★ CSP 能替代 XSS 修复吗？** 不能，它减少部分执行途径，但配置错误、允许源或现有脚本能力仍可能被利用。优先按上下文安全输出和清理不可信 HTML。

16. **密钥轮换怎样兼容在途请求？** 用 key ID 区分版本，短期同时验证新旧密钥，签发切到新键后逐步撤旧；时间窗口和失败日志可观测。

17. **登录限流按什么维度？** 账号、来源与风险联合，避免只按 IP 伤害共享出口用户，也避免只按账号让攻击者封禁别人；返回信息不泄露账号存在性。

18. **★ 防重放要哪些信息？** 校验时间窗口、随机 nonce/请求 ID，并原子记录已用标识；签名只保证未被篡改，不保证请求未执行过。

19. **对象序列化如何避免过度暴露？** 返回字段白名单，尤其不直接输出 ORM __dict__、JSON extra 或连接配置。新字段默认不公开，接口按用途选择。

20. **★ 分享链接为什么要单独授权？** 分享是受限凭证，需绑定资源、期限与能力，可撤销；不能把一个项目分享权扩大成整个工作区访问权。

### 高难
7. **SSRF？** 服务端按用户给的 URL 去请求（比如 Agent 的网页抓取工具），被利用去访问内网服务、云厂商元数据接口（`169.254.169.254`）。防：解析域名后校验 IP 不在内网段；禁止重定向到内网；只允许 http / https。**Agent 的 web_fetch 类工具必须考虑这个**。
8. **Agent 特有的安全问题？** prompt 注入（外部内容里藏指令）、越权调用工具、沙箱逃逸、记忆投毒、数据外泄（模型被诱导把内部数据发到外部）。核心原则：**权限在 harness 不在 prompt**（见 01 文档 Q15）。

9. **★ 检查后资源被转移造成越权怎么办？** 缩短检查与提交窗口，锁后刷新资源并重新授权，IO 后核对版本。数据库检查通过也不能撤销已经写出的文件，需协调发布步骤。

10. **缓存为何会绕过撤权？** 缓存可能带旧授权或混用用户键；撤权事件要失效，敏感读取回权威源复核。不能只让新登录生效而旧会话永久可读。

11. **★ SSRF 如何处理重定向和 DNS？** 每个跳转目标都校验，避免校验一个地址后实际连接另一个；控制协议、端口、解析结果和出口网络，必要时只允许明确目标。

12. **用户给的 JWT 里 org_id 能直接用吗？** 先验证签名、算法、issuer/audience 与期限，再核对当前成员关系；合法旧令牌里的组织声明可能已失效。

13. **★ JWT 算法混淆怎么防？** 服务端固定允许算法和对应密钥类型，验证 issuer/audience，不按令牌自由选择不受信任的验证方法；采用成熟库并保持更新。

14. **多租户搜索怎么验证无泄露？** 构造同名资料、旧 payload、搬迁、撤权和缺出处片段，断言连摘要和引用都不返回；不是只验证最终答案没有正文。

15. **★ 审批后权限变化怎么处理？** 批准绑定具体动作和版本，执行时重查身份、资源归属与权限。拒绝过期批准，不能把「此前点了同意」当永久授权。

16. **恶意压缩包如何隔离？** 限制解压总字节、文件数、路径、嵌套与时间，拒绝越界路径和危险链接；在受限执行环境处理并清理失败产物。

17. **★ 凭证泄露怎么处置？** 先撤销/轮换并限制继续滥用，再查使用范围、日志和产物，修复来源与验证新旧密钥切换。只从 git 删字符串不能撤销已泄露凭证。

18. **多层代理如何防伪造客户端 IP？** 只信任已知代理链和约定跳数，入口清理不可信转发头。限流/审计按实际可信地址计算，部署拓扑变化后重新验证。

19. **★ 第三方回调为什么不只看签名？** 还要核对商户、订单、金额、事件类型、时间和幂等状态。签名验证了来源，不证明该通知对应本系统合法业务。

20. **身份依赖不可用时能放行吗？** 敏感读写通常 fail-closed，返回可重试失败并记录；异步投递可暂缓而非永久认定身份失效，避免错误状态造成不可恢复丢失。

21. **★ 预签名 URL 有什么边界？** 授权常绑定方法、资源与期限，但持有者通常可在有效期内使用。限制生命周期、对象版本和分享范围，不能当可随时撤销的完整会话。

22. **如何防跨租户的批量接口漏洞？** 逐资源或等价集合授权，确认全部目标都属于许可范围；局部失败与原子语义明确，不能只检查列表第一项。

23. **★ 高权限工具如何最小化？** 细化动作、参数与目标范围，凭证按调用注入并及时清理，输出受控；模型描述里写「谨慎」不能替代服务端门禁。

24. **安全规则升级如何避免漏入口？** 列普通、确认、后台、重试、批量与下载等所有执行路径，统一策略并逐条回归。把检查加在 UI 或单一 decorator 往往会留下旁路。

25. **★ 删除敏感数据为何不能只删主表？** 索引、缓存、图断言、日志、备份和产物都可能保留副本。制定删除范围与保留政策，并对实际可读路径做验证。

26. **如何衡量权限实现是否完整？** 建立操作者×资源关系×动作×状态的用例矩阵，包含撤权、转移和并发；追踪每个拒绝/允许来源，不只看代码覆盖率。


---

## 九、Linux 与容器

### 入门（补齐 20 题）

1. **★ 绝对路径与相对路径区别？** 绝对路径从根目录开始，相对路径依赖当前工作目录。脚本启动时明确工作目录，避免服务和终端运行得到不同文件。

2. **文件描述符是什么？** 进程用于访问文件、socket、管道等的整数句柄；0/1/2 通常是标准输入/输出/错误。句柄耗尽会影响新文件和连接。

3. **★ 文件权限 rwx 怎么解释？** 对文件是读、写、执行；对目录是列目录、改目录项和搜索/进入。只给文件可读但父目录无搜索权限，仍可能无法读取。

4. **用户和用户组做什么？** 用 UID/GID 表示身份和基本权限关系；容器内外同名用户不保证同 UID，挂载目录按数值身份决定访问。

5. **硬链接与软链接区别？** 硬链接共享 inode，通常不能跨文件系统；软链接是指向路径的独立对象，可悬空。删除一个名字不一定释放底层文件。

6. **★ 管道和重定向是什么？** 管道把前一进程输出接到后一进程输入；重定向选择文件描述符的目标。stdout/stderr 分别处理，别把错误日志当业务数据。

7. **进程 PID 与 PPID 是什么？** PID 标识进程，PPID 标识父进程；线程和命名空间会影响看到的 ID。PID 可重用，持久业务身份不能只用它。

8. **★ kill 是杀进程命令吗？** 本质是发信号，默认通常 SIGTERM；能用于通知进程清理和重载。SIGKILL 不可捕获，不能指望 finally 一定执行。

9. **前台、后台与守护有什么区别？** 终端后台不等于受可靠监管，退出终端可能影响子进程。长期服务由 systemd/编排器管理生命周期和日志。

10. **环境变量会自动同步吗？** 子进程通常继承创建时的环境，之后父进程修改不自动传播。变量值常是字符串，配置变更需重新加载或重启。

11. **★ df 和 du 为什么不同？** df 看文件系统分配，du 遍历可见文件。已删除但仍打开的文件、挂载覆盖和权限都可能造成差异。

12. **inode 用完会怎样？** 还有字节空间也可能无法创建文件；大量小文件会消耗 inode。用 df -i 等检查，清理先确认文件用途和保留规则。

13. **★ load average 等于 CPU 使用率吗？** 不是，Linux 中还包含部分不可中断等待任务；结合 CPU、运行队列和 IO 判断。8 核 load=4 与 1 核 load=4 含义不同。

14. **内存 available 和 free 区别？** free 是当前空闲，available 估可供应用使用的内存，含可回收部分；缓存不等于泄漏，容器还要看 cgroup 限制。

15. **★ 怎么确认端口谁在监听？** 用 ss/lsof 等查看地址、端口与进程，区分 127.0.0.1 和 0.0.0.0。容器内监听与宿主发布端口分别检查。

16. **软限制和硬限制是什么？** ulimit 相关软限制是当前生效值，硬限制是普通进程可提升的上界；systemd 与容器可能另有配置，需看实际进程。

17. **僵尸进程与孤儿进程区别？** 僵尸已退出待父进程回收，孤儿的父进程已退出后被接管。二者处理方法不同，僵尸本身不能再被 kill 杀一次。

18. **★ 文件系统大小写问题在哪？** Linux 常见文件系统区分大小写，某些本机默认配置不同。导入路径和资源名大小写不一致可能只在部署后失败。

19. **为什么日志轮转有时不释放空间？** 应用可能继续持有旧文件描述符，或轮转方式与日志程序不兼容。检查打开文件再按服务能力重开，不能只反复 rm 文件。

20. **★ 为什么排障先收证据？** 重启可能清掉内存、连接与时间线，先记录状态、日志和资源，再按影响止血。证据中去除凭证和个人数据。

### 中等
1. **常用排查命令？** `top` / `htop`（CPU、内存）、`free -h`、`df -h` / `du -sh *`（磁盘）、`ss -tnlp` / `netstat`（端口和连接）、`lsof -p <pid>`（打开的文件）、`ps aux | grep`、`tail -f` / `grep` / `awk`（日志）、`iostat`（磁盘 IO）、`vmstat`、`strace -p <pid>`（系统调用）、`curl -v`。
2. **进程和线程？** 进程是资源分配单位（独立地址空间），线程是调度单位（共享进程的内存）。
3. **fork 和写时复制？** fork 复制出子进程，父子共享物理内存页，任何一方写某页时才复制那一页。Redis 的 RDB、gunicorn 的 `--preload` 都利用它。
4. **Docker 的原理？** **namespace** 做隔离（PID、网络、挂载、UTS、IPC、用户）+ **cgroup** 做资源限制（CPU、内存）+ 联合文件系统（镜像分层）。容器和虚拟机的区别：容器共享宿主机内核，轻量、启动快，隔离弱一些。
5. **Dockerfile 优化？** 多阶段构建；变化少的层放前面（先装依赖再拷代码）；`.dockerignore`；合并 RUN 减少层数；slim 基础镜像。

6. **★ 怎么区分 CPU 忙和 IO 等待？** 结合 top、vmstat、iostat 和进程状态，看 user/sys/iowait、运行队列与磁盘延迟；单个总体 CPU 百分比不足以定位。

7. **如何定位高 CPU 线程？** 找到 PID 后看线程级使用，再用语言 profiler/栈对应热点。先用低开销采样，避免排障工具本身影响敏感负载。

8. **★ 文件描述符泄漏怎么查？** 对比 /proc/PID/fd、lsof 与限制，按 socket/文件类型观察是否持续增长；结合代码路径找缺失 close，而不是只提高 nofile。

9. **strace 可以观察什么？** 系统调用、返回码和等待耗时，适合看卡在读、连接还是锁。附加有开销和权限要求，先缩小调用与时间范围。

10. **★ 进程 D 状态是什么？** 通常为不可中断睡眠，常见于存储等待；信号可能要等内核等待结束才处理。查对应设备/文件系统，不能只重复 kill -9。

11. **TIME_WAIT 多就一定有问题吗？** 不一定，它是正常 TCP 生命周期状态。结合连接建立率、端口范围、错误与复用判断，别为了降数量随便改内核参数。

12. **★ SYN_RECV 与 ESTABLISHED 看什么？** 区分握手压力和已建立连接，结合监听队列、连接数与丢包。连接数高不代表应用正在处理同样多业务。

13. **磁盘满先查什么？** 分清块空间、inode、日志、构建缓存、卷与已删除打开文件；先停止异常增长，再按保留策略处理，避免误删数据库文件。

14. **★ cgroup v2 哪些指标有用？** cpu.stat 看节流，memory.current/events 看内存与 OOM 事件，io.stat 看 IO；路径按运行环境确认，宿主总量不能代替容器实际限额。

15. **namespace 与 cgroup 区别？** namespace 隔离进程看到的对象，cgroup 归组并控制资源；二者解决不同问题。看不到别的进程不等于无法耗尽 CPU。

16. **★ chroot 有什么局限？** 主要改变路径解析根，不单独提供进程、网络与内核隔离；高权限进程仍可能突破。需配合身份、挂载、namespace 和资源控制。

17. **软链接为什么影响路径授权？** 字面路径在允许目录内，最终目标却可能指向外部；解析后检查仍要考虑检查到打开之间竞争，必要时用更安全的文件打开方式。

18. **★ systemd 与 shell 启动差在哪？** 环境、工作目录、身份、资源限制和输出位置可能不同；用服务实际配置复现，不靠在登录 shell 里手动成功推断部署正常。

19. **定时任务为什么时间不对？** 检查应用时区、系统时区、调度器与数据库时间，以及夏令时规则；日志显示时间与调度解释时区可能不是同一设置。

20. **★ 如何读取日志更高效？** 按关联 ID、时间范围和错误类别缩小，再关联版本与实例；流式工具避免整文件加载。先保护原始时间线，别只截最后一条异常。

### 高难
6. **我们沙箱的隔离为什么用 `unshare` + `chroot`？** 沙箱进程都是同一个 uid，用户之间能互读文件。`unshare` 给每次执行建新的 mount 和 PID namespace（看不到别人的进程、挂载只影响自己），`chroot` 把根目录换成该用户的目录。本质就是 Docker 的原理在进程级别的手动应用。代价：容器要 `SYS_ADMIN` 能力。没用 bubblewrap 是因为容器环境的限制。
7. **容器 OOM 了怎么排查？** `docker inspect` 看 `OOMKilled`；`dmesg` 看内核 OOM 日志；容器内存限制是否太小；应用是否泄漏；注意 Python / Java 进程不一定感知 cgroup 限制（JVM 8u191+ 才默认感知）。
8. **多架构镜像？** `docker buildx build --platform linux/amd64,linux/arm64 --push`，同一个 tag 下是多个架构的 manifest list，拉取时自动选匹配的。我们客户服务器有 x86 也有 ARM。

9. **★ load 高但 CPU 很闲怎么查？** 看 D 状态、磁盘/网络文件系统与内核等待栈，区分 IO 和锁；增加 CPU 对存储阻塞可能无效。

10. **进程 RSS 不降一定泄漏吗？** 不一定，分配器保留内存、页缓存和内存碎片会影响。比较活对象、堆与 RSS 的长期趋势，重任务结束后观察稳定基线。

11. **★ 容器 CPU 看起来有空闲却变慢？** 可能触发 quota 节流，宿主空闲不表示该 cgroup 还能用。查 cpu.stat/配额和请求延迟，再决定调并发还是资源。

12. **fork 后为什么会死锁？** 多线程父进程里其他线程持有的锁复制到子进程后，持有线程不在子进程中。控制 fork 时机或选干净启动方式，重建连接/锁资源。

13. **★ SIGTERM 后仍超时退出怎么查？** 按时间线看 PID1、信号转发、摘流、在途请求和资源关闭；容器强杀上限是最后边界，不保证应用宣称的等待时间都能用完。

14. **已删除大文件为何还占空间？** 只删目录项但进程仍持有文件，引用释放后空间才回收。定位持有者并按服务方式重开/关闭，直接改 fd 或重启需评估影响。

15. **★ 高并发下 accept 失败可能是什么？** 监听队列、fd、内存、连接跟踪与端口等资源都可能耗尽；对照具体 errno 和指标，不能只调 backlog。

16. **如何处理磁盘延迟突增？** 区分吞吐、随机 IO、队列长度和设备错误，关联备份/索引构建；限后台工作或迁移负载，扩容前确认存储类型和共享瓶颈。

17. **★ 时钟差导致清扫误判怎么办？** 让状态写入与超时比较使用同一权威钟；跨系统携带时间语义，时长测量用单调钟。扩大阈值只是缓解，不能根除跨钟偏差。

18. **内核 OOM 与应用内存异常区别？** 内核/cgroup 可直接杀进程，应用可能来不及抛异常或清理；应用异常则可能被捕获。查 OOM events、退出原因和当时峰值，别只找 Python traceback。

19. **★ 沙箱 CPU/内存限制够不够？** 还需文件大小、进程数、fd、磁盘、网络与执行时间预算；子进程也纳入同一边界，避免父进程限制未覆盖后代。

20. **多节点文件偶尔缺失怎么查？** 核对实际请求节点、挂载源和文件版本，本地路径一致不代表数据相同。共享存储/调度约束按需求选，不能用粘性路由假装可靠复制。

21. **★ 网络慢如何分层定位？** 分 DNS、握手、TLS、首字、下载和应用处理，逐跳比较；trace ID 关联代理与后端，别把所有耗时都归给数据库。

22. **如何避免排障命令泄露凭证？** 限制 inspect/env/命令行输出，按字段提取必要信息，日志脱敏。工具能读取配置不代表可以把全部配置贴到工单或文档。

23. **★ 怎样验证资源限制实际生效？** 读取目标进程所在 cgroup 和实际计数，在隔离本机负载下观测节流/拒绝；只看 compose 声明不能证明运行时支持并应用。

24. **进程重启为何解决不了句柄泄漏根因？** 重启暂时释放资源，缺失关闭的代码仍会累积。保存增长曲线和对象归属，修生命周期并复现回归，再用滚动回收作兜底。

25. **★ Linux 命令在 macOS 都能用吗？** 不能，/proc、ss、strace、GNU timeout 等可能没有或参数不同。确认执行平台，必要时在本机 Linux 容器/虚拟机验证，不把命令不存在当业务失败。


---

## 十、Java / MySQL / Kafka 复习清单（老本行）

### Java
- **集合**：HashMap 结构（数组 + 链表 + 红黑树）、扩容（2 倍、为什么容量是 2 的幂）、JDK7 并发扩容死循环；ConcurrentHashMap（JDK8 CAS + synchronized 锁桶头）；ArrayList vs LinkedList；CopyOnWriteArrayList。
- **并发**：synchronized 锁升级（偏向锁已在 JDK15 废弃）、volatile（可见性 + 禁止重排序）、CAS 与 ABA、AQS、ReentrantLock、CountDownLatch / CyclicBarrier / Semaphore、线程池七个参数和四种拒绝策略、CompletableFuture、ThreadLocal 内存泄漏、虚拟线程（JDK21，和 Python 协程可以对比）。
- **JVM**：内存区域、对象创建与内存布局、类加载与双亲委派、GC 算法（标记清除 / 复制 / 标记整理）、G1 / ZGC、OOM 排查（jmap、MAT、arthas）。**准备好你的线上 JVM 调优案例**。
- **Spring**：IoC / AOP 原理（JDK 动态代理 vs CGLIB）、Bean 生命周期、循环依赖三级缓存、事务传播行为和失效场景（自调用、非 public、异常被吞）、Spring Boot 自动配置原理。
- **Spring Cloud**：Nacos（注册 + 配置）、Gateway、OpenFeign、Sentinel 熔断限流。
- **转 AI 岗必问**：Java 和 Python 做后端的区别 —— Java 强类型、并发能力强、生态成熟，适合大型业务系统；Python 在 AI 生态上没有替代品，开发快。LLM 应用的瓶颈在 IO 和模型，不在语言性能。我们用 Pydantic、类型标注、ruff 补 Python 的工程性。

### MySQL
- **索引**：B+ 树、聚簇 / 二级索引、回表、覆盖索引、最左前缀、索引下推、索引失效场景。
- **事务**：ACID 分别靠什么（undo / redo / 锁 + MVCC）、隔离级别、MVCC（ReadView、版本链）、当前读 vs 快照读。
- **锁**：行锁、间隙锁、临键锁、RR 下如何防幻读、死锁排查（`SHOW ENGINE INNODB STATUS`）。
- **日志**：redo / undo / binlog、两阶段提交、binlog 三种格式、组提交。
- **调优**：慢查询日志、EXPLAIN 各字段、深分页、大表 Online DDL / gh-ost。
- **架构**：主从复制（异步 / 半同步）、读写分离、分库分表。
- **准备两个真实点**：读过的 8.0 源码具体是哪部分；慢查询优化的完整案例。
- **和 PG 对比**：见 07 文档，几乎每个知识块都有对比。

### Kafka
- **架构**：Broker、Topic、Partition、Replica、ISR、Controller（KRaft 模式去掉了 ZooKeeper）、Consumer Group。
- **为什么快**：顺序写、页缓存、零拷贝、批量 + 压缩、分区并行。
- **可靠性**：`acks=all` + `min.insync.replicas` + 幂等生产者；消费者手动提交 offset。
- **有序性**：分区内有序，同一业务 key 发同一个分区。
- **重复消费 / 积压 / Rebalance** 的处理。
- **准备讲清**：你的数据服务平台（Canal + Debezium → Kafka）的数据链路和怎么保证不丢不重。
- **和 Redis Stream 对比**：见 08 文档第十节。

## 补充资料与统计口径

Python 语言/并发/工程化合为 Python 学科；网络由 11 完整覆盖，SQLAlchemy/Celery 由 15 覆盖，Linux 的容器部署另见 17。系统设计、安全、Linux 在本文件各补至三档 20 题；Java、Kafka 保留清单，不列入最低题数验收。

安全复核：[OWASP 授权](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)、[CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)；Linux 资源口径：[cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)。新增命令说明为口述知识，没有执行破坏性清理或服务重启。
