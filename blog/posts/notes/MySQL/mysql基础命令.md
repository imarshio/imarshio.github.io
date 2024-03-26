---
icon: pen-to-square
date: 2021-03-17
category:
  - mysql
title: 基础命令 
# tag:

---

### CRUD

#### INSERT

```sql
# 普通插入，不需要指定列名，此时需要列与数据的类型和数量全匹配
INSERT INTO table_name VALUE (value1, value2, ..., valueN)

# 等同于，VALUE <==> VALUES，只是VALUES效率更高，你可以试试
INSERT INTO table_name VALUES (value1, value2, ..., valueN)

# 指定字段插入I，
INSERT INTO table_name (field1, field2, ..., fieldN) 
 VALUES (value1, value2, ..., valueN)
 
# 指定字段插入II
INSERT INTO table_name SET field1=value1,field2=value2,...fieldN=valueN;

# 一次插入多条数据，尽量指定需要插入的列明
INSERT INTO table_name (field1, field2, ..., fieldN)
VALUES (value1, value2, ..., valueN)，(value1, value2, ..., valueN)，(value1, value2, ..., valueN)...
```

> 主键自增是不用主动插入数据的，但是再插入时不能指定自增的id主键，不然会报不匹配。

进阶用法

- 表明使用``包裹

```sql
# 将表名用 `` 符号包起来
INSERT INTO `table_name` () VALUES ()
```

这样当我们**表名**（table name）较复杂时也不会出现因**表名**而引起的错误

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113170630.png#id=uBBI9&originHeight=335&originWidth=1079&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 导入历史数据

> 在实际开发过程中，会产生很多历史数据，且很多历史数据都不会经常用到，此时如果不对历史数据做处理，我们的数据库会越来越大，性能会越来越低，所以我们需要将一部分历史数据导出。
>  
> 假设有表exam_record，数据如下
>  
> id    uid   eid  create_date     last_date        score
>  
> 12 111 1111 2020-01-02 09:21:01 2020-01-02 09:21:01 10
13 111 1111 2020-01-02 09:21:01 2020-01-02 09:21:01 10
14 111 1111 2020-01-02 09:21:01 2020-01-02 09:21:01 10
15 111 1111 2020-01-02 09:21:01 2020-01-02 09:21:01 10
16 111 1111 2020-01-02 09:21:01 2020-01-02 09:21:01 10
4 1002 9001 2021-05-02 10:01:01 2021-05-02 10:30:01 81
5 1002 9002 2021-09-02 12:01:01
3 1002 9003 2022-04-22 16:56:58 2022-04-22 16:56:58 50

现在将创建日期在2021年及之前的数据放到history_exam_record表中。

