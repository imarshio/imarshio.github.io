---
title: "设计模式"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 38
---

## 什么是设计模式？

设计模式是一套被反复使用的，多人只晓的，经过分类的代码设计经验总结。

设计模式有三大类：创建型，结构型，行为型

**创建型**：工厂模式，抽象工厂模式，单例模式，建造者模式，原型模式

**结构型**：适配器模式，过滤器模式，装饰模式，享元模式，代理模式，外观模式，组合模式，桥接模式

**行为型**：责任链模式，命令模式，中介者模式，观察者模式，状态模式，策略模式，模板模式，空对象模式，备忘录模式，迭代器模式，解释器模式，访问者模式

## 常见的设计模式有哪些？

## 单例模式常见的实现方式

## 工厂模式和虚拟工厂模式有什么区别？

## 策略模式和装饰器模式有什么区别？

## 代理模式

---

## 一、设计模式

> 面试官问设计模式，通常就三连问：**是什么 → 你哪里用了 → 为什么用它而不是 if-else**。
> 每个模式都按这三问准备。

### 1. 注册表模式（Registry）

**是什么**：建一个全局的「登记处」（通常是一个字典），各个组件启动时把自己**登记**进去（名字 → 对象）；使用方只按名字去登记处**查**，不直接依赖具体组件。

可以理解为「电话簿」：你不需要认识每个人，只要知道名字就能查到电话。

**最小代码**：
```python
class ToolRegistry:
    def __init__(self):
        self._specs: dict[str, ToolSpec] = {}

    def register(self, spec: ToolSpec):          # 登记
        if spec.name in self._specs:
            raise ValueError(f"重复注册: {spec.name}")
        self._specs[spec.name] = spec

    def lookup(self, name: str) -> ToolSpec | None:   # 查找
        return self._specs.get(name)

    def all(self, predicate=lambda s: True):         # 按条件筛选
        return [s for s in self._specs.values() if predicate(s)]

GLOBAL_REGISTRY = ToolRegistry()
GLOBAL_REGISTRY.register(ToolSpec(name="search_chunks", parallel_safe=True, ...))
```

**项目里怎么用**：`core/agent/tools/registry.py` 的 `GLOBAL_REGISTRY`。每个工具是一个 `ToolSpec`（名字、参数 schema、处理函数、元数据），启动时全部注册。运行时：
- 给模型发工具列表 → 从注册表按 agent 权限筛选；
- 模型返回 tool_call → 按名字 `lookup` 拿到处理函数执行；
- 并行、延迟加载、打转检测 → 都是读 `ToolSpec` 上的元数据决定，**主循环里没有一行写死某个工具名**。

**为什么不用 if-else**：
```python
# 不用注册表：每加一个工具都要改主循环，100 多个工具就是 100 多个分支
if name == "search_chunks": ...
elif name == "web_search": ...
```
用注册表后，加工具 = 写一个 ToolSpec 注册进去，主循环零改动（**开闭原则：对扩展开放，对修改关闭**）。

**适合**：同一类东西很多、会持续增加、需要按名字动态查找（工具、插件、消息处理器、命令）。
**不适合**：只有两三个固定实现的场景，直接写反而清楚。

**常见追问**：
- 「和工厂模式什么区别？」注册表**存已有的对象**，按名字取；工厂**负责创建新对象**。两者经常一起用：注册表里存的是「名字 → 构造方法」，就成了工厂。我们的 `ToolSpec` 里存的是 `run_factory`，每次运行按会话上下文创建一个绑定了当前用户的处理函数 —— 这就是注册表 + 工厂的组合。
- 「Java 里对应什么？」Spring 容器本身就是一个巨大的注册表（Bean 名字 → Bean 实例）。

### 2. 工厂模式（Factory）

**是什么**：把「创建哪个具体类的对象」这个判断收到一个地方，调用方只说「我要什么」，不关心「怎么造」。

**最小代码**：
```python
_BACKENDS = {"openai": OpenAIBackend, "dashscope": OpenAIBackend, "anthropic": AnthropicBackend}

def backend_for(protocol: str) -> LLMBackend:
    cls = _BACKENDS.get(protocol)
    if cls is None:
        raise ValueError(f"不支持的协议: {protocol}")
    return cls()
```

