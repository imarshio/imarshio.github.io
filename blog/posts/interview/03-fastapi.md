---
title: "FastAPI 专题"
lang: zh-CN
date: 2026-10-23
order: 103
category:
  - 面试准备
tag:
  - 面试题
---

# FastAPI 专题

> 背景：我们项目用 Flask（为什么用 Flask 见 [09-Flask专题.md](/posts/interview/09-flask.md)），但市面上新的 AI 后端大多是 FastAPI。
> 回答「没在生产用过 FastAPI」时的姿态：**理解两者的本质差别，知道迁移的难点，能当场写出流式 Agent 接口**。
> 建议面试前用 FastAPI 把第六节的代码真跑一遍。
>
> 目录：一、基础 → 二、请求与响应 → 三、Pydantic → 四、依赖注入 → 五、async 与并发 → 六、手写流式 Agent 接口 → 七、中间件、异常、生命周期 → 八、鉴权与安全 → 九、数据库 → 十、后台任务与长任务 → 十一、测试 → 十二、部署与性能 → 十三、高难场景 → 十四、从 Flask 迁移 → 十五、快问快答

---

## 一、基础

### 入门
1. **FastAPI 是什么？** 基于 **Starlette**（ASGI Web 框架：路由、请求响应、中间件、WebSocket）+ **Pydantic**（数据校验和序列化）的 Web 框架。用 Python 类型标注声明参数，框架自动完成解析、校验、序列化和 OpenAPI 文档生成。
2. **最小应用？**
   ```python
   from fastapi import FastAPI
   app = FastAPI()

   @app.get("/health")
   async def health():
       return {"ok": True}
   # uvicorn main:app --reload
   ```
3. **自动文档在哪？** `/docs`（Swagger UI）、`/redoc`、`/openapi.json`。
4. **ASGI 和 WSGI？**
   | | WSGI | ASGI |
   |---|---|---|
   | 接口 | `app(environ, start_response)` 同步接口，并发由服务器进程/线程/gevent 等决定 | `async app(scope, receive, send)`，基于事件循环 |
   | 长连接 | 可流式响应/SSE；标准未定义 WebSocket | 定义 HTTP/WebSocket 事件；网络协议版本取决于服务器实现 |
   | 框架举例 | Flask、Django 的 WSGI 入口 | FastAPI、Starlette、Django 的 ASGI 入口 |
5. **Uvicorn 是什么？** ASGI 应用服务器，常用于 FastAPI。uvloop、httptools 是可选底层实现，不是所有平台/安装都必用；也可选择其他事件循环与解析实现。WSGI/ASGI、框架、服务器与 worker 的分层详见 [09 的基础导读](/posts/interview/09-flask.md)。
6. **APIRouter？** 路由分组，相当于 Flask 的 Blueprint：
   ```python
   router = APIRouter(prefix="/models", tags=["models"], dependencies=[Depends(require_login)])
   @router.get("/{model_id}")
   async def get_model(model_id: str): ...
   app.include_router(router, prefix="/api/gateway")
   ```

### 中等
7. **FastAPI 和 Flask 的核心区别？**
   | | Flask | FastAPI |
   |---|---|---|
   | 协议 | WSGI，同步 | ASGI，异步 |
   | 参数校验 | 手动 / 扩展（Flask-RESTX、marshmallow） | 内置（Pydantic） |
   | 文档 | 扩展 | 内置 |
   | 依赖注入 | 没有（用装饰器 + 全局对象 `g`、`current_user`） | 内置 `Depends` |
   | 上下文 | 全局代理对象（`request`、`current_app`） | 显式参数 |
   | 并发 | 多线程 / gevent | 事件循环 + 线程池 |
8. **FastAPI 为什么快？** 底层 Starlette + uvicorn（uvloop、httptools）；异步 IO 让一个进程同时处理大量等待中的请求；Pydantic v2 核心是 Rust。注意「快」主要体现在 IO 并发，CPU 密集的逻辑不会因为用了 FastAPI 变快。

---

## 二、请求与响应

### 入门
1. **参数来源？**
   ```python
   @app.post("/items/{item_id}")
   async def update(
       item_id: int,                                  # 路径参数（在路径里声明了）
       q: str | None = None,                          # 查询参数（简单类型默认是 query）
       body: ItemIn,                                  # 请求体（Pydantic 模型默认是 body）
       x_token: str = Header(...),                    # 请求头（下划线自动转成连字符 x-token）
       session_id: str | None = Cookie(None),         # cookie
   ): ...
   ```
