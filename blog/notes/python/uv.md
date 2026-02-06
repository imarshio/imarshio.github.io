---
icon: fa-brands fa-python
category:
  - python
title: Python UV
order: 24
tag:
- celery

---

## 简介

An extremely fast Python package and project manager, written in Rust.

## 下载

[official installation guide](https://docs.astral.sh/uv/getting-started/installation/)

```sh
# 有 curl
curl -LsSf https://astral.sh/uv/install.sh | sh

# 有 wget
wget -qO- https://astral.sh/uv/install.sh | sh
```

### 解决国内下载慢

#### 方案一：设置临时变量

```sh
export UV_INSTALLER_GHE_BASE_URL="https://ghfast.top/https://github.com" && curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 方案二：修改脚本

部分国内的同学可能没有🪜，甚至可能有🪜一样都下载很慢。此时我们就需要先将脚本 down 下来。

```sh
# 下载脚本，也可以直接点开链接下载下来
curl -LsSf https://astral.sh/uv/install.sh

# 编辑脚本
# 找到里面的 UV_INSTALLER_GHE_BASE_URL ，这是脚本中设置的 uv 下载链接前缀
# 在前面添加 GitHub 的代理地址： https://ghfast.top/
# 如下
if [ -n "${UV_INSTALLER_GHE_BASE_URL:-}" ]; then
    INSTALLER_BASE_URL="$UV_INSTALLER_GHE_BASE_URL"
else
    INSTALLER_BASE_URL="${UV_INSTALLER_GITHUB_BASE_URL:-https://ghfast.top/https://github.com}"
fi
```

## 入门命令

```sh
# 进入根目录
cd ～

# 创建项目目录
mkdir project-a

# 进入项目目录
cd project-a

# 环境初始化
uv init

# 可选：如果是新项目，可以执行也可以不执行，若果是已经有的项目，则需要执行
uv sync

# 添加依赖
uv add requests

# 指定版本 ~= 代表 >=
uv add requests~=1.0.0

# 添加依赖到开发环境
uv add requests --dev

# 移除依赖
uv remove requests
```
