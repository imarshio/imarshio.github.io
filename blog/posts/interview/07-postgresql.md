---
title: "PostgreSQL 专题"
lang: zh-CN
date: 2026-10-23
order: 107
category:
  - 面试准备
tag:
  - 面试题
---

# PostgreSQL 专题

> 按知识块组织，每块分 **入门 / 中等 / 高难**。被问到 PG 时的总策略：**能和 MySQL 对比的地方主动对比**，把话题拉到你熟的地方。
> 05 文档里的 11 个 PG 场景题仍然有效，这里不重复，只在相关位置标「见 05」。
>
> 目录：一、架构 → 二、存储 → 三、数据类型 → 四、索引 → 五、执行计划与优化 → 六、事务与 MVCC → 七、锁 → 八、VACUUM → 九、WAL 与持久化 → 十、复制与高可用 → 十一、分区与分片 → 十二、连接与连接池 → 十三、备份恢复 → 十四、安全与权限 → 十五、扩展生态 → 十六、监控与排查 → 十七、SQL 写法 → 十八、综合场景

---

## 一、架构

### 入门
1. **PG 的进程模型？**
   多进程。一个主进程 `postmaster` 负责监听和派生；**每个客户端连接 fork 一个 backend 进程**；另有一批后台进程：
   - checkpointer（做检查点）、background writer（把脏页慢慢刷盘）、walwriter（刷 WAL）；
   - autovacuum launcher / workers（自动清理）；
   - archiver（归档 WAL）、wal sender / receiver（复制）、logical replication launcher。
   **对比 MySQL**：MySQL 是单进程多线程，每个连接一个线程。所以 PG 的连接更贵，必须用连接池。
2. **数据库、schema、表的层级？** 一个实例（cluster）有多个 database，database 下有多个 schema（命名空间，默认 `public`），schema 下才是表。跨 database 不能直接 JOIN（要 `dblink` / `postgres_fdw`），跨 schema 可以。

### 中等
3. **主要内存参数？**
   | 参数 | 作用 | 经验值 |
   |---|---|---|
   | `shared_buffers` | 共享缓冲池，缓存数据页 | 内存的 25% 左右 |
   | `work_mem` | **每个**排序 / 哈希操作可用的内存 | 默认 4MB；注意一条复杂 SQL 可能有多个排序节点，乘以并发连接数可能爆内存 |
   | `maintenance_work_mem` | VACUUM、建索引用的内存 | 几百 MB 到 1–2GB |
   | `effective_cache_size` | **不分配内存**，只告诉优化器「操作系统 + PG 一共大约能缓存多少」 | 内存的 50–75% |
   | `wal_buffers` | WAL 缓冲 | 默认自动 |
   **和 MySQL 的区别**：InnoDB 的 Buffer Pool 一般给 60–80% 内存，自己管缓存；PG 依赖**双重缓存**（shared_buffers + 操作系统页缓存），所以 shared_buffers 不宜过大。
4. **一条 SELECT 在 PG 里怎么执行？** 解析（parser）→ 重写（rewriter，处理视图和规则）→ 规划（planner，基于代价选最优计划）→ 执行（executor）。

### 高难
5. **为什么 PG 连接数上不去？** 每个连接一个进程，内存占用几 MB 起（加上 work_mem 更多）；进程上下文切换开销；快照计算要遍历所有活跃连接（PG14 优化过）。几百连接后性能下降明显，几千基本不可用。解法是连接池（见十二）。

---

## 二、存储

### 入门
1. **数据怎么存的？** 每张表是一个或多个文件，按 **8KB 的页（page）** 组织。表是**堆表（heap）**：行按插入顺序放，没有按主键排序。

### 中等
2. **堆表和 MySQL 的聚簇索引有什么区别？**
   - InnoDB：数据按主键顺序存在 B+ 树叶子节点里（聚簇索引），二级索引存的是主键值，查询要**回表**到主键索引；
   - PG：数据在堆里无序存放，**所有索引（包括主键）都是二级索引**，存的是行的物理位置 `ctid`（页号 + 页内偏移），直接定位到堆里的行。
   - 影响：PG 按主键范围扫描不如 InnoDB 连续（可以用 `CLUSTER` 命令一次性重排，但不会自动保持）；PG 更新一行如果换了位置，**所有索引都要更新**（除非是 HOT 更新）。
3. **行头里有什么？** `xmin`（插入事务）、`xmax`（删除 / 锁定事务）、`ctid`（当前位置或新版本位置）、infomask（各种标志位，比如 hint bits：缓存「这个事务已提交」）。可以直接查：`SELECT xmin, xmax, ctid, * FROM t;`
4. **TOAST 是什么？** 一行超过约 2KB 时，大字段（text、jsonb、bytea）会被压缩，还放不下就切块存到单独的 TOAST 表里，主表只存指针。PG14 起可选 lz4 压缩（比默认的 pglz 快）。
   - 影响：读大字段要额外读 TOAST 表；**更新大字段要重写整个值**（改 jsonb 里一个键 = 重写整个 jsonb）。
5. **FSM 和 VM 是什么？**
   - FSM（Free Space Map）：记录每页还有多少空闲空间，插入时找空位；
   - VM（Visibility Map）：每页两个位：「所有行对所有事务可见（all-visible）」和「全部已冻结（all-frozen）」。**Index Only Scan 依赖它**：页是 all-visible 才不用回堆检查可见性；VACUUM 也靠它跳过不用处理的页。

### 高难
6. **HOT 更新（Heap-Only Tuple）是什么？怎么利用？**
   如果更新的列**都不在任何索引里**，并且**同一页有空位**，新版本直接放在同一页，并从旧版本链过去，**不用更新任何索引**。
   - 提高命中率：给频繁更新的表设 `fillfactor = 70~90`（每页预留空间）；不要给频繁更新的列建索引。
   - 看命中率：`pg_stat_user_tables` 的 `n_tup_hot_upd / n_tup_upd`。

---

