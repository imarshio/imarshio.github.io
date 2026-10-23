---
title: "SQLAlchemy 与 Celery 题库"
lang: zh-CN
date: 2026-10-23
order: 115
category:
  - 面试准备
tag:
  - 面试题
---

# SQLAlchemy 与 Celery 题库

> 两部分，各分入门 / 中等 / 高难三档，每档 20 题以上，★ 是高频题。02 和 05 文档里已有的题，这里收进来做成完整版（简写），并补上新题。
> 项目代码核对日期：2026-10-21。标「项目」的是当前源码能支持的实现；故障原因按代码注释和既有复盘归纳，不把复盘里每个案例都当成已复现。
> 代码块中省略了导入、模型或业务函数的是写法片段，不是可直接复制的整段程序。可运行自检见文末。

---

# 第一部分：SQLAlchemy

## SQLAlchemy 入门（21 题）

### 1. ★ ORM 是什么？优缺点？
对象关系映射：把数据库表映射成类、行映射成对象，用操作对象的方式读写数据库。优点：少写 SQL、防注入、跨数据库、和代码结构契合；缺点：复杂查询不如 SQL 直观、容易无意中写出低效查询（N+1）、多一层抽象。**对比 Java**：相当于 Hibernate / JPA；MyBatis 更接近 SQLAlchemy Core。

### 2. ★ SQLAlchemy 的两层结构？
- **Core**：SQL 表达式语言 + 连接 / 事务管理，用 Python 构造 SQL（`select(table).where(...)`），接近原生 SQL；
- **ORM**：在 Core 之上，提供模型类、Session（工作单元）、关系加载。
复杂报表和大批量操作常用 Core，业务逻辑用 ORM。

### 3. ★ Engine 是什么？连接字符串怎么写？
Engine 管理连接池和数据库方言，一个应用一个（单例）。
```python
engine = create_engine("postgresql+psycopg2://xknow:密码@localhost:5432/xknow", pool_size=10, pool_pre_ping=True)
```
格式：`方言+驱动://用户:密码@主机:端口/库名`。常见驱动：PG 的 `psycopg2` / `psycopg`（v3）/ `asyncpg`（异步）、MySQL 的 `pymysql` / `mysqlclient`。

### 4. ★ Session 是什么？
ORM 的「工作单元」：追踪加载进来的对象和你对它们的修改，`commit()` 时生成对应的 SQL 一起提交。Session 不是连接，它在需要时从 Engine 的连接池借连接，事务结束后归还。

### 5. ★ 2.0 风格的模型怎么定义？
```python
class Base(DeclarativeBase):
    pass

class Card(Base):
    __tablename__ = "workspace_cards"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(20), index=True, default="generating")
    extra: Mapped[dict] = mapped_column(JSONB, default=dict)
    note: Mapped[str | None]                       # 类型里有 None 就是 nullable
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
```

### 6. `default` 和 `server_default` 的区别？
`default`：Python 侧的默认值，插入时由 SQLAlchemy 填（可以是函数，比如 `uuid.uuid4`）；`server_default`：写进表结构的数据库默认值（`DEFAULT now()`），绕过 ORM 直接插入也生效。需要数据库层兜底的用 server_default。

### 7. ★ 增删改查怎么写？
```python
session.add(Card(title="a"))                              # 增
card = session.get(Card, card_id)                         # 按主键查
card.title = "b"                                          # 改（修改属性即可）
session.delete(card)                                      # 删
session.commit()
cards = session.execute(select(Card).where(Card.status == "done")).scalars().all()   # 查
```

### 8. ★ 常用的过滤条件怎么写？
```python
select(Card).where(
    Card.status.in_(["done", "failed"]),
    Card.title.like("%报告%"),            # ilike 不区分大小写
    Card.note.is_(None),                  # IS NULL，不要写 == None（能用但 lint 会报）
    or_(Card.org_id == org_id, Card.user_id == user_id),
    Card.created_at >= since,
)
```
多个条件写在同一个 `where()` 里就是 AND。

### 9. 排序、分页、聚合？
```python
select(Card).order_by(Card.created_at.desc()).limit(20).offset(40)
select(func.count()).select_from(Card).where(Card.org_id == org_id)
select(Card.status, func.count()).group_by(Card.status)
```

### 10. `scalars()`、`scalar_one()`、`first()` 有什么区别？
`execute(select(Card))` 返回的是行（Row 对象，行为类似元组）；`.scalars()` 取每行的第一列（也就是 Card 对象）；`.scalar_one()` 要求正好一行，否则报错；`.scalar_one_or_none()` 零或一行；`Result.first()` 取第一行（没有返回 None），不会自动给 SQL 加 LIMIT；只要一条时应在语句里显式 `.limit(1)`。

### 11. ★ 一对多关系怎么定义？
```python
class Card(Base):
    steps: Mapped[list["Step"]] = relationship(back_populates="card")

class Step(Base):
    card_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workspace_cards.id"))
    card: Mapped["Card"] = relationship(back_populates="steps")
```
`ForeignKey` 定义数据库层的外键列，`relationship` 定义 Python 层的对象关联（`card.steps`、`step.card`）。

### 12. 多对多关系怎么定义？
用一张关联表：
```python
member_table = Table("project_members", Base.metadata,
    Column("project_id", ForeignKey("projects.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True))

class Project(Base):
    members: Mapped[list["User"]] = relationship(secondary=member_table)
```
关联表上要存额外字段（加入时间、角色）时，改成一个完整的关联模型（Association Object）。

### 13. `back_populates` 和 `backref` 的区别？
都用来建立双向关系。`back_populates` 两边都要显式写，清晰（推荐）；`backref` 只在一边写，自动在另一边生成属性，少写一行但不直观。

### 14. ★ `flush` 和 `commit` 的区别？
`flush`：把 Session 里待执行的修改**发送**给数据库（执行 INSERT / UPDATE），但不提交事务，别的连接看不到；常用来提前拿到自增 ID。`commit`：先 flush，再提交事务。默认在 ORM 查询等操作前会 autoflush；执行纯 Core/text SQL 不保证触发同样的自动 flush。

### 15. ★ 出错了怎么处理事务？
```python
try:
    ...
    session.commit()
except Exception:
    session.rollback()     # 必须回滚，否则这个 session 不能再用
    raise
```
或者 `with session.begin(): ...`，自动提交和回滚。

### 16. 怎么执行原生 SQL？
`session.execute(text("SELECT * FROM cards WHERE id = :id"), {"id": card_id})`。用 `:name` 绑定参数，**不要用 f-string 拼接**（SQL 注入）。

