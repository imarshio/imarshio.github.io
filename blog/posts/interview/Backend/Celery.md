---
title: "Celery 面试题"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 4
---

# Celery 面试题

> 两部分，各分入门 / 中等 / 高难三档，每档 20 题以上，★ 是高频题。02 和 05 文档里已有的题，这里收进来做成完整版（简写），并补上新题。
> 项目代码核对日期：2026-10-21。标「项目」的是当前源码能支持的实现；故障原因按代码注释和既有复盘归纳，不把复盘里每个案例都当成已复现。
> 代码块中省略了导入、模型或业务函数的是写法片段，不是可直接复制的整段程序。可运行自检见文末。

---

---

## 五、Celery

> 05 文档有 6 个高难场景（重复执行、gevent 卡死、内存增长、批量任务饿死别人、beat 单点、任务丢失），这里补充。

### 入门
1. **一个最小的 Celery 应用？**
   ```python
   celery = Celery("app", broker="redis://localhost:6379/0", backend="redis://localhost:6379/1")

   @celery.task
   def parse_document(doc_id: str): ...

   parse_document.delay(doc_id)                                   # 投递
   parse_document.apply_async(args=[doc_id], countdown=10, queue="ontology_doc")
   ```
2. **启动 worker？** `celery -A app.celery worker -P gevent -c 5 -Q celery,ontology_doc --loglevel INFO`（`-P` 并发模型，`-c` 并发数，`-Q` 监听的队列）。
3. **broker 选 Redis 还是 RabbitMQ？** RabbitMQ 是专业消息队列，可靠性和路由能力更强；Redis 简单、已经在用、够用。我们用 Redis。

### 中等
4. **任务状态？** PENDING（其实是「不知道」，任务 ID 不存在也返回 PENDING）→ STARTED（需要 `task_track_started=True`）→ SUCCESS / FAILURE / RETRY / REVOKED。
5. **要不要存任务结果？** 不需要结果就 `ignore_result=True`，否则结果后端会被大量用不到的结果撑大。业务状态（文档解析到哪一步了）应该存在**业务数据库**里，不依赖 Celery 的结果后端。
6. **任务超时？** `soft_time_limit`（抛 `SoftTimeLimitExceeded`，任务可以捕获后清理）+ `time_limit`（硬杀）。
7. **撤销任务？** `app.control.revoke(task_id, terminate=True)`。还没执行的会被跳过；已在执行的要 `terminate`（prefork 模式下杀子进程，gevent 下不可靠）。更稳妥的做法是任务里定期检查业务上的「取消标记」。
8. **定时任务？** beat 读 `beat_schedule` 配置按 cron 投递。动态定时任务（用户自己配的）不适合写死在配置里 → 我们是 PG 存规则 + Redis ZSet 调度。
9. **任务优先级？** Redis broker 下优先级支持有限（通过多个队列模拟）；更实用的是**按优先级分队列 + 给高优先级队列更多 worker**。
10. **chain、group、chord 的使用场景？** 一个文档：解析 → 切分 → 向量化（chain）；一批文档并行解析（group）；一批文档全部解析完后生成汇总 wiki（chord = group + 回调）。注意 chord 依赖结果后端，Redis 下有一些边界问题，复杂编排可以用业务状态机代替。
11. **监控？** Flower（Web 界面看任务、worker）；`celery inspect active` / `reserved` / `stats`；队列长度直接看 Redis（`LLEN celery`）。

### 高难
12. **怎么保证任务「恰好执行一次」？** 消息系统只能做到「至少一次」（acks_late + 重投）或「至多一次」（提前 ack）。「恰好一次」要靠**至少一次 + 幂等**：任务开始时用数据库状态或 Redis `SET NX` 判断是否已处理；写操作用唯一约束 / upsert。
13. **任务里调用另一个任务并等待结果？** 不要在任务里 `.get()` 等子任务（可能死锁：worker 都在等，没有 worker 执行子任务），Celery 默认会报错阻止。用 chain / chord 或者回调。
14. **worker 优雅停机？** 发 SIGTERM 是 warm shutdown：不再取新任务，等当前任务执行完。长任务要配合 `acks_late`（被强杀时任务回到队列）和足够长的容器 `stop_grace_period`。
15. **Celery 和 asyncio？** Celery 本身不支持 async 任务函数（5.x），要在任务里 `asyncio.run(...)`；或者换 arq、Dramatiq、Taskiq 这类原生支持 async 的任务队列。
16. **什么时候不该用 Celery？** 交互式、需要低延迟流式返回的任务（比如我们的对话）：Celery 多一跳 broker、首字延迟大，而且流式结果要再走一层 pub/sub。我们的对话在 Web 进程的后台线程里跑，事件写 Redis Stream；只有长尾的批处理才走 Celery。

