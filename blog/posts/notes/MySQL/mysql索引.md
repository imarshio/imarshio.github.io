---
icon: pen-to-square
date: 2021-03-17
category:
  - mysql
title: 索引 
# tag:

---

> 索引是一个（？）的（？）。
>  
> 索引有利有弊。在会用的人手里，利大大大于弊。在不会用的人手里，利弊不相上下（目前的我就是这个级别，所以说起索引，我也是蒙的很）。
>  
> 首先啊，经过两天的基础学习，我知道了要想知道索引的好坏，那么你必须要先了解什么是索引，然后是它的数据结构---B+树。其次，你需要知道它是如何存储的，存储在哪，怎么调用。

## 准备

- B 树
- B+ 树
- B+ 树
- B+ 树
- 。。。

### WHAT？

在关系数据库中，索引是一种**单独**的、**物理**的，对数据库表中的**一列或多列**的值进行**排序**的一种**存储结构**（B+树），他是表中一列或多列值的集合和一系列指向实际数据的指针集合（类似字典K-V）。

所以，索引独立于数据表，也是一个文件，所以索引也是**存储在磁盘**上的，每次开启MySQL客户端后，会加载索引文件到**内存**中。

### WHY？

为什么使用索引？

因为索引能提高我们查询的效率，为什么能够提高我们的查询效率？这就需要说一下数据库查询的过程。

当数据库中有大量数据时，想要查询一条数据，最简单粗暴的方式就是逐一匹配（全表搜索），这既是最慢的，慢在两点，其一，**待匹配的数据量**大且**无序**，其二，加载数据所需的**IO**次数多，也会造成时间浪费。

为了减少上面所需时间，我们就需要从这两方面下手。

所以出现了以**B+树**为数据结构的索引。

B+树能保证IO次数不会太多，索引是行数据的**关键值**得集合，保证了小体量的数据，一个索引文件能够存储大量的索引。

创建索引时，你需要确保该索引是应用在 `SQL` 查询语句的条件(一般作为 `WHERE` 子句的条件)，即保证索引能起作用。

实际上，索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录。

### 优点

`MySQL`索引的建立对于 `MySQL`的高效运行是很重要的，索引可以大大提高 `MySQL`的检索速度。

打个比方，如果合理的设计且使用索引的 `MySQL`是一辆兰博基尼的话，那么没有设计和使用索引的 `MySQL`就是一个人力三轮车。

拿汉语字典的目录页（索引）打比方，我们可以按拼音、笔画、偏旁部首等排序的目录（索引）快速查找到需要的字。

### 缺点

虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行 `INSERT`、`UPDATE`和 `DELETE`。因为更新表时，`MySQL`不仅要保存数据，还要保存一下索引文件。

索引文件会占用磁盘空间，所以，索引不是越多越好。

### 分类

根据底层实现可以分为**B-Tree索引**和**哈希索引**。

根据存储方式可以分**聚簇索引**和**非聚簇索引**，下还可分为**单列索引**、**组合索引**、**普通索引**、**唯一索引**、**覆盖索引**

---

## 索引类型

### 聚簇索引

> 聚簇索引，按我的意思来说就是，其指向的地址包含行数据的全数据，即找到该索引，你就能通过索引指向的地址找到你需要的所有数据。有且仅有一个聚簇索引，可以等价理解为主键，其实他就是主键（有主键的情况下）。
>  
> 官方原话：
>  
> The InnoDB term for a primary key index. InnoDB table storage is organized based on the values of the primary key columns, to speed up queries and sorts involving the primary key columns. For best performance, choose the primary key columns carefully based on the most performance-critical queries. Because modifying the columns of the clustered index is an expensive operation, choose primary columns that are rarely or never updated.
>  
> 大致意思：
>  
> 聚簇索引是InnoDB引擎中主键索引的术语。为了加快主键列的查询和排序，InnoDB的聚簇索引存储的是主键索引列。所以选择主键时需要认真选，不然后期维护很费时间和钱。
>  
> 当然也是会有意外情况的，比如我们建表时没有选择主键，那么MySQL会如何处理呢？
>  
> ① 聚簇索引默认选择主键。
>  
> ② 如果表中没有定义主键，InnoDB会选择一个唯一（unique index）的非空索引代替。
>  
> ③ 如果没有上面那样的索引，InnoDB会自动地创建一个6字节的隐式主键作为聚簇索引。