### 17. ★ Flask-SQLAlchemy 是什么？和原生 SQLAlchemy 有什么区别？
Flask 的扩展：从 `app.config` 读数据库配置创建 Engine；提供 `db.session`（按应用上下文划分的 scoped_session，请求结束自动 remove）；提供 `db.Model` 基类、分页工具。我们项目用的就是它。

### 18. ★ Alembic 是什么？基本命令？
SQLAlchemy 作者开发的数据库迁移工具（类似 Java 的 Flyway / Liquibase）。`alembic revision --autogenerate -m "说明"`（对比模型和数据库生成迁移脚本）、`alembic upgrade head`（升级到最新）、`alembic downgrade -1`（回退一个版本）、`alembic current` / `history`。Flask-Migrate 包装成 `flask db migrate` / `flask db upgrade`。

### 19. 为什么要用迁移工具而不是手动改表？
表结构变更有版本、可追溯、可回滚；不同部署环境按同样的顺序执行，保证一致；变更和代码一起评审、一起发布。

### 20. 怎么查看 SQLAlchemy 实际执行的 SQL？
`create_engine(..., echo=True)` 打印所有 SQL；或者 `str(stmt.compile(compile_kwargs={"literal_binds": True}))` 看某条语句；生产上用引擎事件记录慢 SQL。

### 21. 怎么定义索引和唯一约束？
单列：`mapped_column(index=True, unique=True)`；联合：
```python
__table_args__ = (
    Index("ix_cards_user_created", "user_id", "created_at"),
    UniqueConstraint("org_id", "code"),
    Index("ix_pending", "created_at", postgresql_where=text("status = 'pending'")),   # PG 部分索引
)
```

---

## SQLAlchemy 中等（22 题）

### 1. ★ 对象有哪几种状态？
transient（刚 new 出来）→ pending（`add` 后、flush 前）→ persistent（在数据库里且属于某个 session）→ detached（session 关闭或 `expunge`）；deleted（`delete` 后 flush 了）。`inspect(obj)` 可以查看。

### 2. ★ Identity Map 是什么？
同一个 Session 里，同一主键的行只对应一个 Python 对象。对象仍被引用、未过期时，再次 `session.get()` 可直接返回同一对象；过期时仍会查库。Identity Map 对普通 persistent 对象通常是弱引用，不等于永久缓存全部对象。外部集合、待提交修改等强引用仍可能造成内存增长；要刷新用 `refresh`、`expire` 或 `populate_existing`，能看到哪个版本还受事务隔离级别限制。

### 3. ★ `expire_on_commit` 是什么？
commit 后，Session 里所有对象的属性默认被标记为过期，下次访问时重新查库（重新读取，实际可见版本仍受事务隔离级别约束）。坑：commit 后 Session 关了再访问属性，就会报 `DetachedInstanceError`。需要在 commit 后返回对象给别处用时，设 `expire_on_commit=False`（async 模式下几乎必须）。

### 4. ★ 什么是 N+1 问题？怎么解决？
```python
cards = session.execute(select(Card)).scalars().all()   # 1 条 SQL
for c in cards:
    print(len(c.steps))                                  # 每个卡片再查 1 次 → N 条 SQL
```
默认的关系加载是懒加载（访问时才查）。解决：查询时指定加载策略 `select(Card).options(selectinload(Card.steps))`，2 条 SQL 搞定。

### 5. ★ `joinedload`、`selectinload`、`subqueryload` 怎么选？
- `joinedload`：一条 LEFT JOIN 查出来。适合**多对一 / 一对一**（`step.card`）；一对多会让主表的行数膨胀（一个卡片 100 个 step 就重复 100 行）；
- `selectinload`：先查主表，再 `WHERE card_id IN (...)` 查关联表。**一对多 / 多对多首选**；
- `subqueryload`：多数场景优先 selectinload；复合主键且数据库不支持元组 IN 等场景仍可能用到；
- `raiseload`：访问没加载的关系直接报错，开发期用来强制发现 N+1。

### 6. 级联（cascade）是什么？
`relationship(cascade="all, delete-orphan")`：对父对象的 add / delete 等操作级联到子对象；`delete-orphan`：子对象从父对象的集合里移除后被删除。数据库层的级联用 `ForeignKey(..., ondelete="CASCADE")`，大批量删除时数据库层更快（ORM 级联要先把子对象都加载出来）。

### 7. ★ 事务边界怎么管理？
```python
with Session(engine) as session, session.begin():   # 块结束自动 commit，异常自动 rollback
    session.add(...)
```
原则：事务要短；**不要在事务里调用外部接口（模型、HTTP）**，否则连接和锁一直被占着。

### 8. `begin_nested()` 是什么？有什么风险？
创建 SAVEPOINT，可以只回滚块内修改。进入时会先 flush 已有 pending 修改，即使关闭 autoflush；应把可能冲突的插入放在块内。PG 同时活跃的子事务过多会增加快照和可见性开销，不能把「循环累计执行 64 次」当成统一阈值。批量导入优先分批或 upsert。

### 9. ★ 连接池的参数怎么配？
| 参数 | 含义 | 建议 |
|---|---|---|
| `pool_size` | 常驻连接数 | 按并发和数据库上限算 |
| `max_overflow` | 高峰时额外允许的连接 | 一般设为 pool_size 的一半到一倍 |
| `pool_timeout` | 等连接的最长时间（默认 30 秒） | 超时报 `QueuePool limit ... reached` |
| `pool_recycle` | 连接超过此年龄后，下次 checkout 时重建 | **小于数据库 / 中间设备的空闲超时**（源码默认 1800 秒，环境变量可覆盖） |
| `pool_pre_ping` | 取出连接前先 ping | 开启（我们开了），防止拿到已断开的连接 |
峰值上界按所有进程、所有 Engine 的 `pool_size + max_overflow` 求和，还要给管理连接留余量。项目默认 pool_size=20；`SQLALCHEMY_MAX_OVERFLOW` 虽声明为 20，但没有放进 `SQLALCHEMY_ENGINE_OPTIONS`，不能当成已生效，当前未另行覆盖时 QueuePool 使用默认 max_overflow=10。

### 10. ★ `scoped_session` 是干什么的？
一个「按作用域（线程 / 协程 / 请求）自动给出同一个 Session」的注册表。同一个线程里多次调用 `Session()` 拿到的是同一个，不同线程互相隔离；用完 `remove()`。Flask-SQLAlchemy 按应用上下文划分作用域。

### 11. ★ 批量插入和批量更新怎么做才快？
```python
session.execute(insert(Card), [{"title": "a"}, {"title": "b"}, ...])          # 批量插入（executemany）
session.execute(update(Card), [{"id": 1, "status": "done"}, ...])            # 按主键批量更新
session.execute(update(Card).where(Card.status == "old").values(status="new"))  # 一条 UPDATE 搞定
```
减少逐对象追踪和往返开销；2.x 的普通 ORM 插入也有批处理优化，具体差距要按驱动、RETURNING 和数据规模实测。超大批量用 PG 的 `COPY`。

