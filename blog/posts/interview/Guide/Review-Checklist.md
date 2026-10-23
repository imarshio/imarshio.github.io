---
title: "复习清单"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 4
article: false
---

# 复习清单

---

## 十、Java / MySQL / Kafka 复习清单（老本行）

### Java
- **集合**：HashMap 结构（数组 + 链表 + 红黑树）、扩容（2 倍、为什么容量是 2 的幂）、JDK7 并发扩容死循环；ConcurrentHashMap（JDK8 CAS + synchronized 锁桶头）；ArrayList vs LinkedList；CopyOnWriteArrayList。
- **并发**：synchronized 锁升级（偏向锁已在 JDK15 废弃）、volatile（可见性 + 禁止重排序）、CAS 与 ABA、AQS、ReentrantLock、CountDownLatch / CyclicBarrier / Semaphore、线程池七个参数和四种拒绝策略、CompletableFuture、ThreadLocal 内存泄漏、虚拟线程（JDK21，和 Python 协程可以对比）。
- **JVM**：内存区域、对象创建与内存布局、类加载与双亲委派、GC 算法（标记清除 / 复制 / 标记整理）、G1 / ZGC、OOM 排查（jmap、MAT、arthas）。**准备好你的线上 JVM 调优案例**。
- **Spring**：IoC / AOP 原理（JDK 动态代理 vs CGLIB）、Bean 生命周期、循环依赖三级缓存、事务传播行为和失效场景（自调用、非 public、异常被吞）、Spring Boot 自动配置原理。
- **Spring Cloud**：Nacos（注册 + 配置）、Gateway、OpenFeign、Sentinel 熔断限流。
- **转 AI 岗必问**：Java 和 Python 做后端的区别 —— Java 强类型、并发能力强、生态成熟，适合大型业务系统；Python 在 AI 生态上没有替代品，开发快。LLM 应用的瓶颈在 IO 和模型，不在语言性能。我们用 Pydantic、类型标注、ruff 补 Python 的工程性。

### MySQL
- **索引**：B+ 树、聚簇 / 二级索引、回表、覆盖索引、最左前缀、索引下推、索引失效场景。
- **事务**：ACID 分别靠什么（undo / redo / 锁 + MVCC）、隔离级别、MVCC（ReadView、版本链）、当前读 vs 快照读。
- **锁**：行锁、间隙锁、临键锁、RR 下如何防幻读、死锁排查（`SHOW ENGINE INNODB STATUS`）。
- **日志**：redo / undo / binlog、两阶段提交、binlog 三种格式、组提交。
- **调优**：慢查询日志、EXPLAIN 各字段、深分页、大表 Online DDL / gh-ost。
- **架构**：主从复制（异步 / 半同步）、读写分离、分库分表。
- **准备两个真实点**：读过的 8.0 源码具体是哪部分；慢查询优化的完整案例。
- **和 PG 对比**：见 07 文档，几乎每个知识块都有对比。

### Kafka
- **架构**：Broker、Topic、Partition、Replica、ISR、Controller（KRaft 模式去掉了 ZooKeeper）、Consumer Group。
- **为什么快**：顺序写、页缓存、零拷贝、批量 + 压缩、分区并行。
- **可靠性**：`acks=all` + `min.insync.replicas` + 幂等生产者；消费者手动提交 offset。
- **有序性**：分区内有序，同一业务 key 发同一个分区。
- **重复消费 / 积压 / Rebalance** 的处理。
- **准备讲清**：你的数据服务平台（Canal + Debezium → Kafka）的数据链路和怎么保证不丢不重。
- **和 Redis Stream 对比**：见 08 文档第十节。

---

## 补充资料与统计口径

Python 语言/并发/工程化合为 Python 学科；网络由 11 完整覆盖，SQLAlchemy/Celery 由 15 覆盖，Linux 的容器部署另见 17。系统设计、安全、Linux 在本文件各补至三档 20 题；Java、Kafka 保留清单，不列入最低题数验收。

安全复核：[OWASP 授权](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)、[CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)；Linux 资源口径：[cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)。新增命令说明为口述知识，没有执行破坏性清理或服务重启。

---

## 十、MySQL / Kafka / Java（高难场景各备一个）

- **MySQL**：「一张 5 亿行的订单表查询越来越慢」→ 慢查询分析 → 索引优化 → 冷热分离 / 归档 → 分库分表（分片键选择、分布式 ID、跨分片查询、扩容迁移）。准备你自己那次慢查询优化的真实案例。
- **Kafka**：「消费积压了 1000 万条」→ 先看是消费慢还是生产突增 → 临时扩分区和消费者（消费者数 ≤ 分区数）→ 消费逻辑批量化 / 异步化 → 必要时先转储到新 topic 再并行消费 → 事后加积压告警。
- **Java**：「线上服务频繁 Full GC」→ `jstat -gcutil` 看 GC 频率 → `jmap -histo` / dump 后 MAT 分析大对象 → 常见原因：大对象直接进老年代、内存泄漏（静态集合、ThreadLocal 未清理）、元空间不足 → 调整参数或修代码。准备你那次 JVM 调优的真实案例。

---

## 十、高频考点自查清单

> 每条能脱口而出 30 秒的回答就打勾。

**Python**

基础内容和自查清单见 [21-Python基础.md](/posts/interview/Python/Basics.md)；分级题见 [02-后端八股.md](/posts/interview/Python/Questions.md)，内存与执行原理见 [20](/posts/interview/Python/Runtime.md)。

**数据结构与算法**

- [ ] 数组 vs 链表
- [ ] 哈希表原理和冲突解决
- [ ] 为什么数据库用 B+ 树
- [ ] 为什么 Redis ZSet 用跳表
- [ ] 堆和 Top K
- [ ] 排序算法的复杂度和稳定性，快排原理
- [ ] 手撕：LRU、反转链表、Top K、两数之和、有效括号、二分查找

**SQL / 数据库**

- [ ] SELECT 执行顺序
- [ ] 各种 JOIN、WHERE vs HAVING
- [ ] NULL 和 NOT IN 的坑
- [ ] DELETE / TRUNCATE / DROP
- [ ] 三大范式
- [ ] ACID、四种隔离级别、脏读 / 不可重复读 / 幻读
- [ ] 索引原理、最左前缀、索引失效
- [ ] 手写：每组 Top N、连续登录、去重

**操作系统**

- [ ] 进程 / 线程 / 协程
- [ ] 死锁四条件
- [ ] 用户态 / 内核态
- [ ] 虚拟内存
- [ ] IO 多路复用，select / poll / epoll
- [ ] 零拷贝

**网络**

- [ ] TCP vs UDP
- [ ] 三次握手、四次挥手、TIME_WAIT
- [ ] TCP 可靠传输、流量控制、拥塞控制
- [ ] HTTP 状态码、方法、缓存
- [ ] HTTPS 握手
- [ ] HTTP/1.1 vs 2 vs 3
- [ ] 输入 URL 到页面显示

**Redis（详见 08）**

- [ ] 五种数据类型及底层结构
- [ ] 为什么快、单线程模型
- [ ] RDB vs AOF
- [ ] 过期删除 + 内存淘汰
- [ ] 缓存穿透 / 击穿 / 雪崩
- [ ] 分布式锁
- [ ] 主从 / 哨兵 / 集群