---

---

## Celery 入门（21 题）

### 1. ★ Celery 是什么？用来做什么？
Python 的分布式异步任务队列。用途：把耗时操作从请求里拿出去异步执行（发邮件、文档解析、生成报告）、定时任务、削峰（任务排队慢慢处理）、分布式并行计算。

### 2. ★ 由哪几部分组成？
**Producer**（应用代码，投递任务）→ **Broker**（消息中间件，存放任务：Redis / RabbitMQ）→ **Worker**（取任务执行）→ **Result Backend**（可选，存执行结果：Redis / 数据库）。另外 **Beat** 负责定时投递。

### 3. ★ Broker 选 Redis 还是 RabbitMQ？
RabbitMQ 是专业的消息队列：消息确认、持久化、路由能力强、优先级支持好，适合对可靠性要求高的场景；Redis 简单、性能好、通常已经在用，但可靠性要靠配置（持久化、visibility_timeout）。我们用 Redis。

### 4. ★ 怎么定义和调用任务？
```python
@shared_task(name="parse_document")
def parse_document(doc_id: str):
    ...

parse_document.delay(doc_id)                                       # 简写
parse_document.apply_async(args=[doc_id], countdown=10, queue="ontology_doc")
```
`shared_task` 不绑定具体的 Celery 应用实例，适合放在可复用的模块里。

### 5. `delay` 和 `apply_async` 的区别？
`delay(*args, **kwargs)` 是 `apply_async(args, kwargs)` 的简写；`apply_async` 能额外指定 `countdown`（延迟几秒）、`eta`（指定执行时间）、`queue`、`priority`、`expires`、`headers` 等。

### 6. ★ 怎么启动 worker？
```bash
celery -A app.celery worker -P gevent -c 5 -Q celery,ontology_doc,ontology_chat,scheduled,bench --loglevel INFO
```
`-A` 指定 Celery 应用，`-P` 并发池类型，`-c` 并发数，`-Q` 要监听的队列（**少监听一个队列，那个队列里的任务就永远没人执行**）。

### 7. 怎么拿到任务结果？
`result = task.delay(x)` 返回 `AsyncResult`，`result.get(timeout=10)` 阻塞等结果、`result.status` 看状态。要配置 Result Backend。**Web 请求里不要同步 `.get()` 等结果**（那就失去异步的意义了），应该返回任务 ID 让前端轮询，或者推送。

### 8. 任务有哪些状态？
PENDING（等待，**或者根本不知道这个任务 ID**）、STARTED（需要 `task_track_started=True` 才会有）、SUCCESS、FAILURE、RETRY、REVOKED。

### 9. ★ Beat 是什么？
定时调度器，按配置的时间表定时向 Broker 投递任务（它自己不执行任务）。**全局只能运行一个 Beat**，否则任务会被重复投递。

### 10. 定时任务怎么配置？
```python
celery.conf.beat_schedule = {
    "sweep-stuck-cards": {"task": "beat_task_sweep_stuck_cards", "schedule": 300},     # 每 300 秒
    "daily-report": {"task": "daily_report", "schedule": crontab(hour=8, minute=0)},  # 每天 8 点
}
```

### 11. ★ worker 有哪些并发模式？怎么选？
`prefork`（默认，多进程，适合 CPU 密集）、`gevent` / `eventlet`（协程，适合 IO 密集、大量等待网络的任务）、`threads`（线程）、`solo`（单线程，调试用）。我们的任务大多在等模型和网络，用 gevent。

### 12. ★ 什么是队列和路由？
可以有多个队列，不同的任务进不同的队列，不同的 worker 监听不同的队列。目的：**隔离**（慢任务不堵快任务）和**独立扩容**。我们按业务分了 celery（默认）、ontology_doc（文档本体抽取）、ontology_chat（对话本体）、scheduled（定时任务，一次要跑一整个 Agent）、bench（模型评测）几个队列。

### 13. ★ 任务失败了怎么自动重试？
```python
@shared_task(bind=True, autoretry_for=(TimeoutError, ConnectionError), retry_backoff=True,
             retry_backoff_max=600, retry_jitter=True, max_retries=5)
def call_api(self, x): ...
```
或者手动 `raise self.retry(exc=e, countdown=30)`。`retry_backoff` 指数退避，`retry_jitter` 加随机抖动（避免大量任务同时重试）。