2. **参数校验？** `Query(min_length=3, max_length=50, pattern="^[a-z]+$")`、`Path(gt=0)`、`Body(embed=True)`；校验失败返回 **422**，带具体字段和原因。
3. **`...` 是什么意思？** `Ellipsis`，表示必填（新写法用 `Annotated[str, Query()]` 不给默认值即必填）。
4. **推荐的 `Annotated` 写法？**
   ```python
   from typing import Annotated
   async def list_items(limit: Annotated[int, Query(ge=1, le=100)] = 20): ...
   ```
   好处：类型和元数据分开，同一个 `Annotated` 类型可以复用。
5. **文件上传？**
   ```python
   async def upload(file: UploadFile):
       content = await file.read()          # 小文件
   ```
   `UploadFile` 底层是 SpooledTemporaryFile（超过阈值写磁盘），比 `bytes` 参数省内存。需要装 `python-multipart`。
6. **表单？** `username: str = Form(...)`。
7. **响应类型？** 默认返回 dict / 模型自动转 JSON；`JSONResponse`、`HTMLResponse`、`PlainTextResponse`、`RedirectResponse`、`FileResponse`、`StreamingResponse`、`ORJSONResponse`（更快的 JSON）。
8. **自定义状态码？** `@app.post("/items", status_code=201)`；运行时 `raise HTTPException(status_code=404, detail="not found")`。

### 中等
9. **`response_model` 的作用？** 声明返回结构：**过滤字段**（不把密码返回出去）、序列化、生成文档。
   ```python
   class UserOut(BaseModel):
       id: int
       email: str
   @app.get("/me", response_model=UserOut)
   async def me(user = Depends(current_user)):
       return user                       # 即使 user 有 password 字段也不会返回
   ```
   相关参数：`response_model_exclude_unset=True`（只返回显式设置过的字段，做 PATCH 响应常用）、`response_model_exclude_none`。
10. **返回类型标注和 response_model？** 新版本可以直接写返回类型 `-> UserOut`，效果相同；两者都写时 `response_model` 优先。
11. **怎么统一响应格式 `{code, msg, data}`？** 泛型响应模型：
    ```python
    T = TypeVar("T")
    class Resp(BaseModel, Generic[T]):
        code: int = 0
        msg: str = "ok"
        data: T | None = None
    @app.get("/models", response_model=Resp[list[ModelOut]])
    ```
    再配合全局异常处理器把异常也转成这个格式。
12. **大文件下载 / 流式返回？** `StreamingResponse(async_generator, media_type=...)`；本地文件用 `FileResponse`（支持 Range 断点续传）。
13. **怎么读原始请求体？** `request: Request` 参数，`await request.body()` / `await request.json()`；超大请求体用 `async for chunk in request.stream()` 分块读，不一次性进内存。

---

## 三、Pydantic（v2）

### 入门
1. **BaseModel 基本用法？**
   ```python
   class ToolCallIn(BaseModel):
       name: str
       arguments: dict[str, Any] = {}
       timeout: float = Field(default=30, gt=0, le=600)
   obj = ToolCallIn.model_validate({"name": "search", "timeout": "10"})   # "10" 自动转成 10.0
   obj.model_dump()                                                         # 转回 dict
   obj.model_dump_json()
   ```
2. **可变默认值安全吗？** Pydantic 会为每个实例深拷贝默认值，所以 `arguments: dict = {}` 是安全的（和普通函数、dataclass 不同）；也可以用 `Field(default_factory=dict)`。

### 中等
3. **校验器？**
   ```python
   class ModelConfig(BaseModel):
       model_id: str
       fallbacks: list[str] = []

       @field_validator("model_id")
       @classmethod
       def strip(cls, v: str) -> str:
           return v.strip()

       @model_validator(mode="after")
       def no_self_fallback(self):
           if self.model_id in self.fallbacks:
               raise ValueError("兜底模型不能等于主模型")
           return self
   ```
   我们的模型兜底链校验（不能等于主模型、不能重复）就是这类逻辑。
4. **模型配置？** `model_config = ConfigDict(extra="forbid", from_attributes=True, str_strip_whitespace=True, frozen=True)`。
   - `extra="forbid"`：多余字段直接报错（配置类必开，拼错键名能立刻发现）；
   - `from_attributes=True`：可以从 ORM 对象构造（v1 叫 `orm_mode`）。
