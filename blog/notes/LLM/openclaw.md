---
# icon: database
category:
  - llm
  - vlm
title: open claw

---

## HTTP 400: registry.ollama.ai/library/deepseek-r1:1.5b does not support tools

当我尝试使用本地的 ollama 服务来代替云端 api 的时候，我发现如果你的模型太小，open claw 就不能很好的工作，甚至不能支持对话功能。

## 命令

```sh
# node >= 22
pnpm add -g openclaw@latest

# 进行初始化配置并下载守护进程，以便在后台常驻运行，且支持开机自启
openclaw onboard --install-daemon

# 重置配置 == 修改配置文件，只不过是用交互
openclaw onboard

# 非常驻运行，用于查看控制台日志
openclaw gateway --port 18789 --verbose

# 启动 Gateway 服务
openclaw gateway start

# 暂停 Gateway 服务
openclaw gateway stop
# ⚠️ 如果你使用了 openclaw gateway stop，这会清理守护进程
# 如果你想重启这个服务，那么你需要再次注册一下这个进程
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.gateway.plist
# 查看服务状态
launchctl list | grep openclaw
# 在执行一次 start
openclaw gateway start

openclaw gateway status

```