### 14. 任务参数的序列化？为什么不推荐 pickle？
默认 JSON（安全、跨语言，但只支持基本类型）。pickle 能序列化任意 Python 对象，但**反序列化时可以执行任意代码**，如果 Broker 被别人写入了恶意消息就会被攻击，所以默认关闭。

### 15. ★ 任务参数应该传什么？
传 **ID**，不要传大对象或 ORM 对象：参数会序列化后存在 Broker 里（占内存、序列化慢）；任务执行时数据可能已经变了（应该在任务里按 ID 重新读最新数据）；ORM 对象跨进程根本用不了。

### 16. 不需要结果时怎么做？
`@shared_task(ignore_result=True)` 或全局 `task_ignore_result=True`（我们就是全局关闭的）。不然 Result Backend 会存大量用不到的结果。业务状态应该存在业务数据库里。

### 17. Flower 是什么？
Celery 的 Web 监控工具：看 worker 状态、正在执行和已完成的任务、任务耗时、失败原因，还能远程撤销任务。

### 18. 任务的超时怎么设？
prefork 下可用 `time_limit`（硬超时）和 `soft_time_limit`（抛 `SoftTimeLimitExceeded`，可清理），软的应短于硬的。gevent 不支持 soft time limit，阻塞调用也可能逃过 hard time limit，不能把装饰器参数当成所有并发池都能保证的墙钟上限。项目使用 gevent，更需要外部 IO 超时、看门狗和可恢复状态。

### 19. 延迟执行怎么做？
`apply_async(countdown=60)`（60 秒后）或 `eta=datetime`（指定时间）。注意：延迟任务是被 worker **先取走、存在 worker 内存里等到时间再执行**的（不是 Broker 到时间再发），这会带来一些问题（见中等第 17 题）。

### 20. ★ Celery 怎么和 Flask 集成？
任务里经常要用到数据库、配置，需要 Flask 的应用上下文。常用做法：自定义 Task 基类，在 `__call__` 里 `with app.app_context():` 包住任务执行，这样所有任务都自动有上下文。

### 21. 怎么查看队列里积压了多少任务？
Redis broker 可用 `LLEN` 看 ready list，但启用优先级后一个逻辑队列可能拆成多个 list，要累加；它不包含 unacked、active 和 ETA 等任务。`celery -A app inspect active / reserved / scheduled` 看 worker 手上正在执行 / 已预取 / 延迟中的任务。

---

## Celery 中等（22 题）

### 1. ★ `acks_late` 是什么？为什么要配合幂等？
默认在任务即将执行前确认（不是刚从队列预取就确认），执行途中崩溃可能丢失。`task_acks_late=True`：延迟到执行结束确认，但普通异常、子进程退出、整个 worker 掉线走不同路径，是否重投还受失败确认、reject 配置和 transport 影响。代价是任务可能执行不止一次，所以**任务必须幂等**。我们全局开启了 `acks_late`，同时开了 `task_reject_on_worker_lost=True`（worker 被 kill -9 / OOM 时让任务回到队列）。

### 2. ★ `worker_prefetch_multiplier` 是什么？
worker 的预取额度通常是 multiplier × 并发槽位数；默认 multiplier=4。不是每个 prefork 子进程各自再乘一遍。短任务预取多一点能提高吞吐；**长任务应该设为 1**，否则一个 worker 囤着一堆任务慢慢执行，别的 worker 却闲着。我们设的是 1。

### 3. ★ Redis broker 的 `visibility_timeout` 是什么？
任务被取走后，如果在这个时间内没有 ack，Redis 认为 worker 挂了，把任务重新放回队列。默认 1 小时。配合 `acks_late`，这个值**必须大于最长任务的执行时间**，否则长任务执行中途就会被重新投递，出现两份同时执行。源码默认 3600 秒，可被环境变量覆盖；`config.py` 里「最长 30 分钟」的注释已过时：`run_scheduled_task` 的 time_limit=3600，几乎没有余量。`run_agent_bench` 上限 6 小时但单独设 acks_late=False，不能和晚确认任务混为一谈。gevent 的超时能力还需单独验证。

### 4. ★ 任务路由怎么配？
```python
celery.conf.task_routes = {
    "ontology_ingest": {"queue": "ontology_doc"},
    "run_scheduled_task": {"queue": "scheduled"},
}
```
或者在任务定义上写 `@shared_task(queue="bench")`，或者投递时 `apply_async(queue=...)`。