5. **v1 → v2 主要变化？** 核心用 Rust 重写（pydantic-core），快 5–50 倍；`.dict()` → `.model_dump()`、`.json()` → `.model_dump_json()`、`.parse_obj()` → `.model_validate()`、`@validator` → `@field_validator`、`class Config` → `model_config`、`orm_mode` → `from_attributes`。
6. **严格模式？** 默认是「宽松转换」（`"10"` 能转成 int）；`Field(strict=True)` 或 `ConfigDict(strict=True)` 禁止转换。
7. **判别联合（Discriminated Union）？** 多种事件类型用一个字段区分：
   ```python
   class TextEvent(BaseModel):
       type: Literal["text"]; content: str
   class ToolEvent(BaseModel):
       type: Literal["tool"]; name: str
   Event = Annotated[TextEvent | ToolEvent, Field(discriminator="type")]
   ```
   比普通 Union 快，错误信息也更清楚。Agent 的 SSE 事件建模很适合用这个。
8. **pydantic-settings？** 从环境变量 / `.env` 读配置并校验：
   ```python
   class Settings(BaseSettings):
       model_config = SettingsConfigDict(env_file=".env")
       database_url: str
       redis_url: str = "redis://localhost:6379/0"
   settings = Settings()
   ```

### 高难
9. **Pydantic 成为性能瓶颈怎么办？** 大响应的 `response_model` 校验 + 序列化可能占不少 CPU。优化：内部可信数据用 `model_construct()` 跳过校验；直接返回 `ORJSONResponse` 跳过 response_model；`TypeAdapter` 复用（别在每次请求里新建）；减少嵌套层级。
10. **工具参数 schema 和 Pydantic？** LLM 的 function calling 参数就是 JSON Schema，`Model.model_json_schema()` 能直接生成；模型返回的 `arguments` 再用 `model_validate_json()` 校验，失败把错误信息回喂给模型让它重试。这是 AI 应用里 Pydantic 最常见的用法。

---

## 四、依赖注入 `Depends`

### 入门
1. **是什么？** 把每个接口都要做的事（拿 DB session、拿当前用户、鉴权、分页）抽成函数，FastAPI 在调用路由前先执行它，把返回值注入参数。
   ```python
   def pagination(page: int = 1, size: int = Query(20, le=100)):
       return {"offset": (page - 1) * size, "limit": size}

   @app.get("/cards")
   async def list_cards(p: dict = Depends(pagination)): ...
   ```

### 中等
2. **带清理的依赖（yield）？**
   ```python
   async def get_db():
       async with SessionLocal() as session:
           try:
               yield session              # yield 之前：请求前执行
               await session.commit()
           except Exception:
               await session.rollback()
               raise                      # yield 之后：请求结束后清理
   ```
3. **依赖嵌套？** 依赖本身也可以有依赖：`current_user` 依赖 `get_db` 和 `oauth2_scheme`，FastAPI 自动解析整棵依赖树。
4. **同一个请求里依赖会执行几次？** 默认**只执行一次**（结果缓存），即使多个地方都依赖它。不想缓存用 `Depends(dep, use_cache=False)`。
5. **类作为依赖？** `Depends(Paginator)` 会调用 `Paginator(...)`，`__init__` 的参数同样被解析。
6. **路由级 / 全局依赖？** `APIRouter(dependencies=[Depends(require_login)])` 或 `FastAPI(dependencies=[...])`：不需要返回值、只需要执行（比如鉴权、记录日志）。
7. **测试时替换依赖？** `app.dependency_overrides[get_db] = fake_db`，测试结束 `app.dependency_overrides.clear()`。**这是相比 Flask 最大的便利之一**。
8. **和 Spring 的依赖注入有什么区别？** Spring 是容器级的、按类型注入单例 Bean；FastAPI 是按请求、按函数参数注入，更轻量，生命周期默认是一次请求。

