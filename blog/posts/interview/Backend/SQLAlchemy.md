---
title: "SQLAlchemy 面试题"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 3
redirectFrom:
  - /posts/interview/15-sqlalchemy-celery.html
---

# SQLAlchemy 面试题

> 按学习顺序展开：[SQLAlchemy 会话与事务](/notes/python/practice/sqlalchemy.md)。

> 两部分，各分入门 / 中等 / 高难三档，每档 20 题以上，★ 是高频题。02 和 05 文档里已有的题，这里收进来做成完整版（简写），并补上新题。
> 项目代码核对日期：2026-10-21。标「项目」的是当前源码能支持的实现；故障原因按代码注释和既有复盘归纳，不把复盘里每个案例都当成已复现。
> 代码块中省略了导入、模型或业务函数的是写法片段，不是可直接复制的整段程序。可运行自检见文末。

---

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

---

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

---

## 二、SQLAlchemy

### 入门
1. **ORM 和 Core 区别？** ORM 操作对象，Core 是 SQL 表达式构建器，更接近原生 SQL。复杂报表用 Core 或 `text()`。
2. **2.0 的查询写法？** `session.execute(select(User).where(User.id == 1)).scalar_one_or_none()`；旧的 `session.query()` 仍可用但不推荐。
3. **Session 是什么？** 工作单元：追踪对象变化，`commit()` 时生成 SQL 一起提交。
4. **`flush` 和 `commit` 区别？** flush 把 SQL 发给数据库但不提交事务（能拿到自增 ID）；commit 提交事务。
5. **关系怎么定义？** `relationship()` + `ForeignKey`，`back_populates` 双向。

### 中等
6. **N+1 问题和加载策略？**
   - `lazy="select"`（默认）：访问时才查，循环里就是 N+1；
   - `joinedload`：一条 JOIN 查出来，适合多对一；
   - `selectinload`：先查主表，再用 `WHERE id IN (...)` 查关联，**适合一对多**（JOIN 一对多会让主表行数膨胀）；
   - `raiseload`：访问未加载的关联直接报错，用来在开发期抓 N+1。
7. **`expire_on_commit` 是什么？** commit 后对象属性默认全部过期，下次访问重新查库。session 关闭后再访问就报 `DetachedInstanceError`。需要在 commit 后返回对象时可以设为 False。
8. **连接池参数？** `pool_size`（常驻连接）、`max_overflow`（临时多开）、`pool_timeout`（等连接多久）、`pool_recycle`（多久回收，防止被防火墙 / 数据库断开）、`pool_pre_ping`（取连接前先 ping，自动丢弃断掉的连接）。
9. **批量插入怎么快？** 2.0 里 `session.execute(insert(Model), [dict, dict, ...])` 走 executemany 批量；比逐个 `add` 快很多。PG 上超大批量用 `COPY`。
10. **`scoped_session` 是什么？** 按线程（或协程）各给一个 session。Flask-SQLAlchemy 按应用上下文划分。

### 高难（场景模拟）

#### 场景 1：一个 SQL 报错后，后面所有查询都报 `This Session's transaction has been rolled back`
- 原因：SQL 出错后事务处于失败状态，session 必须先 `rollback()` 才能继续用。
- **项目真实事故**：Agent 的某个工具查库失败，异常被工具内部吞掉了但没回滚，同一个 session 被后续所有工具共用 → 后面所有工具都失败。
- 方案：不在 36 个工具入口一个个加 try，而是在工具分发的统一 except 里兜底 `session.rollback()`（收敛到一个点）。

#### 场景 2：修改了 jsonb 字段里的一个键，commit 后数据库没变
- 原因：ORM 通过「属性被重新赋值」感知变化，`card.extra["status"] = "done"` 是原地修改字典，ORM 不知道。
- 方案：重新赋值整个字典 `card.extra = {**card.extra, "status": "done"}`；或 `flag_modified(card, "extra")`；或列类型用 `MutableDict.as_mutable(JSONB)`。
- 进阶：并发更新同一个 jsonb 会互相覆盖（读出 → 改 → 写回，后写的覆盖先写的）→ 用数据库侧原子更新 `jsonb_set(extra, '{status}', '"done"')`，或乐观锁。

#### 场景 3：乐观锁怎么做？
```python
class Card(Base):
    version = mapped_column(Integer, nullable=False)
    __mapper_args__ = {"version_id_col": version}
```
更新时自动带 `WHERE version = 旧值`，影响行数为 0 就抛 `StaleDataError`，业务重试。适合冲突少的场景；冲突多用悲观锁 `with_for_update()`。

#### 场景 4：导出 500 万行数据，内存爆了
- 默认 ORM 会把结果全部加载进内存并且追踪每个对象。
- 方案：`session.execute(select(...).execution_options(yield_per=1000))` 或 `stream_results=True`（服务端游标），分批处理；只查需要的列而不是整个对象；导出类需求直接用 PG 的 `COPY ... TO STDOUT`。

#### 场景 5：gevent 并发执行多个工具，共用一个 session 出现奇怪错误
- session **不是线程 / 协程安全的**，多个协程同时用一个 session 会互相干扰事务和对象状态。
- **项目真实做法**：并行执行的工具，每个 greenlet 自己 `push` 一个 Flask app context → 拿到自己的 scoped session，结束时随 context 一起清理。

#### 场景 6：Celery / gunicorn fork 子进程后数据库连接报错
- fork 会把父进程的连接池「复制」给子进程，多个进程共用同一个 socket → 协议错乱。
- 方案：fork 后在子进程里 `engine.dispose(close=False)`（丢弃继承的连接，不关闭父进程的）；或者在子进程里才创建 engine（gunicorn 不用 `--preload` 或用 `post_fork` 钩子）。

#### 场景 7：模型属性拼错，静态检查查不出来
- Flask-SQLAlchemy 的 `db.Model` 对类型检查器来说是 `Any`，`card.extar` 这种拼写错误 ruff / 类型检查都放过，运行到那一行才报错。
- **项目做法**：写了一个 AST 审计脚本，扫描代码里所有「模型对象.属性」的访问，和模型实际定义的列 / 关系集合比对。说明你会用工具补语言的短板。

#### 场景 8：读写分离怎么在 SQLAlchemy 里做？
继承 `Session` 重写 `get_bind()`：有写操作（`flush` 中）走主库，否则走从库；或者显式用两个 sessionmaker。注意「写后读」要走主库。

---