举个🌰，来说明聚簇索引具体的功能。

```sql
#数据表有以下字段
create table db_student(
    id int(8) unsigned auto_increment primary key,
    stu_num  varchar(8)  null,
    stu_name varchar(16) null,
    stu_age  int(3)      null,
    stu_sex  varchar(1)  null,
    constraint stu_num
    unique (stu_num)
);

insert into db_student(stu_num,stu_name,stu_age,stu_sex) values('2017','张三',20,'0');
insert into db_student(stu_num,stu_name,stu_age,stu_sex) values('2018','里斯',20,'0');
insert into db_student(stu_num,stu_name,stu_age,stu_sex) values('2019','李四',20,'0');
insert into db_student(stu_num,stu_name,stu_age,stu_sex) values('2020','王五',20,'0');

# 主键自增，所以我们不用插入，在数据库中会自动从1开始自增
```

可以看到主键是id，那么聚簇索引就是id，你在主键的索引文件中找到对应的列，假设索引文件如下（实际不是，只是为了好体现出聚簇索引）：

| id | 地址 |
| --- | --- |
| 1 | 0001 |
| 2 | 0002 |
| 3 | 0003 |
| 4 | 0004 |

```sql
# 此时我们查询id=1的数据
select * from db_student where id = 1;

# 语句命中索引，所以我们会去索引文件查询id=1的数据行，找到后，根据地址去存储实际数据的文件找到该地址存储的数据，里面会包含（'2017','张三',20,'0'）
```

### 非聚簇索引

> 非聚簇索引也叫二级索引、辅助索引、普通索引。
>  
> 它的叶子节点指向的是主键索引的地址。命中非聚簇索引后，通过非聚簇索引文件找到聚簇索引文件的地址，再通过聚簇索引文件找到对应的数据，<u>非聚簇索引文件 --> 聚簇索引文件</u> 的这一过程也叫**回表**。

|  | 聚簇索引 | 非聚簇索引 |
| --- | --- | --- |
| key | 索引列的值（不能为空） | 索引列的值（可以为空） |
| value | 指向数据存储地址 | 指像聚簇索引文件地址 |
| 叶子节点 | 存储对应的行数据的地址 | 存储对应的主键值 |

举个🌰

下表中，数字列为主键（聚簇索引）。

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220325105633.png#id=fUAee&originHeight=424&originWidth=631&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

