---
title: "题数统计"
lang: zh-CN
date: 2026-10-23
order: 131
category:
  - 面试准备
tag:
  - 学习笔记
article: false
---

# 题数统计

统计日期：2026-10-23。运行 `python3 -I 面试准备/验证/count_questions.py` 可重新生成。

每个学科按指定完整版统计，不把多份文档的重复题相加。Python 的语言、并发、工程化合为一科；02 的网络/SQLAlchemy/Celery 清单分别由 11/15 覆盖。系统设计、安全、Linux 单独验收。

旧格式只计难度小节里的编号加粗题干，场景标题单独计一题；新格式只计编号三级标题。代码、答案步骤、速查表、测试数据与口述材料不计。01、04、05、06、10、21 是口述/速查/基础导读/补充练习，不作为独立学科叠加；Agent 与前端的完整版分别是 19/18。Java、Kafka 按要求免于最低题数检查。

| 学科 | 完整版 | 入门 | 中等 | 高难 | 验收 |
|---|---|---:|---:|---:|---|
| Python（语言/并发/工程化） | [02-后端八股.md](/posts/interview/02-backend-fundamentals.md) | 20 | 24 | 20 | 通过 |
| 系统设计 | [02-后端八股.md](/posts/interview/02-backend-fundamentals.md) | 20 | 20 | 20 | 通过 |
| 安全 | [02-后端八股.md](/posts/interview/02-backend-fundamentals.md) | 20 | 20 | 20 | 通过 |
| Linux | [02-后端八股.md](/posts/interview/02-backend-fundamentals.md) | 20 | 20 | 20 | 通过 |
| FastAPI | [03-FastAPI.md](/posts/interview/03-fastapi.md) | 21 | 49 | 21 | 通过 |
| PostgreSQL | [07-PostgreSQL专题.md](/posts/interview/07-postgresql.md) | 25 | 69 | 39 | 通过 |
| Redis | [08-Redis专题.md](/posts/interview/08-redis.md) | 23 | 46 | 32 | 通过 |
| Flask | [09-Flask专题.md](/posts/interview/09-flask.md) | 20 | 29 | 20 | 通过 |
| 计算机网络 | [11-计算机网络.md](/posts/interview/11-computer-networks.md) | 24 | 26 | 25 | 通过 |
| 操作系统 | [12-操作系统.md](/posts/interview/12-operating-systems.md) | 22 | 23 | 22 | 通过 |
| 数据结构与算法 | [13-数据结构与算法.md](/posts/interview/13-data-structures-algorithms.md) | 21 | 24 | 22 | 通过 |
| SQL | [14-SQL与MySQL.md](/posts/interview/14-sql-mysql.md) | 22 | 22 | 22 | 通过 |
| MySQL | [14-SQL与MySQL.md](/posts/interview/14-sql-mysql.md) | 22 | 22 | 22 | 通过 |
| SQLAlchemy | [15-SQLAlchemy与Celery.md](/posts/interview/15-sqlalchemy-celery.md) | 21 | 22 | 22 | 通过 |
| Celery | [15-SQLAlchemy与Celery.md](/posts/interview/15-sqlalchemy-celery.md) | 21 | 22 | 22 | 通过 |
| 向量检索 | [16-向量检索与知识图谱.md](/posts/interview/16-vector-search-knowledge-graphs.md) | 20 | 20 | 20 | 通过 |
| 知识图谱 | [16-向量检索与知识图谱.md](/posts/interview/16-vector-search-knowledge-graphs.md) | 20 | 20 | 20 | 通过 |
| Docker 与部署 | [17-Docker与部署.md](/posts/interview/17-docker-deployment.md) | 20 | 20 | 20 | 通过 |
| React | [18-React-Next-Node.md](/posts/interview/18-react-next-node.md) | 20 | 20 | 20 | 通过 |
| Next.js | [18-React-Next-Node.md](/posts/interview/18-react-next-node.md) | 20 | 20 | 20 | 通过 |
| Node.js | [18-React-Next-Node.md](/posts/interview/18-react-next-node.md) | 20 | 20 | 20 | 通过 |
| Agent | [19-Agent分级题库.md](/posts/interview/19-agent-question-bank.md) | 20 | 20 | 20 | 通过 |

共 **22 个学科、66 个档位、1529 题**，每档均不少于 20 题。新增 16–19 共 420 题。题数通过不等于旧稿所有技术结论已逐条复核，代码运行范围见 [验证记录.md](/posts/interview/verification-record.md)。

## 专项补充（单列验收）

Python 运行时与主表 Python 有概念交叉，保留单独练习与计数，不重复叠加成去重总题数。

| 专项 | 文件 | 入门 | 中等 | 高难 |
|---|---|---:|---:|---:|
| Python 运行时 | [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md) | 20 | 20 | 20 |
