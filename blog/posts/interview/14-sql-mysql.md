---
title: "SQL 与 MySQL 题库"
lang: zh-CN
date: 2026-10-23
order: 114
category:
  - 面试准备
tag:
  - 面试题
---

# SQL 与 MySQL 题库

> 两部分，各分入门 / 中等 / 高难三档，每档 20 题以上，★ 是高频题。
> SQL 部分的例子按 PostgreSQL 写，和 MySQL 写法不同的地方会标出来；高难手写题都在本地 PG 里跑通过（文末附测试数据）。
> MySQL 是你的老本行，重点是**讲出原理 + 准备你自己的真实案例**；每题尽量顺带说一句 PG 的不同（见 07 文档）。

---

# 第一部分：SQL

## SQL 入门（22 题）

### 1. ★ SQL 语句分几类？
DDL（`CREATE` / `ALTER` / `DROP` / `TRUNCATE`）、DML（`INSERT` / `UPDATE` / `DELETE`）、DQL（`SELECT`）、DCL（`GRANT` / `REVOKE`）、TCL（`BEGIN` / `COMMIT` / `ROLLBACK` / `SAVEPOINT`）。

### 2. ★ SELECT 的逻辑执行顺序？
`FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT`。所以 WHERE 里不能用聚合函数和 SELECT 的别名；ORDER BY 可以用别名。

### 3. 基本查询子句？
```sql
SELECT DISTINCT dept_id, salary AS s FROM employee
WHERE salary > 100 ORDER BY s DESC, dept_id LIMIT 10 OFFSET 20;
```
`DISTINCT` 作用于所有选出的列的组合；`ORDER BY` 默认升序，可以按多列；PG 里 NULL 默认排在升序的最后（`NULLS FIRST / LAST` 可改），MySQL 里 NULL 被当作最小值。

### 4. ★ WHERE 里常用的运算符？
比较（`=`、`<>`、`>`）、`AND` / `OR` / `NOT`、`IN (...)`、`BETWEEN a AND b`（**两端都包含**）、`LIKE`（`%` 任意多个字符、`_` 一个字符）、`IS NULL` / `IS NOT NULL`。PG 的 `ILIKE` 不区分大小写；MySQL 默认的排序规则（`_ci`）本身就不区分大小写。

### 5. ★ 常用的聚合函数？
`COUNT`、`SUM`、`AVG`、`MAX`、`MIN`，PG 还有 `string_agg`、`array_agg`、`bool_and`（MySQL 对应 `GROUP_CONCAT`）。**聚合函数忽略 NULL**（`COUNT(*)` 除外）。

### 6. ★ GROUP BY 有什么规则？
SELECT 里的列要么在 GROUP BY 里，要么在聚合函数里。PG 严格执行；MySQL 5.7 起默认开启 `ONLY_FULL_GROUP_BY` 也严格了（老版本允许，会返回不确定的值）。PG 允许 GROUP BY 主键后选出该表其他列（函数依赖）。

### 7. ★ WHERE 和 HAVING 的区别？
WHERE 在分组前过滤行，不能用聚合函数；HAVING 在分组后过滤组，可以用聚合函数。能放 WHERE 的条件就别放 HAVING（先减少数据量）。

### 8. ★ 各种 JOIN 的区别？
`INNER`（两边都匹配）、`LEFT`（左表全部 + 右表匹配上的，没匹配补 NULL）、`RIGHT`、`FULL OUTER`（两边全部，**MySQL 不支持**，用 LEFT JOIN UNION RIGHT JOIN 模拟）、`CROSS`（笛卡尔积）、自连接。

### 9. ★ LEFT JOIN 时条件写在 ON 和写在 WHERE 有什么区别？
```sql
-- 所有用户，以及他们「已支付」的订单（没有的补 NULL）
SELECT u.id, o.id FROM users u LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid';
-- 只剩「有已支付订单」的用户 —— 实际上变成了 INNER JOIN
SELECT u.id, o.id FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.status = 'paid';
```
ON 是**连接条件**（决定右表哪些行能匹配上），WHERE 是**连接之后的过滤**（右表没匹配上时是 NULL，`NULL = 'paid'` 不成立，行被过滤掉）。

### 10. ★ UNION 和 UNION ALL？
UNION 去重（要排序或哈希，慢），UNION ALL 直接拼接。两边列数和类型要一致。确定不会重复时一律 UNION ALL。

### 11. 子查询有哪几种？
- 标量子查询（返回一个值）：`SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) FROM users u`；
- 行子查询、表子查询（在 FROM 里当派生表）；
- **相关子查询**：子查询引用了外层的列，逻辑上外层每一行执行一次（优化器可能会改写成 JOIN）。

### 12. ★ IN 和 EXISTS 的区别？
- `IN`：先算出子查询结果集，再判断外层的值在不在里面；
- `EXISTS`：对外层每一行，判断子查询有没有返回任何行（找到一行就停）；
- 经验：子查询结果小用 IN，外层小、子查询表大且有索引用 EXISTS；现代优化器（PG、MySQL 8）很多时候会把两者改写成相同的半连接计划；
- **`NOT IN` 和 `NOT EXISTS` 不等价**：子查询结果里有 NULL 时 `NOT IN` 一行都返回不了（见第 15 题）。

### 13. ★ `COUNT(*)`、`COUNT(1)`、`COUNT(列)` 的区别？
前两个统计所有行，性能一样；`COUNT(列)` 只统计该列非 NULL 的行；`COUNT(DISTINCT 列)` 去重计数。

### 14. ★ NULL 有哪些坑？
任何值与 NULL 用 `=`、`<>` 比较结果都是 UNKNOWN（不是 true），WHERE 只保留 true 的行；判断要用 `IS NULL`；`NULL + 1` 是 NULL；聚合忽略 NULL（`AVG` 是非 NULL 值的平均）；`COALESCE(x, 0)` 给默认值；PG 里 `IS DISTINCT FROM` 可以把 NULL 当普通值比较。

### 15. ★ `NOT IN` 遇到 NULL 为什么查不出数据？
`x NOT IN (1, 2, NULL)` 等价于 `x <> 1 AND x <> 2 AND x <> NULL`，最后一项永远是 UNKNOWN，整个条件不可能为 true。所以子查询可能返回 NULL 时，用 `NOT EXISTS` 或者在子查询里加 `WHERE col IS NOT NULL`。

### 16. CASE WHEN 怎么用？
```sql
SELECT name, CASE WHEN score >= 90 THEN 'A' WHEN score >= 60 THEN 'B' ELSE 'C' END AS level FROM students;
SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) FROM orders;   -- 条件聚合
```

### 17. ★ 有哪些约束？主键和唯一约束的区别？
`PRIMARY KEY`、`UNIQUE`、`NOT NULL`、`CHECK`、`FOREIGN KEY`、`DEFAULT`。主键 = 唯一 + 非空，一张表一个；唯一约束可以多个、允许 NULL（多个 NULL 不算重复）。

### 18. ★ DELETE、TRUNCATE、DROP 的区别？
DELETE 逐行删、可加 WHERE、可回滚、触发触发器、不重置自增；TRUNCATE 清空整表、快、重置自增、MySQL 里不能回滚（隐式提交），**PG 里可以在事务里回滚**；DROP 连表结构一起删。

### 19. ★ 数据库三大范式？
1NF 列不可再分；2NF 非主键列完全依赖整个主键（不能只依赖联合主键的一部分）；3NF 非主键列不传递依赖于主键。反范式：为了查询性能有意冗余，代价是要同步更新。