图源：[https://www.jianshu.com/p/fa8192853184](https://www.jianshu.com/p/fa8192853184)

### 单列索引

> 一个索引只包含单个列，一个表可以有多个单列索引，但这不是组合索引。

### 组合索引

> 又称联合索引，说的是一个索引包含多个列。
>  
> 创建组合索引后，索引文件中的叶子节点会同时包含每个索引列的值，并根据多列排序

举个🌰

```sql
# 建表时建立主键
CREATE TABLE IF NOT EXISTS `db_stu`(
    `id` int(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `stu_num` int(8),
    `stu_name` varchar(16),
    `stu_age` int(3)
)ENGINE=InnoDB;

# 建立组合索引,注意，这里不要加id，因为已经存在id索引文件了，
# 组合索引:id,stu_num,stu_name在使用上并不会比组合索引：stu_num,stu_name + 主键索引：id好
CREATE INDEX index_union ON db_stu (stu_num,stu_name,stu_age);

insert into db_stu(stu_num,stu_name,stu_age) values('2017','张三',20);
insert into db_stu(stu_num,stu_name,stu_age) values('2018','ls',20);
insert into db_stu(stu_num,stu_name,stu_age) values('2019','里斯',20);
insert into db_stu(stu_num,stu_name,stu_age) values('2020','李四',20);
# 查看索引
SHOW INDEX FROM db_stu;
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220120154648.png#id=UNUdo&originHeight=289&originWidth=1316&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 最左匹配

> 说到组合索引，那就不得不说一下最左匹配原则了。
>  
> 什么是最左匹配原则？
>  
> 在创建了组合索引之后，并不是 `where`子句中包含组合索引就能命中组合索引的，想要命中组合索引时需要一定条件的。
>  
> 有兴趣的小伙伴可以参考官方文档：[组合索引](https://dev.mysql.com/doc/refman/5.7/en/multiple-column-indexes.html)。
>  
> 官方原话：
>  
> If the table has a multiple-column index, any leftmost prefix of the index can be used by the optimizer to look up rows. For example, if you have a three-column index on `(col1, col2, col3)`, you have indexed search capabilities on `(col1)`, `(col1, col2)`, and `(col1, col2, col3)`.
>  
> 最左匹配类似于选择省市县时，需要先选择省，缩小范围（确定下一级范围）这种意思。
>  
> 表示假设对表中的（A，B，C）建立组合索引，那么能命中索引的场景如下
>  
> - （A，B，C）（A，B）（A），
> - 使用通配符时，

```sql
# 联合索引为（stu_num,stu_name,stu_age）,能命中索引的情况如下
explain select * from db_stu where stu_num='2017' and stu_name='ww' and stu_age=20;
explain select * from db_stu where stu_num='2017' and stu_name='ww';
explain select * from db_stu where stu_num='2017';

# 剩下的都不能命中索引
explain select * from db_stu where stu_name = 'ww' and stu_age=20;
```

#### 索引下推

### 唯一索引

> 它与普通索引类似，不同的就是
>  
> - 索引列的值必须唯一，允许有空值。
> - 如果是组合索引，则列值的组合必须唯一。

### 覆盖索引

> 由于非覆盖索引的叶子节点没有完整的数据信息，所以我们需要**回表**，来保证我们能取到自己所需的数据，但是回表相当于又进行一次查询，可能会涉及多次IO。
>  
> 覆盖索引并不是一种真的索引，他只是一种针对**回表**的优化方案。

举个🌰

```sql
# 创建一个表，查询其中的两个值
create table db_test(
 `id` int auto_increment primary key,
    `name` varchar(16),
    `age` int(3)
)engine=innodb;

# 创建name为普通索引
create index index_name on db_test(name);

# 插入示例数据
insert into db_test(name,age) values('zs',20);
insert into db_test(name,age) values('ls',20);
insert into db_test(name,age) values('ww',20);
```

业务场景：看如下信息查询的不同

```sql
# 
select id,name,age from db_test where name='zs';
select id,name from db_test where name='zs';
```

> 首先这里涉及到了MySQL存储索引的方式，需要了解B+树的结构，还需要了解索引文件的结构
>  
> 第一条语句执行顺序：先去name的索引文件找到“zs”，根据“zs”找到数据ID，再根据ID，去ID的索引文件（聚簇索引文件）中寻找匹配的数据，返回数据。
>  
> 第二条语句执行顺序：去name的索引文件找到“zs”，根据“zs”找到了ID，这时已经找到了所需数据，直接返回数据。
>  
> 上面的不同是，第二条语句没有**回表**，仅靠辅助索引就找到了所需的数据，这就是覆盖索引。

## 索引操作

### 建表时指定索引

```sql
# 建表时添加主键索引
CREATE TABLE mytable(  
 `ID` INT NOT NULL,   
 `username` VARCHAR(16) NOT NULL,  
 PRIMARY KEY (`ID`));

# 建表时添加普通索引
CREATE TABLE mytable(  
 `ID` INT NOT NULL,   
 `username` VARCHAR(16) NOT NULL,  
 INDEX [indexName] (username(length)));

# 建表时指定唯一索引
CREATE TABLE mytable(  
 `ID` INT NOT NULL,   
 `username` VARCHAR(16) NOT NULL,  
 UNIQUE [indexName] (username(length)));

# 建表时添加组合索引
CREATE TABLE mytable(  
 `ID` INT NOT NULL,   
 `username` VARCHAR(16) NOT NULL,
    `userage` VARCHAR(16) NOT NULL,
 INDEX <indexName> (username,userage);
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114154335.png#id=Wphjc&originHeight=171&originWidth=497&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 添加索引

> 表构建完成，最好在添加数据前就想好如何建立索引。
>  
> 添加索引有两种方式
>  
> - ALTER TABLE table_name ADD INDEX …
> - CREATE INDEX … ON table_name ，（推荐，相对修改表结构更快）

```sql
# 修改表结构,添加普通索引
ALTER TABLE <table_name> ADD INDEX <index_name>(column_name);

# 修改表结构,添加唯一索引
ALTER TABLE <table_name> ADD UNIQUE <index_name>(column_name);

# 修改表结构，添加全文索引
ALTER TABLE <table_name> ADD FULLTEXT <index_name>(column_name);


# 添加普通索引，最后这个括号必须要加,
CREATE INDEX <indexName> ON <table_name> (column_name);

# 添加唯一索引
CREATE UNIQUE INDEX <indexName> ON <table_name> (column_name);

# 添加全文索引
CREATE FULLTEXT INDEX <indexName> ON <table_name> (column_name);
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114152544.png#id=WF0xy&originHeight=88&originWidth=488&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114152201.png#id=sFUaA&originHeight=85&originWidth=532&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 查看索引

```sql
SHOW INDEX FROM <table_name>;
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114155321.png#id=RYEYi&originHeight=176&originWidth=1305&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

> **Table:** 表名
>  
> **Non_unique:** 是否为唯一索引，0为是，1为不是。
>  
> **Key_name 索引名称**，如果名字相同则表明是同一个索引，而并不是重复，比如上图中的第四、五条数据，索引名称都是**name**，其实是一个联合索引。
>  
> **Seq_in_index** 索引中的列序列号，从1开始。上图中的四、五条数据，**Seq_in_index**一个是1一个是2，就是表明在联合索引中的顺序，我们就能推断出联合索引中索引的前后顺序。
>  
> **Column_name** 索引的列名。
>  
> **Collation**指的是列以什么方式存储在索引中，大概意思就是字符序。
>  
> **Cardinality** 是基数的意思，表示索引中唯一值的数目的估计值。我们知道某个字段的重复值越少越适合建索引，所以我们一般都是根据**Cardinality**来判断索引是否具有高选择性，如果这个值非常小，那就需要重新评估这个字段是否适合建立索引。
>  
> **Sub_part** 前置索引的意思，如果列只是被部分地编入索引，则为被编入索引的字符的数目。如果整列被编入索引，则为NULL。
>  
> **Packed** 指示关键字如何被压缩。如果没有被压缩，则为NULL。压缩一般包括压缩传输协议、压缩列解决方案和压缩表解决方案。
>  
> **Null** 如果列含有NULL，则含有YES。
>  
> **Index_type**表示索引类型，Mysql目前主要有以下几种索引类型：FULLTEXT，HASH，BTREE。
>  
> **Comment Index_comment** 注释的意思。

### 删除索引

同添加索引，一样有两种方式删除索引

- DROP，直接删除索引 （推荐，相比修改表结构更快）
- ALTER，修改表结构

```sql
# 直接删除,如果不写的话，默认删除全部
DROP INDEX [index_name] ON <table_name>

# 修改表结构
ALTER TABLE <table_name> DROP INDEX <index_name>
```

![](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220114155433.png#id=duIJh&originHeight=184&originWidth=1303&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
