---
icon: pen-to-square
category:
  - redis
  - trouble shooting
title:  MISCONF Errors writing to the AOF file： Bad file descriptor`
# tag:

---

## `ERROR: MISCONF Errors writing to the AOF file: Bad file descriptor`

### 确认问题根源

尝试远程连接到redis服务器

```sh
# 如果你能直接登录该服务器，则直接登陆服务器，进入redis的客户端
$ redis-cli -h <redis-server-ip> -p <redis-port> -a <password>

# 在服务端直接尝试写入数据
$ 127.0.0.1:6379> set key value EX 60
MISCONF Errors writing to the AOF file: Bad file descriptor

# 至此确认是redis服务端的问题

```

### Bad file descriptor

Bad file descriptor : 文件描述符错误

这个其实很容易就能猜到,大致原因是由于redis在启动的时候肯定会去找到 aof 文件,但是运行一段时间后,由于外部干扰,如人工修改了aof 文件,就会导致 redis获取到的文件描述信息过时,进而导致Bad file descriptor.

### 重启redis

```sh

# 我们先尝试重启redis
systemctl restart redis

# 在这个案例里,重启完redis服务就已经恢复了

# 如果你的仍然不能恢复,建议查看一下aof文件的详细信息,比如启动redis的用户是否有对aof文件的读写权限,aof文件是否还存在
```

解决！
