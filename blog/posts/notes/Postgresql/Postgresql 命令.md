---
icon: pen-to-square
date: 2021-03-17
category:
  - postgresql
title: pg命令
# tag:

---

前言

以下命令中`[]`表示可选项，

## 角色/用户

在postgres13中，用户和角色共用一张表，用户和角色的关系通过`rolcanlogin`区分，能LOGIN的是user，不能LOGIN的是role（目前来看，不保准后面会有特例）。
参考
[https://www.postgresql.org/docs/15/sql-alterrole.html](https://www.postgresql.org/docs/15/sql-alterrole.html)

### 查看角色

```sql
select * from pg_roles;
```

#### 属性

参考官方文档：[https://www.postgresql.org/docs/13/role-attributes.html](https://www.postgresql.org/docs/13/role-attributes.html)

| 列name | 含义 |
| --- | --- |
| rolname | 用户名称 |
| rolsuper | 是否超级用户，使用`SUPERUSER`来标识这是一个超级用户 |
| rolinherit | 用户继承 |
| rolcreaterole | 能否创建用户，使用`CREATEROLE`来标识这个用户可以创建用户，但是不能用于创建超级用户 |
| rolcreatedb | 能否创建数据库，使用`CREATEDB`来标识这个用户可以创建数据库 |
| rolcanlogin | 能否登录，使用`LOGIN`来标识这个用户可以登录 |
| rolreplication | 能否启用流式复制，使用`REPLICATION LOGIN`来标识这个用户可以启用流失复制 |
| rolconnlimit | 用户连接数据库限制，使用`CREATE ROLE _**name**_ CONNECTION LIMIT '_**integer**_'.`来限制一个用户的最大连接数，`-1`表示不限制 |
| rolpassword | 用户密码，使用`CREATE ROLE _**name**_ PASSWORD '_**string**_'`指定用户密码 |
| rolvaliduntil |  |
| rolbypassrls |  |
| rolconfig | 用户配置 |
| oid | 用户id |

示例

```sh
rolname                | rolsuper | rolinherit | rolcreaterole | rolcreatedb | rolcanlogin | rolreplication | rolconnlimit | rolpassword | rolvaliduntil | rolbypassrls | rolconfig |  oid                                                                                                                                                                          
---------------------------+----------+------------+---------------+-------------+-------------+----------------+--------------+-------------+---------------+--------------+-----------+-------                                                                                                                                                                        
 pg_signal_backend         | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  4200                                                                                                                                                                         
 pg_read_server_files      | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  4569                                                                                                                                                                         
 postgres                  | t        | t          | t             | t           | t           | t              |           -1 | ********    |               | t            |           |    10                                                                                                                                                                         
 pg_write_server_files     | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  4570                                                                                                                                                                         
 pg_execute_server_program | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  4571                                                                                                                                                                         
 pg_read_all_stats         | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  3375                                                                                                                                                                         
 pg_monitor                | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  3373                                                                                                                                                                         
 pg_read_all_settings      | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  3374                                                                                                                                                                         
 pg_stat_scan_tables       | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           |  3377                                                                                                                                                                         
 marshio                   | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           | 16385
```

### 创建角色

```sql
create role marshio;

-- 出现CREATE ROLE则表示创建成功

-- 详情查看
select * from pg_roles where rolname = 'marshio';
 rolname | rolsuper | rolinherit | rolcreaterole | rolcreatedb | rolcanlogin | rolreplication | rolconnlimit | rolpassword | rolvaliduntil | rolbypassrls | rolconfig |  oid  
---------+----------+------------+---------------+-------------+-------------+----------------+--------------+-------------+---------------+--------------+-----------+-------
 marshio | f        | t          | f             | f           | f           | f              |           -1 | ********    |               | f            |           | 16385


```

### 角色更改

#### 更改用户名

```sql
ALTER ROLE name RENAME TO new_name
ALTER ROLE test rename to test1;
```

#### 更改密码

`ALTER ROLE rolename WITH PASSWORD 'newpassword';`

```shell
ALTER ROLE postgres WITH PASSWORD 'postgres';
```

#### 更改权限

参考：[https://www.postgresql.org/docs/13/sql-alterrole.html](https://www.postgresql.org/docs/13/sql-alterrole.html)
`ALTER ROLE role_specification [ WITH ] option [ ... ]`
role_specification表示指定role。

```sql
-- 创建测试用户，不可登录
create role test;

-- 设置为可登录用户
alter role test login;


```

### 删除角色

`DROP ROLE [ IF EXISTS ] name [, ...]`

```sql
drop role test;

-- 样例
postgres=# drop role test1;
DROP ROLE
```

### 查看用户

```sql
select * from pg_user;
```

### 创建用户

```sql
create user marshio;
```

需要注意的是，官方对role和user的区分为：
> Only roles that have the LOGIN attribute can be used as the initial role name for a database connection. A role with the LOGIN attribute can be considered the same as a “database user”. To create a role with login privilege, use either:
> 上面英文的意思大致是只有携带LOGIN属性的role才能被用来数据库连接。携带LOGIN属性的role可以被视为一个数据库用户。创建一个可以登陆的role有如下两种方法：
> `CREATE ROLE name LOGIN;`
> `CREATE USER name;`
> 即  `CREATE ROLE name LOGIN;` 等价于 `CREATE USER name;`都是创建一个可以登陆的role。

所以，在postgres中不允许role和user同名。

```sh
-- 用户和role同名测试
postgres=# create role marshio;
CREATE ROLE

postgres=# create user marshio;                                                                                                                                                                                                                                                                                                                                         
ERROR:  role "marshio" already exists

-- CREATE ROLE name LOGIN和CREATE USER name互相验证
postgres=# create user lx;
CREATE ROLE
postgres=# select * from pg_user;
 usename  | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil | useconfig 
----------+----------+-------------+----------+---------+--------------+----------+----------+-----------
 postgres |       10 | t           | t        | t       | t            | ******** |          | 
 lx       |    16386 | f           | f        | f       | f            | ******** |          | 
(2 rows)

postgres=# select * from pg_roles where rolname = 'lx';
 rolname | rolsuper | rolinherit | rolcreaterole | rolcreatedb | rolcanlogin | rolreplication | rolconnlimit | rolpassword | rolvaliduntil | rolbypassrls | rolconfig |  oid  
---------+----------+------------+---------------+-------------+-------------+----------------+--------------+-------------+---------------+--------------+-----------+-------
 lx      | f        | t          | f             | f           | t           | f              |           -1 | ********    |               | f            |           | 16386

postgres=# create role zmh LOGIN;
CREATE ROLE

postgres=# select * from pg_user;
 usename  | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil | useconfig 
----------+----------+-------------+----------+---------+--------------+----------+----------+-----------
 postgres |       10 | t           | t        | t       | t            | ******** |          | 
 lx       |    16386 | f           | f        | f       | f            | ******** |          | 
 zmh      |    16387 | f           | f        | f       | f            | ******** |          | 
(3 rows)

postgres=# select * from pg_roles where rolname = 'zmh';
 rolname | rolsuper | rolinherit | rolcreaterole | rolcreatedb | rolcanlogin | rolreplication | rolconnlimit | rolpassword | rolvaliduntil | rolbypassrls | rolconfig |  oid  
---------+----------+------------+---------------+-------------+-------------+----------------+--------------+-------------+---------------+--------------+-----------+-------
 zmh     | f        | t          | f             | f           | t           | f              |           -1 | ********    |               | f            |           | 16387
```

### 用户切换

```sql
-- 切换用户
postgres=# \c - postgres
You are now connected to database "postgres" as user "postgres".



# 可能会出现异常
psql: error: FATAL:  Peer authentication failed for user "marshio"
```

## Database

信息参考：[https://www.postgresql.org/docs/13/catalog-pg-database.html](https://www.postgresql.org/docs/13/catalog-pg-database.html)

### 查看DB

```sql
select * from pg_databse;


postgres=# select * from pg_database;
  oid  |  datname  | datdba | encoding | datcollate  |  datctype   | datistemplate | datallowconn | datconnlimit | datlastsysoid | datfrozenxid | datminmxid | dattablespace |               datacl                
-------+-----------+--------+----------+-------------+-------------+---------------+--------------+--------------+---------------+--------------+------------+---------------+-------------------------------------
 14174 | postgres  |     10 |        6 | en_US.UTF-8 | en_US.UTF-8 | f             | t            |           -1 |         14173 |          479 |          1 |          1663 | 
 16393 | db1       |  16385 |        6 | en_US.UTF-8 | en_US.UTF-8 | f             | t            |           -1 |         14173 |          479 |          1 |          1663 | 
     1 | template1 |     10 |        6 | en_US.UTF-8 | en_US.UTF-8 | t             | t            |           -1 |         14173 |          479 |          1 |          1663 | {=c/postgres,postgres=CTc/postgres}
 14173 | template0 |     10 |        6 | en_US.UTF-8 | en_US.UTF-8 | t             | f            |           -1 |         14173 |          479 |          1 |          1663 | {=c/postgres,postgres=CTc/postgres}
(4 rows)
```

### 创建DB

参考：[https://www.postgresql.org/docs/13/sql-createdatabase.html](https://www.postgresql.org/docs/13/sql-createdatabase.html)

```sql
CREATE DATABASE name
    [ WITH ] [ OWNER [=] user_name ]
           [ TEMPLATE [=] template ]
           [ ENCODING [=] encoding ]
           [ LOCALE [=] locale ]
           [ LC_COLLATE [=] lc_collate ]
           [ LC_CTYPE [=] lc_ctype ]
           [ TABLESPACE [=] tablespace_name ]
           [ ALLOW_CONNECTIONS [=] allowconn ]
           [ CONNECTION LIMIT [=] connlimit ]
           [ IS_TEMPLATE [=] istemplate ]

-- 示例
CREATE DATABASE db1 owner marshio;

postgres=# CREATE DATABASE db1 owner marshio;
CREATE DATABASE
```

### 切换DB

```sql
-- 切换DB
\c dbname

-- 切换role
\c - rolename

-- 带用户user切换DB
\c dbname rolename
```

## Schema

参考
[https://www.postgresql.org/docs/current/ddl-schemas.html](https://www.postgresql.org/docs/current/ddl-schemas.html)

### 创建schema

```shell
# 创建一个schema
create schema myschema;


```

### 查看schema

```sql

postgres=# \dn+
                           List of schemas
   Name   |  Owner   |  Access privileges   |      Description       
----------+----------+----------------------+------------------------
 myschema | postgres |                      | 
 public   | postgres | postgres=UC/postgres+| standard public schema
          |          | =UC/postgres         | 
(2 rows)
```

### schema权限

参考：[https://www.postgresql.org/docs/13/sql-grant.html](https://www.postgresql.org/docs/13/sql-grant.html)

```sql
-- 给用户roleA添加myschema的使用权限
GRANT USAGE on SCHEMA myschema to rolaA;

-- 给用户roleA添加myschema的所有权限
GRANT ALL ON ALL TABLES IN SCHEMA myschema To roleA;  

-- 将用户postgres对的权限,暂定，验证未通过
ALTER DEFAULT PRIVILEGES FOR ROLE postgres in SCHEMA myschema GRANT SELECT ON tables TO roleA;

-- 
GRANT USAGE ON SCHEMA postgres TO marshio;
```

异常记录：

#### [Permission denied for schema even though grants were given](https://stackoverflow.com/questions/52830768/postgres-permission-denied-for-schema-even-though-grants-were-given)

解决

```sql
-- 
GRANT ALL ON ALL TABLES IN SCHEMA myschema To roleA;  

GRANT USAGE ON SCHEMA postgres TO marshio;
```

## Table

### 查看数据库

### 创建数据库

参考：[https://www.postgresql.org/docs/13/sql-createtable.html](https://www.postgresql.org/docs/13/sql-createtable.html)

```sql
create table tablename (id int);

-- 指定默认值，sequence
create table test(id int default nextval('test_id'));
```

## Sequence

参考：[https://www.postgresql.org/docs/13/infoschema-sequences.html](https://www.postgresql.org/docs/13/infoschema-sequences.html)

### 创建Sequence

参考：[https://www.postgresql.org/docs/13/sql-createsequence.html](https://www.postgresql.org/docs/13/sql-createsequence.html)

```sql
-- 创建一个从101开始增长的序列，值最小为1
CREATE SEQUENCE serial START 101;

-- sequence 从0开始会报错
marshio=# create sequence test_id start 0;
ERROR:  START value (0) cannot be less than MINVALUE (1)
marshio=# create sequence test_id start 1;
CREATE SEQUENCE

-- 使用
SELECT nextval('serial');
```

### Sequence权限

```sql
-- 将所有的sequence给schema_name下的role授权
GRANT ALL ON ALL SEQUENCES IN SCHEMA schema_name TO role;
```

## Grant

参考：[https://www.postgresql.org/docs/13/sql-grant.html](https://www.postgresql.org/docs/13/sql-grant.html)

```sql
GRANT { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES | TRIGGER }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { [ TABLE ] table_name [, ...]
         | ALL TABLES IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { { SELECT | INSERT | UPDATE | REFERENCES } ( column_name [, ...] )
    [, ...] | ALL [ PRIVILEGES ] ( column_name [, ...] ) }
    ON [ TABLE ] table_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { { USAGE | SELECT | UPDATE }
    [, ...] | ALL [ PRIVILEGES ] }
    ON { SEQUENCE sequence_name [, ...]
         | ALL SEQUENCES IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { { CREATE | CONNECT | TEMPORARY | TEMP } [, ...] | ALL [ PRIVILEGES ] }
    ON DATABASE database_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON DOMAIN domain_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN DATA WRAPPER fdw_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON FOREIGN SERVER server_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { EXECUTE | ALL [ PRIVILEGES ] }
    ON { { FUNCTION | PROCEDURE | ROUTINE } routine_name [ ( [ [ argmode ] [ arg_name ] arg_type [, ...] ] ) ] [, ...]
         | ALL { FUNCTIONS | PROCEDURES | ROUTINES } IN SCHEMA schema_name [, ...] }
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON LANGUAGE lang_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { { SELECT | UPDATE } [, ...] | ALL [ PRIVILEGES ] }
    ON LARGE OBJECT loid [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { { CREATE | USAGE } [, ...] | ALL [ PRIVILEGES ] }
    ON SCHEMA schema_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { CREATE | ALL [ PRIVILEGES ] }
    ON TABLESPACE tablespace_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT { USAGE | ALL [ PRIVILEGES ] }
    ON TYPE type_name [, ...]
    TO role_specification [, ...] [ WITH GRANT OPTION ]

GRANT role_name [, ...] TO role_specification [, ...]
    [ WITH ADMIN OPTION ]
    [ GRANTED BY role_specification ]

where role_specification can be:

    [ GROUP ] role_name
  | PUBLIC
  | CURRENT_USER
  | SESSION_USER
```
