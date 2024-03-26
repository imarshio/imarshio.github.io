---
icon: pen-to-square
date: 2021-03-17
category:
  - mysql
title: 事务 
# tag:

---

MySQL 事务(**Transaction**)主要用于处理操作量大，复杂度高的数据。

比如说，在人员管理系统中，你删除一个人员，你既需要删除人员的基本资料，也要删除和该人员相关的信息，如信箱，文章等等，这样，这些数据库操作语句就构成一个事务！

> - 在 `MySQL` 中只有使用了 `Innodb` 数据库引擎的数据库或表才支持事务。MyISAM不支持事务。
> - 事务处理可以用来维护数据库的**完整性**，保证成批的 `SQL` 语句要么全部执行，要么全部不执行。
> - 事务用来管理 `insert`,`update`,`delete` 语句

### MVCC

> 全称是**M**ulti**V**ersion **C**oncurrency **C**ontrol ，翻译过来就是多版本并发控制，一般用于数据库管理系统，实现对数据库的并发访问。

#### 为什么需要

> 数据库通常使用锁来实现隔离性。最原生的锁，锁住该资源后会禁止其他任何线程访问该资源。
>  
> 矛盾产生：大多数的业务场景是读多写少，而读锁之间的相互排斥就会显得不是很必要。
>  
> 所以产生了读锁、写锁。读锁与读锁之间不互斥，写锁与读锁或写锁互斥。
>  
> 之后由于业务场景再次升级，仅仅是读锁、写锁已经满足不了当时的业务场景，所以有了读锁与写锁不互斥的方法，就是在读取数据时将数据按照**快照**的方式保存下来，即 `MVCC`，这样读锁与写锁不在冲突。
>  
> **快照**在不同的数据库有不同的实现方式。

#### InnoDB

> 上面说到，在 `MySQL`中只有 `InnoDB`支持事务，而在事务的四大隔离级别中又只有 `READ COMMITTED` 、`REPEATABLE READ`支持 `MVCC`，因为 `READ UNCOMMITTED` 的业务场景不符合 `MVCC`的业务场景，他只读取最新版本的数据，而 `SERIALIZABLE`会对所有的读取行加锁，不存在共享。

#### 实现

// TODO

### ACID

> 事务需要满足四个条件，ACID
>
> - 原子性(Automatic):一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成.
> - 一致性(Consistency):WAL(Write-Ahead Logging)
> - 隔离性(Isolation):数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同的级别,包括读未提交,读已提交,可重复读,串行化.
> - 持久性(Durablity):事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。
>
> 在 `MySQL` 命令行的默认设置下，事务都是自动提交的，即执行 `SQL` 语句后就会马上执行 `COMMIT` 操作。因此要显式地开启一个事务务须使用命令 `BEGIN` 或 `START TRANSACTION`，或者执行命令 `SET AUTOCOMMIT=0`，用来禁止使用当前会话的自动提交。

### BEGIN

> 开始一个事务,等同于 `START TRANSACTION`.

### COMMIT

> 提交一个事务,等同于 `COMMIT WORK`.

### ROLLBACK

> 事务回滚,等同于 `ROLLBACK WORK`.
>  
> `ROLLBACK TO identifier`,回滚到保存点.

### SAVEPOINT

> `SAVEPOINT identifier`,在事务中创建一个保存点,在一个事务中可以有多个保存点.
>  
> 可以利用保存点开启子事务,子事务失败进行回滚,而不影响主事务.

### RELEASE

> `RELEASE SAVEPOINT identifier` ,释放/删除一个保存点,

### SET

> `SET TRANSACTION`,设置事务隔离级别.

```sql
# 查看当前隔离级别
SELECT @@tx_isolation;

# 在事务开始之前设置此次事务会话的隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL (READ COMMITTED/READ UNCOMMITTED/REPEATABLE READ/SERIALIZABLE)

# 设置全局事务默认的隔离级别
SET GLOBAL TRANSACTION ISOLATION LEVEL (READ COMMITTED/READ UNCOMMITTED/REPEATABLE READ/SERIALIZABLE)
```

