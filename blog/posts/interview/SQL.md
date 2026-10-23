---
title: "SQL 面试题"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 19
redirectFrom:
  - /posts/interview/14-sql-mysql.html
---

# SQL 面试题

> 两部分，各分入门 / 中等 / 高难三档，每档 20 题以上，★ 是高频题。
> SQL 部分的例子按 PostgreSQL 写，和 MySQL 写法不同的地方会标出来；高难手写题都在本地 PG 里跑通过（文末附测试数据）。
> MySQL 是你的老本行，重点是**讲出原理 + 准备你自己的真实案例**；每题尽量顺带说一句 PG 的不同（见 07 文档）。

---

---

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

---

## 五、SQL 基础

### 1. ★ SQL 语句分类？

DDL（定义：`CREATE` / `ALTER` / `DROP` / `TRUNCATE`）、DML（操作：`INSERT` / `UPDATE` / `DELETE`）、DQL（查询：`SELECT`）、DCL（权限：`GRANT` / `REVOKE`）、TCL（事务：`BEGIN` / `COMMIT` / `ROLLBACK` / `SAVEPOINT`）。

### 2. ★ SELECT 的逻辑执行顺序？

**FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT / OFFSET**
推论：

- WHERE 里不能用聚合函数（还没分组）；
- WHERE 里不能用 SELECT 里起的别名（MySQL 的 HAVING / ORDER BY 可以，PG 的 ORDER BY 可以、HAVING 不行）；
- 窗口函数在 SELECT 阶段计算，所以不能直接在 WHERE 里过滤窗口函数结果，要包一层子查询 / CTE。

### 3. ★ 几种 JOIN 的区别？

| JOIN | 结果 |
| --- | --- |
| `INNER JOIN` | 两边都匹配上的行 |
| `LEFT JOIN` | 左表全部 + 右表匹配上的（匹配不上补 NULL） |
| `RIGHT JOIN` | 右表全部（通常改写成 LEFT JOIN） |
| `FULL OUTER JOIN` | 两边全部（MySQL 不支持，用 LEFT UNION RIGHT 模拟） |
| `CROSS JOIN` | 笛卡尔积 |
| 自连接 | 同一张表和自己连（员工表查上级） |
| 半连接（semi） | `WHERE EXISTS (...)`：左表中「在右表里有匹配」的行，不重复 |
| 反连接（anti） | `WHERE NOT EXISTS (...)` 或 `LEFT JOIN ... WHERE 右.id IS NULL`：左表中「在右表里没有匹配」的行 |

**LEFT JOIN 的坑**：把右表的过滤条件写在 WHERE 里会把 LEFT JOIN 变成 INNER JOIN（NULL 行被过滤掉了），应该写在 `ON` 里。

### 4. ★ WHERE 和 HAVING 的区别？

WHERE 在分组前过滤**行**，不能用聚合函数；HAVING 在分组后过滤**组**，可以用聚合函数。能用 WHERE 的条件尽量放 WHERE（先减少数据量）。

### 5. ★ `COUNT(*)`、`COUNT(1)`、`COUNT(列)` 的区别？

`COUNT(*)` 和 `COUNT(1)` 都统计行数（包括 NULL 行），性能基本一样；`COUNT(列)` 只统计该列**不为 NULL** 的行；`COUNT(DISTINCT 列)` 去重计数。

### 6. ★ `UNION` 和 `UNION ALL`？

UNION 去重（要排序或哈希，慢）；UNION ALL 不去重，快。确定没有重复时用 UNION ALL。

### 7. ★ `DELETE`、`TRUNCATE`、`DROP` 的区别？

| | DELETE | TRUNCATE | DROP |
| --- | --- | --- | --- |
| 作用 | 删行（可带 WHERE） | 清空所有行 | 删整张表（结构也没了） |
| 速度 | 慢（逐行，记日志） | 快 | 快 |
| 回滚 | 可以 | MySQL 不能（隐式提交）；**PG 可以** | MySQL 不能；PG 在事务里可以 |
| 自增 | 不重置 | 重置 | — |
| 触发器 | 触发 | 不触发 | — |

### 8. ★ NULL 的坑（三值逻辑）

- 任何值和 NULL 比较（`=`、`<>`、`>`）结果都是 **UNKNOWN**（不是 true 也不是 false），WHERE 只保留 true → 判断要用 `IS NULL` / `IS NOT NULL`；
- `NOT IN` **的经典坑**：`WHERE id NOT IN (SELECT uid FROM t)`，如果子查询结果里有一个 NULL，整个条件永远不为 true，一行都查不出来 → 用 `NOT EXISTS`；
- 聚合函数（SUM、AVG、COUNT(列)）忽略 NULL；`AVG` 是「非 NULL 值的平均」；
- `COALESCE(a, 0)` 把 NULL 换成默认值；
- 唯一约束里多个 NULL 不算重复（PG15 可改）。

### 9. ★ 约束有哪些？主键和唯一约束的区别？

