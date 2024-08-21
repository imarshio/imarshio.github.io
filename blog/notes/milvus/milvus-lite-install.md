---
icon: database
category:
  - milvus
title: Install milvus lite

---

[官方文档](https://milvus.io/docs/milvus_lite.md)

## Prerequisites

- Ubuntu >= 20.04 (x86_64 and arm64)
- MacOS >= 11.0 (Apple Silicon M1/M2 and x86_64)

> [!Note]
> Milvus Lite is only suitable for small scale vector search use cases. For a large scale use case, we recommend using Milvus Standalone or Milvus Distributed. You can also consider the fully-managed Milvus on Zilliz Cloud.
> Milvus Lite 只支持小体量的向量搜索案例。

## 安装 Milvus Lite

```sh
pip install -i https://mirrors.aliyun.com/pypi/simple/ -U pymilvus
```
