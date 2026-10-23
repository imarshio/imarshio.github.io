---
title: "验证记录"
lang: zh-CN
date: 2026-10-23
order: 132
category:
  - 面试准备
tag:
  - 学习笔记
article: false
---

# 验证记录

日期：2026-10-21。只访问本机 Docker 中间件；没有执行镜像推送、部署、应用迁移或共享服务写入，没有 commit。

## 本轮执行结果

| 内容 | 实际验证 | 结果 |
|---|---|---|
| 10 基础打底 | 直接提取完整 Python 代码块，运行末尾断言 | 通过 |
| 13 数据结构与算法 | 直接提取代码合集，运行末尾断言 | 通过 |
| 10 手写 SQL | 9 条语句，临时数据集，查询结果断言；含删除重复行 | 通过，事务回滚 |
| 14 SQL 高难 1–12 | 直接提取 12 题的 13 条查询，用文中数据逐题断言；中位数额外覆盖奇数/偶数样本 | 通过，事务回滚 |
| 14 SQL 高难 13–14 | 参数化库存更新与版本条件更新，各重复执行验证拒绝重复领取/旧版本 | 通过，事务回滚；不是多连接并发压测 |
| 15 Python 片段 | 25 个代码块做 AST 语法解析 | 通过；省略的上下文不等于已独立执行 |
| 15 ORM/Celery 独立自检 | 内存 SQLite CRUD、关系加载、JSON 修改、版本冲突、保存点；PG 特有 SQL 编译；租户过滤；内存 broker 路由与 eager chain/group；支付后崩溃恢复模型 | 通过 |
| 16 RRF | 多路相同 ID 累加、空输入、重复 ID、自定义常数 | 通过 |
| 16 Qdrant | 127.0.0.1:6333 临时 collection，两路 dense/sparse Prefetch、RRF、租户过滤和点数 | 通过，finally 删除集合；稀疏向量为手工构造，未调用 embedding 模型 |
| 16 Neo4j | 127.0.0.1:7687，MERGE 重入、关系计数、UNWIND，回滚后查询零残留 | 通过，事务回滚；未创建约束/索引 |
| 18 Node | reducer 不变性、会话归属、去重/乱序与终态；UTF-8 逐字节增量解码；CJS/ESM 的微任务调度实验 | 通过，Node v22.22.3；不等于完整 SSE parser |
| 关键项目事实 | 只读解析 compose、package.json 和 Python 源码，核对停机宽限、更新顺序、图写限制、Agent 骨架等；bash -n 检查两份入口/构建脚本 | 通过 |
| 题数 | 22 科、66 档，标准题干计数；新格式检查编号连续 | 1529 题，每档 ≥20，详见题数统计 |

Python 自检使用项目本机虚拟环境（SQLAlchemy 2.0.49、Celery 5.6.3）。不导入整个项目应用，不读取项目 .env。Neo4j 验证只从指定本机容器获取认证，程序不输出凭证。

## 重跑命令

在 `/Users/marshio/Workspace` 下执行：

```bash
python3 -I 面试准备/验证/count_questions.py
xknow-ai/.venv/bin/python -I 面试准备/验证/verify_existing.py
xknow-ai/.venv/bin/python -I 面试准备/验证/verify_15.py
xknow-ai/.venv/bin/python -I 面试准备/验证/verify_16.py
xknow-ai/.venv/bin/python -I 面试准备/验证/verify_sources.py
node 面试准备/验证/verify_18.mjs
```

SQL 验证程序连接容器 `postgres15` 的 `xknow` 数据库，在同一连接中执行 BEGIN、创建随机命名 schema、SET LOCAL search_path、练习及 ROLLBACK，遇错连接关闭也会回滚。没有创建数据库的需求，也不写 public 业务表。

## 本轮修正与边界

- 15：pool_recycle 源码默认 1800 秒；max_overflow 变量没有接入 ENGINE_OPTIONS；Identity Map 通常是弱引用。修正租户过滤 lambda 中调用函数、大表 NOT NULL 迁移和 Session.merge 的表述。
- Celery：早确认不等于预取即确认；限流按 worker 实例；send_task 会使用发送端路由；普通失败不 ACK 不代表自动重试。区分 gevent 超时能力、prefork 子进程回收、chord 结果依赖与支付副作用恢复。
- 配置注释里的「最长 30 分钟」已过时：定时任务声明 3600 秒，benchmark 声明 6 小时且 acks_late=False；默认 visibility_timeout=3600 不能笼统称作余量充足。这里只修正文档，没有改项目配置。
- 17：Web 宽限 120 秒、worker 3900 秒、Beat 30 秒；Beat 更新是 stop-first。只由 backend 负责迁移不代表已有全局迁移锁。
- 18：console/gateway rewrite 有启用条件；不同 Next 版本的缓存、请求 API 与命令不能混用。
- 19：协议 backend 和 SkillLoader 以当前源码为准；旧架构图有 LiteLLM、Skill 字段等过时描述。子 Agent 合并及完整运行租约接管不写成已交付。
- 14：通用中位数显式 FLOOR，避免 MySQL 除法差异；首单排序补 ID；动作覆盖人数与严格顺序漏斗分开讲。

没有启动真实 Celery worker 做 ACK、重投、time limit 或停机故障演练；没有运行 React DOM/Next 构建与浏览器 E2E；MySQL 专有语法、Alembic DDL 和其他旧稿的零散片段也没有被本轮全量执行。题数通过不表示 00–14 的每个历史结论都重新逐条验证。表中范围以外的地方不标为「已跑通」。

