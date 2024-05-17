---
icon: pen-to-square
category:
  - Linux
title: Linux Command -- Chapter File
order: 20
tag:
- ls

---

一个命令的使用总归是先有一个背景的，所以如下命令都会争取结合适用场景。

由于 Linux 家族过于庞大，每个分支都各有特点，可能处理方式也不完全一样，所以我会尽量给出常用发行版对应的的命令。
如果需要知道自己的电脑属于哪个发行版，可以点击了解一下(虽然我也不是很了解，但是可以稍微提供一点点帮助)。

> [!NOTE]
> 如下命令使用中，
>
> - `[]` 代表可选参数，
> - `<>` 代表可自由输入输入的字符
> - `-` 后面跟的是缩写
> - `--` 后面跟的是全拼

## ls

list，列出当前文件夹下有哪些文件

用法

```sh
ls [options] [file_path]
```

参数

| 参数 | 说明                       |
| ---- | -------------------------- |
| l    | 展示文件的详细信息     |
| a    | 展示全部文件                   |
| h    | 提高可读性（human） |

```sh
# 在一些发行版中会将此命令简写为 ll
ls -l

ls -a

ls -al

ls -h
```

## touch

创建一个文件

## mkdir

创建一个文件夹

## rm

删除一个文件或文件夹

| 参数 | 说明                       |
| ---- | -------------------------- |
| i    | 删除前逐一询问是否删除     |
| f    | 强制删除                   |
| r    | 将目录及之下的文件逐一删除 |

## cat

`concatenate fiels and print`，接所有指定文件并将结果写到标准输出 。

### 用法

`cat [options]... [file]...`

### 常用参数

|     |     |     |
| --- | --- | --- |
|     |     |     |
|     |     |     |

### 常用场景

## tail

```shell

# 常用的查看生产日志的命令
tail -f -n 200 log.log

```

参考

- [https://linux.vbird.org/](https://linux.vbird.org/)(推荐，基本所有的命令都可以在这找到)
- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)