### 5. ★ chain、group、chord 是什么？
```python
chain(parse.s(doc_id), split.s(), embed.s())()       # 串行：前一个的返回值作为后一个的第一个参数
group(parse.s(d) for d in doc_ids)()                 # 并行
chord(group(parse.s(d) for d in doc_ids))(build_wiki.s())   # 并行全部完成后执行回调
```
`.s()` 是签名（signature），`.si()` 是不接收上一个结果的不可变签名。chord 依赖支持它的 Result Backend，header/body 任务不能忽略结果；项目全局 task_ignore_result=True，直接照搬要先为参与任务覆盖 ignore_result=False。

### 6. 任务优先级怎么做？
RabbitMQ 原生支持队列优先级；Redis broker 的优先级是通过多个子队列模拟的，效果有限。更可靠的做法：**按优先级分队列，给高优先级的队列分配更多（或专属的）worker**。

### 7. `rate_limit` 能做全局限流吗？
`@shared_task(rate_limit="10/m")` 是**每个 worker 实例**的任务类型限流（prefork 子进程共享该实例的消费控制），不是全局的：开 10 个 worker 实际就是每分钟 100 次。要全局限流（比如调用某个外部 API 每分钟最多 60 次），用 Redis 实现的分布式限流器，在任务里先获取令牌。

### 8. 怎么撤销一个任务？
`celery.control.revoke(task_id)`：还没执行的会被跳过；`terminate=True` 杀掉正在执行的（prefork 模式下杀子进程；gevent 模式下不可靠）。更稳妥的做法：任务里定期检查业务上的「取消」标记，自己优雅地退出。

### 9. 常用的信号有哪些？
`task_prerun` / `task_postrun`（任务前后，可以做日志、计时、设置 trace_id）、`task_failure`（失败告警）、`task_retry`、`worker_ready`（worker 启动完成）、`worker_shutting_down`（开始停机，我们在这里做了「等所有任务执行完再退出」）。

### 10. `bind=True` 有什么用？
任务函数的第一个参数是任务实例 `self`，可以访问 `self.request`（任务 ID、重试次数、投递时的 headers）、调用 `self.retry()`、`self.update_state()` 上报进度。

### 11. 任务进度怎么上报？
`self.update_state(state="PROGRESS", meta={"done": 30, "total": 100})`，前端通过结果后端查询。更常用的是写**业务表**（文档表的 status、progress 字段），因为业务数据本来就要存，也不依赖 Celery 的结果后端。我们的文档解析流水线每一步都更新进度（`@notify(step_name)` 装饰器）。

### 12. 结果要保存多久？
`result_expires`（默认 1 天）。结果后端是 Redis 时，大量结果会占内存。不需要结果的任务一律 `ignore_result`。

### 13. worker 的并发数怎么定？
prefork：一般等于 CPU 核数；gevent：可以开几十到几百（取决于任务在等待 IO 的比例、下游能承受的并发、数据库连接池大小）。**并发数 × 每个任务占用的数据库连接**不能超过连接池上限。

### 14. 怎么防止 worker 内存泄漏？
`worker_max_tasks_per_child=100`（每个子进程执行 100 个任务后重启）、`worker_max_memory_per_child=500000`（KB，超过就重启）。prefork 模式下有效。

### 15. ★ 任务里怎么正确使用数据库 Session？
每个任务用自己的 Session，任务结束时 `remove()`（或用 `with` 管理）；失败时回滚；不要在任务里复用 Web 请求的 Session（不同进程，也没有意义）；长任务不要一直持有事务。

### 16. 任务失败怎么告警？
`task_failure` 信号里上报到监控 / 告警系统（Sentry、企业微信机器人）；超过重试次数的任务进入「死信」处理（记录到数据库，人工处理或定期重试）。

### 17. ★ 延迟（eta / countdown）任务有什么坑？
延迟任务被 worker 取走后存在 worker 内存里等到时间才执行。
- 如果延迟时间**超过 visibility_timeout**，在等待期间 Redis 会认为它超时没 ack，重新投递一份 → **重复执行**；
- worker 重启时内存里的延迟任务会被 Redis 重新投递（acks_late 下）；
- 大量延迟任务会占用 worker 内存；ETA 任务的预取行为有版本差异，不能只靠 multiplier 限量，较新版本可评估 worker_eta_task_limit。
- 结论：**长时间的延迟（几小时、几天）不要用 Celery 的 eta**，改用数据库 / Redis ZSet 记录执行时间，由定时扫描投递（这也是我们定时任务的做法）。

