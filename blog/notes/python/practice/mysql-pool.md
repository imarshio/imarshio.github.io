---
title: "MySQL 连接池实践"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 7
article: false
redirectFrom:
  - /notes/python/python-mysql-pool.html
---

# MySQL 连接池实践

> 以下保留原有项目实践记录。依赖版本、业务配置和目录约定来自当时环境；其中引用项目模块的代码片段需要对应上下文。

```python
import pymysql
from dbutils.pooled_db import PooledDB

from config.mysql import DATABASE_CONFIG


# 创建数据库连接池
class MysqlPool(object):
    __pool = None

    def __enter__(self):
        self.conn = self.get_conn()
        self.cursor = self.conn.cursor()
        return self.conn, self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cursor.close()
        self.conn.close()

    @classmethod
    def get_conn(cls):
        if cls.__pool is None:
            cls.__pool = PooledDB(
                # 使用链接数据库的模块
                creator=pymysql,
                # 连接池允许的最大连接数，可以根据情况调整
                maxconnections=5,
                # 初始化时，链接池中至少创建的空闲的链接，0表示不创建
                mincached=5,
                # 链接池中最多闲置的链接，0和None不限制
                # 链接池中最多共享的链接数量，0和None表示全部共享。
                maxcached=5,
                # PS: 无用，因为pymysql和MySQLdb等模块的 threadsafety都为1，
                # 所有值无论设置为多少，maxcached永远为0，所以永远是所有链接都共享。
                maxshared=3,
                # 连接池中如果没有可用连接后，是否阻塞等待。True，等待；False，不等待然后报错
                blocking=True,
                # 一个链接最多被重复使用的次数，None表示无限制
                maxusage=None,
                # 开始会话前执行的命令列表。如：["set datestyle to ...", "set time zone ..."]
                setsession=[],
                # ping MySQL服务端，检查是否服务可用。
                # 如：0 = None = never,
                # 1 = default = whenever it is requested,
                # 2 = when a cursor is created,
                # 4 = when a query is executed,
                # 7 = always
                ping=0,
                **DATABASE_CONFIG
            )
        return cls.__pool.connection()

# if __name__ == '__main__':
#     with MysqlPool() as (conn, cursor):
#         cursor.execute("select * from sina_notices limit 10")
#         result = cursor.fetchall()
#         print(result)
#         if result:
#             conn.commit()
#         else:
#             conn.rollback()

```

```python

DATABASE_HOST = 'localhost'
DATABASE_PORT = 3306
DATABASE_USER = ''
DATABASE_PASSWORD = ''
DATABASE_NAME = 'demo'

DATABASE_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'passwd',
    'database': 'demo',
    'charset': 'utf8mb4',
}

```

---

[上一篇](/notes/python/practice/celery.md) · [下一篇](/notes/python/practice/spider.md) · [学习目录](/notes/python/README.md)