### 20. 视图是什么？
保存起来的查询，像表一样使用，不存数据（物化视图存）。用途：简化复杂查询、权限控制（只暴露部分列和行）、保持接口兼容（表结构变了视图不变）。

### 21. ★ 事务的四个特性和四个隔离级别？
ACID：原子性、一致性、隔离性、持久性。隔离级别：读未提交、读已提交（PG 默认）、可重复读（MySQL 默认）、可串行化。并发问题：脏读、不可重复读、幻读。

### 22. CHAR 和 VARCHAR？
CHAR 定长（不足补空格），VARCHAR 变长（MySQL 里另外用 1–2 个字节存长度）。MySQL 里定长的短字段（MD5、手机号）用 CHAR 略好；PG 里没有性能区别，一般用 `text`。

---

## SQL 中等（22 题）

### 1. ★ 窗口函数是什么？和 GROUP BY 有什么区别？
窗口函数对「与当前行相关的一组行」做计算，但**不把行合并**：每一行都保留，并多出一个计算结果。GROUP BY 把每组合成一行。语法：
```sql
函数() OVER (PARTITION BY 分组列 ORDER BY 排序列 ROWS BETWEEN ... AND ...)
```
MySQL 8.0 才支持窗口函数。

### 2. ★ ROW_NUMBER、RANK、DENSE_RANK 的区别？
分数 100、100、90：`ROW_NUMBER` → 1、2、3（同分也不同号）；`RANK` → 1、1、3（同分同号，跳号）；`DENSE_RANK` → 1、1、2（不跳号）。

### 3. ★ LAG 和 LEAD？
取当前行前面 / 后面第 n 行的值：`LAG(amount) OVER (ORDER BY day)` 是前一天的金额，用于环比、计算相邻事件的时间间隔。

### 4. 窗口帧（ROWS BETWEEN）怎么用？
```sql
AVG(amount) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)   -- 近 7 天滑动平均
SUM(amount) OVER (ORDER BY day)                                            -- 累计和
```
注意：有 ORDER BY 但不写帧时，默认帧是 `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`（值相同的行会被算进同一个帧里），要按行精确计算时写明 `ROWS`。

### 5. ★ 每组取前 N 条怎么写？
```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employee
) t WHERE rn <= 3;
```
窗口函数不能直接写在 WHERE 里（WHERE 先于 SELECT 执行），要包一层。PG 只取每组第一条可以用 `DISTINCT ON`；PG 也可以用 `LATERAL`。

### 6. ★ CTE（WITH）有什么用？和子查询的区别？
让复杂查询分步骤写，可读性好；同一个 CTE 可以引用多次；支持递归（`WITH RECURSIVE`）。PG 12 以前 CTE 必定物化（不能把外层条件推进去，可能变慢），12 起默认可以内联。MySQL 8.0 起支持 CTE。

### 7. ★ 递归 CTE 怎么查树形结构？
```sql
WITH RECURSIVE sub AS (
  SELECT id, parent_id, name, 1 AS depth FROM depts WHERE id = 1      -- 起点
  UNION ALL
  SELECT d.id, d.parent_id, d.name, s.depth + 1
  FROM depts d JOIN sub s ON d.parent_id = s.id                        -- 每次往下一层
) SELECT * FROM sub;
```
要防止数据里有环导致无限递归（加深度上限，或 PG14 的 `CYCLE` 子句）。

### 8. ★ 行转列和列转行？
- 行转列（每个用户一行、每个月一列）：条件聚合 `SUM(CASE WHEN month = 1 THEN amount END)`，PG 可以写 `SUM(amount) FILTER (WHERE month = 1)`；
- 列转行：`UNION ALL` 拼接，或 PG 的 `unnest(ARRAY[...])` / `LATERAL (VALUES ...)`。

### 9. ★ 删除重复数据，只保留一条？
```sql
-- PG
DELETE FROM users a USING users b WHERE a.email = b.email AND a.id > b.id;
-- 通用（窗口函数）
DELETE FROM users WHERE id IN (
  SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) rn FROM users) t WHERE rn > 1
);
```
MySQL 不能在 DELETE 的子查询里直接引用被删的表，要多包一层派生表或用 `DELETE a FROM users a JOIN users b ...`。删完记得加唯一约束防止再出现。

### 10. ★ 分页怎么写？深分页为什么慢？
`LIMIT 20 OFFSET 100000` 要先扫过并丢弃前 10 万行。优化：**游标分页**（keyset）`WHERE id < 上一页最后的id ORDER BY id DESC LIMIT 20`；MySQL 还可以「延迟关联」：先在覆盖索引上查出 id，再 JOIN 回表取整行。

### 11. 自连接的例子？
员工和经理在同一张表：`SELECT e.name, m.name AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id;`。找「工资比经理高的员工」就在这个基础上加条件。

### 12. ★ 半连接和反连接？
半连接：左表中在右表**有**匹配的行（`EXISTS` / `IN`），结果不会因为右表多条匹配而重复；反连接：左表中在右表**没有**匹配的行（`NOT EXISTS`，或 `LEFT JOIN ... WHERE 右.id IS NULL`）。「从没下过单的用户」是典型的反连接。

### 13. ★ 什么样的 SQL 写法会让索引失效？
对索引列用函数或运算（`WHERE date(created_at) = ...` → 改成范围 `created_at >= ... AND created_at < ...`）；隐式类型转换（字符串列和数字比较）；`LIKE '%xx'` 前导通配符；`OR` 连接了没有索引的列；联合索引不满足最左前缀；`!=` / `NOT IN` 可能导致选择走全表扫描；优化器估计返回行太多。

### 14. ★ upsert（存在就更新、不存在就插入）怎么写？
```sql
-- PG
INSERT INTO stats (day, cnt) VALUES ('2026-10-21', 1)
ON CONFLICT (day) DO UPDATE SET cnt = stats.cnt + EXCLUDED.cnt;
-- MySQL
INSERT INTO stats (day, cnt) VALUES ('2026-10-21', 1) ON DUPLICATE KEY UPDATE cnt = cnt + VALUES(cnt);
```
冲突的列上必须有唯一约束。这是解决「先查后插」并发竞态的标准写法。

### 15. 批量插入怎么快？
多行 `INSERT ... VALUES (...), (...)`（一次几百到几千行）；放在一个事务里；PG 用 `COPY`，MySQL 用 `LOAD DATA INFILE`；超大批量导入时先删索引、导完再建。

### 16. GROUP BY 的高级用法？
`GROUP BY ROLLUP (year, month)`：同时出按年月、按年、总计三层小计；`CUBE`：所有维度组合；`GROUPING SETS ((a), (b), ())`：指定几种组合。做报表很好用。MySQL 支持 `WITH ROLLUP`。

### 17. 常用的日期和字符串函数？
- 日期：`now()`、`date_trunc('day', ts)`（PG）/ `DATE(ts)`（MySQL）、`ts + interval '1 day'`、`extract(hour from ts)`、`to_char(ts, 'YYYY-MM-DD')`（PG）/ `DATE_FORMAT`（MySQL）；
- 字符串：`length`、`substring`、`concat` / `||`、`lower` / `upper`、`trim`、`replace`、`split_part`（PG）、`position`。

### 18. ★ 怎么防止除以零？
`a / NULLIF(b, 0)`：b 为 0 时返回 NULL 而不是报错；需要显示 0 再套 `COALESCE(..., 0)`。PG 里整数相除会截断（`1 / 2 = 0`），要转成 numeric：`a::numeric / b`。