### 18. 链式任务中某一步失败了怎么处理？
`chain(...).on_error(handle_error.s())` 或 `apply_async(link_error=...)`，失败时调用错误回调；后续步骤不会执行。每一步自身的重试在它的任务定义里配置。

### 19. Beat 和 worker 要分开部署吗？
要。Beat 只能有一个实例，worker 可以水平扩展多个。我们的部署里 beat 是单独的角色（`MODE=beat`），和 worker（`MODE=worker`）分开，用同一个镜像。

### 20. ★ 为什么配置了 `task_routes`，任务却跑到默认队列去了？（项目）
`task_routes` 是在**发送任务的那一端**生效的。源码注释记录过：模型评测由 gateway 投递，但该发送端未应用预期路由，任务落入默认队列而不进入预期 bench 消费者。当前 entrypoint 的默认队列列表已包含 bench；这是一段历史路由问题，不能说现状下所有默认 worker 都不消费 bench。解决：把队列声明直接写在任务定义上 `@shared_task(queue="bench")`，不依赖发送端的配置。教训：**加路由前先确认这个任务是谁在投递**。

### 21. 怎么做任务去重（同一个文档不要被同时解析两次）？
任务开始时 `SET lock:parse:{doc_id} <worker_id> NX EX 3600`，拿不到锁直接返回；或者以数据库状态为准（`UPDATE docs SET status = 'parsing' WHERE id = ? AND status = 'pending'`，影响 0 行说明已经有人在处理了）。

### 22. 有哪些替代 Celery 的方案？
- **RQ**：基于 Redis，更简单，功能少；
- **Dramatiq**：设计更现代，默认行为更安全（默认 acks_late）；
- **arq / Taskiq**：原生支持 asyncio；
- **Kafka / RabbitMQ 直接用**：事件驱动、多消费者、高吞吐；
- **Temporal**：工作流引擎，适合长时间运行、需要持久化状态和复杂编排的流程（AI Agent 的长流程编排也有人用它）。

---

## Celery 高难（22 题）

### 1. ★ 长任务被执行了两次（项目经验）
原因：`acks_late` + Redis 的 `visibility_timeout` 小于任务执行时间，执行到一半被认为超时重新投递。解决：visibility_timeout 设得比最长任务的硬超时还长（项目默认 3600 秒，而定时运行声明上限也是 3600 秒，存在余量不足的风险）；任务幂等；用锁防止并发执行同一个对象；把超长任务拆成小任务。

### 2. ★ gevent worker 启动后第一个任务就永久卡住（项目）
monkey-patch 没在最早期生效，socket 还是阻塞的，第一个网络 IO 就把 gevent 的事件循环（hub）卡死，所有任务挂起且不报错。解决：用 `sitecustomize` 在解释器启动时最先 patch；启动命令的 `PYTHONPATH` 必须指向 `app/`（否则 sitecustomize 不加载）；写了专门的测试检测 patch 是否生效。

### 3. ★ 发版时正在执行的任务怎么办？（项目）
warm shutdown 通常等待当前任务完成；实际可等多久还受容器、额外停机阶段及应用钩子限制；容器的 `stop_grace_period` 到了会被 SIGKILL。我们的做法：
- 在 `worker_shutting_down` 信号里起一个协程，轮询本进程正在执行的任务数，全部完成才退出，最长等 1 小时兜底；
- 注意 gevent 下信号处理函数运行在事件循环的回调里，不能直接起线程（会报 `BlockingSwitchOutError`），要用 `gevent.spawn`；
- 停机流程顺带停掉独立线程里的监听器，让它们释放分布式锁，存活的副本秒级接管；
- 万一被 SIGKILL：晚确认任务在 transport 恢复机制下可能重投，仍需检查 Redis 持久化、可见性超时和业务对账；这些参数不保证所有任务都不丢。当前 worker 的容器停机宽限为 3900 秒，Web 为 120 秒。

### 4. ★ 滚动发版把正在执行的 Agent 连进程一起杀掉，卡片永远停在「生成中」（项目）
进程被杀时，写最终状态、发结束事件的代码根本没机会执行。兜底：每 5 分钟跑一次「僵尸卡片清扫」定时任务，把静默超过阈值的「生成中」卡片收尾成失败状态、发终止事件（幂等）。这是兜底不是根本方案，根本方案是给每次运行加**租约 + 接管**（运行中定期续租，租约过期由别的实例接管或收尾）。