## 三、数据类型

### 入门
1. **常用类型？** `integer` / `bigint`、`numeric`（精确小数，存钱用）、`text` / `varchar(n)`（PG 里两者性能一样，`text` 没长度限制）、`boolean`、`timestamp` / `timestamptz`、`date`、`uuid`、`jsonb`、数组 `text[]`、`bytea`（二进制）。
2. **`char(n)`、`varchar(n)`、`text` 怎么选？** 一律 `text` 或 `varchar(n)`（需要长度约束时）。`char(n)` 会补空格，几乎不用。**对比 MySQL**：MySQL 里 varchar 长度影响索引和内存临时表，PG 里没区别。
3. **主键用自增还是 UUID？**
   - 自增（`bigint GENERATED ALWAYS AS IDENTITY`）：小、顺序写入、索引紧凑；缺点：暴露数据量、分布式下难统一。
   - UUID v4：全局唯一、可在应用层生成；缺点：随机，插入时 B-tree 到处分裂，索引膨胀、缓存命中率低。
   - **UUID v7**：前面是时间戳，**有序 + 全局唯一**，兼顾两者。PG18 内置了 `uuidv7()`，老版本在应用层生成。
   - 我们项目大量用 UUID 主键。

### 中等
4. **数组类型怎么用？** `tags text[]`，查询 `WHERE 'ai' = ANY(tags)` 或 `tags @> ARRAY['ai']`，配 GIN 索引。适合标签这类简单多值；关系复杂还是拆表。
5. **枚举怎么存？** PG 有 `CREATE TYPE status AS ENUM (...)`，但加值要 DDL、删值几乎不行。实践中更常用 `text` + `CHECK` 约束，或者应用层枚举。
6. **`numeric` 和 `double precision`？** numeric 精确但慢，钱、计费必须用它；double 是浮点，有精度误差。我们的模型计费按 token 单价算钱，用 numeric。
7. **范围类型？** `tstzrange`、`int4range`，配合排他约束可以实现「同一会议室时间段不能重叠」：`EXCLUDE USING gist (room WITH =, during WITH &&)`。这是 MySQL 做不到的。

### 高难
8. **jsonb 深入**（项目重点用）：
   - 操作符：`->`（取 JSON）、`->>`（取文本）、`#>` / `#>>`（按路径取）、`@>`（包含）、`?`（键存在）、`?|` / `?&`（任一 / 全部键存在）、`||`（合并）、`-`（删键）；
   - 修改：`jsonb_set(data, '{a,b}', '"x"')`、`jsonb_insert`；
   - **jsonpath**（PG12+）：`data @? '$.items[*] ? (@.price > 100)'`；
   - 索引：
     - `GIN (data)`（默认 `jsonb_ops`）：支持 `@>`、`?`、`?|`、`?&`；
     - `GIN (data jsonb_path_ops)`：**只支持 `@>`**，但索引更小更快；
     - 表达式索引 `((data->>'status'))`：对某个固定键做等值 / 范围查询最快。
   - **什么时候不该用 jsonb**：需要频繁更新单个键（每次重写整个值，写放大）；需要外键和约束；需要频繁按里面的字段做 JOIN 和聚合。**经常查的字段要提出来成独立列**。
   - 项目真实问题：卡片 `extra` 里放了运行日志，每个检查点都整体重写一次（见 05 场景 2）。

---

## 四、索引

### 入门
1. **PG 有哪些索引类型？**
   | 类型 | 适合 |
   |---|---|
   | B-tree（默认） | 等值、范围、排序、`LIKE 'abc%'`（需要 `text_pattern_ops` 或 C collation） |
   | Hash | 只有等值；PG10 后才安全可用，实际很少用 |
   | GIN | 倒排索引：jsonb、数组、全文检索、`pg_trgm` 模糊搜索 |
   | GiST | 地理位置、范围类型、最近邻 |
   | SP-GiST | 非平衡数据结构（四叉树、前缀树），比如 IP、电话号码 |
   | BRIN | 块范围索引：按时间顺序写入的超大表，体积极小 |
2. **怎么建索引不锁表？** `CREATE INDEX CONCURRENTLY`。不阻塞写，但要扫两遍表、不能在事务块里跑；失败会留一个 `INVALID` 索引要手动删。重建：`REINDEX INDEX CONCURRENTLY`（PG12+）。

### 中等
3. **多列索引的列顺序？** 等值条件的列放前面，范围条件的列放后面；选择性高的放前面。PG 的多列 B-tree 在没有首列条件时**也可能**被使用（扫整个索引），但效率差。
4. **部分索引（partial index）？** `CREATE INDEX ON orders (user_id) WHERE status = 'pending';` 只索引一部分行，小而快。典型：软删除表只索引未删除的；队列表只索引待处理的。**MySQL 没有**。
5. **表达式索引？** `CREATE INDEX ON users (lower(email));` 查询必须写成同样的表达式 `WHERE lower(email) = ...` 才能用上。
6. **覆盖索引（INCLUDE）？** `CREATE INDEX ON cards (user_id) INCLUDE (title);` 把额外列存在索引叶子上，实现 Index Only Scan。但还要 VM 页是 all-visible 才真的不回堆。
7. **唯一索引和 NULL？** 默认多个 NULL 不算重复。PG15 可以 `UNIQUE NULLS NOT DISTINCT` 让 NULL 也唯一。
8. **GIN 的 fastupdate？** GIN 写入很贵（一行可能对应很多个倒排项），默认先写到一个待处理列表（pending list），攒够了再批量合并。代价：查询要额外扫描 pending list；可以关掉 `fastupdate` 或调 `gin_pending_list_limit`。
9. **索引越多越好吗？** 不是。每个索引都拖慢写入（PG 非 HOT 更新要更新所有索引）、占空间、占缓存。用 `pg_stat_user_indexes` 里 `idx_scan = 0` 的找出从没用过的索引删掉。