### 12. ★ upsert 怎么写？
```python
from sqlalchemy.dialects.postgresql import insert
stmt = insert(Stats).values(day=d, cnt=1)
stmt = stmt.on_conflict_do_update(index_elements=["day"], set_={"cnt": Stats.cnt + stmt.excluded.cnt})
session.execute(stmt)
```
MySQL 用 `sqlalchemy.dialects.mysql.insert(...).on_duplicate_key_update(...)`。

### 13. ★ 悲观锁怎么加？
`select(Card).where(Card.id == cid).with_for_update()`；不等待 `with_for_update(nowait=True)`；跳过被锁的 `with_for_update(skip_locked=True)`（做任务队列）。

### 14. `hybrid_property` 是什么？
一个属性既能在 Python 里计算（`user.full_name`），也能用在查询里（`select(User).where(User.full_name == "张三")`，会生成对应的 SQL 表达式）。

### 15. 事件钩子能做什么？
- 模型事件：`before_insert` / `before_update` 自动填充时间、操作人；
- Session 事件：`after_commit` 后发通知（注意：在 commit 之后才发，避免事务回滚了通知却发出去了）；
- Engine 事件：`before_cursor_execute` / `after_cursor_execute` 记录每条 SQL 耗时，做慢查询日志。

### 16. 自定义列类型？
继承 `TypeDecorator`：在 `process_bind_param` 里把 Python 值转成数据库值，在 `process_result_value` 里转回来。用途：加密字段、枚举、自定义 JSON 序列化、时区转换。

### 17. ★ 修改 JSONB 字段里的一个键，为什么没有保存？
ORM 只能检测到「属性被重新赋值」，`card.extra["status"] = "done"` 是原地修改字典，ORM 不知道。解决：重新赋值 `card.extra = {**card.extra, "status": "done"}`；或 `flag_modified(card, "extra")`；或列类型用 `MutableDict.as_mutable(JSONB)`。

### 18. ★ Alembic 的 autogenerate 能识别哪些变化？
能：增删表、增删列、可空性变化、大部分索引和外键、部分类型变化。不能 / 不可靠：**改名**（会生成删除 + 新增，数据丢失）、CHECK 约束、枚举值变化、视图、存储过程、`server_default` 的部分变化。**生成的脚本必须人工审查**。

### 19. 迁移脚本要不要写 downgrade？
要写，用于回滚失败的发布。但要注意：删列、删表的 downgrade 只能恢复结构恢复不了数据；有的迁移是不可逆的（数据转换），要在发布方案里写清楚。

### 20. 动态拼接查询条件怎么写？
```python
stmt = select(Card)
if status:
    stmt = stmt.where(Card.status == status)
if keyword:
    stmt = stmt.where(Card.title.ilike(f"%{keyword}%"))     # 这里的 % 拼的是参数值，仍然是参数化的
stmt = stmt.order_by(Card.created_at.desc()).limit(size)
```
`select` 对象是不可变的，每次 `.where()` 返回新对象，可以放心地按条件链式追加。

### 21. 分页时同时要总数怎么写？
```python
total = session.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
items = session.execute(stmt.limit(size).offset((page - 1) * size)).scalars().all()
```
大表的精确 count 很慢：只在第一页查总数、或者给估算值、或者改成「是否还有下一页」（多查一条）。

### 22. `session.merge()` 是干什么的？
把一个 detached 对象（比如从缓存反序列化出来的）的状态合并到当前 Session：按主键查出（或新建）一个 persistent 对象，把属性复制过去，返回这个 persistent 对象。返回的是当前 Session 管理的目标对象，不保证一定新建；传入的 detached 对象本身不会因此附着到 Session。

---

## SQLAlchemy 高难（22 题）

### 1. ★ 一个 SQL 报错后，后面所有查询都报 `transaction has been rolled back`（项目）
SQL 出错后事务处于失败状态，Session 必须先 `rollback()`。我们的事故：Agent 的某个工具查库失败，异常被工具内部吞掉但没回滚，同一个 Session 被后续工具共用 → 后面所有工具全部失败。修复：不在几十个工具入口逐个加 try，而是**在工具分发的统一 except 里兜底 rollback**，收敛到一个点。

### 2. ★ fork 之后连接串台，读到别人的查询结果（项目）
gunicorn `--preload` 时应用在 master 里导入，导入时连过一次库，连接留在池里；fork 后多个 worker 共用同一个 socket。修复：`post_fork` 里 `engine.dispose(close=False)`（只丢引用不真关，真关会给 PG 发终止命令把兄弟进程的会话也杀掉）。

### 3. ★ 多个 greenlet 并发执行工具，共用一个 Session 出错（项目）
Session 不是线程 / 协程安全的。做法：每个并发的 greenlet 自己 push 一个 Flask 应用上下文，Flask-SQLAlchemy 就给它一个独立的 Session，结束时随上下文一起 remove。

### 4. ★ 模型属性拼错了，静态检查查不出来（项目）
`db.Model` 对类型检查器是 `Any`，`card.extar` 运行到才报错。我们写了 AST 脚本，扫描所有「模型对象.属性」访问并和模型实际的列 / 关系比对。

### 5. ★ 导出 500 万行数据把内存撑爆了
ORM 默认把全部结果加载进内存并为每个对象维护状态。解决：
```python
for row in session.execute(select(Card.id, Card.title).execution_options(yield_per=1000)):
    write(row)
```
`yield_per` 分批取（PG 上会用服务端游标）；只查需要的列；真正的导出直接用 PG 的 `COPY ... TO STDOUT`。

### 6. ★ 乐观锁怎么做？
```python
class Card(Base):
    version: Mapped[int] = mapped_column(nullable=False, default=1)
    __mapper_args__ = {"version_id_col": version}
```
UPDATE 自动带上 `WHERE version = 旧值` 并把 version 加一；影响行数为 0 时抛 `StaleDataError`，业务层捕获后重新读取再试。

### 7. 读写分离怎么实现？
继承 Session 重写 `get_bind()`：正在 flush（有写操作）时返回主库 Engine，否则返回从库 Engine；对「写后立刻读」的场景强制走主库。或者干脆用两个 sessionmaker，在代码里显式选择。