### 5. ★ worker 内存越跑越大
原因：全局缓存无上限、解析库（PDF、Office、LibreOffice）本身泄漏、长生命周期的 Session。prefork 可用 `worker_max_tasks_per_child` / `worker_max_memory_per_child`；gevent 不能靠这两个参数回收子进程，要滚动替换实例或隔离重任务；把重的解析放进子进程，跑完退出；`tracemalloc` 定位。

### 6. ★ 一个用户上传了 1000 个文件，其他用户的任务全部排队
同一个队列先进先出。解决：**公平调度** —— 按组织 / 用户限制同时在执行的任务数，超过的延后投递；大批量导入走单独的低优先级队列；把单个文件的处理拆成多个小任务，便于穿插。

### 7. ★ Beat 是单点，挂了定时任务就停；部署多个又会重复调度
- 方案一：Beat 只部署一个副本，容器编排保证挂了自动拉起；
- 方案二：分布式锁（RedBeat 这类基于 Redis 的调度器自带锁）；
- 方案三（项目做法）：**用户配置的定时任务不放在 Beat 的静态配置里**。PG 是真相（规则存表里），Redis ZSet 按下次执行时间排序；单副本 Beat 每 5 秒投递 dispatch 扫描任务，另每分钟投递 reconcile；扫描执行端用 ZSet 抢占和数据库状态防重，对账补回丢失项。**它没有消除 Beat 依赖**：Beat 停了，扫描和对账也会停。

### 8. ★ 任务丢了怎么办？
Redis 没开持久化时重启任务全丢；worker 预取的任务在内存里（非 acks_late 时）。原则：**数据库是真相，队列只是加速**。业务状态存在数据库里（文档状态是「待解析」就说明还没处理），定期扫描卡住的记录重新投递。

### 9. ★ 怎么做到「恰好一次」？
Celery 不能承诺端到端恰好一次。工程上可用「至少一次投递 + 原子幂等提交」实现特定业务效果一次：任务开始时检查业务状态是否已处理；所有写操作是幂等的（upsert、带条件的 UPDATE、唯一约束）；外部副作用（发邮件、扣费）带幂等键，接收端也必须原子地识别幂等键；先查再调存在并发和崩溃窗口。

### 10. 任务里同步等待子任务的结果，为什么会死锁？
所有 worker 都在执行「等待子任务结果」的父任务，子任务排在队列里却没有空闲的 worker 去执行。Celery 默认会对任务里调用 `.get()` 报错阻止。正确做法：chain / chord，或者回调。

### 11. 一次要投递 10 万个任务，怎么做？
逐个 `delay` 会产生 10 万次网络往返。`group` 便于组织任务，但一般仍要发每条消息，并不会自动把十万次发布变成一次网络请求；可以按批创建签名、复用发布连接；或者 `chunks`（`task.chunks(zip(ids), 100)` 把 10 万个调用打包成 1000 个任务，每个处理 100 个）；或者干脆投递一个任务，任务内部按批处理。同时注意不要一下子把下游（数据库、模型）打爆。

### 12. ★ 下游服务挂了，大量任务一起重试，形成重试风暴
所有任务按相同的间隔重试，下游刚恢复就被重试流量再次打垮。解决：指数退避 + **随机抖动**（`retry_backoff` + `retry_jitter`）；设最大重试次数；在任务里加**熔断**（下游连续失败时暂时不调用，直接延后重试）；全局限流。

### 13. Redis broker 挂了会怎样？
新任务投递失败（应用要处理投递异常：重试、降级、或记录到数据库稍后补投）；worker 断开后自动重连。缓解：Redis 高可用（哨兵）；关键任务先写数据库再投递（outbox 模式），投递失败可以补投。

### 14. 多租户场景下怎么隔离任务？
大客户的任务单独队列 + 专属 worker（防止一个客户影响所有人）；任务里按组织做配额和限流；任务参数里带上租户 ID，任务里所有数据访问都按租户过滤。

### 15. 怎么设计一个幂等的任务？
这里给状态流程，完整可运行的故障窗口演示在 `验证/verify_15.py`：

1. 在短事务中把 pending 原子改为 charging，记下幂等键并提交；charging 的恢复任务也要能继续处理。
2. 在事务外调用支付方，始终复用同一幂等键。超时表示结果未知，不能直接生成新扣款请求。
3. 短事务记录支付结果；若第 2 步后进程崩溃，由恢复任务按同一键查询或重调，再落 paid。
4. 并发执行要用租约或领取 token；对照账单补偿，不能见 charging 就永久退出。

只写「pending→charging→调用外部→paid」而没有提交边界和恢复路径，会在崩溃后卡死或重复产生副作用。这个题是设计示例，不是项目收款实现。