### 高难
10. **B-tree 索引膨胀怎么办？** 大量删除 / 更新后索引页变得稀疏。PG13 的 B-tree 去重（deduplication）和 PG14 的自底向上删除缓解了很多。严重时 `REINDEX CONCURRENTLY`。
11. **怎么验证一个索引有没有用，又不想真建？** `hypopg` 扩展建「假设索引」，再 `EXPLAIN` 看优化器会不会用。
12. **`LIKE '%关键词%'` 怎么加速？** `pg_trgm` 扩展把文本切成三字符组（trigram），配 GIN 索引：`CREATE INDEX ON docs USING gin (title gin_trgm_ops);`。中文效果一般（中文要分词，见十五）。

---

## 五、执行计划与优化

### 入门
1. **`EXPLAIN` 和 `EXPLAIN ANALYZE` 区别？** 前者只给预估计划；后者**真的执行**并给出实际耗时和行数（对 UPDATE / DELETE 要包在事务里然后 ROLLBACK）。加 `BUFFERS` 看读了多少页（命中缓存 `shared hit` / 读磁盘 `read`）。
2. **扫描方式？** Seq Scan（全表）、Index Scan（索引 + 回堆）、Index Only Scan（只读索引）、Bitmap Index Scan + Bitmap Heap Scan（先在索引里收集所有匹配位置，排序后批量读堆，适合中等选择性或多个索引合并）。
3. **连接方式？**
   - Nested Loop：外表每一行去内表查，适合外表小、内表有索引；
   - Hash Join：小表建哈希表，大表探测，适合等值连接、没有索引；
   - Merge Join：两边按连接键排好序后归并，适合都已排序或数据量大。
   **对比 MySQL**：MySQL 8.0.18 以前只有 Nested Loop，后来加了 Hash Join，没有 Merge Join。

### 中等
4. **执行计划里的 cost 是什么？** `cost=启动代价..总代价`，单位是抽象的「读一个顺序页 = 1」。由 `seq_page_cost`（1）、`random_page_cost`（默认 4）、`cpu_tuple_cost` 等参数算出来。**SSD 上应把 `random_page_cost` 调到 1.1 左右**，否则优化器过度偏好全表扫描。
5. **统计信息存在哪？怎么更新？** `pg_statistic`（可读视图 `pg_stats`）：每列的空值比例、不同值数量、最常见值及频率、直方图、物理顺序相关性。`ANALYZE` 更新，autovacuum 会自动做。大批量导入后要手动 `ANALYZE`。
6. **为什么明明有索引却走了全表扫描？** 优化器估计要返回的行太多（比如超过 10%~20%），全表顺序读比大量随机读便宜；统计信息过期；类型不匹配或用了函数；小表。
7. **`count(*)` 为什么慢？** MVCC 下每个事务看到的行数不同，PG 不维护全局行数，必须扫描（可以走 Index Only Scan）。要近似值：`SELECT reltuples FROM pg_class WHERE relname = 't';`。**对比 MySQL**：InnoDB 也一样慢，MyISAM 才存行数。
8. **并行查询？** 大表扫描、聚合、连接可以多进程并行（`max_parallel_workers_per_gather`）。计划里看到 `Gather` / `Parallel Seq Scan`。
9. **预编译语句的执行计划问题？** 预编译语句前 5 次用「定制计划」（按实际参数），之后可能切换成「通用计划」（不看参数值）。数据倾斜时通用计划可能很差 → `plan_cache_mode = force_custom_plan`。

### 高难
10. **执行计划突然变差** → 见 05 场景 4（统计信息、扩展统计 `CREATE STATISTICS`）。
11. **多表 JOIN 很多时优化器很慢或选错顺序？** 超过 `join_collapse_limit`（默认 8）个表时，优化器不再穷举所有连接顺序；超过 `geqo_threshold`（12）用遗传算法。可以用 CTE / 子查询把 JOIN 拆开，引导顺序。
12. **PG 没有 index hint 怎么办？** 用 `pg_hint_plan` 扩展；或临时 `SET enable_seqscan = off` 诊断（只用于诊断，不要用在生产代码里）；根本解法是修正统计信息和索引。
13. **怎么优化一条慢 SQL（完整流程）？**
    1. `pg_stat_statements` 找到总耗时最高的 SQL；
    2. `EXPLAIN (ANALYZE, BUFFERS)` 看实际计划，找耗时最多的节点；
    3. 对比估算行数和实际行数，差距大 → 统计信息问题；
    4. 看是否有不该出现的 Seq Scan、Sort（内存不够写了磁盘：`Sort Method: external merge`）、Nested Loop 外表很大；
    5. 加索引 / 改写 SQL / 调 work_mem / 更新统计；
    6. 改完再 EXPLAIN 验证，上线后看 pg_stat_statements 的变化。

---

## 六、事务与 MVCC

### 入门
1. **ACID 在 PG 里靠什么实现？** 原子性：事务提交状态记录在 `pg_xact`（CLOG），回滚只需标记中止，什么都不用撤销；持久性：WAL；隔离性：MVCC + 锁；一致性：约束 + 以上三者。
2. **四个隔离级别 PG 都支持吗？** 语法上都支持，但「读未提交」实际行为等于「读已提交」（PG 永远不会读到未提交数据）。**默认是读已提交（RC）**。

### 中等
3. **MVCC 的可见性怎么判断？** 事务开始（RC 是每条语句开始）时拿一个**快照**：当前最小活跃事务号、下一个事务号、活跃事务列表。一行版本可见的条件大致是：`xmin` 已提交且在快照之前，并且 `xmax` 为空、或未提交、或在快照之后。
4. **RC 和 RR 在 PG 里的区别？**
   - RC：每条语句新拿快照，能看到别的事务刚提交的数据（不可重复读）。
   - RR：整个事务用第一条语句的快照（快照隔离），**PG 的 RR 不会幻读**（比 SQL 标准要求更强）。
