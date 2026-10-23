---
title: Python
icon: fa-brands fa-python
lang: zh-CN
index: false
article: false
category:
  - python
dir:
  link: true
  collapsible: true
---

# Python 学习笔记

这里按实际学习顺序整理：先能运行程序，再掌握语言和对象，接着理解迭代、并发与运行原理，最后完成 Web 和数据库实践。每一阶段都依赖前面的概念，可以顺着章节底部的“下一篇”阅读。

语言基础与运行原理以 **CPython 3.12 常规 GIL 构建**为主要基线。示例涉及第三方库时会注明依赖；旧项目记录保留当时的配置和版本，不把它们当作当前环境的默认值。

## 先把环境准备好

| 顺序 | 笔记 | 先弄清楚 |
|---|---|---|
| 1 | [解释器与源码安装](./source-install.md) | Python 与解释器、当前运行哪个版本 |
| 2 | [多版本与虚拟环境](./multi-version.md) | 版本管理、环境隔离、包管理的区别 |
| 3 | [uv 项目管理](./uv.md) | 建项目、管理依赖与锁定环境 |

## 1. 语言基础

从变量绑定开始，逐步写出能处理数据、拆成函数并正确关闭资源的小程序。

4. [变量、类型与运算](./basics/types.md)
5. [容器与数据操作](./basics/containers.md)
6. [条件、循环与推导式](./basics/control-flow.md)
7. [函数、参数与类型标注](./basics/functions.md)
8. [作用域、模块与导入](./basics/scope-modules.md)
9. [异常、文件与资源管理](./basics/exceptions-io.md)

## 2. 类与对象

把状态与行为组织成类，再理解继承、抽象接口和 Python 的对象协议。

10. [类、实例与属性](./objects/classes.md)
11. [继承与抽象基类](./objects/inheritance-abc.md)
12. [对象协议与特殊方法](./objects/data-model.md)

## 3. 进阶特性

在函数与对象的基础上学习惰性计算、函数包装和并发调度。

13. [迭代器与生成器](./advanced/iterators.md)
14. [装饰器与函数包装](./advanced/decorators.md)
15. [线程、进程与协程](./advanced/concurrency.md)

## 4. 内存与执行

追踪对象如何保持存活、内存如何分配，以及源码如何成为可执行代码。

16. [引用与垃圾回收](./runtime/lifecycle.md)
17. [内存分配与观测](./runtime/allocation.md)
18. [源码、字节码与执行](./runtime/execution.md)

## 5. 工程实践

把前面的概念用于可测试的程序、HTTP 应用、数据库事务和后台任务。

19. [模块化、日志与测试](./practice/project-quality.md)
20. [WSGI、ASGI 与服务器](./practice/web-servers.md)
21. [Flask 应用与测试](./practice/flask.md)
22. [FastAPI 请求与校验](./practice/fastapi.md)
23. [SQLAlchemy 会话与事务](./practice/sqlalchemy.md)
24. [Celery 后台任务](./practice/celery.md)
25. [MySQL 连接池实践](./practice/mysql-pool.md)
26. [爬虫实践记录](./practice/spider.md)

## 怎样使用这些笔记

先运行标注“可独立运行”的示例，改一处输入，再解释结果。代码片段需要前文上下文时，不把它当成独立程序直接运行。实际安装、部署和连接外部服务的命令属于操作记录，需要按自己的环境调整。

基础掌握后，可以到 [Python 面试题](/posts/interview/Python/README.md) 做自测；题库保留问答与场景，知识说明在本目录按学习顺序展开。

学习顺序参考 [Python 官方教程](https://docs.python.org/3.12/tutorial/)，具体知识点的依据链接放在对应章节。