### 高难
9. **yield 依赖和 BackgroundTasks 的坑？** yield 依赖的清理代码和后台任务的执行先后顺序在不同 FastAPI 版本里有过调整。**原则：后台任务里不要复用请求的 DB session，自己新开一个**。
10. **依赖里抛异常会怎样？** 在 yield 之前抛 `HTTPException` → 直接返回对应响应；yield 之后的清理代码里要 `raise` 原异常，不要吞掉。
11. **多租户怎么用依赖实现？**
    ```python
    async def tenant_db(user = Depends(current_user), db = Depends(get_db)):
        await db.execute(text("SET LOCAL app.org_id = :o"), {"o": str(user.org_id)})
        return db       # 配合 PG 的 RLS，后面所有查询自动按租户隔离
    ```

---

## 五、async 与并发（最高频，必须答准）

### 入门
1. **`async def` 和 `def` 路由的区别？**
   - `async def`：直接在事件循环里执行，里面**只能用异步 IO**（`await httpx.AsyncClient().get()`、`await session.execute()`）。调用同步阻塞的东西（`requests.get`、`time.sleep`、同步数据库驱动）会**卡住整个事件循环，所有请求都停下**。
   - `def`：FastAPI 自动放进**线程池**执行（AnyIO 的线程池，默认 40 个线程），不卡事件循环，但受线程数限制。
   - **最糟糕的情况**：`async def` 里调同步阻塞函数。
2. **怎么选？** 用的库都是异步的 → `async def`；只能用同步库 → `def`；混合 → `async def` + 把同步调用包进线程池。

### 中等
3. **`async def` 里必须调同步函数怎么办？**
   ```python
   from starlette.concurrency import run_in_threadpool
   result = await run_in_threadpool(blocking_func, arg)
   result = await asyncio.to_thread(blocking_func, arg)    # 标准库写法
   ```
   CPU 密集的放进程池（`ProcessPoolExecutor`）或交给 Celery。
4. **并发调用多个下游？**
   ```python
   results = await asyncio.gather(fetch(a), fetch(b), fetch(c), return_exceptions=True)
   # 3.11+ 更安全：
   async with asyncio.TaskGroup() as tg:
       t1 = tg.create_task(fetch(a)); t2 = tg.create_task(fetch(b))
   ```
   对应我们项目里「一轮 5 个只读工具并发执行」。
5. **超时？** `async with asyncio.timeout(10):`（3.11+）或 `await asyncio.wait_for(coro, 10)`。
6. **限制并发数？** `sem = asyncio.Semaphore(10)`，`async with sem: ...`。注意：只在单进程内有效，多 worker / 多副本要用 Redis。
7. **线程池不够用了怎么调？**
   ```python
   import anyio
   @asynccontextmanager
   async def lifespan(app):
       anyio.to_thread.current_default_thread_limiter().total_tokens = 100
       yield
   ```
8. **怎么发现事件循环被阻塞了？** `PYTHONASYNCIODEBUG=1` 或 `loop.set_debug(True)`，会对执行超过 100ms 的回调打警告（`slow_callback_duration` 可调）；生产上监控请求延迟突增而 CPU 不高的情况；`py-spy dump` 看主线程卡在哪。

### 高难
9. **一个接口偶尔变得特别慢，同时其他接口也跟着慢，可能是什么？** 典型的事件循环被阻塞：某个 `async def` 里调了同步 IO / 做了 CPU 密集计算（大 JSON 序列化、正则、分词、图片处理）。排查：开 debug 模式看 slow callback；`py-spy` 采样。修复：挪进线程池 / 进程池。
10. **客户端断开连接，服务端的处理会停吗？** 普通请求：不会自动停，处理完才发现没人收。可以用 `await request.is_disconnected()` 主动检查。流式响应：客户端断开后 Starlette 会取消生成器所在的任务，生成器里的 `await` 点抛 `CancelledError` → **清理逻辑写在 `finally` 里**。注意 `BaseHTTPMiddleware` 对取消传播和流式响应有一些已知问题，流式接口多的项目建议写纯 ASGI 中间件。
11. **想让 Agent 在客户端断开后继续跑完怎么办？** 不能把 Agent 跑在请求的生成器里（断开就被取消）。要把生成和推送解耦：`asyncio.create_task` 或独立 worker 跑 Agent，事件写入 Redis Stream，SSE 接口只负责读 Stream —— 这就是我们 Flask 项目的架构，在 FastAPI 里一样适用。注意 `create_task` 的任务要保存引用（否则可能被垃圾回收），进程重启会丢，所以状态要落库。
12. **`CancelledError` 的正确处理？** 不要吞掉（捕获后做完清理要重新 `raise`）；需要保证执行完的片段用 `asyncio.shield()`（比如写账单）。