### 19. ★ 怎么看一条 SQL 的执行计划？
PG：`EXPLAIN (ANALYZE, BUFFERS)`；MySQL：`EXPLAIN`（8.0.18 起有 `EXPLAIN ANALYZE`）。重点看：有没有全表扫描、用了哪个索引、预估行数和实际行数差多少、有没有额外的排序和临时表。

### 20. 并发下「先查再插」有什么问题？
两个请求同时查到「不存在」，各自插入，结果重复。解决：唯一约束 + upsert；或者 `SELECT ... FOR UPDATE` 锁住相关行（但锁不住「还不存在的行」，MySQL RR 下靠间隙锁能锁住范围，PG 没有间隙锁）；或者可串行化隔离级别 + 重试。

### 21. 字段类型选择有什么原则？
够用就好、越小越好（`int` 够就别用 `bigint`，主键例外，主键直接 bigint 防止将来不够）；金额用 `decimal / numeric`；时间用时间类型而不是字符串；能用 NOT NULL 就加（NULL 让查询和索引更复杂）；状态值用短整数或短字符串加 CHECK 约束。

### 22. 什么情况下用临时表？
复杂报表的中间结果要多次使用、一条 SQL 太复杂优化器处理不好时，把中间结果落到临时表（`CREATE TEMP TABLE`），可以在上面建索引。会话结束自动删除。

---

## SQL 高难（手写题 + 优化，22 题）

> 下面的 SQL 都在本地 PostgreSQL 里跑通过，测试数据在本部分末尾。MySQL 8.0 绝大部分可以直接用，个别语法标出来了。

### 1. ★ 第 N 高的薪水（N = 2），没有则返回 NULL
```sql
SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS nth;
```
外面包一层标量子查询是为了「没有结果时返回 NULL」而不是空结果集。

### 2. ★ 连续登录至少 3 天的用户
```sql
SELECT user_id, MIN(d) AS start_day, COUNT(*) AS days
FROM (
  SELECT user_id, d, d - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d))::int AS grp
  FROM (SELECT DISTINCT user_id, login_at::date AS d FROM logins) x
) t
GROUP BY user_id, grp HAVING COUNT(*) >= 3;
```
思路（gaps and islands）：连续的日期减去连续的行号，得到的值相同，按它分组即可。MySQL 写 `DATE_SUB(d, INTERVAL rn DAY)`。

### 3. ★ 次日留存率
```sql
SELECT a.d, ROUND(COUNT(DISTINCT b.user_id)::numeric / COUNT(DISTINCT a.user_id), 2) AS retention
FROM (SELECT DISTINCT user_id, login_at::date d FROM logins) a
LEFT JOIN (SELECT DISTINCT user_id, login_at::date d FROM logins) b
  ON a.user_id = b.user_id AND b.d = a.d + 1
GROUP BY a.d ORDER BY a.d;
```

### 4. ★ 近 7 天滑动平均、累计和、环比
```sql
SELECT day, amount,
       SUM(amount) OVER (ORDER BY day) AS running_total,
       ROUND(AVG(amount) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS ma7,
       amount - LAG(amount) OVER (ORDER BY day) AS diff
FROM daily_sales ORDER BY day;
```

### 5. ★ 中位数
```sql
-- PG
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) FROM employee;
-- 通用写法（MySQL 8 也能用）
SELECT AVG(salary) FROM (
  SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) rn, COUNT(*) OVER () cnt FROM employee
) t WHERE rn IN (FLOOR((cnt + 1) / 2.0), FLOOR((cnt + 2) / 2.0));
```

### 6. ★ 会话切分：用户两次行为间隔超过 30 分钟算新会话，统计每个会话的时长
```sql
SELECT user_id, session_no, MIN(ts) AS start_at, MAX(ts) AS end_at, COUNT(*) AS events
FROM (
  SELECT user_id, ts,
         SUM(is_new) OVER (PARTITION BY user_id ORDER BY ts) AS session_no
  FROM (
    SELECT user_id, ts,
           CASE WHEN ts - LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) <= interval '30 minutes'
                THEN 0 ELSE 1 END AS is_new
    FROM events
  ) a
) b
GROUP BY user_id, session_no ORDER BY user_id, session_no;
```
思路：先用 LAG 标记「新会话的开始」，再用累计求和给每个会话编号。这个模式（**标记 + 累计和**）能解决很多「按条件切段」的问题。

### 7. ★ 各动作覆盖人数：浏览 / 加购 / 下单（非严格顺序漏斗）
```sql
SELECT COUNT(DISTINCT user_id) FILTER (WHERE action = 'view')  AS viewed,
       COUNT(DISTINCT user_id) FILTER (WHERE action = 'cart')  AS carted,
       COUNT(DISTINCT user_id) FILTER (WHERE action = 'order') AS ordered
FROM user_actions;
```
严格漏斗要按顺序选事件：先找到有效浏览，再找其后首次加购，再找其后首次下单。分别取每类动作的全局最早时间可能漏掉后续合法序列，例如先加购、后浏览、再加购；还需定义转化窗口和同时间事件的排序。MySQL 用 `COUNT(DISTINCT CASE WHEN action = 'view' THEN user_id END)`。

### 8. ★ 每个用户的首单
```sql
SELECT DISTINCT ON (user_id) user_id, id AS order_id, created_at
FROM orders ORDER BY user_id, created_at, id;            -- PG 专有写法，MySQL 用 ROW_NUMBER
```

### 9. 找出不连续的 ID（缺失的编号区间）
```sql
SELECT id + 1 AS gap_start, next_id - 1 AS gap_end
FROM (SELECT id, LEAD(id) OVER (ORDER BY id) AS next_id FROM tickets) t
WHERE next_id - id > 1;
```

### 10. ★ 互相关注的用户对
```sql
SELECT a.follower, a.followee FROM follows a
JOIN follows b ON a.follower = b.followee AND a.followee = b.follower
WHERE a.follower < a.followee;                        -- 每对只输出一次
```

### 11. 部门工资最高的员工（含并列）
```sql
SELECT d.name AS dept, e.name, e.salary FROM employee e JOIN dept d ON d.id = e.dept_id
WHERE (e.dept_id, e.salary) IN (SELECT dept_id, MAX(salary) FROM employee GROUP BY dept_id);
```

### 12. 同比、环比（按月）
```sql
SELECT month, amount,
       amount - LAG(amount, 1)  OVER (ORDER BY month) AS mom,     -- 环比：比上个月
       amount - LAG(amount, 12) OVER (ORDER BY month) AS yoy      -- 同比：比去年同月（数据要连续）
FROM monthly_sales;
```
数据可能有缺月时，用 `generate_series` 先补齐月份，或者直接自连接 `ON b.month = a.month - interval '1 year'`。

### 13. ★ 并发安全的计数 / 扣库存怎么写？
```sql
UPDATE stock SET n = n - 1 WHERE id = $1 AND n > 0 RETURNING n;   -- 影响 0 行就是卖完了
```
不要「先 SELECT 出库存、在代码里减一、再 UPDATE 回去」—— 并发下会超卖。

### 14. ★ 乐观锁的 SQL？
```sql
UPDATE cards SET title = $1, version = version + 1 WHERE id = $2 AND version = $3;
```
影响行数为 0 说明被别人改过了，重新读取再重试。

### 15. ★ 慢 SQL 的常见改写手法？
- `OR` 改 `UNION ALL`（让两个条件各自走索引）；
- 相关子查询改 JOIN 或 `LATERAL`；
- `SELECT *` 改成只选需要的列（可能用上覆盖索引）；
- 对索引列的函数挪到常量一侧（`WHERE created_at >= '2026-10-01'` 而不是 `WHERE date(created_at) = ...`）；
- 大 `IN` 列表改成 JOIN 一个临时表 / `VALUES` 列表；
- `COUNT(*)` 精确值改成近似值或预聚合；
- 深分页改游标分页。

