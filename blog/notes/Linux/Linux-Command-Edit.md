---
icon: pen-to-square
order: 21
category:
  - Linux
title: Linux Command -- Chapter Edit
tag:
- ls

---

一个命令的使用总归是先有一个背景的，所以如下命令都是结合适用场景总结出来的。
由于 Linux 家族过于庞大，每个分支都各有特点，且处理方式不完全一样，所以我会尽量给出常用系统的命令。
这里你需要知道自己的电脑属于哪个发行版，不了解的可以点击了解一下(虽然我也不是很了解，但是可以稍微i提供一点点帮助)。
参考

- [https://phoenixnap.com/kb/linux-commands](https://phoenixnap.com/kb/linux-commands)（推荐）
- [https://www.runoob.com/linux/linux-command-manual.html](https://www.runoob.com/linux/linux-command-manual.html)
- [https://www.linuxcool.com/](https://www.linuxcool.com/)
-

> [!NOTE]
> 如下命令使用中，
>
> - `[]` 代表可选参数，
> - `<>` 代表可自由输入输入的字符
> - `-` 后面跟的是缩写
> - `--` 后面跟的是全拼

<!-- # 编辑 -->

## `vi`



## `vim`

<!-- ##  -->

## `sed`

Stream EDitor，流式编辑器，类似`awk`，但是没有`awk`功能强大，但相对简单。

### 用法

`sed [OPTION]... {script-only-if-no-other-script} [input-file]...`

### 参数

| 参数 | 说明                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| i    | 直接修改读取的文件内容，`sed -i 's///'`，支持的界定符:`/`、`@`、`#`、`&#124;` |
|      |                                                                               |

### 举例

```shell

# 将/home/text.txt文件中的oldstr替换成newstr
sed -i 's/oldstr/newstr/' /home/text.txt
sed -i 's/oldstr/newstr/g' /home/text.txt

# 上面的区别就是s///每行找到第一个oldstr并替换后就会结束，s///g不会结束，会替换到最后一个字符串

# 如下测试用例，创建两个txt文件，写入abcabca\nabcabcabca

```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/21953536/1679498606268-77b52d4f-a471-4efb-a2e4-b2badb8ae9c8.png#averageHue=%232a343e&clientId=u5ce6f6a9-7c29-4&from=paste&height=347&id=u7873d025&originHeight=347&originWidth=448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17823&status=done&style=none&taskId=u4addc969-37de-46d6-9f9d-fdb9ef37560&title=&width=448)

## `awk`
