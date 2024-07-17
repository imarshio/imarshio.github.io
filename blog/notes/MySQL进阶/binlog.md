---
icon: pen-to-square
category:
  - MySQL
title: MySQL binlog
tag:
- binlog
- MySQL
---

## 简介

[Binlog（Binary Log）](https://dev.mysql.com/doc/refman/5.7/en/binary-log.html)是MySQL数据库中的一种日志文件，它记录了数据库中所有修改数据的操作，包括插入（INSERT）、更新（UPDATE）、删除（DELETE）以及数据定义语言（DDL）操作，如创建（CREATE）、修改（ALTER）和删除（DROP）表等。。

## 配置参数

### 查看`BINLOG`文件

一般情况下，binlog 文件会存放在 MySQL 的数据文件夹下，如果你不知道你的数据文件夹在哪里，你可以按照如下方式查找。

```sh
# 查看 MySQL 配置文件的位置
[root@demo ~]# whereis my.cnf
my: /etc/my.cnf
```

通过上面得知，配置文件的位置为`/etc/my.cnf`，数据文件的位置为`/var/lib/mysql`

```sh
[root@demo ~]# cd /var/lib/mysql
[root@demo mysql]# ll
total 759668
-rw-r----- 1 mysql mysql        56 May 12 01:09 auto.cnf
-rw-r----- 1 mysql mysql 684080001 Jul 17 09:47 binlog.000005
-rw-r----- 1 mysql mysql       180 Jul 17 09:53 binlog.000006
-rw-r----- 1 mysql mysql       180 Jul 17 09:54 binlog.000007
-rw-r----- 1 mysql mysql       157 Jul 17 09:55 binlog.000008
-rw-r----- 1 mysql mysql        64 Jul 17 09:55 binlog.index
```

### 查看相关参数

官方文档：[Binary Logging Options and Variables](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html)

在MySQL服务器上也可以通过如下 SQL 查询当前服务器的参数配置：

```sql
show variables like '%binlog%';
```

| 参数                                           | 值                   | 含义 |
| ---------------------------------------------- | -------------------- | ---- |
| binlog_cache_size                              | 32768                |      |
| binlog_checksum                                | CRC32                |      |
| binlog_direct_non_transactional_updates        | OFF                  |      |
| binlog_encryption                              | OFF                  |      |
| binlog_error_action                            | ABORT_SERVER         |      |
| binlog_expire_logs_auto_purge                  | ON                   |      |
| binlog_expire_logs_seconds                     | 2592000              |      |
| binlog_format                                  | ROW                  |      |
| binlog_group_commit_sync_delay                 | 0                    |      |
| binlog_group_commit_sync_no_delay_count        | 0                    |      |
| binlog_gtid_simple_recovery                    | ON                   |      |
| binlog_max_flush_queue_time                    | 0                    |      |
| binlog_order_commits                           | ON                   |      |
| binlog_rotate_encryption_master_key_at_startup | OFF                  |      |
| binlog_row_event_max_size                      | 8192                 |      |
| binlog_row_image                               | FULL                 |      |
| binlog_row_metadata                            | MINIMAL              |      |
| binlog_row_value_options                       | ""                   |      |
| binlog_rows_query_log_events                   | OFF                  |      |
| binlog_stmt_cache_size                         | 32768                |      |
| binlog_transaction_compression                 | OFF                  |      |
| binlog_transaction_compression_level_zstd      | 3                    |      |
| binlog_transaction_dependency_history_size     | 25000                |      |
| binlog_transaction_dependency_tracking         | COMMIT_ORDER         |      |
| innodb_api_enable_binlog                       | OFF                  |      |
| log_statements_unsafe_for_binlog               | ON                   |      |
| max_binlog_cache_size                          | 18446744073709547520 |      |
| max_binlog_size                                | 1073741824           |      |
| max_binlog_stmt_cache_size                     | 18446744073709547520 |      |
| sync_binlog                                    | 1                    |      |

### 重要参数

#### binlog_format

- STATEMENT：会记录完整的SQL语句，每一条 UPDATE、DELETE、INSERT 语句
- ROW：默认配置，记录行级变更，如果一个 Transaction 里，存在对一行的多次修改语句，最终只会保留修改结果
- MIXED：混合记录

```sql
-- 查看当前 binlog_format 的设置
show variables like '%binlog_format%';
```

#### binlog_row_image

决定了`变更SQL`如何写入 binlog 文件，默认为`full`，表示记录一行的全部数据，不论你更新了几个，比如，你有个表有5个字段，你只更新了2个字段，但是记录的时候会记录所有的字段

#### binlog_rows_query_log_events

仅在 binlog_format=ROW 的时候生效，不开启时，不会记录执行的具体 SQL，开启后，会记录执行的 SQL 。

#### binlog_gtid_simple_recovery

#### binlog_group_commit_sync_delay

#### binlog_group_commit_sync_no_delay_count

## 特性和用途

以下是Binlog的一些关键特性和用途：

### 事务安全

Binlog是事务安全型的，这意味着它记录了每个事务的所有操作，确保了事务的原子性和一致性

### 复制支持

Binlog是MySQL主从复制的基础。主服务器（Master）生成Binlog，从服务器（Slave）读取并执行这些日志中的操作，从而实现数据的同步

### 数据恢复

通过Binlog，可以恢复因误操作导致的数据丢失。管理员可以使用Binlog文件来回滚或重放事务，恢复到某个特定时间点的数据状态

### 审计和监控

Binlog记录了所有修改数据的操作，因此可以用于审计和监控数据库的变更历史，分析数据库的访问模式和性能瓶颈

### 性能影响

开启Binlog会有一定的性能开销，因为它需要记录每个事务的详细操作。不过，这种影响通常在可接受范围内。

### 存储和维护

Binlog文件会占用磁盘空间，需要定期清理和维护。可以通过设置`expire_logs_days`参数来自动清理旧的Binlog文件。

### 安全性

Binlog文件中包含了数据库的详细操作记录，因此需要妥善保护，防止未授权访问。

## 解析

### 内容

在解析前我们先了解一下 binlog 文件都有哪些内容吧，不然解析出来都不认得就尴尬了。

首先，我们需要确认当前的配置，主要就是如下几个配置，不然你怎么解析，解析出来的内容你都不方便阅读。

```sql

```

### 样例

基本看不懂的输出格式配置

```sql
# at 2607
#240717 13:52:04 server id 1  end_log_pos 2686 CRC32 0xd673a51b         Anonymous_GTID  last_committed=5        sequence_number=6       rbr_only=yes    original_committed_timestamp=1721195524808310   immediate_commit_timestamp=1721195524808310     transaction_length=357
/*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
# original_commit_timestamp=1721195524808310 (2024-07-17 13:52:04.808310 CST)
# immediate_commit_timestamp=1721195524808310 (2024-07-17 13:52:04.808310 CST)
/*!80001 SET @@session.original_commit_timestamp=1721195524808310*//*!*/;
/*!80014 SET @@session.original_server_version=80037*//*!*/;
/*!80014 SET @@session.immediate_server_version=80037*//*!*/;
SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
# at 2686
#240717 13:52:04 server id 1  end_log_pos 2772 CRC32 0xc813e61b         Query   thread_id=22    exec_time=0     error_code=0
SET TIMESTAMP=1721195524/*!*/;
BEGIN
/*!*/;
# at 2772
#240717 13:52:04 server id 1  end_log_pos 2847 CRC32 0x3ce01deb         Table_map: `mybatis`.`role` mapped to number 108
# has_generated_invisible_primary_key=0
# at 2847
#240717 13:52:04 server id 1  end_log_pos 2933 CRC32 0x63218733         Write_rows: table id 108 flags: STMT_END_F
# at 2933
#240717 13:52:04 server id 1  end_log_pos 2964 CRC32 0xfe84517b         Xid = 413
COMMIT/*!*/;
# at 2964
#240717 15:26:09 server id 1  end_log_pos 3043 CRC32 0x23b7e7b1         Anonymous_GTID  last_committed=6        sequence_number=7       rbr_only=yes    original_committed_timestamp=1721201169478520   immediate_commit_timestamp=1721201169478520     transaction_length=427
/*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
# original_commit_timestamp=1721201169478520 (2024-07-17 15:26:09.478520 CST)
# immediate_commit_timestamp=1721201169478520 (2024-07-17 15:26:09.478520 CST)
/*!80001 SET @@session.original_commit_timestamp=1721201169478520*//*!*/;
/*!80014 SET @@session.original_server_version=80037*//*!*/;
/*!80014 SET @@session.immediate_server_version=80037*//*!*/;
SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
# at 3043
#240717 15:26:09 server id 1  end_log_pos 3138 CRC32 0xd7ffff4a         Query   thread_id=22    exec_time=0     error_code=0
SET TIMESTAMP=1721201169/*!*/;
BEGIN
/*!*/;
# at 3138
#240717 15:26:09 server id 1  end_log_pos 3213 CRC32 0x0e6db3ba         Table_map: `mybatis`.`role` mapped to number 108
# has_generated_invisible_primary_key=0
# at 3213
#240717 15:26:09 server id 1  end_log_pos 3360 CRC32 0xba48de84         Update_rows: table id 108 flags: STMT_END_F
# at 3360
#240717 15:26:09 server id 1  end_log_pos 3391 CRC32 0x5086dcb7         Xid = 447
COMMIT/*!*/;
SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
DELIMITER ;
DELIMITER ;
# End of log file
# End of log file
/*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
/*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
/*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;
```

查看[mysqlbinlog](./mysqlbinlog.md)