### 问题

> 事务在**并发**时可产生以下数据问题
>  
> - **脏读**
> - **不可重复读**
> - **幻读**
> - **第一类更新丢失**
> - **第二类更新丢失**

#### 脏读

> 指事务读取到了另一事务**未提交的数据**。
> 隔离级别为读未提交可产生脏读，可重复读，幻读。

举个🌰

- 事务A开启，进行读取数据。
- 事务B开启，修改数据，此时，事务B未提交。
- 事务A再次读取数据，读取到了B修改的数据。
- 事务B由于某种原因，进行了回滚。此时事务A读取到的数据就是脏数据，即脏读。

#### 不可重复读

> 指在一事务中，前后两次读取到的数据不一致。这里的不一致指的是某一**数据的值**前后发生了变化。强调的是**一条或多条数据的值**。

举个🌰

- 事务A开启，进行读取数据。
- 事务B开启，修改数据，提交。
- 事务A再次读取数据，读取到了B修改的数据，导致两次读取数据产生了差异，即不可重复读。

#### 幻读

> 指在一事务中，前后两次读取到的数据不一样。这里的不一样指的是**数据集合**的增减差异。强调的是**数据集合**。

举个🌰

- 事务A开启，进行读取数据。
- 事务B开启，新增数据，提交。
- 事务A再次读取数据，读取到了B新增的数据，导致两次读取到的数据集合不一样，即幻读。

#### 第一类更新丢失

> 指两个事务都对数据进行更新，但是由于由于某种原因，其中一个事务进行了回滚，把事务B已提交的更新的数据给覆盖了。

#### 第二类更新丢失

> 指两个事务都对数据进行更新，但是事务A的更新把已提交的事务B的更新数据给覆盖了。

---

### 事务隔离级别

> 在 `MySQL`中,`InnoDB`存储引擎提供的事务隔离级别有四种，隔离级别由低到高为
>  
> - 读未提交,`READ UNCOMMITTED`
> - 读已提交,`READ COMMITTED`
> - 可重复读,`REPEATABLE READ`
> - 串行读取,`SERIALIZABLE`
>
>
> 事务的隔离级别越高，越能保证数据的一致性完整性，但是执行效率也越低。
>  
> `MySQL`默认启用的是可重复读。

#### 读未提交

> 字面意思,在事务没提交的时候仍然可以读到更新后的数据,即该级别的事务对查询无影响.
>  
> 由此会产生问题
>  
> - 不可重复读，由于可读取到未提交的数据，前后两次读取到的数据不一致，产生不可重复读。
> - 如果事务B因为某种原因进行了回滚，那么就会导致事务A的查询读到的数据为脏数据，即脏读。
> - 同理，如果事务B进行的是新增操作，就会产生幻读。

举个🌰

```sql
# 开启事务前先查看数据库数据
select * from db_student;

# 1.设置事务A、B为读未提交的隔离级别，需要开启两个终端，set session指设置当前会话的隔离级别
set session transaction isolation level read uncommitted;
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117100551.png#id=ape4e&originHeight=377&originWidth=1276&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 2.开启事务A、B
begin
// 等同于命令 start transaction

# 事务A查询，事务B修改数据
# 事务A 查询
select * from db_student;
# 事务B 更新
update db_student set stu_name = 'read uncommitted' where id = 1;
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117101604.png#id=ifhUh&originHeight=332&originWidth=1230&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务A再次查询
select * from db_student;
# 两次查询结果值不一样，发生了不可重复读

# 事务B回滚，提交
rollback;
commit;

# 结束事务后查询，事务A查询到的数据此时就是脏数据，即脏读
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117102646.png#id=KTGCh&originHeight=554&originWidth=1288&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 读已提交

> 读取到的数据是事务提交之后的数据,这样就不会发生数据回滚对查询的结果造成了影响.
>  
> 但是，此时会有另外一个问题，假设事务A正在执行隔离级别为读已提交的事务，事务A还未提交,还没有执行结束，此时，事务B对事务A查询的表进行了更新并提交了事务，但事务A没读到更新的数据,这就是不可重复读.

举个🌰

```sql
# 开启事务前先查看数据库数据
select * from db_student;