**项目里怎么用**（两处）：
1. **模型后端**：`core/llm/backends/registry.py` 的 `backend_for(protocol)`。模型配置里写着协议（openai / anthropic / dashscope），工厂据此创建对应的后端。上层的 `LLMClient` 只调用 `backend.complete(...)`，不知道底下是哪家。
2. **文档解析**：`worker/pipeline/factory/`。上传文件后，按文件类型创建对应的解析流水线（PDF、Word、Excel、音频……近 20 种）。

**适合**：创建逻辑有分支、将来会加新类型、调用方不该知道具体类。
**不适合**：只有一种实现。

**追问**：「简单工厂、工厂方法、抽象工厂区别？」
- 简单工厂：一个函数 / 类按参数返回不同产品（我们用的就是这种）。
- 工厂方法：父类定义创建方法，子类决定创建什么。
- 抽象工厂：创建「一整套」相关产品（比如一套 UI 组件：按钮 + 输入框 + 弹窗，分 Windows 风格和 Mac 风格）。

### 3. 策略模式（Strategy）

**是什么**：同一件事有多种**算法**，把每种算法封装成独立的类，实现同一个接口，运行时按条件选一个。调用方只依赖接口。

**最小代码**：
```python
class Limiter(ABC):
    @abstractmethod
    def acquire(self, tokens: int) -> None: ...
    @abstractmethod
    def release(self) -> None: ...

class SlidingWindowLimiter(Limiter):     # 按每分钟请求数 / token 数限
    def acquire(self, tokens): ...       # Redis ZSet 滑动窗口

class ConcurrencyLimiter(Limiter):       # 按同时在跑的请求数限
    def acquire(self, tokens): ...       # Redis ZSet 信号量

def limiter_for(spec) -> Limiter:
    return {"window": SlidingWindowLimiter, "concurrency": ConcurrencyLimiter}[spec.limiter_kind](spec)

# 调用方
limiter.acquire(estimated_tokens)
try:
    resp = backend.complete(...)
finally:
    limiter.release()
```

**项目里怎么用**：模型限流。不同供应商的限流规则**本质不同**：百炼按每分钟请求数和 token 数（滑动窗口），DeepSeek、智谱按同时在跑的请求数（并发）。每种做成一个策略类，`LLMClient` 只调 `acquire / release`。

**一个经验（面试加分）**：不是所有「不同」都值得建策略类。
- **算法不同** → 建策略类（限流）；
- **只是数据不同** → 加配置字段就行（比如不同时段价格不同，只是价格表不同，计算方式一样）。
过度使用策略模式会让类爆炸。

**适合**：多种可互换的算法，且会扩展（支付方式、折扣规则、排序规则、限流算法、重试策略）。
**和工厂的关系**：工厂负责「选哪个策略并创建」，策略负责「具体怎么做」，经常一起出现。
**和 if-else 比**：if-else 把所有算法写在一个函数里，加一种算法就要改这个函数，还容易互相影响。

### 4. 适配器模式（Adapter）

**是什么**：两个接口对不上，中间加一层「转换头」，让旧的 / 外部的东西能按我们的接口使用。像电源转换插头。

**项目里怎么用**（两处）：
1. **Anthropic 协议适配**：系统内部统一用 OpenAI 的消息格式（`messages`、`tool_calls`、`role=tool`）。Claude 的格式不一样（system 单独传、工具结果是 `tool_result` 内容块、流式事件类型不同、思考块要原样回传）。`anthropic_backend.py` 负责双向转换：请求转出去、流式事件转回来。上层几十处代码都只认 OpenAI 格式，**零改动**接入 Claude。
2. **MCP 适配**：MCP server 的工具格式和我们内部的 `ToolSpec` 不同，`mcp_bridge.py` 把每个 MCP 工具包成一个 `ToolSpec` 注册进注册表，对运行时来说和内置工具没有区别。

**适合**：接入第三方 SDK / 老系统 / 外部协议，又不想让外部格式渗透到业务代码里。

