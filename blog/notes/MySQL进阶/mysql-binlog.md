---
icon: pen-to-square
category:
  - MySQL
title: MySQL binlog 解析
tag:
- binlog
- MySQL
---

## mysqlbinlog

### 前提

- `binlog_format=row`
- `binlog_row_image=full`
- `binlog_rows_query_log_events=off`

### 命令

#### 输出详细的 `SQL`

```sh
# 解析binlog
mysqlbinlog --base64-output=DECODE-ROWS -v binlog.000008

# ***********************输出如下***********************

# at 2607 --表示这是一个 position
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
### INSERT INTO `mybatis`.`role`
### SET
###   @1=2
###   @2='TEACHAER'
###   @3='Teacher'
###   @4='教师'
###   @5='老师'
###   @6=b'1'
###   @7='2024-07-17 13:52:04'
###   @8='2024-07-17 13:52:04'
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
### UPDATE `mybatis`.`role`
### WHERE
###   @1=2
###   @2='TEACHAER'
###   @3='Teacher'
###   @4='教师'
###   @5='老师'
###   @6=b'1'
###   @7='2024-07-17 13:52:04'
###   @8='2024-07-17 13:52:04'
### SET
###   @1=2
###   @2='TEACHAER'
###   @3='Teacher'
###   @4='教师'
###   @5='老师，教师'
###   @6=b'1'
###   @7='2024-07-17 13:52:04'
###   @8='2024-07-17 15:26:09'
# at 3360
#240717 15:26:09 server id 1  end_log_pos 3391 CRC32 0x5086dcb7         Xid = 447
COMMIT/*!*/;
SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
DELIMITER ;
```

## 参考

－<https://dev.mysql.com/doc/refman/8.0/en/mysqlbinlog-row-events.html>