### 8. ★ 多租户怎么让所有查询自动带上租户条件？
```python
@event.listens_for(Session, "do_orm_execute")
def _tenant_filter(state):
    if state.is_select and not state.execution_options.get("skip_tenant"):
        org_id = current_org_id()  # 先求值，再闭包捕获；不要在 lambda SQL 内调用取值函数
        state.statement = state.statement.options(
            with_loader_criteria(TenantMixin, lambda cls: cls.org_id == org_id, include_aliases=True)
        )
```
这个示例只覆盖相应 ORM SELECT；原生 SQL、Core、批量写和管理员旁路仍需单独控制，不能当成完整的授权边界。继承 `TenantMixin` 的模型在查询时加 `WHERE org_id = ?`，包括关系加载。同样的方法可以做**软删除**的全局过滤（自动加 `deleted = false`）。再配合 PG 的行级安全（RLS）做数据库层兜底。

### 9. ★ async SQLAlchemy 报 `MissingGreenlet` 是什么原因？
在异步 Session 里访问了没有加载的关系属性（触发懒加载 = 隐式同步 IO），异步模式不允许。解决：查询时 `selectinload` 预加载；或者 `await session.refresh(obj, ["steps"])`；或者 `AsyncAttrs` 混入后用 `await obj.awaitable_attrs.steps`。另外 `expire_on_commit=False` 防止 commit 后访问属性触发重新加载。

### 10. ★ 数据库里出现大量 `idle in transaction` 的连接
程序开了事务（Session 执行过查询就已经开启了事务）但一直没有 commit / rollback / close —— 比如查完数据后去调了一个几十秒的模型接口，或者 Session 没在请求结束时关闭。危害：占着连接、挡住 PG 的 VACUUM、持有的锁阻塞别人。解决：调外部接口前先结束事务；保证 Session 有明确的生命周期（请求级、任务级）；数据库侧设 `idle_in_transaction_session_timeout` 兜底。

### 11. ★ 报 `QueuePool limit of size 10 overflow 20 reached, connection timed out`
连接池耗尽。排查：是不是有代码长时间持有连接（同上）；并发量是不是超过了池大小（gevent 下几千个协程共用十几个连接）；有没有连接泄漏（Session 没关）。解决：缩短持有时间 > 修泄漏 > 合理调大池（同时确认数据库扛得住）。监控池的使用情况：`engine.pool.status()`。

### 12. ★ 怎么写安全的大表迁移？
```python
def upgrade():
    with op.get_context().autocommit_block():           # CONCURRENTLY 不能在事务里跑
        op.execute("SET lock_timeout = '3s'")
        op.create_index("ix_cards_org", "workspace_cards", ["org_id"], postgresql_concurrently=True)
```
加列评估默认值是否导致重写；NOT NULL 可先加 `CHECK (col IS NOT NULL) NOT VALID`，再 VALIDATE 该 CHECK，最后 `SET NOT NULL`，不是直接写 `NOT NULL NOT VALID`；数据回填分批做（见 07 文档的在线 DDL）。

### 13. ★ 数据迁移脚本里为什么不能导入应用的 ORM 模型？
模型会随着代码演进（加列、改名），几个月前写的迁移脚本在新代码下运行时，模型和那个时间点的表结构对不上，脚本就跑不了了。做法：在迁移脚本里用 `sa.table("cards", sa.column("id"), sa.column("status"))` 临时声明需要的列，或者直接写 SQL。

### 14. ★ 多副本部署时，迁移和发版的先后顺序？（项目）
- 迁移只由一个服务跑（我们是 backend `NEED_MIGRATE=true`，console / gateway 关闭），防止并发迁移；
- **加列：先迁移，再发新代码**（否则新代码查一个还不存在的列直接报错，新容器都起不来）；
- **删列：先发不再使用这一列的代码，再迁移删除**（否则旧代码还在跑时列就没了）；
- 改名：拆成「加新列 → 双写 → 迁移数据 → 切读 → 删旧列」几次发布。

### 15. ORM 为什么会产生死锁？
flush 时 SQLAlchemy 依据工作单元依赖生成 SQL，但不会替业务保证跨事务统一的全局加锁顺序，两个并发的事务如果以不同顺序修改相同的几行，就可能死锁。解决：对要修改的行按固定顺序先 `with_for_update()` 加锁；事务尽量短；捕获死锁错误后重试整个事务。

### 16. ORM 和 Core 的性能差多少？什么时候换 Core？
ORM 每个对象要维护状态、身份映射、变更追踪，大批量（几万行以上）时开销明显，可能比 Core 慢几倍到十几倍。批量导入、批量更新、报表查询用 Core（`insert()` / `update()` / `select()` 直接返回行）；业务逻辑里少量对象的增删改用 ORM。

### 17. 模型之间互相引用导致循环导入怎么办？
`relationship("Step")` 用字符串引用类名（运行时才解析）；类型标注用 `Mapped[list["Step"]]` 加引号，或 `from __future__ import annotations`；只在 `TYPE_CHECKING` 下导入对方模块。

### 18. 测试里怎么做到「每个测试的数据库修改自动回滚」？
```python
@pytest.fixture
def session(engine):
    conn = engine.connect()
    trans = conn.begin()                                   # 外层事务
    sess = Session(bind=conn, join_transaction_mode="create_savepoint")   # 代码里的 commit 只提交 SAVEPOINT
    yield sess
    sess.close()
    trans.rollback()                                       # 测试结束全部回滚
    conn.close()
```
比每个测试重建数据库快得多，测试之间互不污染。

### 19. 从 1.x 升级到 2.0 要改什么？
`session.query(Model)` → `session.execute(select(Model)).scalars()`（query 还能用，但属于旧风格）；去掉了库级的 autocommit，事务边界必须显式；`engine.execute()` 删除，必须先拿连接；`Column` 声明改成 `Mapped` + `mapped_column`（可选，但类型提示更好）；`relationship` 的 `backref` 不推荐。可以先在 1.4 上开 `future=True` 和 2.0 的弃用警告逐步迁移。

### 20. 长生命周期的 Session 有什么问题？
外部持有的对象集合、pending/dirty 对象可能越积越大；未刷新的对象可能过时；未结束的事务占着连接和快照。Identity Map 本身通常使用弱引用。Session 的生命周期应该和「一个工作单元」一致：一个请求、一个任务、一次批处理。我们的 Agent 一次对话可能跑几十分钟，所以不能一个 Session 用到底，每个需要读写的点短暂地使用。

### 21. 怎么在 SQLAlchemy 里实现「软删除」？
模型加 `deleted_at` 列；删除改成 `UPDATE ... SET deleted_at = now()`；查询时通过第 8 题的 `do_orm_execute` + `with_loader_criteria` 全局过滤；唯一约束要改成部分唯一索引 `UNIQUE (email) WHERE deleted_at IS NULL`（否则删掉的记录会占着唯一值，同一个邮箱不能再注册）。

### 22. 一次请求里怎么定位「是哪段代码发了这么多 SQL」？
开发环境用 `echo=True` 或 SQL 计数中间件（请求结束时打印本次请求执行了多少条 SQL、总耗时）；在引擎事件里记录调用栈；`raiseload("*")` 强制所有懒加载报错。一个请求发了几百条 SQL 基本就是 N+1。