5. **RC 下两个事务同时 UPDATE 同一行会怎样？** 后到的等前一个提交，然后**拿最新版本重新检查 WHERE 条件**，满足才更新。
6. **RR 下同样的情况？** 后到的等前一个提交后**直接报错** `could not serialize access due to concurrent update`，应用要重试整个事务。**这和 MySQL 的 RR 不一样**：MySQL RR 下 UPDATE 用「当前读」读最新版本直接更新，不报错。
7. **PG 和 MySQL 的 MVCC 实现区别？**
   | | PG | MySQL InnoDB |
   |---|---|---|
   | 旧版本在哪 | 表里（新旧版本并存） | undo log |
   | 清理 | VACUUM | purge 线程 |
   | 回滚代价 | 极小（标记中止即可） | 要应用 undo |
   | 更新代价 | 大（写整行新版本，可能更新所有索引） | 较小（原地改 + 写 undo） |
   | 长事务的影响 | 表膨胀（VACUUM 清不掉） | undo 膨胀 |

### 高难
8. **快照隔离（RR）的写偏斜（write skew）？**
   例子：「至少一个医生值班」。两个医生同时查到「当前 2 人值班」，各自把自己改成下班，两个事务改的是不同行，都能提交 → 0 人值班。RR 防不住。
   解法：Serializable 隔离级别（SSI 会检测到读写依赖环并让一个失败）；或者 `SELECT ... FOR UPDATE` 显式锁住相关行。
9. **Serializable（SSI）是怎么实现的？** 在快照隔离基础上加「谓词锁」（SIRead 锁，只记录不阻塞），追踪事务之间的读写依赖，发现可能形成环时让一个事务失败（SQLSTATE `40001`）。不会死锁式地阻塞，但要业务重试。
10. **子事务（SAVEPOINT）有什么坑？** 每个 SAVEPOINT 是一个子事务，有自己的事务号。一个事务里子事务超过 64 个后，判断可见性要查 `pg_subtrans`，高并发下会出现严重的锁争用（著名的「子事务性能问题」）。ORM 里嵌套事务 `begin_nested()` 就是 SAVEPOINT，循环里大量使用要小心。
11. **长事务的危害？** 挡住 VACUUM 清理（膨胀）、挡住冻结（回卷风险）、持有锁阻塞 DDL、占着连接。用 `idle_in_transaction_session_timeout` 自动杀掉「开了事务不干活」的连接。

---

## 七、锁

### 入门
1. **行锁怎么加？** `SELECT ... FOR UPDATE`（排他）、`FOR NO KEY UPDATE`（不改主键的更新，UPDATE 默认加这个）、`FOR SHARE`、`FOR KEY SHARE`（外键检查用）。
2. **`NOWAIT` 和 `SKIP LOCKED`？** 拿不到锁立即报错 / 跳过被锁的行。`SKIP LOCKED` 做任务队列（见 05）。

### 中等
3. **表级锁有哪些？** 8 种，从弱到强：`ACCESS SHARE`（SELECT）→ `ROW SHARE` → `ROW EXCLUSIVE`（INSERT / UPDATE / DELETE）→ `SHARE UPDATE EXCLUSIVE`（VACUUM、`CREATE INDEX CONCURRENTLY`）→ `SHARE`（`CREATE INDEX`）→ `SHARE ROW EXCLUSIVE` → `EXCLUSIVE` → `ACCESS EXCLUSIVE`（大多数 `ALTER TABLE`、`DROP`、`TRUNCATE`、`VACUUM FULL`，和所有锁冲突，连 SELECT 都会被挡住）。
4. **PG 的行锁存在哪？会锁升级吗？** 行锁记在**行头的 xmax** 里（多个事务共享锁时用 MultiXact），不占内存锁表，所以**不会锁升级**（SQL Server 会把大量行锁升级为表锁）。代价：加锁也要写页（产生 WAL 和脏页）。
5. **PG 有间隙锁吗？** **没有**。MySQL RR 用间隙锁 / 临键锁防幻读；PG RR 靠快照防幻读，Serializable 用谓词锁。所以 PG 里「插入被间隙锁挡住」这类死锁不存在。
6. **死锁怎么检测？** 等锁超过 `deadlock_timeout`（默认 1 秒）后跑死锁检测，发现环就中止其中一个。预防：所有事务按相同顺序加锁；事务尽量短。
7. **咨询锁（advisory lock）？** 应用自定义含义的锁：`pg_advisory_lock(id)`（会话级，要手动释放）、`pg_advisory_xact_lock(id)`（事务结束自动释放）、`pg_try_advisory_lock`（不等待）。适合「同一个文档同时只能有一个任务处理」这类互斥，不需要 Redis。注意：PgBouncer transaction 模式下不能用会话级的。

### 高难
8. **DDL 引起的「锁队列」雪崩** → 见 05 场景 1（`lock_timeout`）。这是 PG 线上事故最常见的原因之一。
9. **外键会带来什么锁问题？** 子表插入 / 更新时对父表对应行加 `FOR KEY SHARE`；父表删除或改主键时要检查子表（**子表外键列没有索引就会全表扫描子表**）。规则：外键列一定要建索引（PG 不会自动建，MySQL 会）。
10. **怎么排查锁？**
    ```sql
    SELECT a.pid, a.query, a.state, l.locktype, l.mode, l.granted,
           pg_blocking_pids(a.pid) AS blocked_by
    FROM pg_stat_activity a JOIN pg_locks l ON l.pid = a.pid
    WHERE NOT l.granted;
    ```

---

## 八、VACUUM

### 入门
1. **VACUUM 是干什么的？** 回收死元组空间（供以后复用）、更新 VM、冻结老事务号、（`VACUUM ANALYZE`）更新统计信息。
2. **VACUUM 和 VACUUM FULL？** 普通 VACUUM 不锁表、不还空间给操作系统；FULL 重写整张表、还空间，但加 `ACCESS EXCLUSIVE` 锁。生产上用 `pg_repack` 代替 FULL。