# 1.设置事务A、B为读已提交的隔离级别，需要开启两个终端，set session指设置当前会话的隔离级别
set session transaction isolation level read committed;

# 开启事务A、B
begin；
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117111848.png#id=FPruO&originHeight=418&originWidth=1292&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务A查询，事务B新增/修改，事务A查询
# 可以看到暂时没有发生不可重复读，既如此，脏读也不会发生
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117110920.png#id=Hcu43&originHeight=552&originWidth=1296&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务B提交，事务查询
# 可以看到，发生了不可重复读，但是没有发生脏读，
# 如果事务B进行的是新增操作，那么就会发生幻读，
# 所以读已提交解决了脏读的问题，但是没有解决不可重复读以及幻读的问题
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117111206.png#id=uEEge&originHeight=547&originWidth=1295&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 可重复读

> 可重复读指在事务中读取数据时,读的是进入事务时的快照,而不一定是当前版本的数据,因为可重复读使用了MVCC机制,select不会更新版本号,但是insert,update,delete会更新版本号,是当前读(最新版本的数据).
>  
> 这样避免了不可重复读与幻读的问题,但是不能解决脏读的问题.

举个🌰

```sql
# 开启事务前先查看数据库数据
select * from db_student;

# 1.设置事务A、B为读已提交的隔离级别，需要开启两个终端，set session指设置当前会话的隔离级别
set session transaction isolation level read committed;

# 开启事务A、B
begin；
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117111838.png#id=fhQcC&originHeight=384&originWidth=1283&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务A查询，事务B修改/新增
# 事务A查询
# 没有发生不可重复读，没有发生脏读
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117112223.png#id=oVRij&originHeight=546&originWidth=1296&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务B提交，事务A查询
# 没有发生不可重复读，
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117112406.png#id=qspxt&originHeight=540&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```sql
# 事务B新增，事务A更新事务B新增的数据，事务A查询
# 出现了幻读，图片标注错误，说明可重复读并不会完全避免幻读
```

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117123321.png#id=pK97l&originHeight=555&originWidth=1297&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 串行读取

> 事务级别为串行化读取时，在执行事务期间，事务会串行执行，也会锁表，因此不会出现幻读，但是并发性极低。唯一的并发就是操作不同的表时，可能会出现并发。

举个🌰

![image](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20220117123619.png#id=torz9&originHeight=56&originWidth=833&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

[官方](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_phantom)文档说明，在所有的隔离级别中，幻读只有串行读取才能避免，在可重复读，读已提交，读未提交级别中都会出现。

所以就没必要举例子了。

**注意**

> 事务隔离级别为读提交时,写数据会锁住相应的行.

**隔离级别产生的问题**

| 隔离级别/产生的错误 | 脏读 | 不可重复读 | 幻读 | 第一类 | 第二类 |
| --- | --- | --- | --- | --- | --- |
| 读未提交 | ✔️ | ✔️ | ✔️ |  |  |
| 读已提交 | ❌ | ✔️ | ✔️ |  |  |
| 可重复读 | ❌ | ❌ | ✔️ |  |  |
| 串行化 | ❌ | ❌ | ❌ |  |  |

**隔离级别解决的问题**

| 隔离级别/解决的错误 | 脏读 | 不可重复读 | 幻读 | 第一类 | 第二类 |
| --- | --- | --- | --- | --- | --- |
| 读未提交 | ❌ | ❌ | ❌ |  |  |
| 读已提交 | ✔️ | ❌ | ❌ |  |  |
| 可重复读 | ✔️ | ✔️ | ❌ |  |  |
| 串行化 | ✔️ | ✔️ | ✔️ |  |  |