---

## 六、手写：FastAPI 流式 Agent 接口（面试很可能让写）

最小可运行版：一个工具调用循环，SSE 流式返回。

```python
import json
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
from pydantic import BaseModel

app = FastAPI()
client = AsyncOpenAI()

TOOLS = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "查询城市天气",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

async def get_weather(city: str) -> str:
    return json.dumps({"city": city, "weather": "晴"})

EXECUTORS = {"get_weather": get_weather}

class ChatIn(BaseModel):
    query: str

def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"

async def agent_loop(query: str, request: Request):
    messages = [{"role": "user", "content": query}]
    for _ in range(10):                                  # max_rounds
        if await request.is_disconnected():              # 客户端断开就停
            return
        stream = await client.chat.completions.create(
            model="gpt-4o-mini", messages=messages, tools=TOOLS, stream=True,
        )
        text, calls = "", {}
        async for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            if delta is None:
                continue
            if delta.content:
                text += delta.content
                yield sse("delta", {"text": delta.content})
            for tc in delta.tool_calls or []:            # tool_call 是分片到达的，按 index 拼
                c = calls.setdefault(tc.index, {"id": "", "name": "", "args": ""})
                c["id"] += tc.id or ""
                c["name"] += (tc.function.name or "") if tc.function else ""
                c["args"] += (tc.function.arguments or "") if tc.function else ""

        tool_calls = [
            {"id": c["id"], "type": "function",
             "function": {"name": c["name"], "arguments": c["args"]}}
            for _, c in sorted(calls.items())
        ]
        messages.append({"role": "assistant", "content": text or None,
                         **({"tool_calls": tool_calls} if tool_calls else {})})
        if not tool_calls:
            yield sse("done", {})
            return

        for tc in tool_calls:
            name = tc["function"]["name"]
            yield sse("tool_start", {"name": name})
            try:
                result = await EXECUTORS[name](**json.loads(tc["function"]["arguments"]))
            except Exception as e:                       # 工具失败也要回填，保持配对
                result = json.dumps({"error": str(e)})
            messages.append({"role": "tool", "tool_call_id": tc["id"], "content": result})
            yield sse("tool_end", {"name": name})
    yield sse("max_rounds", {})

@app.post("/chat")
async def chat(body: ChatIn, request: Request):
    return StreamingResponse(
        agent_loop(body.query, request),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```

**写完主动说出它和生产版本的差距**（加分项，正好对上 01 文档里的项目经验）：
1. 生成和连接绑在一起，刷新页面就断了 → 生产要后台执行 + Redis Stream，SSE 只负责读，支持重连重放；
2. 工具串行执行 → 只读工具用 `asyncio.gather` 并发，结果按原顺序回填；
3. 没有上下文压缩、没有 prompt 缓存设计；
4. 没有打转守卫、没有超时（`asyncio.timeout` 包住工具和模型调用）；
5. 没有限流、重试、兜底模型、计费；
6. 工具参数没校验（可以用 Pydantic 模型校验 `arguments`）。

---

## 七、中间件、异常、生命周期

### 入门
1. **CORS？**
   ```python
   app.add_middleware(CORSMiddleware, allow_origins=["https://a.com"], allow_credentials=True,
                      allow_methods=["*"], allow_headers=["*"])
   ```
   `allow_credentials=True` 时 `allow_origins` 不能是 `["*"]`。
2. **全局异常处理？**
   ```python
   @app.exception_handler(BizError)
   async def biz_error(request: Request, exc: BizError):
       return JSONResponse(status_code=400, content={"code": exc.code, "msg": exc.msg})
   ```

### 中等
3. **自定义中间件？**
   ```python
   @app.middleware("http")
   async def request_id(request: Request, call_next):
       rid = request.headers.get("x-request-id") or uuid4().hex
       token = request_id_var.set(rid)                # contextvars，日志里打出来
       try:
           response = await call_next(request)
       finally:
           request_id_var.reset(token)
       response.headers["x-request-id"] = rid
       return response
   ```
