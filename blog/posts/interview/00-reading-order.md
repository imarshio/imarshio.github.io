---
title: "面试准备 · 阅读顺序"
lang: zh-CN
date: 2026-10-23
order: 100
category:
  - 面试准备
tag:
  - 学习笔记
article: false
index: false
icon: book-open
---

# 面试准备 · 阅读顺序

> 这组资料同步自本地「面试准备」，保留原稿的章节编号和内容。所有面试相关资料统一收录在 [Interview](/posts/interview/README.md)。表中的文件名沿用原稿，链接已指向站内对应页面。
> 项目现状、历史复盘和计划的区别见 [交接说明](/posts/interview/handover.md)；技术核对与运行记录截至原稿所标日期。

先看 [交接说明.md](/posts/interview/handover.md) 了解约定与复核边界。2026-10-21 已补齐 00–19，2026-10-22 增补 20，2026-10-23 将 Python 基础单独拆为 21；[题数统计.md](/posts/interview/question-counts.md)按 22 个学科、66 个档位验收，共 1529 题，各档均 ≥20。Java、Kafka 保留复习清单，不要求满档。20 的 Python 运行时专项另有三档各 20 题，单列验收，不与 Python 主表重复相加；21 是基础导读，不重复累加题数。

| 顺序 | 文件 | 重点 | 什么时候看 |
|---|---|---|---|
| 1 | [21-Python基础.md](/posts/interview/21-python-basics.md) | 类型与对象、tuple 等容器、object、下划线、继承、abc | Python 基础单独一份，先读 |
| 1.5 | [10-基础打底.md](/posts/interview/10-foundation-notes.md) | 算法、手撕代码、SQL、OS/网络浓缩版 | 再补跨学科基础 |
| 2 | [11-计算机网络.md](/posts/interview/11-computer-networks.md) | TCP、HTTP、TLS、DNS、排查 | 和基础打底一起看 |
| 3 | [12-操作系统.md](/posts/interview/12-operating-systems.md) | 进程、线程、内存、IO、调度、锁 | 补系统原理 |
| 4 | [13-数据结构与算法.md](/posts/interview/13-data-structures-algorithms.md) | 分级概念与可运行代码合集 | 代码默写、跑自检 |
| 5 | [01-Agent与Harness.md](/posts/interview/01-agent-harness.md) | 项目口述、演进、故事与架构取舍 | 准备项目主线；历史技术链路以 19 和源码为准 |
| 6 | [19-Agent分级题库.md](/posts/interview/19-agent-question-bank.md) | Runtime、工具、上下文、记忆、委派、恢复、评测 | 三档各 20；明确实现与计划 |
| 7 | [04-简历技术点详解.md](/posts/interview/04-resume-tech-notes.md) | 简历术语、设计模式 | 投简历前过一遍，项目事实有疑问回源码 |
| 8 | [02-后端八股.md](/posts/interview/02-backend-fundamentals.md) | Python、系统设计、安全、Linux；其他专题速查 | 前三节合为 Python，系统设计/安全/Linux 各三档 20 |
| 8.5 | [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md) | 引用计数、循环 GC、堆/内存池、RSS、AST/字节码/解释器、排查实验 | Python 进阶重点；基线 CPython 3.12，三档各 20 |
| 9 | [09-Flask专题.md](/posts/interview/09-flask.md) | WSGI/ASGI 导读与 WSGI 三问；上下文、gevent、SSE、部署 | 项目框架重点，先看开头的名词分层 |
| 10 | [03-FastAPI.md](/posts/interview/03-fastapi.md) | ASGI、Pydantic、依赖、异步、流式接口 | 用来对比 Flask 与 async |
| 11 | [14-SQL与MySQL.md](/posts/interview/14-sql-mysql.md) | SQL 与 MySQL 各三档；高难手写 SQL | 笔试与数据库问答 |
| 12 | [07-PostgreSQL专题.md](/posts/interview/07-postgresql.md) | 索引、MVCC、事务、WAL、复制、恢复 | 结合项目数据库深入 |
| 13 | [08-Redis专题.md](/posts/interview/08-redis.md) | 数据结构、缓存、锁、Stream、限流、持久化 | 与任务/流式事件串起来 |
| 14 | [15-SQLAlchemy与Celery.md](/posts/interview/15-sqlalchemy-celery.md) | ORM、事务、连接池；任务确认、重试、路由、停机 | 本轮已复核并修正配置与语义 |
| 15 | [16-向量检索与知识图谱.md](/posts/interview/16-vector-search-knowledge-graphs.md) | Qdrant、BM25/RRF、重排、Neo4j、权限与证据 | 两科各三档 20 |
| 16 | [17-Docker与部署.md](/posts/interview/17-docker-deployment.md) | 镜像、多架构、Swarm、迁移、优雅停机 | 三档各 20；Web/worker/Beat 分开讲 |
| 17 | [06-React与Node入门.md](/posts/interview/06-react-node-intro.md) | 前端与 Node 的快速入门材料 | 基础薄弱时先看 |
| 18 | [18-React-Next-Node.md](/posts/interview/18-react-next-node.md) | React、Next、Node 各三档 20 | 全栈岗重点，留意 Next 15/16 差异 |
| 19 | [05-分级题库与高难场景.md](/posts/interview/05-advanced-scenarios.md) | 跨专题场景与口述框架 | 最后练综合回答，不叠加进题数 |

练习：概念讲「是什么→怎么用→失败边界」，场景讲「估算→定位→方案→取舍→验证」。项目题先说源码现状，再讲改进；`DELEGATION_PLAN.md` 的子 Agent 合并尚未实施。

代码与 SQL 的已执行范围、命令及限制见 [验证记录.md](/posts/interview/verification-record.md)。15 的片段有省略上下文，需区分语法解析、独立自检与真实 worker 行为验证。

## 配套材料

- [题数统计](/posts/interview/question-counts.md)
- [验证记录](/posts/interview/verification-record.md)
- [原始验证脚本及运行条件](/posts/interview/verification/README.md)