### 16. 大表之间 JOIN 很慢，怎么优化？
确认 JOIN 列两边都有索引、类型和字符集一致（不一致会隐式转换导致索引失效）；先过滤再 JOIN（缩小两边的数据量）；看执行计划的连接方式是否合理；只选需要的列；必要时冗余字段避免 JOIN，或预先算好宽表；分析型查询放到分析库。

### 17. 一个 GROUP BY 在某个值上特别慢（数据倾斜）？
某个分组的数据量远大于其他（比如一个大客户占了 80% 的数据）。在单机数据库里主要是索引和统计信息的问题；在分布式计算（Spark、Hive）里会导致个别任务特别慢，常用「加随机前缀两阶段聚合」：先按 `key + 随机数` 局部聚合，再去掉随机数做最终聚合。

### 18. 去重计数（UV）在大数据量下很慢？
`COUNT(DISTINCT)` 要排序或哈希全部值。优化：预聚合（每天的 UV 落一张表）；近似计数（HyperLogLog：PG 的 `hll` 扩展、ClickHouse 的 `uniq`、Redis 的 `PFCOUNT`）误差 1% 以内、速度快几个数量级。

### 19. 分库分表之后，分页和排序怎么做？
- 全局排序分页：每个分片都取前 `offset + limit` 条，在中间层合并排序再截取 —— offset 越大越慢（「深分页」问题被放大 N 倍）；
- 改进：禁止跳页，用游标分页（每个分片按上一页最后的排序值往后取 limit 条再合并）；
- 或者把需要全局排序和查询的数据同步到 Elasticsearch / 分析库里查。

### 20. ★ SQL 注入是怎么发生的？怎么防？
```python
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")    # name 传入 ' OR '1'='1 就拿到全部数据
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))  # 参数化：数据库把参数当值，不当 SQL
```
永远参数化；ORM 默认参数化，但拼接 `text()` 时一样会被注入；表名、列名、排序字段不能参数化的，用**白名单**校验；数据库账号最小权限。

### 21. ★ 一张表有 created_at 和 status，查询 `WHERE status = 'pending' ORDER BY created_at LIMIT 20` 很慢，怎么建索引？
建联合索引 `(status, created_at)`：等值条件列在前、排序列在后，这样索引里同一个 status 的数据已经按 created_at 排好序，直接顺序取 20 条，不需要排序。如果 pending 只占一小部分，PG 可以用部分索引 `CREATE INDEX ON t (created_at) WHERE status = 'pending'`，更小更快。

### 22. 怎么设计一个支持「按任意字段组合筛选」的列表接口而不把数据库查崩？
- 限制可筛选的字段（白名单），对高频组合建联合索引；
- 必须带上高选择性的条件（时间范围、租户 ID）；
- 分页用游标、限制最大页数和每页条数；
- 设置语句超时；
- 真正需要「任意字段组合 + 全文搜索 + 聚合」时，同步到 Elasticsearch 查。

### 测试数据（PG）
```sql
CREATE TABLE dept(id int, name text);
CREATE TABLE employee(id int, name text, salary int, dept_id int);
CREATE TABLE logins(user_id int, login_at timestamp);
CREATE TABLE daily_sales(day date, amount int);
CREATE TABLE events(user_id int, ts timestamp);
CREATE TABLE user_actions(user_id int, action text, ts timestamp);
CREATE TABLE orders(id int, user_id int, created_at timestamp);
CREATE TABLE tickets(id int);
CREATE TABLE follows(follower int, followee int);
CREATE TABLE monthly_sales(month date, amount int);
INSERT INTO dept VALUES (1,'A'),(2,'B');
INSERT INTO employee VALUES (1,'a',100,1),(2,'b',200,1),(3,'c',200,1),(4,'d',50,1),(5,'e',300,2);
INSERT INTO logins VALUES (1,'2026-01-01 10:00'),(1,'2026-01-02 09:00'),(1,'2026-01-03 08:00'),(2,'2026-01-01 08:00');
INSERT INTO daily_sales VALUES ('2026-01-01',10),('2026-01-02',15),('2026-01-03',5);
INSERT INTO events VALUES (1,'2026-01-01 10:00'),(1,'2026-01-01 10:20'),(1,'2026-01-01 11:30'),(2,'2026-01-01 09:00');
INSERT INTO user_actions VALUES (1,'view',now()),(1,'cart',now()),(1,'order',now()),(2,'view',now()),(3,'view',now()),(3,'cart',now());
INSERT INTO orders VALUES (1,1,'2026-01-02'),(2,1,'2026-01-01'),(3,2,'2026-01-05');
INSERT INTO tickets VALUES (1),(2),(5),(6),(9);
INSERT INTO follows VALUES (1,2),(2,1),(1,3),(3,4),(4,3);
INSERT INTO monthly_sales SELECT generate_series('2025-01-01'::date,'2026-01-01','1 month'), 10;
```

---

# 第二部分：MySQL

## MySQL 入门（22 题）

### 1. ★ MySQL 的整体架构？一条 SELECT 是怎么执行的？
Server 层：**连接器**（认证、权限、管理连接）→（8.0 已删除查询缓存）→ **分析器**（词法、语法分析）→ **优化器**（选索引、定连接顺序）→ **执行器**（调用存储引擎接口逐行取数据）。存储引擎层：InnoDB（默认）、MyISAM 等，插件式。

### 2. ★ InnoDB 和 MyISAM 的区别？
| | InnoDB | MyISAM |
|---|---|---|
| 事务 | 支持 | 不支持 |
| 锁 | **行锁** | 表锁 |
| 外键 | 支持 | 不支持 |
| 崩溃恢复 | 有（redo log） | 容易损坏 |
| 索引 | **聚簇索引**（数据和主键索引在一起） | 非聚簇（索引和数据分开存） |
| `COUNT(*)` | 要扫描 | 直接存了行数 |
现在一律用 InnoDB。

### 3. ★ 常用数据类型怎么选？
整数 `tinyint`（1 字节）/ `int`（4）/ `bigint`（8）；金额 `decimal(M,D)`；字符串 `varchar(n)`（n 是字符数）；大文本 `text`；时间 `datetime`（8 字节，与时区无关，范围到 9999 年）/ `timestamp`（4 字节，存 UTC、按会话时区显示，**2038 年问题**）；JSON 类型（5.7+）。

### 4. ★ `utf8` 和 `utf8mb4` 的区别？
MySQL 的 `utf8` 其实是 `utf8mb3`，每个字符最多 3 字节，**存不了 emoji 和部分生僻字**；`utf8mb4` 才是完整的 UTF-8（最多 4 字节）。8.0 默认 utf8mb4。排序规则（collation）：`utf8mb4_general_ci`（快、不太准）、`utf8mb4_unicode_ci`、`utf8mb4_0900_ai_ci`（8.0 默认）；`_ci` 表示不区分大小写，`_bin` 按二进制比较。

### 5. ★ 主键用自增还是 UUID？
InnoDB 数据按主键顺序存在 B+ 树里：**自增主键**顺序追加，页写满再开新页，紧凑高效；**随机 UUID** 每次插到树的随机位置，频繁页分裂、空间碎片多、缓存命中差，而且 36 字节的字符串主键会让所有二级索引都变大（二级索引存主键值）。分布式需要全局 ID 时用雪花算法或有序的 UUID（v7）。