### 16. ★ 什么场景不适合用 Celery？（项目）
交互式、要求低延迟流式返回的任务。我们的 AI 对话就没有用 Celery：多一跳 broker 首字延迟变大，流式结果还要再走一层发布订阅。对话在 Web 进程的后台线程里跑，事件写 Redis Stream，SSE 直接读；只有长尾的批处理（文档解析、本体抽取、定时任务、评测）才走 Celery。

### 17. 新旧版本的 worker 同时在线时，任务签名改了怎么办？
滚动发布期间，新代码投递的任务可能被旧 worker 执行，反之亦然。规则：新增参数必须有默认值；不要直接改参数含义或删除参数（先兼容两种，下个版本再删）；任务改名时保留旧名字的任务作为转发；必要时用新队列，新 worker 先上线再切流量。

### 18. 跨服务投递任务（发送方没有任务代码）怎么做？
`celery.send_task("run_agent_bench", args=[...], queue="bench")`，只按名字投递，不需要导入任务函数。注意：`send_task` 会使用当前发送端 Celery app 的路由配置；发送端未加载路由、且没有任务对象时，接收端装饰器上的 queue 无法替它路由，跨服务时最好显式指定队列。

### 19. 长任务怎么做断点续传？
把任务拆成可恢复的步骤，每完成一步就把进度持久化（数据库记录处理到第几页 / 第几个 chunk）；任务重新执行时从上次的进度继续。我们文档入库分块重试（`ontology_chunk_retry`）就是只重试失败的分块，而不是整个文档重来。

### 20. Celery 任务的可观测性怎么做？
每个任务带 trace_id（投递时放进 headers，`task_prerun` 里取出设置到日志上下文），和触发它的 Web 请求串起来；记录任务的排队时间（投递到开始执行）、执行时间、重试次数、失败原因；监控每个队列的积压长度和 worker 数量，积压超过阈值告警。

### 21. 某个队列积压了几万个任务，怎么处理？
先看是生产突增（某个批量操作）还是消费变慢（下游变慢、某类任务卡住）；临时增加这个队列的 worker；排查慢的根因（`inspect active` 看都卡在什么任务上）；必要时先清理无效任务（重复的、过期的）；事后加积压告警和限流。

### 22. Celery 和 Temporal 这类工作流引擎有什么本质区别？
Celery 是「任务队列」：每个任务独立，任务之间的编排（chain / chord）比较简单，状态由你自己存；Temporal 是「持久化工作流」：工作流代码的执行状态由引擎持久化，进程崩了可以从断点**精确恢复**，天然支持长时间运行（几天）、定时、重试、人工审批等待。AI Agent 的长流程（跑几十分钟、要等用户确认、要能从中断处恢复）在需求变复杂后，可能更适合工作流引擎 —— 我们现在的「检查点落库 + 僵尸卡片清扫」就是在手动实现其中一部分。


## 复核依据与自检

2026-10-21 已核对：`../xknow-ai/app/config.py`、`app/extended/ext_celery.py`、`app/extended/ext_sqlalchemy.py`、`app/gunicorn_conf.py`、`app/core/agent/orchestrator.py`、`app/worker/tasks/{stuck_card_task,scheduled_task_task,agent_bench_task}.py`、`app/services/workspace_service.py` 及 `docker-compose/docker-compose-prd.yaml`（这些 app 路径相对 xknow-ai）。

配置里 `task_acks_on_failure_or_timeout=False` **不等于普通失败会自动重试**；当前 Celery 的普通失败可走 reject(requeue=False)，业务重试需 `retry/autoretry` 或对账。任务级选项可覆盖全局值，尤其 bench 的 acks_late=False。