约束：`PRIMARY KEY`、`UNIQUE`、`NOT NULL`、`CHECK`、`FOREIGN KEY`、`DEFAULT`（PG 还有 `EXCLUDE`）。
主键：唯一 + 非空，一张表只能有一个；唯一约束：可以有多个，允许 NULL。

### 10. ★ 数据库三大范式？

- 第一范式：每列不可再分（原子性）；
- 第二范式：在 1NF 基础上，非主键列完全依赖于整个主键（不能只依赖联合主键的一部分）；
- 第三范式：在 2NF 基础上，非主键列不传递依赖于主键（不能 A → B → C）。
- **反范式**：为了查询性能故意冗余（订单表里冗余用户名），代价是更新时要同步多处。实际业务常在 3NF 基础上适度反范式。

### 11. 视图是什么？

保存的查询语句，像虚拟表一样用。用途：简化复杂查询、权限控制（只暴露部分列）。普通视图不存数据；物化视图存结果，要刷新。

### 12. 子查询和 JOIN 哪个好？

现代优化器很多情况下会把子查询改写成 JOIN，性能差不多；**相关子查询**（子查询里引用外层的列，外层每一行都要执行一次）容易慢，能改成 JOIN 就改。可读性优先，有性能问题看执行计划。

### 13. `CHAR` 和 `VARCHAR`？

CHAR 定长，不足补空格；VARCHAR 变长。MySQL 里定长短字段（手机号、MD5）用 CHAR 有一点优势；PG 里没区别，统一用 `text` / `varchar`。

### 14. ★ 事务的 ACID 和隔离级别（基础版）

- 原子性（全做或全不做）、一致性（数据始终满足约束）、隔离性（并发事务互不干扰）、持久性（提交后不丢）。
- 并发问题：**脏读**（读到别人未提交的）、**不可重复读**（同一事务两次读同一行结果不同，因为别人改了并提交）、**幻读**（同一事务两次范围查询，行数不同，因为别人插入了）。
- 隔离级别：读未提交（都可能发生）→ 读已提交（防脏读，**PG 默认**）→ 可重复读（再防不可重复读，**MySQL 默认**）→ 可串行化（全防）。
- 深入见 07 文档第六节。

### 15. ★ 索引基础

- 索引是什么：帮助快速查找的数据结构（通常是 B+ 树），像书的目录；
- 优点：加速查询、排序、分组；缺点：占空间、**拖慢写入**（每次增删改都要维护索引）；
- 什么列适合建索引：WHERE / JOIN / ORDER BY 常用的列、区分度高的列；
- 什么情况不适合：区分度低（性别）、频繁更新、小表；
- 联合索引的最左前缀原则（MySQL）；
- 深入见 07 文档第四节。

### 16. ★ 手写 SQL 高频题

```sql
-- (1) 第二高的薪水（力扣 176），没有则返回 NULL
SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;

-- (2) 每个部门工资最高的前 3 名（每组 Top N），窗口函数
SELECT * FROM (
  SELECT d.name AS dept, e.name, e.salary,
         DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rk
  FROM employee e JOIN dept d ON d.id = e.dept_id
) t WHERE rk <= 3;
-- ROW_NUMBER：1,2,3,4（同分也不同号）；RANK：1,1,3（跳号）；DENSE_RANK：1,1,2（不跳号）

-- (3) 查找重复的邮箱
SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;

-- (4) 删除重复行，只保留 id 最小的（PG）
DELETE FROM users a USING users b WHERE a.email = b.email AND a.id > b.id;

-- (5) 从没下过单的用户（反连接）
SELECT u.* FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- (6) 累计求和、环比
SELECT day, amount,
       SUM(amount) OVER (ORDER BY day) AS running_total,
       amount - LAG(amount) OVER (ORDER BY day) AS diff_vs_prev_day
FROM daily_sales;

-- (7) 连续登录 3 天以上的用户（gaps and islands：日期减去行号，连续的日期结果相同）
SELECT user_id, MIN(d) AS start_day, COUNT(*) AS days
FROM (
  SELECT user_id, d, d - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d))::int AS grp
  FROM (SELECT DISTINCT user_id, login_at::date AS d FROM logins) x
) t
GROUP BY user_id, grp HAVING COUNT(*) >= 3;

-- (8) 次日留存率
SELECT a.d, COUNT(DISTINCT b.user_id)::numeric / COUNT(DISTINCT a.user_id) AS retention
FROM (SELECT DISTINCT user_id, login_at::date d FROM logins) a
LEFT JOIN (SELECT DISTINCT user_id, login_at::date d FROM logins) b
  ON a.user_id = b.user_id AND b.d = a.d + 1
GROUP BY a.d;

-- (9) 行转列（条件聚合）
SELECT user_id,
       SUM(amount) FILTER (WHERE month = 1) AS jan,     -- MySQL 写 SUM(CASE WHEN month = 1 THEN amount END)
       SUM(amount) FILTER (WHERE month = 2) AS feb
FROM sales GROUP BY user_id;
```

---