---

# 第二部分：Celery

## Celery 入门（21 题）

### 1. ★ Celery 是什么？用来做什么？
Python 的分布式异步任务队列。用途：把耗时操作从请求里拿出去异步执行（发邮件、文档解析、生成报告）、定时任务、削峰（任务排队慢慢处理）、分布式并行计算。

### 2. ★ 由哪几部分组成？
**Producer**（应用代码，投递任务）→ **Broker**（消息中间件，存放任务：Redis / RabbitMQ）→ **Worker**（取任务执行）→ **Result Backend**（可选，存执行结果：Redis / 数据库）。另外 **Beat** 负责定时投递。

### 3. ★ Broker 选 Redis 还是 RabbitMQ？
RabbitMQ 是专业的消息队列：消息确认、持久化、路由能力强、优先级支持好，适合对可靠性要求高的场景；Redis 简单、性能好、通常已经在用，但可靠性要靠配置（持久化、visibility_timeout）。我们用 Redis。

### 4. ★ 怎么定义和调用任务？
```python
@shared_task(name="parse_document")
def parse_document(doc_id: str):
    ...

parse_document.delay(doc_id)                                       # 简写
parse_document.apply_async(args=[doc_id], countdown=10, queue="ontology_doc")
```
`shared_task` 不绑定具体的 Celery 应用实例，适合放在可复用的模块里。

### 5. `delay` 和 `apply_async` 的区别？
`delay(*args, **kwargs)` 是 `apply_async(args, kwargs)` 的简写；`apply_async` 能额外指定 `countdown`（延迟几秒）、`eta`（指定执行时间）、`queue`、`priority`、`expires`、`headers` 等。

### 6. ★ 怎么启动 worker？
```bash
celery -A app.celery worker -P gevent -c 5 -Q celery,ontology_doc,ontology_chat,scheduled,bench --loglevel INFO
```
`-A` 指定 Celery 应用，`-P` 并发池类型，`-c` 并发数，`-Q` 要监听的队列（**少监听一个队列，那个队列里的任务就永远没人执行**）。

### 7. 怎么拿到任务结果？
`result = task.delay(x)` 返回 `AsyncResult`，`result.get(timeout=10)` 阻塞等结果、`result.status` 看状态。要配置 Result Backend。**Web 请求里不要同步 `.get()` 等结果**（那就失去异步的意义了），应该返回任务 ID 让前端轮询，或者推送。

### 8. 任务有哪些状态？
PENDING（等待，**或者根本不知道这个任务 ID**）、STARTED（需要 `task_track_started=True` 才会有）、SUCCESS、FAILURE、RETRY、REVOKED。

### 9. ★ Beat 是什么？
定时调度器，按配置的时间表定时向 Broker 投递任务（它自己不执行任务）。**全局只能运行一个 Beat**，否则任务会被重复投递。

### 10. 定时任务怎么配置？
```python
celery.conf.beat_schedule = {
    "sweep-stuck-cards": {"task": "beat_task_sweep_stuck_cards", "schedule": 300},     # 每 300 秒
    "daily-report": {"task": "daily_report", "schedule": crontab(hour=8, minute=0)},  # 每天 8 点
}
```

### 11. ★ worker 有哪些并发模式？怎么选？
`prefork`（默认，多进程，适合 CPU 密集）、`gevent` / `eventlet`（协程，适合 IO 密集、大量等待网络的任务）、`threads`（线程）、`solo`（单线程，调试用）。我们的任务大多在等模型和网络，用 gevent。

### 12. ★ 什么是队列和路由？
可以有多个队列，不同的任务进不同的队列，不同的 worker 监听不同的队列。目的：**隔离**（慢任务不堵快任务）和**独立扩容**。我们按业务分了 celery（默认）、ontology_doc（文档本体抽取）、ontology_chat（对话本体）、scheduled（定时任务，一次要跑一整个 Agent）、bench（模型评测）几个队列。

### 13. ★ 任务失败了怎么自动重试？
```python
@shared_task(bind=True, autoretry_for=(TimeoutError, ConnectionError), retry_backoff=True,
             retry_backoff_max=600, retry_jitter=True, max_retries=5)
def call_api(self, x): ...
```
或者手动 `raise self.retry(exc=e, countdown=30)`。`retry_backoff` 指数退避，`retry_jitter` 加随机抖动（避免大量任务同时重试）。

### 14. 任务参数的序列化？为什么不推荐 pickle？
默认 JSON（安全、跨语言，但只支持基本类型）。pickle 能序列化任意 Python 对象，但**反序列化时可以执行任意代码**，如果 Broker 被别人写入了恶意消息就会被攻击，所以默认关闭。

### 15. ★ 任务参数应该传什么？
传 **ID**，不要传大对象或 ORM 对象：参数会序列化后存在 Broker 里（占内存、序列化慢）；任务执行时数据可能已经变了（应该在任务里按 ID 重新读最新数据）；ORM 对象跨进程根本用不了。

### 16. 不需要结果时怎么做？
`@shared_task(ignore_result=True)` 或全局 `task_ignore_result=True`（我们就是全局关闭的）。不然 Result Backend 会存大量用不到的结果。业务状态应该存在业务数据库里。

### 17. Flower 是什么？
Celery 的 Web 监控工具：看 worker 状态、正在执行和已完成的任务、任务耗时、失败原因，还能远程撤销任务。

### 18. 任务的超时怎么设？
prefork 下可用 `time_limit`（硬超时）和 `soft_time_limit`（抛 `SoftTimeLimitExceeded`，可清理），软的应短于硬的。gevent 不支持 soft time limit，阻塞调用也可能逃过 hard time limit，不能把装饰器参数当成所有并发池都能保证的墙钟上限。项目使用 gevent，更需要外部 IO 超时、看门狗和可恢复状态。

### 19. 延迟执行怎么做？
`apply_async(countdown=60)`（60 秒后）或 `eta=datetime`（指定时间）。注意：延迟任务是被 worker **先取走、存在 worker 内存里等到时间再执行**的（不是 Broker 到时间再发），这会带来一些问题（见中等第 17 题）。

### 20. ★ Celery 怎么和 Flask 集成？
任务里经常要用到数据库、配置，需要 Flask 的应用上下文。常用做法：自定义 Task 基类，在 `__call__` 里 `with app.app_context():` 包住任务执行，这样所有任务都自动有上下文。

### 21. 怎么查看队列里积压了多少任务？
Redis broker 可用 `LLEN` 看 ready list，但启用优先级后一个逻辑队列可能拆成多个 list，要累加；它不包含 unacked、active 和 ETA 等任务。`celery -A app inspect active / reserved / scheduled` 看 worker 手上正在执行 / 已预取 / 延迟中的任务。