### 中等
3. **autovacuum 什么时候触发？** 死元组数 > `autovacuum_vacuum_threshold`（50）+ `autovacuum_vacuum_scale_factor`（0.2）× 表行数。即默认 **20% 的行变成死元组**才触发 —— 1 亿行的表要攒 2000 万死元组，太晚了。大表要单独调小 scale_factor。PG13 起插入量大也会触发（为了及时冻结和更新 VM）。
4. **autovacuum 太慢怎么办？** 调大 `autovacuum_vacuum_cost_limit`（默认限速很保守）、增加 `autovacuum_max_workers`、调大 `maintenance_work_mem`。
5. **什么会挡住 VACUUM 清理？** 长事务、未提交的预备事务（2PC）、复制槽（`pg_replication_slots` 里不活跃的槽）、从库开了 `hot_standby_feedback` 且有长查询。

### 高难
6. **事务号回卷** → 见 05 场景 3。补充：剩余事务号只剩几千万时日志开始告警，再降到几百万时 PG 拒绝分配新事务号（只读还能用）；重启解决不了，只能 VACUUM 冻结。监控 `age(datfrozenxid)`，超过 10 亿就该告警。
7. **大表的 anti-wraparound VACUUM 突然把 IO 打满？** 冻结 VACUUM 要扫全表，不能被取消（会自动重启）。预防：平时让 autovacuum 足够勤快、在业务低峰手动 `VACUUM (FREEZE)`；分区表让老分区冻结一次后就不用再扫。

---

## 九、WAL 与持久化

### 入门
1. **WAL 是什么？** Write-Ahead Log，预写日志：**先写日志，再改数据页**。崩溃后重放 WAL 恢复。等同于 MySQL 的 redo log。
2. **提交时发生了什么？** WAL 记录写入并 fsync 到磁盘（默认），然后返回成功；数据页可以之后慢慢刷。

### 中等
3. **检查点（checkpoint）？** 把所有脏页刷盘，标记一个位置：崩溃恢复只需从最近的检查点开始重放。触发条件：`checkpoint_timeout`（默认 5 分钟）或 WAL 量达到 `max_wal_size`。检查点太频繁 → IO 尖峰；日志里出现 `checkpoints are occurring too frequently` 要调大 `max_wal_size`。
4. **`full_page_writes` 是干什么的？** 检查点之后某页第一次被修改时，把整页写进 WAL，防止「页撕裂」（8KB 的页写到一半断电）。代价是检查点后 WAL 量暴增。**对比 MySQL**：InnoDB 用 doublewrite buffer 解决同一个问题。
5. **`synchronous_commit` 的几个级别？** `off`（不等 WAL 落盘就返回，崩溃可能丢最后几百毫秒的提交，但不会损坏数据）、`local`（本地落盘）、`on`（有同步从库时等从库落盘）、`remote_write`、`remote_apply`（等从库应用完，从库能立刻读到）。可以**按事务设置**：日志类写入用 off 提速，订单类用 on。
6. **`wal_level`？** `minimal` / `replica`（默认，支持物理复制）/ `logical`（支持逻辑复制和 CDC，比如 Debezium 读 PG）。

### 高难
7. **WAL 和 MySQL 的 redo + binlog 有什么不同？** MySQL 有两份日志（InnoDB 的 redo 用于崩溃恢复，Server 层的 binlog 用于复制和恢复），要两阶段提交保证一致；PG 只有一份 WAL，同时用于崩溃恢复、物理复制、逻辑复制（`wal_level=logical`）、PITR。所以 PG 没有「redo 和 binlog 不一致」的问题。
8. **WAL 目录把磁盘撑满了？** 常见原因：复制槽不活跃（从库 / CDC 下线了，PG 为它保留所有 WAL）、归档失败（`archive_command` 一直报错，WAL 不能删）。处理：删掉废弃的槽，修归档；PG13 可以设 `max_slot_wal_keep_size` 限制槽保留的上限。

---

## 十、复制与高可用

### 入门
1. **PG 有哪几种复制？**
   - **物理流复制**：从库接收主库的 WAL 并重放，字节级一模一样，从库只读（hot standby）。
   - **逻辑复制**（PG10+）：发布 / 订阅（`CREATE PUBLICATION` / `CREATE SUBSCRIPTION`），按表同步行变更，可以跨大版本、只同步部分表、订阅端可写。

### 中等
2. **同步复制和异步复制？** 异步：主库提交不等从库，主库挂了可能丢最近的数据；同步（`synchronous_standby_names`）：等至少一个从库确认，不丢数据但写延迟增加，从库挂了主库写入会卡住（所以通常配多个候选从库，`ANY 1 (s1, s2)`）。
3. **复制槽（replication slot）？** 主库为每个从库 / 订阅者记住「它读到哪了」，保证还没被读走的 WAL 不会被删。好处是从库断开一阵子回来能接上；坏处是从库永远不回来，WAL 就无限堆积（见九-8）。
4. **从库上查询被取消 `canceling statement due to conflict with recovery`？** 从库在重放主库的 VACUUM 时，要删掉的旧版本正好被从库上的长查询使用。选择：`max_standby_streaming_delay`（延迟重放，从库数据更旧）、`hot_standby_feedback = on`（告诉主库别清，主库可能膨胀）。
5. **怎么看主从延迟？** 主库 `pg_stat_replication` 的 `write_lag` / `flush_lag` / `replay_lag`；从库 `now() - pg_last_xact_replay_timestamp()`。

### 高难
6. **PG 怎么做高可用自动切换？** PG 本身不带自动故障转移。主流方案 **Patroni + etcd / Consul**：每个节点跑一个 Patroni 代理，通过分布式一致性存储选主，主库失联就提升一个从库；配合 HAProxy / VIP 让应用连到新主。旧主恢复后用 `pg_rewind` 快速回退成从库。
7. **脑裂怎么防？** 依赖 etcd 的租约：拿不到租约的节点必须降级为只读；配合 fencing（隔离旧主）。
8. **读写分离的一致性** → 见 05 场景 8。
9. **大版本升级怎么做到停机时间短？** `pg_upgrade --link`（硬链接，几分钟）；或者用逻辑复制把数据同步到新版本集群，切换时只需短暂停写。

