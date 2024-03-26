---
icon: pen-to-square
date: 2021-03-17
category:
  - mysql
title: 用户管理 
# tag:

---

> 为了数据的安全，我们在访问数据库的时候，不能直接以root的用户进行操作，所以我们需要创建新用户，并给他们相应的权限去完成相应的任务。

### 创建用户

```sql
-- 创建访问用户
-- CREATE USER '用户名'@'授权ip' identified by '用户密码'
CREATE USER 'query_1'@'%' identified by 'query_pwd'
```

- query_1：用户名
- @：拼接符，拼接用户名和主机地址
- %：来自任何地址的访问
- query_pwd：用户密码

### 权限管理

```sql
# 给
grant all on *.* to 'query_1'@'%';

GRANT ALL PRIVILEGES ON aigc_demo.* TO 'aigc_demo'@'%' WITH GRANT OPTION;
```

- all：所有的权限
- on：基于哪些表，后面跟数据的数据表
- `*.*` 所有数据库下的所有表，第一个 `*`代表数据库
