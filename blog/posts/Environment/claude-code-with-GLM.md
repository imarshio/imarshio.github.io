---
icon: pen-to-square
category:
  - CLion
title: Claude code + GLM 5 配置
tag:
---

## 背景

## 准备

- visual studio code or cursor
- GLM 账号

## 配置

claude 的大模型配置文件在 `~/.claude/setting.json`，主要配置就两个`env.ANTHROPIC_AUTH_TOKEN`和`env.ANTHROPIC_BASE_URL`

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "api-key"
  }
}
```
