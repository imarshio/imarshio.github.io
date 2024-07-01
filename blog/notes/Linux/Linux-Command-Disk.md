---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter Disk
order: 23
tag:
- ls

---

> [!NOTE]
> 如下命令使用中，
>
> - `[]` 代表可选参数，
> - `<>` 代表可自由输入输入的字符
> - `-` 后面跟的是缩写
> - `--` 后面跟的是全拼

## `df`

disk free，检查磁盘容量的

用法

```sh
df [options] [file_path]
```

参数

| 参数 | 说明                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| T    | 显示文件类型（Type） |
|   h   |    human，提高可读性                                                            |

```sh
# 直接使用,，默认输出单位为 1K
[root@iZuf6ipaofe0zmf15z5lttZ ~]# df
Filesystem     1K-blocks    Used Available Use% Mounted on
devtmpfs          888672       0    888672   0% /dev
tmpfs             899252       0    899252   0% /dev/shm
tmpfs             899252     556    898696   1% /run
tmpfs             899252       0    899252   0% /sys/fs/cgroup
/dev/vda1       41152812 3670084  35579020  10% /
tmpfs             179852       0    179852   0% /run/user/0

# 增加参数 -Th，会输出 Type 且输出的单位变为G和M
[root@iZuf6ipaofe0zmf15z5lttZ ~]# df -Th
Filesystem     Type      Size  Used Avail Use% Mounted on
devtmpfs       devtmpfs  868M     0  868M   0% /dev
tmpfs          tmpfs     879M     0  879M   0% /dev/shm
tmpfs          tmpfs     879M  556K  878M   1% /run
tmpfs          tmpfs     879M     0  879M   0% /sys/fs/cgroup
/dev/vda1      ext4       40G  3.6G   34G  10% /
tmpfs          tmpfs     176M     0  176M   0% /run/user/0

# 指定目录
[root@iZuf6ipaofe0zmf15z5lttZ ~]# df /mnt
Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/vda1       41152812 3670096  35579008  10% /
[root@iZuf6ipaofe0zmf15z5lttZ ~]# df -Th /mnt
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/vda1      ext4   40G  3.6G   34G  10% /
```

## `du`

disk usage，查看一个文件或目录占用的磁盘空间

用法

```sh
du [options] [file_path]
```

参数

| 参数 | 说明                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| T    | 显示文件类型（Type） |
|   h   |    human，提高可读性                                                            |

## `free`

## `pwd`

print work directory，查看当前所处目录的路径

用法

```sh
pwd [options]

pwd
```

参考

- [https://linux.vbird.org/](https://linux.vbird.org/)(推荐，基本所有的命令都可以在这找到)
- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)