[自检程序](/posts/interview/Guide/Scripts.md#verify-15-py)覆盖：CRUD、关系加载、JSON 原地修改、版本冲突、保存点回滚、PG upsert/行锁/部分索引 SQL 编译、租户过滤、Celery 本地内存 broker 路由和 eager chain/group，以及支付调用后崩溃再恢复。它不启动项目应用，不连接共享服务；内存 broker/eager 无法验证真实 worker 的 ACK、超时和停机行为。片段里的业务函数、省略号和 Alembic DDL 没有被当成完整程序执行。

运行：在 Workspace 下执行 `xknow-ai/.venv/bin/python -I 面试准备/验证/verify_15.py`。

版本依据：[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、[Celery 任务确认与重试](https://docs.celeryq.dev/en/stable/userguide/tasks.html)、[Celery gevent 超时限制](https://docs.celeryq.dev/en/stable/userguide/workers.html#time-limits)。

---

## 三、Celery

### 入门
1. **组成？** Producer → Broker（Redis / RabbitMQ）→ Worker → Result Backend。
2. **`delay` 和 `apply_async`？** `delay(*args)` 是简写；`apply_async` 能指定 `countdown`、`eta`、`queue`、`priority`。
3. **beat 是什么？** 定时发任务的调度器，全局只能一个。
4. **worker 并发模式？** prefork（多进程，CPU 密集）、gevent / eventlet（协程，IO 密集）、solo / threads。我们用 gevent。

### 中等
5. **任务失败重试？**
   ```python
   @celery.task(bind=True, autoretry_for=(TimeoutError,), retry_backoff=True, max_retries=5)
   def parse(self, doc_id): ...
   ```
6. **`acks_late` 和幂等？** 默认拿到就 ack，worker 崩了任务丢；`acks_late=True` 执行完才 ack，崩了会重投 → 任务必须幂等（用状态机判断「已经处理过就跳过」、唯一键、分布式锁）。
7. **`prefetch_multiplier`？** 每个 worker 预取多少任务。长任务设为 1，避免一个 worker 囤了一堆任务而别的 worker 空闲。
8. **队列路由？** `task_routes` 或 `apply_async(queue=...)`，不同 worker 监听不同队列。我们按业务分了多个队列，慢任务（文档本体抽取）不堵快任务。
9. **任务编排？** `chain`（串行，前一个结果传给后一个）、`group`（并行）、`chord`（并行完成后执行回调）。
10. **任务参数传什么？** 只传 ID，不传大对象（参数会序列化进 broker，大了占内存，而且数据可能已过期）。

### 高难（场景模拟）

#### 场景 1：长任务被执行了两次
- 原因：Redis broker 的 `visibility_timeout`（默认 1 小时）—— 任务被取走后超过这个时间没 ack，Redis 认为 worker 死了，重新投递给别的 worker。`acks_late` + 长任务（解析一个大 PDF 超过 1 小时）必然重复。
- 方案：调大 `visibility_timeout` 到大于最长任务时间；任务本身幂等；用 Redis 锁防止同一个文档同时被两个 worker 处理；把超长任务拆成多个小任务。

#### 场景 2：gevent worker 启动后，第一个任务就永久卡住
- **项目真实事故**：worker 的 monkey-patch 没在最早期生效（导入顺序问题），socket 还是阻塞的，第一个网络 IO 就把整个事件循环钉住，所有任务挂起，还不报错。
- 方案：用 `sitecustomize` 保证 Python 启动时最先 patch；启动命令里 `PYTHONPATH` 必须指对，否则 `sitecustomize` 不加载。写了一个测试专门检测 gevent patch 是否生效。
- 教训：gevent 的问题都是「隐式」的，排查时第一个怀疑 patch 有没有生效。

#### 场景 3：worker 内存越跑越大
- 原因：内存泄漏（全局缓存、大对象未释放）、解析库本身泄漏（LibreOffice、PDF 库）。
- 方案：`worker_max_tasks_per_child`（执行 N 个任务后重启子进程）、`worker_max_memory_per_child`；重的解析放到子进程里跑，跑完进程退出。

#### 场景 4：用户一次上传 1000 个文件，其他用户的任务全卡住
- 原因：所有任务在同一个队列，先进先出。
- 方案：按用户 / 组织做公平调度 —— 每个组织同时在跑的任务数限流（超过的延后再投）；大批量导入走单独的低优先级队列；单个文件的任务再拆细（解析、向量化分开），方便穿插。

#### 场景 5：beat 单点，挂了定时任务就停；多副本又会重复调度
- 方案一：beat 只部署一个副本（Swarm `replicas: 1`），配合健康检查自动重启。
- 方案二（**项目做法**）：定时任务不靠 beat 的静态配置，**PG 为准**（用户的定时任务存在表里），Redis ZSet 按下次执行时间排序；多个 worker 轮询到期任务，`ZREM` 成功的那个才执行（原子抢占，天然去重）；另有对账任务定期比对 PG 和 Redis，补回丢失的。

#### 场景 6：任务丢了怎么办
- Redis 作为 broker，如果 Redis 没开持久化重启后任务全丢。
- 方案：Redis 开 AOF；关键业务以数据库状态为准（文档状态是「待解析」就说明还没处理），定期扫描卡住的任务重新投递 —— 「**数据库是真相，队列只是加速**」。

---