```sql
# 将2021年以前的数据导入历史表，
INSERT INTO history_exam_record (uid, eid, create_date, last_date, score)
SELECT uid, eid, create_date, last_date, score
FROM exam_record WHERE YEAR(create_date) <= 2021
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220422171113.png#id=jNhn9&originHeight=244&originWidth=923&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 带更新的插入

> 我们在插入时，有时会遇到id主键相同的插入，一般情况下，我们会重新声明一个不一样的id主键，但是有时候，需要我们覆盖原数据，并插入新数据，此时我们就需要使用 `REPLACE`

```sql
REPLACE INTO table_name (field1, field2, ..., fieldN)
VALUES (value1, value2, ..., valueN)
```

#### SELECT

```sql
SELECT <colum_name>,<colum_name>...
FROM <table_name>
[WHERE ]
[LIMIT ][OFFSET ]
```

> `WHERE`：可选参数，设置筛选条件，详情可查看 [WHERE](# WHERE)。
>  
> `LIMIT`：可选参数，限制筛选数目，详情可看 [LIMIT](# LIMIT)。
>  
> - 一个参数N：表示从0开始的N个符合条件的数据
> - 两个参数N，M：表示从N开始的M个符合条件的数据
>

> `OFFSET`：可选参数，偏移量，配合 `LIMIT`使用

#### DELETE

```sql
DELETE FROM <table_name> [WHERE ]
```

> - 如果没有指定 `WHERE` 子句，`MySQL` 表中的所有记录将被删除。
> - 你可以在 `WHERE` 子句中指定任何条件，删除符合指定条件的数据。
> - 您可以在单个表中一次性删除记录。

#### UPDATE

```sql
UPDATE <table_name> SET <colum_name>=<new_value>,<colum_name>=<new_value>... [WHERE]
```

> - 你可以同时更新一个或多个字段。
> - 你可以在 `WHERE` 子句中指定任何条件。
> - 你可以在一个单独表中同时更新数据。

#### TRUNCATE

```sql
TRUNCATE [TABLE] <table_name>
```

我们都知道，删除表需要使用 `DELETE`语法，但是如果需要我们删除表中所有数据的同时还要重置自增主键的话，`DELETE`已经力不从心了，虽然他能删除表中所有数据，但是他不能重置自增主键，此时我们就需要引入 `TRUNCATE`，他专门用于重置表，且速度比 `DELETE`快。

#### LIMIT

```sql
LIMIT [offset,] counts
```

- offset：起始位置，即偏移量，如 `offset=1`，那么就从查询的结果中第1位开始取，可选参数
- counts：记录数，

上面两个参数只接受正整数，且不支持运算。

当使用一个参数**N**时，会返回从**0**到**N**之间的所有行数据，如

```sql
select * from table_name limit 10;
```

此时数据库会返回前十条数据，如果数据库中的数据量小于十条则返回所有行数据。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113172205.png#id=aFmCL&originHeight=189&originWidth=727&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

当使用两个参数**N**，**M**时，会返回从**N**开始的**M**行数据，如

```sql
select * from table_name limit 0,10;
```

此时会返回从0开始的10条数据，不足则全部返回。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220113172157.png#id=ExpK6&originHeight=404&originWidth=759&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### WHERE

```sql
WHERE <条件1> AND/OR <条件2> AND/OR <条件3> ...
```

> `WHERE` 子句可拼接到其他语句中，但不建议语句过于复杂。
>  
> - 查询语句中你可以使用一个或者多个表，表之间使用逗号**,** 分割，并使用 `WHERE`语句来设定查询条件。
> - 你可以在 `WHERE` 子句中指定任何条件。
> - 你可以使用 `AND` 或者 `OR` 指定一个或多个条件。
> - `WHERE` 子句也可以运用于 `SQL` 的 `DELETE` 或者 `UPDATE` 命令。
> - `WHERE` 子句类似于程序语言中的 `if` 条件，根据 `MySQL` 表中的字段值来读取指定的数据。
>

> `MySQL` 的 `WHERE` 子句的字符串比较是不区分大小写的。 你可以使用 `BINARY` 关键字来设定 `WHERE` 子句的字符串比较是区分大小写的。

| 操作符 | 描述 | 实例 |
| --- | --- | --- |
| = | 等号，检测两个值是否相等，如果相等返回true | (A = B) 返回false。 |
| <> != | 不等于，检测两个值是否相等，如果不相等返回true | (A != B) 返回 true。 |
| > | 大于号，检测左边的值是否大于右边的值, 如果左边的值大于右边的值返回true | (A > B) 返回false。 |
| < | 小于号，检测左边的值是否小于右边的值, 如果左边的值小于右边的值返回true | (A< B) 返回 true。 |
| >= | 大于等于号，检测左边的值是否大于或等于右边的值, 如果左边的值大于或等于右边的值返回true | (A >= B) 返回false。 |
| <= | 小于等于号，检测左边的值是否小于或等于右边的值, 如果左边的值小于或等于右边的值返回true | (A<= B) 返回 true。 |

#### DISTINCT

```sql
SELECT DISTINCT <列名>,<列名>... FROM <表名称>
```

> `DISTINCT` 用于返回一列中 所有 的 唯一的值，即去重。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114083113.png#id=AIkdj&originHeight=149&originWidth=607&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> 注意，去重是按照多个列为一组数据去对比，比如DISTINCT后面跟了两个列名，那么对比时是需要两个都不相等才算不重复。
>  
> 如下

数据：

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220425170154.png#id=dqXAx&originHeight=308&originWidth=189&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> SQL：SELECT DISTINCT uid,exam_id FROM exam_record

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220425170137.png#id=QMKWQ&originHeight=327&originWidth=373&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

如果想要单独取一列不带重复需要用括号，

> SQL：

#### ORDER BY

```sql
SELECT <colum_name>,<colum_name>.. FROM <table_name> ORDER BY <colum_name>
```

> **ORDER BY 语句用于对结果集进行排序。**
>  
> `ORDER BY` 语句用于根据指定的列对结果集进行排序。
>  
> `ORDER BY` 语句默认按照升序对记录进行排序。
>  
> 如果您希望按照降序对记录进行排序，可以使用 `DESC` 关键字。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114083631.png#id=qOLTY&originHeight=437&originWidth=562&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### LIKE

```sql
SELECT field1, field2,...fieldN 
FROM <table_name>
WHERE field1 LIKE condition1 [AND / OR] filed2 = <'somevalue'>
```

> - 你可以在 WHERE 子句中指定任何条件。
> - 你可以在 WHERE 子句中使用LIKE子句。
> - 你可以使用LIKE代替等号 **=**。
> - `LIKE` 通常与 **%** 一同使用， `LIKE` 中使用百分号 **%**字符来表示任意字符，类似于UNIX/正则表达式中的 *，更多通配符可查看 [正则表达式](# 正则表达式)。
> - 你可以使用 `AND` 或者 `OR` 指定一个或多个条件。
> - 你可以在 `DELETE` 或 `UPDATE` 命令中使用 `WHERE...LIKE` 子句来指定条件。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114082655.png#id=BNJhb&originHeight=439&originWidth=522&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### TOP

```sql
# top 后面跟的是数字或百分比，表示前多少个，或前百分之多少个 