---

## Celery 中等（22 题）

### 1. ★ `acks_late` 是什么？为什么要配合幂等？
默认在任务即将执行前确认（不是刚从队列预取就确认），执行途中崩溃可能丢失。`task_acks_late=True`：延迟到执行结束确认，但普通异常、子进程退出、整个 worker 掉线走不同路径，是否重投还受失败确认、reject 配置和 transport 影响。代价是任务可能执行不止一次，所以**任务必须幂等**。我们全局开启了 `acks_late`，同时开了 `task_reject_on_worker_lost=True`（worker 被 kill -9 / OOM 时让任务回到队列）。

### 2. ★ `worker_prefetch_multiplier` 是什么？
worker 的预取额度通常是 multiplier × 并发槽位数；默认 multiplier=4。不是每个 prefork 子进程各自再乘一遍。短任务预取多一点能提高吞吐；**长任务应该设为 1**，否则一个 worker 囤着一堆任务慢慢执行，别的 worker 却闲着。我们设的是 1。

### 3. ★ Redis broker 的 `visibility_timeout` 是什么？
任务被取走后，如果在这个时间内没有 ack，Redis 认为 worker 挂了，把任务重新放回队列。默认 1 小时。配合 `acks_late`，这个值**必须大于最长任务的执行时间**，否则长任务执行中途就会被重新投递，出现两份同时执行。源码默认 3600 秒，可被环境变量覆盖；`config.py` 里「最长 30 分钟」的注释已过时：`run_scheduled_task` 的 time_limit=3600，几乎没有余量。`run_agent_bench` 上限 6 小时但单独设 acks_late=False，不能和晚确认任务混为一谈。gevent 的超时能力还需单独验证。

### 4. ★ 任务路由怎么配？
```python
celery.conf.task_routes = {
    "ontology_ingest": {"queue": "ontology_doc"},
    "run_scheduled_task": {"queue": "scheduled"},
}
```
或者在任务定义上写 `@shared_task(queue="bench")`，或者投递时 `apply_async(queue=...)`。

### 5. ★ chain、group、chord 是什么？
```python
chain(parse.s(doc_id), split.s(), embed.s())()       # 串行：前一个的返回值作为后一个的第一个参数
group(parse.s(d) for d in doc_ids)()                 # 并行
chord(group(parse.s(d) for d in doc_ids))(build_wiki.s())   # 并行全部完成后执行回调
```
`.s()` 是签名（signature），`.si()` 是不接收上一个结果的不可变签名。chord 依赖支持它的 Result Backend，header/body 任务不能忽略结果；项目全局 task_ignore_result=True，直接照搬要先为参与任务覆盖 ignore_result=False。

### 6. 任务优先级怎么做？
RabbitMQ 原生支持队列优先级；Redis broker 的优先级是通过多个子队列模拟的，效果有限。更可靠的做法：**按优先级分队列，给高优先级的队列分配更多（或专属的）worker**。

### 7. `rate_limit` 能做全局限流吗？
`@shared_task(rate_limit="10/m")` 是**每个 worker 实例**的任务类型限流（prefork 子进程共享该实例的消费控制），不是全局的：开 10 个 worker 实际就是每分钟 100 次。要全局限流（比如调用某个外部 API 每分钟最多 60 次），用 Redis 实现的分布式限流器，在任务里先获取令牌。

### 8. 怎么撤销一个任务？
`celery.control.revoke(task_id)`：还没执行的会被跳过；`terminate=True` 杀掉正在执行的（prefork 模式下杀子进程；gevent 模式下不可靠）。更稳妥的做法：任务里定期检查业务上的「取消」标记，自己优雅地退出。

### 9. 常用的信号有哪些？
`task_prerun` / `task_postrun`（任务前后，可以做日志、计时、设置 trace_id）、`task_failure`（失败告警）、`task_retry`、`worker_ready`（worker 启动完成）、`worker_shutting_down`（开始停机，我们在这里做了「等所有任务执行完再退出」）。

### 10. `bind=True` 有什么用？
任务函数的第一个参数是任务实例 `self`，可以访问 `self.request`（任务 ID、重试次数、投递时的 headers）、调用 `self.retry()`、`self.update_state()` 上报进度。

### 11. 任务进度怎么上报？
`self.update_state(state="PROGRESS", meta={"done": 30, "total": 100})`，前端通过结果后端查询。更常用的是写**业务表**（文档表的 status、progress 字段），因为业务数据本来就要存，也不依赖 Celery 的结果后端。我们的文档解析流水线每一步都更新进度（`@notify(step_name)` 装饰器）。

### 12. 结果要保存多久？
`result_expires`（默认 1 天）。结果后端是 Redis 时，大量结果会占内存。不需要结果的任务一律 `ignore_result`。

### 13. worker 的并发数怎么定？
prefork：一般等于 CPU 核数；gevent：可以开几十到几百（取决于任务在等待 IO 的比例、下游能承受的并发、数据库连接池大小）。**并发数 × 每个任务占用的数据库连接**不能超过连接池上限。

### 14. 怎么防止 worker 内存泄漏？
`worker_max_tasks_per_child=100`（每个子进程执行 100 个任务后重启）、`worker_max_memory_per_child=500000`（KB，超过就重启）。prefork 模式下有效。

### 15. ★ 任务里怎么正确使用数据库 Session？
每个任务用自己的 Session，任务结束时 `remove()`（或用 `with` 管理）；失败时回滚；不要在任务里复用 Web 请求的 Session（不同进程，也没有意义）；长任务不要一直持有事务。

### 16. 任务失败怎么告警？
`task_failure` 信号里上报到监控 / 告警系统（Sentry、企业微信机器人）；超过重试次数的任务进入「死信」处理（记录到数据库，人工处理或定期重试）。

### 17. ★ 延迟（eta / countdown）任务有什么坑？
延迟任务被 worker 取走后存在 worker 内存里等到时间才执行。
- 如果延迟时间**超过 visibility_timeout**，在等待期间 Redis 会认为它超时没 ack，重新投递一份 → **重复执行**；
- worker 重启时内存里的延迟任务会被 Redis 重新投递（acks_late 下）；
- 大量延迟任务会占用 worker 内存；ETA 任务的预取行为有版本差异，不能只靠 multiplier 限量，较新版本可评估 worker_eta_task_limit。
- 结论：**长时间的延迟（几小时、几天）不要用 Celery 的 eta**，改用数据库 / Redis ZSet 记录执行时间，由定时扫描投递（这也是我们定时任务的做法）。

### 18. 链式任务中某一步失败了怎么处理？
`chain(...).on_error(handle_error.s())` 或 `apply_async(link_error=...)`，失败时调用错误回调；后续步骤不会执行。每一步自身的重试在它的任务定义里配置。

