---
title: Redis 命令
icon: database
index: 3
category:
  - Intro
tag:
  - Intro
---

## 命令

### 远程

```sh
redis-cli -h <redis-server-ip> -p <redis-port> -a <password>
```

### String

<http://doc.redisfans.com/>

```sh

# SET key value EX 60 NX
SET demo "demo" EX 60 NX
```