SELECT TOP number/percent <colum_names> FROM table_name
```

> 但是，注意 **MySQL不支持TOP**语法。
>  
> 但是**MySQL**的 `limit`等价于**TOP**。

#### IN

```sql
SELECT <column_names> FROM <table_name>
WHERE <column_name> IN (value1,value2,...)
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114100459.png#id=Xj2RF&originHeight=441&originWidth=663&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### BETWEEN

```sql
SELECT <column_names> FROM <table_name> WHERE <column_names>
BETWEEN <value1> AND <value2>
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114101113.png#id=xTqia&originHeight=510&originWidth=726&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### NULL

> 在 `MySQL`中使用 `SELECT`以及 `WHERE`来读取数据表中的数据，但是当提供的查询条件为 `NULL`时，该命令可能无法正常工作。
>  
> 关于 `NULL`的条件运算符是比较特殊的，不能使用 `=NULL` 或 `！=NULL`在列表中查找 `NULL`值。
>  
> 在 `MySQL`中，`NULL`值与其他任何值的比较（即使是 `NULL`）都会返回 `NULL`，即 `NULL=NULL`返回 `NULL`。
>  
> 为了解决这个问题，`MySQL`提供了三大**运算符**：
>  
> - **IS NULL**：当列的值是 `NULL`，返回 `TRUE`。
> - **IS NOT NULL**：当列的值不是 `NULL`，返回 `TRUE`。
> - **<=>**：比较操作符（不同于 = 运算符），当比较的的两个值相等或者都为 `NULL` 时返回 `true`。

举个🌰

```sql
# 获取所有数据
SELECT * FROM <table_name>

# 使用=和！=来过滤，结果显示并没有起作用
SELECT * FROM <table_name> WHERE <column_name> = NULL;
SELECT * FROM <table_name> WHERE <column_name> != NULL;