---

## 十一、分区与分片

### 入门
1. **分区表是什么？** 一张逻辑表按规则拆成多个物理子表。PG10 起支持声明式分区：RANGE（按时间）、LIST（按地区 / 租户）、HASH（均匀打散）。

### 中等
2. **分区裁剪？** 查询条件带分区键时只扫相关分区。PG11 起支持执行期裁剪（参数在执行时才知道也能裁）。
3. **分区表的限制？** 主键 / 唯一约束必须包含分区键（没有全局唯一索引）；分区太多（几千个）规划变慢；跨分区更新分区键会变成删除 + 插入。
4. **怎么维护分区？** 提前建未来分区（`pg_partman` 或定时任务）；老分区 `DETACH PARTITION ... CONCURRENTLY`（PG14+）后归档或删除；默认分区（DEFAULT）兜住不匹配的数据，但默认分区数据多了再建新分区要扫它，尽量别往里放数据。

### 高难
5. **单机 PG 撑不住了怎么分片？**
   - **Citus** 扩展：把 PG 变成分布式数据库，按分布列（比如 `tenant_id`）把表打散到多个 worker 节点，同一个租户的数据在同一个节点，跨租户查询由协调节点并行下发。适合多租户 SaaS。
   - 应用层分片：按租户路由到不同的 PG 实例，简单可控，但跨分片查询和扩容迁移要自己做。
   - **对比 MySQL**：MySQL 生态是 ShardingSphere / Vitess。思路一样：选分片键、处理分布式 ID、跨分片查询、扩容时的数据迁移。
6. **多租户该怎么选：共享表、每租户一个 schema、每租户一个库？**
   | | 共享表 + tenant_id | 每租户一个 schema | 每租户一个库 |
   |---|---|---|---|
   | 隔离 | 弱（靠代码或 RLS） | 中 | 强 |
   | 租户数上限 | 几乎无限 | 几千（表太多元数据膨胀） | 几十到几百 |
   | 迁移成本 | 一次 | 每个 schema 都要跑 | 每个库都要跑 |
   我们是共享表（逻辑多租户），和你旧项目「物理多租户改逻辑多租户」的经历是一致的，可以串起来讲。

---

## 十二、连接与连接池

### 入门
1. **`max_connections` 默认多少？** 100。调大要同时考虑内存（每连接几 MB + work_mem）。

### 中等
2. **PgBouncer 三种模式** → 见 05 中等 15。补充：PgBouncer 1.21+ 在 transaction 模式下支持协议级的预编译语句。
3. **应用侧连接池和 PgBouncer 的关系？** 应用侧池（SQLAlchemy 的 QueuePool）管「本进程」的连接复用；PgBouncer 管「所有进程汇总后」到数据库的连接数。进程多（多副本 × 多 worker）时两者都需要。
4. **连接超时相关参数？** `statement_timeout`（单条 SQL 超时）、`lock_timeout`（等锁超时）、`idle_in_transaction_session_timeout`（事务空闲超时）、`idle_session_timeout`（PG14，连接空闲超时）。可以按角色设：`ALTER ROLE app SET statement_timeout = '30s';`

### 高难
5. **连接打满** → 见 05 场景 7。补充 gevent 的特殊点：协程很便宜，几千个协程同时要连接，`pool_size` 却只有十几个，大部分在 `pool_timeout` 里排队。原则：**拿连接的时间要短，绝不能拿着连接去等模型或外部接口**。
6. **fork 之后连接串台**（项目真实事故）：gunicorn 用 `--preload` 时，应用在 master 进程里导入，导入时连过一次库，那条连接留在池里；fork 出 4 个 worker 后共用同一个 socket，并发时**读到别人的结果集**（报出 `'<' not supported between 'int' and 'UUID'` 这种莫名其妙的错）。修复：在 `post_fork` 钩子里 `engine.dispose(close=False)` —— 只丢掉引用，不真关（真关会给 PG 发终止命令，把兄弟进程正在用的会话也打死）。

---

## 十三、备份恢复

### 入门
1. **逻辑备份和物理备份？**
   - 逻辑：`pg_dump`（单库）/ `pg_dumpall`（全实例），导出 SQL 或自定义格式。`-Fc` 自定义格式 + `pg_restore -j 8` 可以并行恢复。跨版本、可挑表，但大库慢。
   - 物理：`pg_basebackup` 拷贝数据目录，快，但只能同大版本恢复。

### 中等
2. **PITR（时间点恢复）怎么做？** 基础备份 + 持续归档 WAL（`archive_mode = on` + `archive_command`）。恢复时还原基础备份，配置 `restore_command` 和 `recovery_target_time = '2026-10-21 10:00:00'`，重放 WAL 到那个时间点停下。
3. **生产常用工具？** pgBackRest、Barman、WAL-G：支持增量备份、并行、压缩、备份到对象存储、校验。

### 高难
4. **误删数据恢复** → 见 05 场景 11。
5. **备份怎么验证？** 定期在另一台机器上真的恢复一次并跑校验查询。**没恢复演练过的备份等于没有备份**。

---

## 十四、安全与权限

### 入门
1. **用户和角色？** PG 里用户就是能登录的角色（`CREATE ROLE app LOGIN PASSWORD '...'`）。权限用 `GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO app;`，以后新建的表要 `ALTER DEFAULT PRIVILEGES` 才会自动授权。
2. **`pg_hba.conf` 是什么？** 客户端认证配置：哪些 IP、哪个用户、连哪个库、用什么认证方式（`scram-sha-256` 推荐，`trust` 千万别在生产用）。