## 2026-10-22：Python 运行时专项

新增 20，入门/中等/高难各 20，共 60 题。`xknow-ai/.venv/bin/python -I 面试准备/验证/verify_20.py` 已在 **CPython 3.12.11 常规 GIL 构建**下通过，直接运行并断言对象别名/引用、循环收集、关闭自动 GC 后的手动收集、现代终结器、弱引用、闭包/default/traceback/生成器保活、slots、memoryview、AST/compile/执行分层、临时 .pyc、tracemalloc 分配与释放。

只用标准库、固定小输入和 TemporaryDirectory，无外部服务调用。没有以 RSS 必须下降、固定字节码、GC 精确计数为断言；未进行原生分配器对比、free-threaded/3.14 实跑、内存耗尽或 GC 性能压测。版本差异来自专题所链官方文档。

02/10/12 同步修正生命周期、.pyc 必经误解、泛化性能收益、GC 与分配器层次及 freeze/COW 边界。主表仍按 22 科/66 档验收；运行时专项另列，不重复叠加。

## 2026-10-23：Python Web 服务器与接口基础

09 开头新增 WSGI/ASGI、框架、应用服务器、worker、反向代理和周边组件的分层导读；03/10 与阅读索引同步链接，修正「SSE 必须 gevent」「Flask async 是假异步」「Uvicorn 必用 uvloop/httptools」等表述，以及旧 Uvicorn worker 路径。该导读是基础说明，未作为额外分级题重复计数。

`xknow-ai/.venv/bin/python -I 面试准备/验证/verify_web_gateway.py` 已通过：最小 WSGI 应用通过 wsgiref.validator；最小 HTTP ASGI 应用通过请求分块与断开事件断言；两份应用复制到临时目录后，分别由本机 Gunicorn 23.0.0 / Uvicorn 0.51.0 临时监听 127.0.0.1 并返回预期 HTTP 响应。子进程已停止、临时目录已清理。

没有导入项目应用、连接业务库或执行部署；没有验证 WebSocket、lifespan、代理转发、负载容量或新 Gunicorn 原生 ASGI worker。新版本能力按文内官方资料说明，不能视为当前项目已启用。项目启动方式已只读核对 entrypoint、sitecustomize、Gunicorn 配置和依赖。

## 2026-10-23：object 基础与 WSGI 三问

- `xknow-ai/.venv/bin/python -I 面试准备/验证/verify_object_basics.py`：直接提取 10 新增的 4 段 Python 示例执行，核对 CPython 3.12.11 的 22 个 object 方法/钩子，并验证比较/哈希边界。通过。
- `xknow-ai/.venv/bin/python -I 面试准备/验证/verify_wsgi_notes.py`：直接提取 09 的 WSGI 函数，经过 wsgiref.validator；验证 environ 扩展值并非都是 str。教学模型覆盖响应头暂存、空/非空块、生成器延迟登记、提交前 exc_info 替换、提交后重抛，以及正常/提前/异常迭代的 close。通过。
- 同一程序创建临时最小 Flask 模块，分别启动本机 Gunicorn 23.0.0 的两个 sync worker，关闭/开启 preload 各执行一次 HTTP 请求；断言 Flask 在响应 worker 内运行、master 有两个直接 worker 子进程，默认由 worker 加载、preload 由 master 先加载。通过；临时进程与目录已清理。

教学模型不是完整 WSGI/HTTP 服务器一致性认证；进程实验不涉及项目应用、真实代理、业务数据库、Celery 或共享服务。新增章节作为基础讲解单列，主表仍为 22 科/66 档/1529 题。

## 2026-10-23：下划线命名与 Python/Java 继承

10 的 Python 基础新增第 18–19 题。使用项目 CPython 3.12.11 的 `python -I`，一次性从这两题直接提取 4 段 Python 代码并执行：模块的星号/显式导入、__all__、类的单下划线重写与双下划线名称改写、继承或重写 __init__、菱形继承 MRO/super 均通过断言。内存演示模块已从 sys.modules 清理，无外部服务调用。

基础章节编号 1–19 连续，代码围栏闭合。`验证/verify_object_basics.py` 调整原有示例的提取边界后通过；`验证/count_questions.py` 通过，主表仍为 22 科/66 档/1529 题。Java 部分依据链接的 Java SE 25 类规范核对，没有把 Python 示例验证写成 Java 代码实跑。

## 2026-10-23：Python 基础拆分为独立文档

新增 [21-Python基础.md](/posts/interview/21-python-basics.md)，从 10 迁出类型/对象与内置容器正文、自查清单，并补 abc。10 原位置保留入口；阅读索引、02 链接和 object 自检路径已更新。此前记录所指的“10 的 Python 基础”正文现位于 21。

CPython 3.12.11 下，`验证/verify_object_basics.py` 从新位置读取的 4 段示例和 22 个方法表断言通过；另一次性直接提取执行下划线/继承 4 段、tuple 4 段、abc 1 段，共 9 段示例，全部通过。新文档其余 Python 代码块做 AST 语法检查，不把需要上下文的旧片段记为全部独立实跑。

章节编号、相关文件链接与围栏检查通过；10 的原算法自检执行通过，未因纯文档搬迁重跑数据库练习。题数统计说明同步排除基础导读 21，重跑 `验证/count_questions.py` 后仍为 22 科/66 档/1529 题，各档均达标。