# 使用IS NULL和IS NOT NULL 以及 <=>
# 找等空列
SELECT * FROM <table_name> WHERE <column_name> IS NULL;
SELECT * FROM <table_name> WHERE <column_name> <=> NULL;
# 找非空列
SELECT * FROM <table_name> WHERE <column_name> IS NOT NULL;
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117174303.png#id=jPwVf&originHeight=549&originWidth=718&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117175023.png#id=wXQTQ&originHeight=411&originWidth=694&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### DATE

在MySQL中存在四种不同时的时间类型，默认为DateTime，他会存入 `YYYY-MM-DD HH:MM:SS`格式的时间。

> 当我们处理日期时，最难的任务恐怕是确保所插入的日期的格式，与数据库中日期列的格式相匹配。
>  
> 只要数据包含的只是日期部分，运行查询就不会出问题。但是，如果涉及时间，情况就有点复杂了。
>  
> MySQL 使用下列数据类型在数据库中存储日期或日期/时间值
>  
> - DATE - 格式 YYYY-MM-DD
> - DATETIME - 格式: YYYY-MM-DD HH:MM:SS
> - TIMESTAMP - 格式: YYYY-MM-DD HH:MM:SS
> - YEAR - 格式 YYYY 或 YY

#### 函数

| 函数 | 描述 |
| --- | --- |
| [NOW()](https://www.w3school.com.cn/sql/func_now.asp) | 返回当前的日期和时间 |
| [CURDATE()](https://www.w3school.com.cn/sql/func_curdate.asp) | 返回当前的日期 |
| [CURTIME()](https://www.w3school.com.cn/sql/func_curtime.asp) | 返回当前的时间 |
| [DATE()](https://www.w3school.com.cn/sql/func_date.asp) | 提取日期或日期/时间表达式的日期部分 |
| [EXTRACT()](https://www.w3school.com.cn/sql/func_extract.asp) | 返回日期/时间按的单独部分 |
| [DATE_ADD()](https://www.w3school.com.cn/sql/func_date_add.asp) | 给日期添加指定的时间间隔 |
| [DATE_SUB()](https://www.w3school.com.cn/sql/func_date_sub.asp) | 从日期减去指定的时间间隔 |
| [DATEDIFF()](https://www.w3school.com.cn/sql/func_datediff_mysql.asp) | 返回两个日期之间的天数 |
| [DATE_FORMAT()](https://www.w3school.com.cn/sql/func_date_format.asp) | 用不同的格式显示日期/时间 |

当我们想截取 `年月`/`月日`时，我们可以使用MySQL自带的时间函数：`date_format(时间列名,'时间格式')`，如：`date_format(N_time,'%m-%d')`

```sql
select N_time,date_format(N_time,'%m-%d') AS time from notice
```

结果如图：

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701230325.png#id=bqNeT&originHeight=157&originWidth=229&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### UNION

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

> **请注意**，`UNION` 内部的 `SELECT` 语句必须拥有**相同数量的列**。列也必须拥有**相似的数据类型**。同时，每条 `SELECT` 语句中的**列的顺序**必须相同。
>  
> `MySQL UNION` 操作符用于连接**两个**以上的 `SQL`语句的结果组合到一个结果集合中。
>  
> 多个 `SELECT` 语句会删除重复的数据。
>  
> 默认地，`UNION` 操作符选取不同的值。如果允许重复的值，请使用 `UNION ALL`。
>  
> 另外，`UNION` 结果集中的列名总是等于 `UNION` 中第一个 `SELECT` 语句中的列名。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114091027.png#id=tPRze&originHeight=367&originWidth=580&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

union后的结果

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114091052.png#id=IbyTV&originHeight=497&originWidth=917&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### JOIN

> **join 用于根据两个或多个表中的列之间的关系，从这些表中查询数据。**

首先,我们看准备的数据

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114113256.png#id=X81cl&originHeight=502&originWidth=536&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 查看有学分的学生的学号,姓名,学分
SELECT stu.stu_num,stu.stu_name,stus.stu_score 
from table_student as stu,table_score as stus
where stu.id = stus.stu_id;
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114105626.png#id=ExE7M&originHeight=210&originWidth=1024&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

下面我们使用 `join`来完成上面的操作.

#### INNER JOIN

```sql
# 筛选两表都符合条件的数据
SELECT stu.stu_num,stu.stu_name,stus.std_score 
FROM table_student as stu 
INNER JOIN table_score as stus 
ON stu.id = stus.stu_id
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114105956.png#id=pHwVf&originHeight=194&originWidth=1097&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### LEFT JOIN

```sql
# 返回LEFT JOIN 关键字左面表的所有行,并将右表符合条件的数据放在合适的位置
SELECT stu.stu_num,stu.stu_name,stus.std_score 
FROM table_student as stu 
LEFT JOIN table_score as stus 
ON stu.id = stus.stu_id
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114112313.png#id=Omaxb&originHeight=249&originWidth=1082&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### RIGHT JOIN

```sql
# 返回RIGHT JOIN 关键字右面表的所有行,并将左表符合条件的数据放在合适的位置
SELECT stu.stu_num,stu.stu_name,stus.std_score 
FROM table_student as stu 
RIGHT JOIN table_score as stus 
ON stu.id = stus.stu_id
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114113023.png#id=cwDBK&originHeight=235&originWidth=1093&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### FULL JOIN

> `FULL JOIN` 称为 `FULL OUTER JOIN`。但是 `MySQL`不支持.

```sql
# 只要其中某个表存在匹配，FULL JOIN 关键字就会返回行
SELECT stu.stu_num,stu.stu_name,stus.std_score 
FROM table_student as stu 
FULL JOIN table_score as stus 
ON stu.id = stus.stu_id
```

通过上面的实验你可以知道,

> - JOIN: 如果表中有至少一个匹配，则返回行
> - LEFT JOIN: 即使右表中没有匹配，也从左表返回所有的行
> - RIGHT JOIN: 即使左表中没有匹配，也从右表返回所有的行
> - FULL JOIN: 只要其中一个表中存在匹配，就返回行

### VIEW

视图是基于 `SQL` 语句的结果集的可视化的表。

视图包含行和列，就像一个真实的表。视图中的字段就是来自一个或多个数据库中的真实的表中的字段。我们可以向视图添加 `SQL` 函数、`WHERE` 以及 `JOIN` 语句，我们也可以提交数据，就像这些来自于某个单一的表。

**注释：**数据库的设计和结构不会受到视图中的函数、`where` 或 `join` 语句的影响。

#### 创建视图

```sql
CREATE VIEW <view_name> AS
SELECT <column_names>
FROM <table_name>
WHERE <condition>
```

### DESC

> 对数据进行降序排序，与 `sort by`一同使用

```sql
# Employee 表：
# +----+--------+
# | id | salary |
# +----+--------+
# | 1  | 100    |
# | 2  | 200    |
# | 3  | 300    |
# +----+--------+
SELECT salary 
from Employee
sort by salary DESC
```

### DESTINCT

> 对数据进行去重处理，用在列明之前

```sql
# Employee 表：
# +----+--------+
# | id | salary |
# +----+--------+
# | 1  | 100    |
# | 2  | 200    |
# | 3  | 200    |
# +----+--------+
SELECT DISTINCT salary 
from Employee
```

### 临时表

```sql
CREATE TEMPORARY TABLE SalesSummary (
     product_name VARCHAR(50) NOT NULL,
     total_sales DECIMAL(12,2) NOT NULL DEFAULT 0.00, 
     avg_unit_price DECIMAL(7,2) NOT NULL DEFAULT 0.00, 
     total_units_sold INT UNSIGNED NOT NULL DEFAULT 0);
```

##
