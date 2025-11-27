---
title: Redis 命令
icon: database
order: 3
category:
  - Intro
tag:
  - Intro
---

## 基础

redis 有5大基础数据类型，string、hash、list、set、zset，还有3种其他数据类型，bitmap、hyperloglog、Geospatial

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

### zset

zset 是有序集合，结合了 set 的唯一性和 list 的有序特性。基础数据结构是 member，每个 member 都有分数 score，用于从小到大排序。

- 唯一
- 有序

#### zadd

`zadd key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]`

| 参数 | 解释                                                                     |
| ---- | ------------------------------------------------------------------------ |
| NX   | 仅添加新成员，不更新已存在的成员，                                       |
| XX   | 仅更新已存在的成员，不添加新成员                                         |
| GT   | 新分数小于当前分数时才更新                                               |
| LT   | 新分数大于当前分数时才更新                                               |
| CH   | 返回被修改的成员数量，包括新增和更新的。不添加此参数默认只返回新增的数量 |
| INCR | 将成员的分数增加指定的值，类似于ZINCRBY。此时只能指定一对 score-member   |

```sh
# 添加成员, 其默认行为是没有这个成员则添加，有这个成员则更新分数。
$ zadd key 10 a 20 b 30 c
-> 3

# 更新和添加成员
$ zadd key 20 a 40 d
-> 1

# 更新和添加成员，但是返回新增和更新的数量和
$ zadd key ch 30 a 50 e
-> 2

# 为指定成员的分数增加 100
$ zadd key incr 100 a
-> "120"
```

#### ZINCRBY

`ZINCRBY key increment member`

为指定成员分数增加 increment

```sh
$ zadd key 10 a
$ zincrby key 20 a
-> 30
```

#### ZRANGE

`ZRANGE key start stop [WITHSCORES]`

返回索引在 start 到 stop 之间的成员，从小到大排序，索引从 0 开始，支持负数，-1 表示最后一个成员。

- WITHSCORES：同时返回成员及其分数

```sh
$ zadd key 10 b 20 c 30 d 50 a
> 4

# 从小到大前 3 个
$ zrange key 0 2
-> ["b","c","d"]

$ zrange key 0 1 withscores
-> ["b","10","c","20"]
```

#### ZREVRANGE

#### ZRANGEBYSCORE

#### ZCARD

#### ZCOUNT

#### ZREM

`ZREM key member [member ...]`

删除一个或多个成员

#### ZREMRANGEBYRANK

`ZREMRANGEBYRANK key start stop`

按照得分排名删除成员

## LUA

- 原子性

```sh
local token_key = KEYS[1]
local request_key = KEYS[2]
local current_time = ARGV[1]
local estimated_tokens = ARGV[2]

-- 清理过期数据，小于当前时间前一分钟的数据都会被删除
redis.call('ZREMRANGEBYSCORE', token_key, 0, current_time - 60)
redis.call('ZREMRANGEBYSCORE', request_key, 0, current_time - 60)

-- 获取当前统计
local request_count = redis.call('ZCARD', request_key)
local token_count = 0
local token_members = redis.call('ZRANGE', token_key, 0, -1, 'WITHSCORES')
-- 取 member 的值，长度为 token_members 的长度，步长为 2
for i = 1, #token_members, 2 do
    token_count = token_count + tonumber(token_members[i])
end

-- 检查是否超过限制
if request_count >= 1800 or token_count >= 1200000 then
    return 1
else
    -- score 是时间，这样就可以按照时间由小到大进行删除
    redis.call('ZADD', token_key, current_time, estimated_tokens)
    redis.call('ZADD', request_key, current_time, 1)
    return 0
end
```