### 19. Beat 和 worker 要分开部署吗？
要。Beat 只能有一个实例，worker 可以水平扩展多个。我们的部署里 beat 是单独的角色（`MODE=beat`），和 worker（`MODE=worker`）分开，用同一个镜像。

### 20. ★ 为什么配置了 `task_routes`，任务却跑到默认队列去了？（项目）
`task_routes` 是在**发送任务的那一端**生效的。源码注释记录过：模型评测由 gateway 投递，但该发送端未应用预期路由，任务落入默认队列而不进入预期 bench 消费者。当前 entrypoint 的默认队列列表已包含 bench；这是一段历史路由问题，不能说现状下所有默认 worker 都不消费 bench。解决：把队列声明直接写在任务定义上 `@shared_task(queue="bench")`，不依赖发送端的配置。教训：**加路由前先确认这个任务是谁在投递**。

### 21. 怎么做任务去重（同一个文档不要被同时解析两次）？
任务开始时 `SET lock:parse:{doc_id} <worker_id> NX EX 3600`，拿不到锁直接返回；或者以数据库状态为准（`UPDATE docs SET status = 'parsing' WHERE id = ? AND status = 'pending'`，影响 0 行说明已经有人在处理了）。

### 22. 有哪些替代 Celery 的方案？
- **RQ**：基于 Redis，更简单，功能少；
- **Dramatiq**：设计更现代，默认行为更安全（默认 acks_late）；
- **arq / Taskiq**：原生支持 asyncio；
- **Kafka / RabbitMQ 直接用**：事件驱动、多消费者、高吞吐；
- **Temporal**：工作流引擎，适合长时间运行、需要持久化状态和复杂编排的流程（AI Agent 的长流程编排也有人用它）。

---

## Celery 高难（22 题）

### 1. ★ 长任务被执行了两次（项目经验）
原因：`acks_late` + Redis 的 `visibility_timeout` 小于任务执行时间，执行到一半被认为超时重新投递。解决：visibility_timeout 设得比最长任务的硬超时还长（项目默认 3600 秒，而定时运行声明上限也是 3600 秒，存在余量不足的风险）；任务幂等；用锁防止并发执行同一个对象；把超长任务拆成小任务。

### 2. ★ gevent worker 启动后第一个任务就永久卡住（项目）
monkey-patch 没在最早期生效，socket 还是阻塞的，第一个网络 IO 就把 gevent 的事件循环（hub）卡死，所有任务挂起且不报错。解决：用 `sitecustomize` 在解释器启动时最先 patch；启动命令的 `PYTHONPATH` 必须指向 `app/`（否则 sitecustomize 不加载）；写了专门的测试检测 patch 是否生效。

### 3. ★ 发版时正在执行的任务怎么办？（项目）
warm shutdown 通常等待当前任务完成；实际可等多久还受容器、额外停机阶段及应用钩子限制；容器的 `stop_grace_period` 到了会被 SIGKILL。我们的做法：
- 在 `worker_shutting_down` 信号里起一个协程，轮询本进程正在执行的任务数，全部完成才退出，最长等 1 小时兜底；
- 注意 gevent 下信号处理函数运行在事件循环的回调里，不能直接起线程（会报 `BlockingSwitchOutError`），要用 `gevent.spawn`；
- 停机流程顺带停掉独立线程里的监听器，让它们释放分布式锁，存活的副本秒级接管；
- 万一被 SIGKILL：晚确认任务在 transport 恢复机制下可能重投，仍需检查 Redis 持久化、可见性超时和业务对账；这些参数不保证所有任务都不丢。当前 worker 的容器停机宽限为 3900 秒，Web 为 120 秒。

### 4. ★ 滚动发版把正在执行的 Agent 连进程一起杀掉，卡片永远停在「生成中」（项目）
进程被杀时，写最终状态、发结束事件的代码根本没机会执行。兜底：每 5 分钟跑一次「僵尸卡片清扫」定时任务，把静默超过阈值的「生成中」卡片收尾成失败状态、发终止事件（幂等）。这是兜底不是根本方案，根本方案是给每次运行加**租约 + 接管**（运行中定期续租，租约过期由别的实例接管或收尾）。

### 5. ★ worker 内存越跑越大
原因：全局缓存无上限、解析库（PDF、Office、LibreOffice）本身泄漏、长生命周期的 Session。prefork 可用 `worker_max_tasks_per_child` / `worker_max_memory_per_child`；gevent 不能靠这两个参数回收子进程，要滚动替换实例或隔离重任务；把重的解析放进子进程，跑完退出；`tracemalloc` 定位。

### 6. ★ 一个用户上传了 1000 个文件，其他用户的任务全部排队
同一个队列先进先出。解决：**公平调度** —— 按组织 / 用户限制同时在执行的任务数，超过的延后投递；大批量导入走单独的低优先级队列；把单个文件的处理拆成多个小任务，便于穿插。

### 7. ★ Beat 是单点，挂了定时任务就停；部署多个又会重复调度
- 方案一：Beat 只部署一个副本，容器编排保证挂了自动拉起；
- 方案二：分布式锁（RedBeat 这类基于 Redis 的调度器自带锁）；
- 方案三（项目做法）：**用户配置的定时任务不放在 Beat 的静态配置里**。PG 是真相（规则存表里），Redis ZSet 按下次执行时间排序；单副本 Beat 每 5 秒投递 dispatch 扫描任务，另每分钟投递 reconcile；扫描执行端用 ZSet 抢占和数据库状态防重，对账补回丢失项。**它没有消除 Beat 依赖**：Beat 停了，扫描和对账也会停。

### 8. ★ 任务丢了怎么办？
Redis 没开持久化时重启任务全丢；worker 预取的任务在内存里（非 acks_late 时）。原则：**数据库是真相，队列只是加速**。业务状态存在数据库里（文档状态是「待解析」就说明还没处理），定期扫描卡住的记录重新投递。

### 9. ★ 怎么做到「恰好一次」？
Celery 不能承诺端到端恰好一次。工程上可用「至少一次投递 + 原子幂等提交」实现特定业务效果一次：任务开始时检查业务状态是否已处理；所有写操作是幂等的（upsert、带条件的 UPDATE、唯一约束）；外部副作用（发邮件、扣费）带幂等键，接收端也必须原子地识别幂等键；先查再调存在并发和崩溃窗口。

### 10. 任务里同步等待子任务的结果，为什么会死锁？
所有 worker 都在执行「等待子任务结果」的父任务，子任务排在队列里却没有空闲的 worker 去执行。Celery 默认会对任务里调用 `.get()` 报错阻止。正确做法：chain / chord，或者回调。

