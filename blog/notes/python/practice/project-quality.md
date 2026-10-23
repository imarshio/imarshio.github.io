---
title: "模块化、日志与测试"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 1
article: false
---

# 模块化、日志与测试

当脚本开始变长，先把“读入数据、计算、外部副作用”分开。计算函数接收数据并返回结果，入口负责命令行、日志和资源初始化，这样可以直接测试逻辑。

## 一个小项目的分层

```text
project/
├── pyproject.toml
├── src/
│   └── sample/
│       ├── __init__.py
│       ├── service.py
│       └── cli.py
└── tests/
    └── test_service.py
```

这只是一个起点；先按职责组织，不必为每个函数都创建目录。依赖和解释器约束放进项目配置，部署时固定所使用的依赖解析结果。

## 日志与异常

使用模块级 `logging.getLogger(__name__)`，由应用入口配置处理器和级别。处理异常时 `logger.exception(...)` 可记录当前异常信息；不要在日志里直接写认证信息或完整敏感请求体。

## 测试成功与失败边界

```python
# 可独立运行
import unittest

def normalize_name(value):
    if not isinstance(value, str):
        raise TypeError("name 必须是字符串")
    normalized = value.strip()
    if not normalized:
        raise ValueError("name 不能为空")
    return normalized

class NameTests(unittest.TestCase):
    def test_normalizes(self):
        self.assertEqual(normalize_name(" alice "), "alice")

    def test_rejects_empty(self):
        with self.assertRaises(ValueError):
            normalize_name("   ")

suite = unittest.defaultTestLoader.loadTestsFromTestCase(NameTests)
result = unittest.TextTestRunner(verbosity=0).run(suite)
assert result.wasSuccessful()
```

这里不启动外部服务。连接数据库和 HTTP 服务的集成测试应另外准备可控环境，避免把单元测试通过等同于整条链路通过。

## 类型检查、格式和基准

类型标注用于表达约定；静态检查、运行测试和性能测量回答的是不同问题。优化前先建立可重复输入与测量方式，再确认变化发生在 CPU、IO 还是内存上。

接下来把函数接到 Web 接口，先读[WSGI、ASGI 与服务器](./web-servers.md)。

---

[上一篇](/notes/python/runtime/execution.md) · [下一篇](/notes/python/practice/web-servers.md) · [学习目录](/notes/python/README.md)