### 6. ★ 索引有哪些类型？
按数据结构：B+ 树索引（默认）、哈希索引（Memory 引擎；InnoDB 有自适应哈希索引，自动建）、全文索引。按功能：主键索引、唯一索引、普通索引、联合索引、前缀索引。

### 7. ★ 聚簇索引和二级索引？
- **聚簇索引**：叶子节点存**整行数据**，就是主键索引，一张表只有一个（没有主键时用第一个非空唯一索引，再没有就用隐藏的 row_id）；
- **二级索引**（辅助索引）：叶子节点存**索引列 + 主键值**。

### 8. ★ 什么是回表？
通过二级索引找到主键值后，再去聚簇索引里按主键查整行。查询的列不全在二级索引里时就要回表，回表次数多（返回行数多）时，优化器可能干脆选择全表扫描。

### 9. ★ 什么是覆盖索引？
查询需要的列全部包含在某个索引里，不用回表。`EXPLAIN` 的 Extra 显示 `Using index`。例如索引 `(user_id, status)`，查询 `SELECT status FROM orders WHERE user_id = 1` 就是覆盖索引。

### 10. ★ 什么是最左前缀原则？
联合索引 `(a, b, c)` 按 a 排序、a 相同按 b、b 相同按 c。所以能用上索引的条件是从最左边的列开始连续匹配：`a`、`a, b`、`a, b, c` 可以；`b`、`c`、`b, c` 不行；`a, c` 只能用到 a。遇到范围查询（`a > 1`）后，后面的列就不能再用于定位（8.0 的索引跳跃扫描是例外情况）。

### 11. ★ MySQL 默认的隔离级别？
**可重复读（RR）**。在 RR 下通过 MVCC 和临键锁很大程度上避免了幻读。（PG 默认是读已提交）

### 12. ★ MVCC 是什么？（简述）
多版本并发控制：每行有隐藏的事务 ID 和回滚指针，旧版本通过 undo log 串成版本链；读的时候根据 **ReadView** 判断该读哪个版本。效果：**读不加锁、读写不互相阻塞**。

### 13. ★ MySQL 有哪几种重要的日志？
- **redo log**（InnoDB）：物理日志，记录「某页做了什么修改」，保证**崩溃恢复**（持久性）；
- **undo log**（InnoDB）：记录修改前的值，用于**回滚**和 **MVCC**；
- **binlog**（Server 层）：逻辑日志，记录所有修改，用于**主从复制**和**数据恢复**；
- 其他：慢查询日志、错误日志、通用查询日志、relay log（从库）。

### 14. ★ 主从复制的基本流程？
主库把变更写入 binlog → 从库的 IO 线程拉取 binlog 写到本地 relay log → 从库的 SQL 线程重放 relay log。默认是**异步**的，所以有主从延迟。

### 15. ★ 怎么开启和分析慢查询日志？
`slow_query_log = ON`、`long_query_time = 1`（秒）、`log_queries_not_using_indexes`。用 `mysqldumpslow` 或 `pt-query-digest` 按耗时、次数汇总分析。

### 16. ★ EXPLAIN 要看哪些字段？
`type`（访问类型，从好到差：`system` > `const` > `eq_ref` > `ref` > `range` > `index` > `ALL`，至少要到 range）、`key`（实际用的索引）、`rows`（预估扫描行数）、`Extra`（`Using index` 覆盖索引好、`Using where`、`Using filesort` 额外排序、`Using temporary` 临时表，后两个要注意）。

### 17. `COUNT(*)` 在 InnoDB 里是怎么执行的？
因为 MVCC，每个事务看到的行数可能不同，InnoDB 不存总行数，要遍历。优化器会选**最小的二级索引**去扫（比扫聚簇索引读的页少）。需要频繁计数的场景用计数表或 Redis。

### 18. 自增主键为什么会不连续？
插入失败（唯一键冲突）或事务回滚时，已分配的自增值不会归还；批量插入时按批预申请；8.0 以前自增值存在内存里，重启后按 `max(id) + 1` 重新计算（8.0 起持久化）。

### 19. ★ `datetime` 和 `timestamp` 怎么选？
`timestamp` 存 UTC、会按连接的时区转换，范围只到 2038 年；`datetime` 存什么就是什么，范围大。跨时区业务用 timestamp 或者统一存 UTC 的 datetime；只服务一个时区的业务用 datetime 最简单（我们现在的项目也是统一存东八区的不带时区时间，思路一样：**统一一种口径**）。

### 20. 前缀索引是什么？
只对字符串的前 n 个字符建索引：`INDEX(email(10))`，节省空间。缺点：不能用于 ORDER BY 和覆盖索引。选 n 的方法：让 `COUNT(DISTINCT LEFT(col, n)) / COUNT(*)` 接近整列的区分度。

### 21. 一张表最多建多少个索引合适？
没有固定数字，一般建议单表索引不超过 5–6 个、联合索引的列不超过 5 个。索引越多写入越慢、占空间越多、优化器选择越复杂。定期用 `sys.schema_unused_indexes` 找出从没用过的索引删掉。

### 22. 为什么不建议用 `SELECT *`？
多读不需要的列（网络和内存开销）；用不上覆盖索引，必须回表；表结构变化时可能影响程序；大字段（text / blob）尤其明显。

---

## MySQL 中等（22 题）

### 1. ★ 为什么 InnoDB 用 B+ 树？一个页多大？
页 16KB；B+ 树非叶子节点只存键和指针，一页能放上千个，3 层能存约两千万行（计算见 13 文档中等第 5 题），查询只要 1–3 次磁盘 IO；叶子节点的双向链表让范围查询顺序读。对比哈希（不支持范围）、红黑树（太高）、B 树（非叶子存数据、更高、范围查询不便）。

### 2. ★ 索引下推（ICP）是什么？
5.6 引入。联合索引 `(name, age)`，查询 `WHERE name LIKE '张%' AND age = 20`：没有 ICP 时，存储引擎按 `name` 找到所有姓张的记录，每条都回表交给 Server 层再判断 age；有 ICP 时，**在索引里就先把 age 判断掉**，只对满足的记录回表，大幅减少回表次数。Extra 显示 `Using index condition`。

### 3. ★ 索引失效的常见场景？
对索引列使用函数或运算；隐式类型转换（varchar 列用数字比较，**字符串和数字比较时 MySQL 把字符串转成数字**，所以是索引列被转换了）；`LIKE '%xx'`；不满足最左前缀；`OR` 的一侧没有索引；两个表 JOIN 时**字符集不同**（utf8 和 utf8mb4 的列比较会发生转换）；优化器判断走全表更快（返回行数占比大）。

### 4. ★ 联合索引怎么设计？
- 把**等值查询**的列放前面，**范围查询**和**排序**的列放后面；
- 区分度高的列靠前（但要以查询模式为主）；
- 尽量让常用查询能用上**覆盖索引**；
- 利用最左前缀：`(a, b)` 能顶替单独的 `(a)` 索引，不要重复建；
- 考虑 ORDER BY：`WHERE a = ? ORDER BY b` 用 `(a, b)` 可以避免 filesort。

### 5. ★ MVCC 的实现原理？
- 每行有隐藏列 `DB_TRX_ID`（最后修改它的事务 ID）和 `DB_ROLL_PTR`（指向 undo log 里的上一个版本），形成**版本链**；
- **ReadView** 包含：`m_ids`（创建时所有活跃的读写事务 ID）、`min_trx_id`（其中最小的）、`max_trx_id`（下一个要分配的事务 ID）、`creator_trx_id`（自己）；
- 判断某个版本是否可见：
  - `trx_id == creator_trx_id`：自己改的，可见；
  - `trx_id < min_trx_id`：创建 ReadView 前就提交了，可见；
  - `trx_id >= max_trx_id`：在 ReadView 之后才开启，不可见；
  - 在两者之间：如果在 `m_ids` 里（还没提交）不可见，否则可见；
  - 不可见就顺着版本链找上一个版本继续判断。