4. **中间件的执行顺序？** 后添加的在外层（先执行请求部分、后执行响应部分），像洋葱。
5. **改 422 的返回格式？** 覆盖 `RequestValidationError` 的处理器：`@app.exception_handler(RequestValidationError)`。
6. **生命周期 lifespan**（替代已弃用的 `@app.on_event`）：
   ```python
   @asynccontextmanager
   async def lifespan(app: FastAPI):
       app.state.redis = Redis.from_url(settings.redis_url)
       app.state.llm = AsyncOpenAI()
       yield                                   # 应用运行期间
       await app.state.redis.aclose()          # 关闭时清理
   app = FastAPI(lifespan=lifespan)
   ```
   对应我们 Flask 里 `extended/` 目录下各扩展的初始化。
7. **`app.state` 和 `request.state`？** 应用级共享对象 / 单个请求内的临时数据（中间件里放、路由里读），类似 Flask 的 `current_app.extensions` 和 `g`。
8. **其他内置中间件？** `GZipMiddleware`、`TrustedHostMiddleware`、`HTTPSRedirectMiddleware`。

### 高难
9. **`BaseHTTPMiddleware`（`@app.middleware("http")`）有什么问题？** 它会把下游包成一个新任务、通过内存流转发响应：对流式响应和取消传播有已知问题，`contextvars` 的修改在某些版本里不会传回外层。性能敏感或流式多的项目写**纯 ASGI 中间件**：
   ```python
   class TimingMiddleware:
       def __init__(self, app): self.app = app
       async def __call__(self, scope, receive, send):
           if scope["type"] != "http":
               return await self.app(scope, receive, send)
           start = time.perf_counter()
           await self.app(scope, receive, send)
           logger.info("path=%s cost=%.3f", scope["path"], time.perf_counter() - start)
   ```
10. **优雅停机？** uvicorn 收到 SIGTERM 后停止接收新连接、等待进行中的请求（`--timeout-graceful-shutdown`），然后执行 lifespan 的关闭部分。长连接（SSE）要在关闭时主动通知客户端重连。

---

## 八、鉴权与安全

### 中等
1. **OAuth2 + JWT 的标准写法？**
   ```python
   oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

   async def current_user(token: Annotated[str, Depends(oauth2_scheme)], db = Depends(get_db)):
       try:
           payload = jwt.decode(token, SECRET, algorithms=["HS256"])
       except jwt.PyJWTError:
           raise HTTPException(401, "invalid token", headers={"WWW-Authenticate": "Bearer"})
       user = await db.get(User, payload["sub"])
       if user is None:
           raise HTTPException(401)
       return user
   ```
2. **API Key 鉴权？** `APIKeyHeader(name="X-API-Key")` 作为依赖。
3. **权限 / 角色？** 依赖工厂：
   ```python
   def require_role(*roles):
       async def checker(user = Depends(current_user)):
           if user.role not in roles:
               raise HTTPException(403)
           return user
       return checker
   @router.delete("/{id}", dependencies=[Depends(require_role("admin"))])
   ```
4. **Security 和 scopes？** `Security(oauth2_scheme, scopes=["models:write"])`，在 OpenAPI 文档里也能体现。

### 高难
5. **限流怎么做？** `slowapi`（基于 limits 库）可以按 IP / 用户装饰路由；多副本要用 Redis 后端；业务维度的限流（按组织的 token 配额）自己用 Redis Lua 实现（见 08 文档）。
6. **怎么防止请求体过大打爆内存？** 网关层限制 body 大小；应用层用 `request.stream()` 分块读并累计大小，超限立即 413。

---

## 九、数据库

### 中等
1. **同步还是异步 SQLAlchemy？**
   - 同步引擎 + `def` 路由（跑在线程池里）：迁移成本最低，并发受线程池限制；
   - 异步引擎 `create_async_engine("postgresql+asyncpg://...")` + `AsyncSession` + `async def` 路由：真正的异步，但整条链路都要异步。
2. **异步 session 的标准用法？**
   ```python
   engine = create_async_engine(DATABASE_URL, pool_size=10, max_overflow=20, pool_pre_ping=True)
   SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

   @router.get("/cards/{id}")
   async def get_card(id: UUID, db: AsyncSession = Depends(get_db)):
       card = await db.get(Card, id, options=[selectinload(Card.steps)])
       if not card:
           raise HTTPException(404)
       return card
   ```
3. **异步下的坑？** 不能懒加载（访问未加载的关系直接报错 `MissingGreenlet`）→ 显式 `selectinload`；`expire_on_commit=False`（否则 commit 后访问属性会触发隐式 IO）；一个 `AsyncSession` 不能被多个并发任务共享。
4. **其他选择？** SQLModel（FastAPI 作者做的，把 Pydantic 模型和 SQLAlchemy 模型合一）、Tortoise ORM、直接用 asyncpg。