### 中等
3. **行级安全（RLS）？**
   ```sql
   ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation ON docs
     USING (org_id = current_setting('app.org_id')::uuid);
   -- 应用每个事务开头：SET LOCAL app.org_id = '...';
   ```
   数据库层强制租户隔离，就算代码忘了加 `WHERE org_id = ?` 也查不到别人的数据。适合多租户 SaaS 做兜底。注意：表的所有者默认绕过 RLS（要 `FORCE ROW LEVEL SECURITY`）。
4. **SQL 注入怎么防？** 永远用参数化查询（SQLAlchemy 的绑定参数、`text("... WHERE id = :id")`），不拼字符串。动态表名 / 列名用白名单校验。

### 高难
5. **给 Agent 开放「自然语言查数据库」的能力，怎么保证安全？**（AI 岗高频）
   - 专用只读账号，只授权必要的表 / 视图（最好是专门建的视图，屏蔽敏感列）；
   - 事务设为只读：`SET TRANSACTION READ ONLY` 或 `default_transaction_read_only = on`；
   - `statement_timeout` 防止慢查询拖垮库；结果集强制 LIMIT；
   - 多租户靠 RLS 兜底，而不是靠模型生成的 SQL 记得加条件；
   - 走从库，不碰主库；
   - SQL 先 `EXPLAIN` 预估代价，太贵的拒绝。
   我们的企业数据库查数走的是独立的查询服务 + 后台任务（提交即返回，Agent 再轮询结果），不阻塞对话。

---

## 十五、扩展生态

| 扩展 | 用途 |
|---|---|
| `pg_stat_statements` | SQL 级别的耗时统计，**排查慢 SQL 必装** |
| `auto_explain` | 自动记录慢查询的执行计划 |
| `pgvector` | 向量类型 + HNSW / IVFFlat 索引，做 RAG 可以不引入额外向量库 |
| `pg_trgm` | 模糊匹配、相似度、加速 `LIKE '%x%'` |
| `zhparser` / `pg_jieba` | 中文分词，配合内置全文检索 |
| `PostGIS` | 地理信息，业界最强的开源 GIS |
| `pgcrypto` | 加解密；`gen_random_uuid()` PG13 起已内置 |
| `pg_partman` | 自动管理分区 |
| `pg_cron` | 数据库内定时任务 |
| `pg_repack` | 在线重建表 / 索引，消除膨胀 |
| `pgstattuple` | 查看表和索引的真实膨胀率 |
| `hypopg` | 假设索引 |
| `postgres_fdw` | 跨库 / 跨实例查询外部表 |
| `TimescaleDB` | 时序数据 |
| `Citus` | 分布式 / 分片 |

**全文检索怎么做？**
```sql
ALTER TABLE docs ADD COLUMN tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('chinese', title || ' ' || body)) STORED;  -- 需要中文分词配置
CREATE INDEX ON docs USING gin (tsv);
SELECT * FROM docs WHERE tsv @@ plainto_tsquery('chinese', '向量检索');
```
和 Elasticsearch 比：PG 全文检索够用于中小规模、和业务数据同库同事务；ES 在大规模、复杂相关性排序、聚合分析上更强。

**pgvector 怎么用？**
```sql
CREATE EXTENSION vector;
CREATE TABLE chunks (id bigserial, embedding vector(1024), org_id uuid, content text);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
SELECT id, content FROM chunks WHERE org_id = $1
ORDER BY embedding <=> $2 LIMIT 10;   -- <=> 余弦距离
```
难点：带过滤条件时 HNSW 先找最近的再过滤，可能过滤后不够 10 条（新版本有迭代扫描 `hnsw.iterative_scan` 缓解）。和 Qdrant 的取舍见 05 场景 10。

---

## 十六、监控与排查

### 中等
1. **日常要看哪些视图？**
   | 视图 | 看什么 |
   |---|---|
   | `pg_stat_activity` | 当前所有连接在干什么、等什么、事务开了多久 |
   | `pg_stat_statements` | 哪些 SQL 最耗时 |
   | `pg_stat_user_tables` | 顺序扫描次数、死元组数、上次 vacuum / analyze 时间 |
   | `pg_stat_user_indexes` | 索引使用次数（找没用的索引） |
   | `pg_statio_user_tables` | 缓存命中情况 |
   | `pg_locks` | 锁 |
   | `pg_stat_replication` | 复制延迟 |
   | `pg_stat_bgwriter` / `pg_stat_checkpointer` | 检查点和刷盘 |
2. **缓存命中率怎么算？** `sum(blks_hit) / sum(blks_hit + blks_read)` from `pg_stat_database`，OLTP 一般要 99% 以上。
3. **找出表上全表扫描很多的表？** `pg_stat_user_tables` 里 `seq_scan` 大、`seq_tup_read` 大、表又很大的 → 可能缺索引。

### 高难
4. **CPU 突然 100% 怎么排查？**
   1. `pg_stat_activity` 看哪些查询 `state = 'active'` 且跑了很久；
   2. `top` 找到最耗 CPU 的 backend 进程 pid，对应 `pg_stat_activity.pid` 找到 SQL；
   3. 常见原因：缺索引导致大量全表扫描、执行计划变了、某个新上线的接口在循环里查库（N+1）、大量并发连接争用；
   4. 应急：`pg_cancel_backend` 取消问题查询，限流问题接口；然后修根因。
5. **磁盘 IO 打满？** 检查点太频繁、autovacuum 在扫大表、大查询排序写临时文件（`log_temp_files` 记录）、全表扫描。

---

## 十七、SQL 写法

### 中等
1. **upsert**：`INSERT ... ON CONFLICT (uk) DO UPDATE SET v = EXCLUDED.v` 或 `DO NOTHING`。PG15 还有标准 `MERGE`。
2. **`RETURNING`**：`INSERT ... RETURNING id`、`UPDATE ... RETURNING *`，一条语句拿回结果，不用再查一次。MySQL 没有（MariaDB 有）。
3. **`DISTINCT ON`**：每组取一条，`SELECT DISTINCT ON (user_id) * FROM msgs ORDER BY user_id, created_at DESC;`
4. **`FILTER`**：条件聚合，`count(*) FILTER (WHERE status = 'done')`。
5. **`LATERAL`**：对外层每一行执行一次子查询（「每个用户最近 3 条消息」）：
   ```sql
   SELECT u.id, m.* FROM users u
   CROSS JOIN LATERAL (SELECT * FROM msgs WHERE user_id = u.id ORDER BY created_at DESC LIMIT 3) m;
   ```