### 6. ★ RC 和 RR 在 MVCC 上的区别？
**ReadView 的生成时机**：RC 每条 SELECT 都生成新的 ReadView（所以能看到别人刚提交的数据）；RR 只在事务中第一条 SELECT 时生成，之后一直复用（所以可重复读）。

### 7. ★ 快照读和当前读？
- 快照读：普通的 `SELECT`，读 MVCC 的历史版本，不加锁；
- 当前读：`SELECT ... FOR UPDATE`、`SELECT ... LOCK IN SHARE MODE`（8.0 写成 `FOR SHARE`）、`INSERT`、`UPDATE`、`DELETE`，读**最新**版本并加锁。
- 一个经典现象：RR 下事务 A 先快照读到 10 行，B 插入一行并提交，A 再快照读还是 10 行；但 A 执行 `UPDATE` 时（当前读）会更新到 B 插入的那行，之后再快照读就能看到它了 —— 这就是 MySQL RR 下仍可能出现的「幻读」。

### 8. ★ MySQL 的 RR 是怎么解决幻读的？
快照读靠 **MVCC**（同一个 ReadView，看不到新插入的行）；当前读靠**临键锁**（next-key lock = 记录锁 + 间隙锁），锁住记录和记录之间的间隙，别的事务插不进来。但如第 7 题所说，快照读和当前读混用时仍可能出现幻读现象。

### 9. ★ 行锁有哪几种？
- **记录锁**（Record Lock）：锁住索引上的一条记录；
- **间隙锁**（Gap Lock）：锁住两条记录之间的间隙（不包含记录本身），只在 RR 下存在，**间隙锁之间不冲突**，只阻止插入；
- **临键锁**（Next-Key Lock）：记录锁 + 前面的间隙，左开右闭区间，是 RR 下加锁的基本单位；
- **插入意向锁**：插入前加的一种特殊间隙锁，多个插入同一间隙不同位置的事务不互斥。
- 注意：**InnoDB 的行锁是加在索引上的**，如果 UPDATE 的条件没有走索引，会扫描全表并锁住所有记录（相当于锁表）。

### 10. 意向锁是干什么的？
表级锁，表示「这个表里有行被加了共享锁 / 排他锁」。作用：别的事务要加表锁时，不用逐行检查有没有行锁，看一眼意向锁就知道。意向锁之间不冲突，只和表级的 S / X 锁冲突。

### 11. ★ 怎么排查死锁？
`SHOW ENGINE INNODB STATUS` 里的 `LATEST DETECTED DEADLOCK` 会显示两个事务各自持有和等待的锁、执行的 SQL；开启 `innodb_print_all_deadlocks` 把所有死锁记到错误日志。InnoDB 会自动检测死锁并回滚代价小的事务（`innodb_deadlock_detect`）。预防：按固定顺序访问资源、事务尽量小、走索引减少锁的范围、降低隔离级别到 RC（没有间隙锁，死锁大幅减少）。

### 12. ★ redo log 是怎么保证持久性的？刷盘策略？
**WAL**：修改先写 redo log（顺序写，快），数据页之后再慢慢刷。崩溃后用 redo log 重做已提交事务的修改。redo log 是固定大小、循环写的（write pos 和 checkpoint 两个指针）。
`innodb_flush_log_at_trx_commit`：
- `1`（默认，最安全）：每次提交都写入并 fsync；
- `0`：每秒写入并 fsync 一次，MySQL 崩溃可能丢 1 秒；
- `2`：每次提交写到操作系统缓存，每秒 fsync，MySQL 崩溃不丢、操作系统崩溃可能丢 1 秒。

### 13. ★ binlog 有哪几种格式？
- `STATEMENT`：记录 SQL 原文，日志小，但 `now()`、`uuid()`、`LIMIT` 无 ORDER BY 等不确定的语句在从库可能产生不同结果；
- `ROW`（推荐，8.0 默认）：记录每一行修改前后的值，准确，但日志大（一条 UPDATE 改 100 万行就记 100 万行）；Canal、Debezium 这类 CDC 工具需要 ROW 格式；
- `MIXED`：一般用 statement，不安全时自动切 row。
`sync_binlog = 1`：每次提交都 fsync binlog（「双 1」配置：它和 `innodb_flush_log_at_trx_commit = 1` 一起保证不丢数据）。

### 14. ★ 什么是两阶段提交？为什么需要？
redo log（InnoDB）和 binlog（Server 层）是两份日志，必须保证一致：否则崩溃恢复后主库（按 redo log）和从库（按 binlog）的数据会不一样。流程：
1. 写 redo log，状态为 **prepare**；
2. 写 binlog；
3. redo log 改为 **commit**。
崩溃恢复时：redo log 是 commit 的直接提交；是 prepare 的就看 binlog 里有没有这个事务（通过 XID 关联），有就提交、没有就回滚。

### 15. ★ undo log 有什么用？
记录修改前的数据：① 事务**回滚**时用它恢复；② **MVCC** 的版本链由它构成。undo log 在没有任何事务需要读那个版本后，由 purge 线程清理。**长事务**会导致 undo log 无法清理、不断膨胀（和 PG 的长事务导致表膨胀是同一类问题）。

### 16. ★ Buffer Pool 是什么？它的 LRU 做了什么改进？
InnoDB 在内存里缓存数据页和索引页的区域（一般设置为机器内存的 60%–80%），读写都先操作 Buffer Pool，脏页由后台线程刷盘。
改进的 LRU：链表分成 **young 区**（约 5/8）和 **old 区**（约 3/8），新读入的页先放到 old 区的头部，在 old 区停留超过 `innodb_old_blocks_time`（默认 1 秒）后再被访问才移到 young 区。目的：防止**全表扫描**一次性读入大量只用一次的页，把真正的热点数据挤出去；也防止预读的页污染缓存。

### 17. change buffer 是什么？
更新二级索引页时，如果这个页不在 Buffer Pool 里，不立刻从磁盘读出来，而是把修改记录在 change buffer 里，等以后这个页被读入时再合并（merge）。减少随机读 IO，适合写多读少的场景。**唯一索引用不了 change buffer**（插入前必须读出页来检查唯一性）。

### 18. ★ 主从延迟有哪些原因？
从库机器性能差；从库上跑了很多查询；**大事务**（主库执行 10 分钟，从库也要重放 10 分钟）；从库单线程重放跟不上主库的并发写入；网络延迟。看延迟：`SHOW REPLICA STATUS` 的 `Seconds_Behind_Source`（老版本是 `Seconds_Behind_Master`）。

### 19. 半同步复制是什么？
主库提交事务后，至少等一个从库确认**收到** binlog（写入 relay log）才返回给客户端，降低主库宕机丢数据的风险。超时会退化成异步。5.7 的「无损半同步」（`AFTER_SYNC`）在写 binlog 后、引擎提交前等待从库，主库宕机时从库一定有这个事务。

### 20. ★ ORDER BY 是怎么执行的？什么时候会 filesort？
如果排序字段和索引顺序一致（并且是同一个索引能覆盖的条件），直接按索引顺序读，不需要排序；否则要 **filesort**：在 `sort_buffer`（`sort_buffer_size`）里排序，数据太多就用临时文件做归并排序。两种方式：全字段排序（把要返回的列都放进 buffer）、rowid 排序（只放排序列和主键，排完再回表）。优化：建合适的联合索引让排序走索引。