### 高难
5. **连接池大小怎么定？** 异步下一个进程可以同时挂起上千个请求，但数据库连接只有 `pool_size + max_overflow` 个，超出的请求在 `pool_timeout` 里排队。**拿到连接后去等模型 / 外部接口**会迅速耗尽连接池 → 先提交事务归还连接，再调外部接口。多 worker 时总连接数 = worker 数 × 每个池的上限，要小于 PG 的 `max_connections`（见 07 文档第十二节）。
6. **一个请求里既要读写数据库又要流式返回 Agent 输出，session 怎么管？** 不要让一个 session 跨越整个流式过程（可能持续几十分钟，一直占着连接）。每个需要读写的点短暂地开一个 session，用完就关。

---

## 十、后台任务与长任务

### 中等
1. **`BackgroundTasks`？**
   ```python
   @app.post("/signup")
   async def signup(user: UserIn, tasks: BackgroundTasks):
       tasks.add_task(send_welcome_email, user.email)
       return {"ok": True}           # 响应发出后才执行邮件发送
   ```
   在**同一个进程**里执行，进程重启就丢，没有重试，适合轻量、丢了也无所谓的事。
2. **和 Celery 怎么选？** 需要可靠性（重试、持久化）、耗时长、要独立扩容、要定时 → Celery（或 arq / Dramatiq / Taskiq 等原生异步的任务队列）。
3. **轮询长任务结果的接口怎么设计？** 提交接口返回 `task_id`（202 Accepted）→ 状态接口查进度 → 或者 SSE / WebSocket 推送进度。我们的数据库查数就是「提交即返回 + Agent 用另一个工具轮询结果」。

### 高难
4. **后台任务完成后，怎么把结果推回给正在对话的用户？** 推比拉好：任务完成时把结果放进队列，看会话当前状态 —— 还在生成中就在下一轮开始时取出拼进上下文；已经结束就主动续一轮。我们的后台任务就是这么设计的（模型反复回来轮询，每次都要重发全量上下文，比工具调用本身贵得多）。

---

## 十一、测试

### 中等
1. **同步测试？**
   ```python
   from fastapi.testclient import TestClient
   def test_me():
       app.dependency_overrides[current_user] = lambda: User(id=1, role="admin")
       with TestClient(app) as client:              # with 会触发 lifespan
           assert client.get("/me").status_code == 200
       app.dependency_overrides.clear()
   ```
2. **异步测试？**
   ```python
   @pytest.mark.anyio
   async def test_stream():
       async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://t") as c:
           async with c.stream("POST", "/chat", json={"query": "hi"}) as r:
               chunks = [line async for line in r.aiter_lines()]
   ```
3. **怎么 mock 模型调用？** 把 LLM 客户端做成依赖（`Depends(get_llm)`），测试时 override 成返回固定流的假客户端。

---

## 十二、部署与性能

### 中等
1. **生产怎么跑？** `uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000`；或 `gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4`（gunicorn 管进程、uvicorn 管事件循环）。容器里常见做法是**每个容器一个 uvicorn 进程，靠容器副本数扩展**。
2. **worker 数怎么定？** 一般等于 CPU 核数（异步下一个 worker 就能处理大量并发 IO）。
3. **反向代理注意什么？** SSE 关缓冲；WebSocket 要配 `Upgrade` 头；`--proxy-headers` + `--forwarded-allow-ips` 让应用拿到真实客户端 IP。

### 高难
4. **性能优化清单？** uvloop + httptools（`uvicorn[standard]`）；`ORJSONResponse`；减少 response_model 的开销；数据库用 asyncpg；HTTP 客户端复用连接（全局一个 `httpx.AsyncClient`，不要每次请求新建）；避免阻塞事件循环；CPU 重的放进程池。
5. **多 worker 下的状态问题？** 每个 worker 是独立进程，进程内的变量（缓存、限流计数、WebSocket 连接表）不共享 → 共享状态放 Redis；WebSocket 广播用 Redis Pub/Sub 在 worker 之间转发。

---

## 十三、高难场景

