---
title: "交接说明"
lang: zh-CN
date: 2026-10-23
order: 130
category:
  - 面试准备
tag:
  - 学习笔记
article: false
---

# 交接说明

更新：2026-10-23。接手先读本文件，再看 [00-阅读顺序.md](/posts/interview/00-reading-order.md)。本轮任务已完成：复核 15、补 16–19、补旧稿缺题、更新索引和统计，并验证可运行练习。

## 2026-10-23 追加：Python 基础独立成篇

当前 Python 基础正文在 [21-Python基础.md](/posts/interview/21-python-basics.md)：从 10 搬出原前两节（类型/对象与内置容器），保留 tuple、object 方法表、下划线命名、Python/Java 继承对照，并新增 abc 抽象基类。10 的原位置和 Python 自查清单改为入口，算法、SQL、系统和网络正文保留。下面历史记录中提到“10 的 Python 基础”的内容，目前应到 21 阅读。

阅读索引、02 速查链接、object 自检路径和题数统计说明已同步。21 是基础导读，Python 分级题仍按 02 统计，内存与执行专项仍在 20，不叠加重复题数。

## 2026-10-22 追加：Python 运行时

新增 [20-Python内存与执行原理.md](/posts/interview/20-python-memory-runtime.md)，三档各 20，共 60 题，覆盖引用/循环 GC、分配器/堆/驻留内存、编译/AST/字节码/执行及排查。基线为项目限定的 CPython 3.12；3.14 补丁与 free-threaded 差异另标，不当成本机已验证。

`验证/verify_20.py` 已在 CPython 3.12.11 下实际通过；02/10/12 的相关概括同步修正。此专项与 Python 主表有概念交叉，单列题数与验证，不把主表 1529 题直接加成去重总量。

## 2026-10-23 追加：Web 接口与服务器基础

09 开头「〇」新增分层导读，说明 WSGI/ASGI、Gunicorn/Uvicorn、框架、worker、代理以及 Waitress/uWSGI/Hypercorn/Daphne 等；03/10 和索引同步。最小 WSGI/ASGI 接口断言及本机两个临时 HTTP 服务验证通过，详情见验证记录。不是新增独立学科，不重复累加题数。

## 2026-10-23 追加：object 与 WSGI 三问

10 的 Python 基础新增 object 顶层继承、22 个方法/钩子、Java 对照、可调用对象与示例，02 速查同步链接。09 新增「〇附、WSGI 学习笔记」，保留用户三问结构与调用/进程图，校正 environ 类型、延迟响应头、exc_info、close、长响应及 preload/COW 边界。

新增 `验证/verify_object_basics.py` 与 `验证/verify_wsgi_notes.py`：文档代码、方法表、协议教学模型均通过；本机最小 Gunicorn 两 worker 在 preload 关闭/开启两种情况下，PID/应用加载位置断言通过。只用临时应用与本机端口，未加载项目业务应用。基础导读不额外叠加进主表题数。

## 背景与写作约定

2026-10-23 追加：10 的 Python 基础第 18–19 题已补下划线命名与 Python/Java 继承对照，区分内部使用约定、模块导入、类名称改写、__init__ 继承、MRO/super、重写/重载。4 段新增代码已直接提取并在 CPython 3.12.11 执行通过；原 object 自检同步限定提取范围并通过。索引、自查清单已更新，主表题数不重复累加。

用户马硕准备 AI Agent / 全栈岗面试。题库在 `/Users/marshio/Workspace/面试准备/`，简历在 `/Users/marshio/Workspace/马硕-后端开发工程师.MD`。本轮没有修改简历。

- 中文、朴素用词；代码、命令与报错保留英文；★ 标高频。
- 除 Java、Kafka 外，每学科入门/中等/高难各至少 20 题。统计按学科完整版，不把重复资料相加。
- 标「项目」前先查 `xknow-ai/` 或对应前端/支付服务源码。文档、计划、源码注释都可能过时，不能只照抄。
- 区分当前实现、历史复盘和未来方案，不编业务规模、用户数、性能收益。
- 不 commit；Workspace 本身不是 Git 仓库。只访问本机中间件，不操作共享服务。