### 5. 模板方法模式（Template Method）

**是什么**：父类定义一个流程的**骨架**（步骤顺序固定），某些步骤留给子类实现。

**项目里怎么用**：文档解析 `worker/pipeline/abstract_pipeline.py` 的 `BasePipeline`。所有格式的处理流程是一样的：下载文件 → 转成 markdown → 处理图片 → 切分 → 向量化 → 入库 → 更新进度；只有「转成 markdown」这一步每种格式不同。父类管流程和公共步骤（图片上传、进度通知），子类（`PdfPipeline`、`MsWordPipeline`、`AudioPipeline`……）只实现自己的解析。

```python
class BasePipeline(ABC):
    def run(self):                    # 骨架，子类不改
        md = self.parse()             # 留给子类
        md = self._upload_images(md)  # 公共
        chunks = self._split(md)      # 公共
        self._index(chunks)           # 公共

    @abstractmethod
    def parse(self) -> str: ...
```

**适合**：多个流程「大体相同、局部不同」。
**和策略的区别**：模板方法用**继承**，变化的是流程中的某一步；策略用**组合**，变化的是整个算法。

### 6. 责任链 / 兜底链（Chain of Responsibility）

**是什么**：请求沿着一条链依次传递，每个节点要么处理，要么交给下一个。

**项目里怎么用**：模型兜底链。主模型重试 3 次还失败 → 换配置里的第一个兜底模型 → 再失败换第二个 → 全部失败返回统一提示。链在配置中心配置，层数不限。

**适合**：多个处理者按优先级尝试（审批流、过滤器链、异常兜底）。Java 的 Servlet Filter、Spring Security 的过滤器链都是责任链。

### 7. 熔断器（Circuit Breaker）

**是什么**：一个服务连续失败达到阈值，就「断开」一段时间，期间请求直接失败或走兜底，不再打过去；过一段时间放少量请求试探（半开），成功就恢复。三个状态：**关闭（正常）→ 打开（熔断）→ 半开（试探）**。

**为什么需要**：如果某个模型挂了，每个请求都要先重试 3 次（几十秒）才换兜底模型，用户体验很差，还占着连接。熔断后直接跳到兜底模型。

**项目里怎么用**：`core/llm/breaker.py`，和兜底链配合。

**Java 对应**：Hystrix、Sentinel、Resilience4j。

### 8. 生产者-消费者 / 发布订阅

**是什么**：生产者只管往队列里放，消费者只管从队列里取，两边通过队列解耦，速度可以不一致。

**项目里怎么用**：Agent 生成（生产者）→ Redis Stream（队列）→ SSE 推送（消费者）。好处：用户刷新页面只是换了个消费者，生产不受影响；多个页面可以同时看同一个对话。Celery 也是这个模式。

### 9. 拦截器 / 钩子（Interceptor / Hook）

**是什么**：在某个动作前后插入统一的处理逻辑，不改动作本身。

**项目里怎么用**：工具执行前的 `pre_tool_hook`（可以改参数或拒绝）、打转检测（执行前判断是否重复）、工具执行后统一拼接「经验提示」。Flask 的 `before_request`、Java 的 Spring AOP 都是这个思路。

### 10. 插件化 / 可插拔（Plugin）

**是什么**：主程序定义好扩展点和接口，新能力以插件形式「插上」即可生效，不改主程序。

**项目里怎么用**：
- **Skill**：往目录里放一个 `SKILL.md`，Agent 就多了一项技能；
- **MCP**：配置文件里加一个 MCP server，它的工具就自动注册；
- **子 agent**：注册一份配置就能被主 agent 委派。

**旧项目里**：大模型智能助手平台的「可插拔组件」也是这个思路。

### 11. 装饰器（Python 语法）与装饰器模式

Python 的 `@decorator` 是语法糖，本质是「函数包一层函数」；设计模式里的装饰器模式是「对象包一层对象，增强功能但接口不变」。两者思路相同。项目里：`@login_required`（鉴权）、解析流水线的 `@notify(step_name)`（每步自动上报进度）。

---