### 21. JOIN 是怎么执行的？
- **Index Nested-Loop Join**：被驱动表的连接列上有索引，驱动表每一行去索引里查，效率好；
- **Block Nested-Loop Join**：被驱动表没索引，把驱动表的数据分块读进 `join_buffer`，再扫描被驱动表逐块比较，很慢；
- 8.0.18 起用 **Hash Join** 替代 BNL；
- 原则：**小表驱动大表**（「小」指过滤后参与连接的数据量），被驱动表的连接列要有索引。

### 22. 唯一索引和普通索引在性能上有什么区别？
查询：几乎一样（唯一索引找到一条就停，普通索引要再往后看一条，差别可以忽略）。更新：普通索引可以用 change buffer，唯一索引必须读出数据页检查唯一性。所以在业务能保证唯一（或者允许由应用层保证）且写多读少时，普通索引的写入性能更好；但需要数据库兜底唯一性时还是用唯一索引。

---

## MySQL 高难（22 题）

### 1. ★ 深分页（`LIMIT 1000000, 20`）怎么优化？
MySQL 要先读出 100 万零 20 行（还要回表）再丢掉前 100 万。
- **游标分页**：`WHERE id > 上一页最大id ORDER BY id LIMIT 20`；
- **延迟关联**：先在覆盖索引上分页拿主键，再 JOIN 回表：
  ```sql
  SELECT o.* FROM orders o JOIN (SELECT id FROM orders WHERE user_id = 1 ORDER BY created_at LIMIT 1000000, 20) t ON o.id = t.id;
  ```
- 业务上限制最大页数（搜索引擎也只给前几十页）。

### 2. ★ 千万级大表要加字段 / 加索引，怎么不影响线上？
- 5.6 起的 **Online DDL**：`ALTER TABLE ... ALGORITHM=INPLACE, LOCK=NONE`，大部分操作期间可以读写；8.0 的 `ALGORITHM=INSTANT` 可以秒级加列（只改元数据）；
- 注意：DDL 开始和结束时都要拿一下 **MDL 写锁**，如果前面有长事务或长查询，DDL 会等待，**后面所有的查询都被它阻塞** → 先检查并处理长事务，设置 `lock_wait_timeout`；
- 工具：**gh-ost**（读 binlog 同步增量到影子表，不用触发器，可暂停、可限速）、**pt-online-schema-change**（用触发器同步增量）；原理都是「建新表 → 拷贝数据 → 同步增量 → 原子改名」；
- 主从环境：大 DDL 在从库重放也会造成延迟。

### 3. ★ 一张表 5000 万行，查询越来越慢，你的优化思路？
按代价由小到大：
1. **SQL 和索引**：慢查询日志找出问题 SQL，EXPLAIN 分析，加 / 改索引、改写 SQL；
2. **表结构**：拆出大字段（垂直拆分）、冷热字段分离、字段类型精简；
3. **缓存**：热点数据放 Redis；
4. **读写分离**：读压力大时加从库；
5. **归档**：历史数据迁到归档表或分析库（ClickHouse），在线表只留热数据；
6. **分区表**：按时间分区（但 MySQL 分区表限制多，唯一索引必须包含分区键）；
7. **分库分表**：最后的手段（见下一题）。
准备你在旧项目里真实做过的那次慢查询优化。

### 4. ★ 分库分表怎么做？会带来哪些问题？
- **垂直拆分**：按业务把不同的表拆到不同的库（用户库、订单库）；把一张宽表的列拆成多张表；
- **水平拆分**：同一张表的数据按**分片键**拆到多个库 / 表（`user_id % 16`、按时间范围）；
- 分片键选择：选最常用的查询条件（订单按 user_id，保证「查我的订单」只落一个分片）；
- 带来的问题：
  - **分布式 ID**：自增不能用了 → 雪花算法 / 号段模式；
  - **跨分片查询**：不带分片键的查询要查所有分片（按商家查订单 → 再建一份按商家分片的冗余数据，或同步到 ES）；
  - **跨分片排序分页**、聚合：在中间层合并；
  - **分布式事务**：尽量避免，用最终一致（本地消息表 / Saga）；
  - **扩容迁移**：取模分片扩容要迁移大量数据 → 一开始就多分（比如 1024 个逻辑分片映射到少量物理库），或用一致性哈希；
- 中间件：ShardingSphere（客户端 / 代理）、Vitess、MyCat。也可以直接上分布式数据库（TiDB、OceanBase）。

### 5. ★ 读写分离下，刚写完就读不到怎么办？
- 写后立刻读的请求强制走主库（同一个请求 / 会话内写过就读主库，或者按业务标记关键读走主库）；
- 判断从库是否追上：记录写入后主库的 GTID，读之前在从库上等这个 GTID 执行完（`WAIT_FOR_EXECUTED_GTID_SET`）；
- 业务上接受短暂延迟（比如提示「数据正在同步」）；
- 降低延迟：并行复制、避免大事务。

### 6. ★ 主从延迟很大，怎么排查和解决？
- 看是 IO 线程慢（网络、主库 binlog 量大）还是 SQL 线程慢（重放跟不上）；
- 常见原因：大事务（一次删几百万行 → 改成分批）、DDL、从库查询压力大、从库配置差、无主键的表（ROW 格式下每行都要全表扫描找记录）；
- 解决：**并行复制**（5.7 基于组提交、8.0 基于 WRITESET 的并行复制，`replica_parallel_workers`）；拆分大事务；给所有表加主键；从库适当放宽持久化配置（非双 1）。

### 7. ★ 讲一个典型的死锁案例
两个事务在 RR 下按不同顺序插入：
- 表上有唯一索引，现有记录 id = 10、20；
- 事务 A：`SELECT ... WHERE id = 15 FOR UPDATE`（不存在，加了 (10, 20) 的间隙锁）；
- 事务 B：同样 `SELECT ... WHERE id = 16 FOR UPDATE`（也加了 (10, 20) 的间隙锁 —— **间隙锁之间不冲突**，所以都成功了）；
- A：`INSERT id = 15` → 要插入意向锁，被 B 的间隙锁阻塞；
- B：`INSERT id = 16` → 被 A 的间隙锁阻塞 → 死锁。
这是「先查一下不存在再插入」这种写法在 RR 下的经典死锁。解决：直接 `INSERT ... ON DUPLICATE KEY UPDATE`；或者用 RC 隔离级别（没有间隙锁）。

### 8. ★ 热点行（比如商品库存、账户余额）高并发更新怎么优化？
所有请求更新同一行，行锁导致串行，还有死锁检测的开销（每个等待的线程都要检测，并发越高越慢）。
- 应用层排队：同一行的更新在应用层合并或排队，减少同时到达数据库的并发；
- 库存拆分：一个商品拆成多行子库存，随机扣其中一行；
- Redis 预扣 + 异步落库；
- 合并更新：多个请求的扣减攒成一次 `UPDATE`；
- 阿里云 / 腾讯云的 MySQL 分支有专门的热点行优化。

### 9. ★ 优化器选错了索引怎么办？
- 原因：统计信息不准（InnoDB 采样估算区分度）；优化器认为回表代价太高；排序因素（优化器为了避免 filesort 选了排序列的索引，结果扫了很多行）；
- 处理：`ANALYZE TABLE` 重新统计；`FORCE INDEX` 临时强制（不推荐长期用，表结构变了容易出问题）；改写 SQL 引导优化器；调整或删除干扰的索引；8.0 可以用直方图（`ANALYZE TABLE ... UPDATE HISTOGRAM`）改善数据倾斜列的估算。

