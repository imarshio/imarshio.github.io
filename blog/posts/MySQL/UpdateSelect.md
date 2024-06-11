---
icon: pen-to-square
order: 99
category:
  - MySQL
title: MySQL update 不支持子查询
tag:
- MySQL
- 小技巧
---

背景：业务需要将一批误操作的数据状态还原，由于系统还不是很成熟，所以批量接口还不支持，所以只能从数据库层面进行操作。

## 数据准备

- MySQL 版本：8.0.25
- 服务器：2c2G （负载很低）

### 表结构

```sql
create table case_update_self
(
    id           int unsigned auto_increment
        primary key,
    global_id    varchar(64) not null,
    status       varchar(16) not null,
    publish_time datetime    null,
    constraint global_id
        unique (global_id)
);
```

### 数据

现在可以直接通过我在服务器上搭建的 `MySQL` 测试。

| k        | v              |
| -------- | -------------- |
| IP       | 106.15.104.240 |
| user     | demo           |
| password | T&UY9QdNDScZ   |
| database | demo           |
| table    | case_update_self |

## 确定数据范围

```sql
-- 筛选出状态为 RECYCLE 的数据
select * from case_update_self where status = 'RECYCLE'
```

## update select

```sql
update case_update_self
set status = 'PASS'
where global_id in (select global_id from case_update_self where status = 'RECYCLE')
```

输出：`[HY000][1093] You can't specify target table 'case_update_self' for update in FROM clause`

## 尝试其他方法

```sql
update case_update_self 
inner join (select * from case_update_self where status = 'RECYCLE') tmp on tmp.global_id = case_update_self.global_id
set case_update_self.status = 'PASS'
where tmp.status = 'RECYCLE'
```