### 11. 一次要投递 10 万个任务，怎么做？
逐个 `delay` 会产生 10 万次网络往返。`group` 便于组织任务，但一般仍要发每条消息，并不会自动把十万次发布变成一次网络请求；可以按批创建签名、复用发布连接；或者 `chunks`（`task.chunks(zip(ids), 100)` 把 10 万个调用打包成 1000 个任务，每个处理 100 个）；或者干脆投递一个任务，任务内部按批处理。同时注意不要一下子把下游（数据库、模型）打爆。

### 12. ★ 下游服务挂了，大量任务一起重试，形成重试风暴
所有任务按相同的间隔重试，下游刚恢复就被重试流量再次打垮。解决：指数退避 + **随机抖动**（`retry_backoff` + `retry_jitter`）；设最大重试次数；在任务里加**熔断**（下游连续失败时暂时不调用，直接延后重试）；全局限流。

### 13. Redis broker 挂了会怎样？
新任务投递失败（应用要处理投递异常：重试、降级、或记录到数据库稍后补投）；worker 断开后自动重连。缓解：Redis 高可用（哨兵）；关键任务先写数据库再投递（outbox 模式），投递失败可以补投。

### 14. 多租户场景下怎么隔离任务？
大客户的任务单独队列 + 专属 worker（防止一个客户影响所有人）；任务里按组织做配额和限流；任务参数里带上租户 ID，任务里所有数据访问都按租户过滤。

### 15. 怎么设计一个幂等的任务？
这里给状态流程，完整可运行的故障窗口演示在 `验证/verify_15.py`：

1. 在短事务中把 pending 原子改为 charging，记下幂等键并提交；charging 的恢复任务也要能继续处理。
2. 在事务外调用支付方，始终复用同一幂等键。超时表示结果未知，不能直接生成新扣款请求。
3. 短事务记录支付结果；若第 2 步后进程崩溃，由恢复任务按同一键查询或重调，再落 paid。
4. 并发执行要用租约或领取 token；对照账单补偿，不能见 charging 就永久退出。

只写「pending→charging→调用外部→paid」而没有提交边界和恢复路径，会在崩溃后卡死或重复产生副作用。这个题是设计示例，不是项目收款实现。

### 16. ★ 什么场景不适合用 Celery？（项目）
交互式、要求低延迟流式返回的任务。我们的 AI 对话就没有用 Celery：多一跳 broker 首字延迟变大，流式结果还要再走一层发布订阅。对话在 Web 进程的后台线程里跑，事件写 Redis Stream，SSE 直接读；只有长尾的批处理（文档解析、本体抽取、定时任务、评测）才走 Celery。

### 17. 新旧版本的 worker 同时在线时，任务签名改了怎么办？
滚动发布期间，新代码投递的任务可能被旧 worker 执行，反之亦然。规则：新增参数必须有默认值；不要直接改参数含义或删除参数（先兼容两种，下个版本再删）；任务改名时保留旧名字的任务作为转发；必要时用新队列，新 worker 先上线再切流量。

### 18. 跨服务投递任务（发送方没有任务代码）怎么做？
`celery.send_task("run_agent_bench", args=[...], queue="bench")`，只按名字投递，不需要导入任务函数。注意：`send_task` 会使用当前发送端 Celery app 的路由配置；发送端未加载路由、且没有任务对象时，接收端装饰器上的 queue 无法替它路由，跨服务时最好显式指定队列。

### 19. 长任务怎么做断点续传？
把任务拆成可恢复的步骤，每完成一步就把进度持久化（数据库记录处理到第几页 / 第几个 chunk）；任务重新执行时从上次的进度继续。我们文档入库分块重试（`ontology_chunk_retry`）就是只重试失败的分块，而不是整个文档重来。

### 20. Celery 任务的可观测性怎么做？
每个任务带 trace_id（投递时放进 headers，`task_prerun` 里取出设置到日志上下文），和触发它的 Web 请求串起来；记录任务的排队时间（投递到开始执行）、执行时间、重试次数、失败原因；监控每个队列的积压长度和 worker 数量，积压超过阈值告警。

### 21. 某个队列积压了几万个任务，怎么处理？
先看是生产突增（某个批量操作）还是消费变慢（下游变慢、某类任务卡住）；临时增加这个队列的 worker；排查慢的根因（`inspect active` 看都卡在什么任务上）；必要时先清理无效任务（重复的、过期的）；事后加积压告警和限流。

### 22. Celery 和 Temporal 这类工作流引擎有什么本质区别？
Celery 是「任务队列」：每个任务独立，任务之间的编排（chain / chord）比较简单，状态由你自己存；Temporal 是「持久化工作流」：工作流代码的执行状态由引擎持久化，进程崩了可以从断点**精确恢复**，天然支持长时间运行（几天）、定时、重试、人工审批等待。AI Agent 的长流程（跑几十分钟、要等用户确认、要能从中断处恢复）在需求变复杂后，可能更适合工作流引擎 —— 我们现在的「检查点落库 + 僵尸卡片清扫」就是在手动实现其中一部分。


## 复核依据与自检

2026-10-21 已核对：`../xknow-ai/app/config.py`、`app/extended/ext_celery.py`、`app/extended/ext_sqlalchemy.py`、`app/gunicorn_conf.py`、`app/core/agent/orchestrator.py`、`app/worker/tasks/{stuck_card_task,scheduled_task_task,agent_bench_task}.py`、`app/services/workspace_service.py` 及 `docker-compose/docker-compose-prd.yaml`（这些 app 路径相对 xknow-ai）。

配置里 `task_acks_on_failure_or_timeout=False` **不等于普通失败会自动重试**；当前 Celery 的普通失败可走 reject(requeue=False)，业务重试需 `retry/autoretry` 或对账。任务级选项可覆盖全局值，尤其 bench 的 acks_late=False。

[自检程序](https://github.com/imarshio/imarshio.github.io/blob/theme/hope/blog/posts/interview/verification/verify_15.py)覆盖：CRUD、关系加载、JSON 原地修改、版本冲突、保存点回滚、PG upsert/行锁/部分索引 SQL 编译、租户过滤、Celery 本地内存 broker 路由和 eager chain/group，以及支付调用后崩溃再恢复。它不启动项目应用，不连接共享服务；内存 broker/eager 无法验证真实 worker 的 ACK、超时和停机行为。片段里的业务函数、省略号和 Alembic DDL 没有被当成完整程序执行。

运行：在 Workspace 下执行 `xknow-ai/.venv/bin/python -I 面试准备/验证/verify_15.py`。

版本依据：[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、[Celery 任务确认与重试](https://docs.celeryq.dev/en/stable/userguide/tasks.html)、[Celery gevent 超时限制](https://docs.celeryq.dev/en/stable/userguide/workers.html#time-limits)。