### 场景 1：用 FastAPI 做一个支撑 1000 并发流式对话的 Agent 服务
- 连接层：异步 + SSE，一个 worker 能挂住几千个连接，几乎不是瓶颈；
- 执行层：Agent 运行和 HTTP 连接解耦（独立任务 / worker 跑，事件写 Redis Stream），连接断了不影响生成；
- 模型层：全局限流（Redis）+ 多 key / 多供应商 + 兜底链；按组织做公平配额；
- 数据库：短事务，调模型前归还连接；
- 事件循环保护：所有同步 SDK 调用、分词、大 JSON 处理进线程池；
- 可观测：每轮 token、首字延迟、工具耗时、队列等待时间。

### 场景 2：接口 P99 延迟突然从 200ms 涨到 5s，CPU 不高
- CPU 不高 + 全部接口都慢 → 优先怀疑**事件循环被阻塞**或**某个共享资源耗尽**；
- 排查：
  1. `py-spy dump` 看主线程是不是卡在某个同步调用上；
  2. 数据库连接池：是否有请求拿着连接去等外部接口，导致其他请求在 `pool_timeout` 里排队；
  3. 线程池：`def` 路由或 `run_in_threadpool` 是否把 40 个线程用满了；
  4. 下游：模型 / Redis / 第三方接口是否变慢；
- 修复对应的点，并加上连接池等待时间、线程池使用率的监控。

### 场景 3：WebSocket 在多 worker、多副本下怎么广播消息？
- 每个 worker 维护自己的连接表；
- 发消息时发到 Redis Pub/Sub 频道，所有 worker 订阅，各自推给本地的连接；
- 需要可靠投递（离线消息）就再用 Stream / 数据库存一份。

---

## 十四、从 Flask 迁移到 FastAPI（开放题）

答题框架：**先说收益，再说难点，最后说做法**。
- **收益**：原生异步，不再依赖 gevent 的 monkey-patch（那套有过「某个库没被 patch，一个阻塞调用卡死整个进程」的坑）；Pydantic 自动校验 + 文档；依赖注入方便测试。
- **难点**：
  1. 整条调用链异步化：SQLAlchemy 换 async、Redis 换 `redis.asyncio`、HTTP 换 httpx、模型 SDK 换 `AsyncOpenAI` / `AsyncAnthropic`。工具有一百多个，每个都要检查；
  2. Flask 的全局上下文（`g`、`current_app`、`current_user`）改成依赖注入或 `contextvars`；
  3. 后台线程跑 Agent 改成 `asyncio.create_task` 或独立 worker，取消从「设标记 + 关 socket」变成 `task.cancel()`；
  4. Celery 不用变（worker 本来就是独立进程）。
- **做法**：不一次性重写。新接口用 FastAPI 起一个新服务，HAProxy 按路径分流（我们已经按 `/api/web`、`/api/console`、`/api/gateway` 分流，加一条规则就行）；老的同步代码先用 `def` 路由跑在线程池里，再逐个模块异步化。

---

## 十五、快问快答

| 问题 | 答 |
|---|---|
| 422 是什么？ | 请求参数校验失败 |
| `async def` 里能用 `requests` 吗？ | 不能，会阻塞事件循环；用 httpx 的异步客户端 |
| 默认线程池多大？ | AnyIO 默认 40 |
| 依赖在一个请求里执行几次？ | 默认一次（缓存） |
| `on_event("startup")` 还能用吗？ | 已弃用，用 lifespan |
| SSE 和 WebSocket 怎么选？ | 单向推送（LLM 输出）用 SSE；双向实时用 WebSocket |
| WebSocket 怎么写？ | `@app.websocket("/ws")`，`await ws.accept()`、`receive_text()`、`send_text()`，捕获 `WebSocketDisconnect` |
| 静态文件？ | `app.mount("/static", StaticFiles(directory="static"))` |
| 挂载子应用？ | `app.mount("/v2", sub_app)`，也能挂 Flask 应用（`WSGIMiddleware`）—— **渐进迁移就靠这个** |
| `contextvars` 在 FastAPI 里干什么？ | 协程安全的上下文变量，存 request_id、当前用户给日志用 |
| 怎么做 API 版本管理？ | URL 前缀（`/v1`、`/v2`）用不同 router；或请求头 |
| 返回 ORM 对象为什么报错？ | response_model 需要 `from_attributes=True` 才能从 ORM 对象构造 |
| `Body(embed=True)` 是什么？ | 单个 body 参数时，要求请求体是 `{"item": {...}}` 而不是直接 `{...}` |