### 10. ★ 大事务有什么危害？
锁持有时间长，阻塞其他事务；undo log 膨胀；**主从延迟**（从库要重放整个大事务）；回滚很慢（回滚可能比执行还久）；binlog 一次写入很大。规范：批量操作分批提交（每批几千行）、事务里不要调用外部接口、不要在事务里等待用户输入。

### 11. 自增锁（AUTO-INC 锁）是什么？
插入时分配自增值要加的锁。`innodb_autoinc_lock_mode`：
- 0：传统模式，表级锁，语句结束才释放；
- 1：连续模式（5.x 默认），简单插入申请完值就释放，批量插入（`INSERT ... SELECT`）保持到语句结束；
- 2：交错模式（**8.0 默认**），所有插入申请完就释放，并发最好，但批量插入的 id 可能不连续 —— 配合 ROW 格式的 binlog 才是安全的（STATEMENT 格式下主从可能分配出不同的 id）。

### 12. doublewrite buffer 是干什么的？
解决**页的部分写失效**：InnoDB 的页是 16KB，而操作系统 / 磁盘的原子写单位通常是 4KB，写到一半断电就会出现「半新半旧」的损坏页，redo log 也救不了（redo 记录的是对页的修改，需要基于一个完整的页）。所以刷脏页时先把页顺序写到 doublewrite 区域，再写到真实位置；崩溃后发现页损坏，就从 doublewrite 里恢复。对应 PG 的 `full_page_writes`。

### 13. ★ MySQL 是怎么做到 crash-safe 的？
redo log（WAL）保证已提交事务的修改不丢；undo log 回滚未提交的事务；两阶段提交保证 redo log 和 binlog 一致；doublewrite 保证数据页本身不损坏；配合「双 1」（`innodb_flush_log_at_trx_commit = 1`、`sync_binlog = 1`）。

### 14. ★ JOIN 时两个表的字段字符集不同，会有什么问题？
比如 a 表的 `user_id` 是 utf8mb4、b 表的是 utf8，`a.user_id = b.user_id` 时 MySQL 会把 utf8 转成 utf8mb4 来比较，如果被转换的那一侧是被驱动表的索引列，**索引就失效了**，每次都是全表扫描。表结构规范里要统一字符集和排序规则。类似的还有字段类型不一致（int 和 varchar 关联）。

### 15. COUNT 很慢，怎么优化？
- 不需要精确值：`SHOW TABLE STATUS` 的 rows（估算）、或者 `EXPLAIN` 的 rows；
- 需要精确值且频繁：单独维护计数表（在同一个事务里更新，保证一致）或 Redis 计数（和数据库之间可能不一致）；
- 带条件的计数：确保条件走索引，尽量覆盖索引；
- 分析类的计数放到分析库。

### 16. 什么时候会用到临时表？`Using temporary` 怎么优化？
`GROUP BY` 的列没有索引、`DISTINCT` 和 `ORDER BY` 列不同、`UNION`（不是 UNION ALL）、部分子查询。优化：给 GROUP BY 的列建索引（让分组直接按索引顺序进行）；能用 UNION ALL 就不用 UNION；调整 `tmp_table_size` 让临时表留在内存里（超过会转成磁盘临时表）。

### 17. 主键用 UUID，表变得很大、插入很慢，怎么解释和解决？
随机 UUID 插入到 B+ 树的随机位置，频繁**页分裂**（页利用率可能降到一半左右）、Buffer Pool 缓存命中率低（每次插入的页都不一样）；而且 36 字节的字符串主键会被复制到每一个二级索引的叶子节点里，所有索引都变大。解决：主键改用自增或有序 ID（雪花、UUID v7、MySQL 8 的 `UUID_TO_BIN(uuid, 1)` 交换时间位使之有序）并用 `BINARY(16)` 存储；UUID 作为业务字段单独存放。

### 18. 线上误删了数据，怎么恢复？
- 有全量备份 + binlog：用备份恢复到一个临时实例，再用 `mysqlbinlog` 重放 binlog 到误操作前的位置（按时间或 position），导出被删的数据，再导回生产；
- 只是误删 / 误改了少量行、binlog 是 ROW 格式：用 binlog2sql、MyFlash 这类工具从 binlog 里生成反向 SQL（DELETE 变 INSERT、UPDATE 前后对调）；
- 有延迟从库（专门设置延迟 1 小时复制的从库）：直接从延迟从库上取；
- 预防：权限控制、生产操作走审核、危险操作先备份、开启 `sql_safe_updates`（没有 WHERE 或 LIMIT 的 UPDATE / DELETE 拒绝执行）。

### 19. 数据库连接数满了（`Too many connections`）怎么办？
- 应急：用预留的管理连接登录（`max_connections + 1` 留给 SUPER 用户；8.0 有单独的管理端口 `admin_port`），`SHOW PROCESSLIST` 找出大量空闲或卡住的连接，`KILL` 掉；
- 排查：是连接池配置太大（实例数 × 池大小超过上限）、连接泄漏（借了不还）、还是慢查询让连接都占着不释放；
- 解决：调整连接池大小、修复泄漏、修复慢查询、调大 `max_connections`（要考虑内存）、加中间件做连接复用（ProxySQL）。

### 20. MySQL 和 PostgreSQL 怎么选？
| | MySQL | PostgreSQL |
|---|---|---|
| 优势 | 简单易用、国内生态和运维经验丰富、读多写少的互联网业务久经考验、分库分表中间件成熟 | 功能强（丰富的类型、jsonb、GIN / GiST 索引、窗口函数和 CTE 支持早、扩展生态：pgvector、PostGIS）、SQL 标准兼容好、复杂查询优化器更强 |
| 存储 | 聚簇索引、undo log | 堆表、多版本存在表里（需要 VACUUM） |
| 典型场景 | 高并发 OLTP、简单的增删改查 | 复杂业务、数据分析、地理信息、AI 应用（向量） |
我们现在的项目选 PG：jsonb 存半结构化的配置和运行日志、扩展能力强，将来要做向量检索也可以直接用 pgvector。

### 21. 怎么做数据库的水平扩容（从 4 个分片扩到 8 个）？
- 如果一开始就是「逻辑分片（比如 1024 个）→ 物理库」的两级映射：扩容只需要把一部分逻辑分片整体迁到新库，改一下映射表，不用重新计算每行数据的归属；
- 迁移步骤：全量拷贝 → 增量同步（binlog / CDC）→ 数据校验 → 短暂停写切换路由 → 观察 → 清理旧数据；
- 取模直接从 % 4 改成 % 8：一半的数据要迁移，而且所有数据都要重新计算，代价大 —— 这就是要在设计时预留分片数的原因。

### 22. 讲一个你真实做过的 MySQL 优化案例（必须准备）
用 STAR 结构准备：
- **S**：哪个系统、哪张表（数据量多大）、什么现象（某个接口 P99 多少秒、慢查询日志里出现了什么）；
- **T**：目标（降到多少毫秒）；
- **A**：怎么定位（慢查询日志 / EXPLAIN 看到了什么：全表扫描、filesort、索引选错）→ 怎么改（加了什么联合索引、改写了什么 SQL、有没有改业务逻辑）→ 怎么验证（压测、灰度）；
- **R**：结果（从几秒降到几十毫秒、慢查询数量下降多少）。
简历上写了「负责过公司的数据库慢查询优化」，这题一定会被问到。
