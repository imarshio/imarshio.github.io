---
icon: pen-to-square
title: process
---

## `process`

process 是 Node.js 的全局对象，提供当前进程信息和控制。

| 对象            | 含义                 |
| --------------- | -------------------- |
| `process.env`   | 包含所有的环境变量   |
| `process.args`  | 包含所有的命令行参数 |
| `process.cwd()` | 当前进程的工作目录   |

### `process.env`

按照优先级从上到下读取并加载环境变量

- 命令行
- 项目根目录下的 `.env` 文件
- 系统环境变量
- Docker 环境变量

#### .env 文件

在 frontend/ 目录下创建 .env：

```env
PORT=3001
REACT_APP_PROXY_TARGET=http://localhost:5001
DOCKER_CONTAINER=false
WDS_SOCKET_PORT=3001
WDS_SOCKET_HOST=localhost
```

#### 命令行设置

```sh
# Mac/Linux:
PORT=3001 npm start

# Windows PowerShell:
$env:PORT=3001; npm start

# Windows CMD:
set PORT=3001 && npm start
```

#### Docker Compose

```yaml
services:
 frontend:
  environment:
   DOCKER_CONTAINER: "true"
   REACT_APP_PROXY_TARGET: "http://backend:5001"
```