6. **`generate_series`**：生成序列，做「补齐没有数据的日期」报表。
7. **递归 CTE**：查组织树、评论楼层。
   ```sql
   WITH RECURSIVE tree AS (
     SELECT id, parent_id, name FROM depts WHERE id = $1
     UNION ALL
     SELECT d.id, d.parent_id, d.name FROM depts d JOIN tree t ON d.parent_id = t.id
   ) SELECT * FROM tree;
   ```
8. **物化视图**：`CREATE MATERIALIZED VIEW ... ; REFRESH MATERIALIZED VIEW CONCURRENTLY mv;`（CONCURRENTLY 不阻塞读，但要求有唯一索引）。适合看板统计。
9. **生成列**：`total numeric GENERATED ALWAYS AS (price * qty) STORED`。
10. **`LISTEN / NOTIFY`**：数据库内的轻量消息通知，可以做缓存失效通知。不持久化，连接断开期间的消息会丢。
11. **批量插入最快的方式**：`COPY`（比多行 INSERT 快很多）；Python 里 psycopg 的 `copy_expert` / psycopg3 的 `cursor.copy()`。
12. **删除大量数据**：分批删 `DELETE ... WHERE id IN (SELECT id ... LIMIT 10000)` 循环，避免一个超大事务；能用分区的直接 DROP 分区。

---

## 十八、综合场景（面试官出题，你按框架答）

> 05 文档已有 11 个：在线 DDL、表膨胀、回卷、计划变差、日志大表分区、热点行、连接打满、读写分离、Serializable 重试、pgvector vs Qdrant、误删恢复。下面是补充的。

### 场景 A：设计一张存 Agent 对话消息的表，预计一年 5 亿条
- **先估算**：一条消息平均 2KB（含工具结果），5 亿 × 2KB ≈ 1TB，单表单机能放下但要分区。
- **表设计**：
  - 主键 `id`（UUID v7，有序）；`session_id`、`org_id`、`role`、`created_at` 独立成列；内容 `content text`，大的工具结果放对象存储只存路径；
  - 按 `created_at` 月分区；
  - 索引 `(session_id, created_at)`，满足「读一个会话的全部消息」这个最主要的查询；
- **写入**：每轮追加，不更新（避免膨胀）；
- **读取**：按会话读，天然命中单个分区（会话通常不跨月）；
- **老数据**：超过一年的分区 DETACH 后归档到对象存储；
- **统计分析**：不在主库上跑，同步到分析库。

### 场景 B：秒杀扣库存，PG 怎么做
- 方案 1：`UPDATE stock SET n = n - 1 WHERE id = $1 AND n > 0 RETURNING n;`，影响行数为 0 就是卖完了。简单，但热点行串行，几百 QPS 上限。
- 方案 2：Redis 预扣（Lua 原子判断 + 扣减）→ 成功的请求进队列 → 异步写 PG。PG 只承担最终落单。
- 方案 3：库存分段（一个商品拆成 10 行，每行 1/10 库存），请求随机选一行扣，减少冲突。
- 一致性：Redis 和 PG 的对账任务兜底。

### 场景 C：一个报表查询 30 秒，要优化到 1 秒内
1. EXPLAIN ANALYZE 找最慢的节点；
2. 加合适的索引（复合 / 覆盖 / 部分）；
3. 改写：避免 `SELECT *`、相关子查询改 JOIN 或 LATERAL、`OR` 改 `UNION ALL`；
4. 调 `work_mem` 让排序和哈希在内存里完成；
5. 还不够 → 预聚合：物化视图定时刷新，或者写入时维护汇总表；
6. 再不够 → 报表走从库 / 分析库（ClickHouse），不和在线业务抢资源。

### 场景 D：从 MySQL 迁移到 PG，要注意什么？
- 类型映射：`TINYINT(1)` → `boolean`、`DATETIME` → `timestamp`、`AUTO_INCREMENT` → `IDENTITY`、`unsigned` 没有（要扩大类型或加 CHECK）；
- 大小写：PG 不加引号的标识符一律转小写，MySQL 的驼峰列名迁过来要统一；
- 默认隔离级别不同（RR → RC），依赖 RR 行为的代码要检查；
- `GROUP BY` 更严格（select 的非聚合列必须在 group by 里）；
- 字符串比较默认区分大小写；空字符串和 NULL 不同；
- 工具：pgloader；或用 Debezium / Canal 做双写同步，灰度切流。
- 这道题正好能体现你两边都懂。

### 场景 E：业务要求「同一个用户同时只能有 3 个对话在生成」，怎么保证？
- 只靠 `SELECT count(*) ... WHERE status = 'generating'` 再插入：并发下两个请求都读到 2，各自插入 → 4 个。经典的「检查后执行」竞态。
- 方案：
  1. 对用户加咨询锁 `pg_advisory_xact_lock(hashtext(user_id))`，在锁内检查 + 插入；
  2. 或者 `SELECT ... FROM users WHERE id = $1 FOR UPDATE` 锁住用户行作为互斥点；
  3. 或者 Serializable 隔离级别 + 重试；
  4. 或者放到 Redis：ZSet 做带租约的信号量（我们的并发限流就是这么做的，进程崩了租约到期自动释放）。
- 我们实际的选择：并发额度（按组织 / 用户）在 Redis 里控制，因为一个对话要生成几十分钟，用 PG 的锁就得一直占着一个连接和事务，不现实；Redis 的租约可以脱离连接存在，到期自动释放。