## 当前交付状态

| 范围 | 状态 |
|---|---|
| 00–14 原有资料 | 保留；02 补 Python 入门、系统设计/安全/Linux，09 补 Flask 缺题，14 修中位数等细节 |
| 15-SQLAlchemy与Celery | 已复核项目关键配置与易错语义；新增独立可运行自检，片段/真实 worker 验证边界已标 |
| 16-向量检索与知识图谱 | 两科各三档 20，共 120 题；RRF、本机 Qdrant/Neo4j 练习通过 |
| 17-Docker与部署 | 三档各 20，共 60 题；核对多架构、角色、迁移、Swarm、停机和文件存储边界 |
| 18-React-Next-Node | 三科各三档 20，共 180 题；核对三前端版本/代理条件及支付服务，Node 独立自检通过 |
| 19-Agent分级题库 | 三档各 20，共 60 题；01 保持原有口述材料，现状以 19 和源码为准 |
| 索引与统计 | 00 已加入 12–19；22 科、66 档共 1529 题，各档 ≥20；新增 16–19 共 420 题 |

详情见 [题数统计.md](/posts/interview/question-counts.md)、[验证记录.md](/posts/interview/verification-record.md)。统计由 `验证/count_questions.py` 可重复生成；Python 的语言/并发/工程化合为一科，系统设计/安全/Linux 单独统计。06 是入门资料，完整版在 18；01 是口述资料，分级版在 19。

## 容易写错的项目事实

- **子 Agent 合并仍只是 DELEGATION_PLAN 的方案。** `app/core/agent/agent_spec.py` 仍有 vesper / ariadne / cooker / doppel 骨架，可用性还需 DB profile。
- 当前模型层为 LLMClient + protocol backend，旧架构文档里的 LiteLLM 必经链路过时；SkillLoader 的可见性/字段也以源码为准。
- 文档 dense+BM25 在 Qdrant 服务端 RRF；图节点 name/summary 在 Python RRF，常数 60。两者不能混说。
- 图只读已对主 Agent 开放，三个写工具仍限制 ariadne。文档检索 payload 不足以兜授权，命中后回 PG 复核。
- qwen3-vl-rerank 有历史配置与迁移依据，当前实际绑定由配置数据库决定，不能只读历史 YAML 就断言线上永远使用该模型。
- Swarm Web/worker 用 start-first，Beat 用 stop-first。停机宽限 Web=120s、worker=3900s、Beat=30s。
- Celery visibility_timeout 默认 3600s，但定时任务已声明 3600s；bench 最长 6h 且单独早确认。旧注释「最长 30min」不能继续当事实。
- 僵尸卡每 5min 扫描，默认静默阈值 45min，收尾为失败；**这不是 run 租约或透明接管已经实现**。
- backend 负责迁移不代表已有全局互斥；console/gateway 的 API rewrite 只在配置对应代理目标时启用。

每篇 15–19 都有源码入口和适用边界，继续扩题先从那些入口核对。

## 验证方式

Python 完整示例用 `python -I` 跑断言；项目依赖使用 `xknow-ai/.venv/bin/python`。本轮程序和准确运行范围见 [验证记录.md](/posts/interview/verification-record.md)。不要把 AST 解析、SQL 编译或 eager Celery 测试写成真实 worker 故障验证。

本地 SQL 账号无建库权限，使用同连接回滚事务：BEGIN → CREATE SCHEMA（随机唯一名）→ SET LOCAL search_path → 建样本/跑题/断言 → ROLLBACK。验证程序固定调用本机 `postgres15` 容器的 psql，不读项目远端配置，不写 public 表。

## 后续没有自动扩大的任务

这次题库范围已完成。简历标题此前为「全栈开发工程师（Agent 方向）」，技术栈使用「熟悉」；业务数据仍等用户提供。本轮不补造数据，也没有发布、提交或修改项目实现。若后续要逐条复核全部旧稿、做真实 worker/前端故障演练，应单独按范围安排。
