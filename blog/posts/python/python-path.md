---
icon: fa-brands fa-python
order: 99
category:
  - python
title: ModuleNotFoundError
tag:
- python
- 小技巧
---

背景：想要使用命令行执行 python 脚本，但是得到了 `ModuleNotFoundError: No module named 'xxx'`

## 项目结构

```md
py-spider
└── util
    ├── request.py
    ├── mysql_pool.py
    ├── logger.py
    └── __init__.py
└── spider
    ├── spider_demo.py
    └── __init__.py
└── main.py
```

## 命令

```sh
python spider_demo.py

# 输出
Traceback (most recent call last):
  File "/py-spider/spider/spider_demo.py", line 12, in <module>
    from util.request import get_url
ModuleNotFoundError: No module named 'util'
```

## 问题

如上问题很明显，模块找不到，但是为什么找不到呢？

我们需要了解一下 python 的执行过程。

## `python` 脚本执行过程

当我们输入`python spider_demo.py`并按下回车之后就开始了如下操作

### Python解释器启动

当你执行上述命令时，Python 解释器启动。

### 读取脚本文件

Python 解释器查找并读取指定的 .py 文件。

### 编译源代码

解释器将源代码编译成字节码（Bytecode）。

### 执行字节码

编译后的字节码由 Python 虚拟机执行。

### 运行脚本

脚本开始运行，按照代码的顺序执行指令。

### 处理依赖

如果脚本中导入了其他模块或包，解释器会递归地加载并执行这些依赖。

所以重点就是这里。

那处理依赖的详细过程是什么呢？

#### 解析脚本

当Python解释器开始执行脚本时，它会从上到下逐行解析脚本代码。

#### 识别导入语句

当解释器遇到一个`import`语句时，它会识别出需要导入的模块或包。

如`import module_name`，Python 解释器会在其模块搜索路径（[sys.path](https://docs.python.org/zh-cn/3/library/sys.html#sys.path)）中查找要导入的模块。

`sys.path`是一个列表，包含了解释器搜索模块的目录，我们可以通过`python -c "import sys; print(sys.path)"`来查看。

```sh
(python-3.8.0) root@demo:~# python -c "import sys; print(sys.path)"
['', '/root/.pyenv/versions/3.8.0/lib/python38.zip', '/root/.pyenv/versions/3.8.0/lib/python3.8', '/root/.pyenv/versions/3.8.0/lib/python3.8/lib-dynload', '/root/.pyenv/versions/python-3.8.0/lib/python3.8/site-packages']
```

#### 确定模块位置

如果模块在sys.path中找到，解释器确定模块的存储位置。这可能是一个内置模块、一个已安装的第三方库，或者一个本地文件。

#### 编译模块

如果模块还没有被编译，解释器会读取模块的源代码，将其编译成字节码。这个过程由Python的内置编译器完成。

#### 执行模块代码

编译后的字节码被加载到内存中，并由Python虚拟机执行。这会初始化模块的命名空间，包括定义函数、类和全局变量。

#### 处理嵌套依赖

如果导入的模块本身又有其他依赖（即它包含了其他的import语句），解释器会递归地执行上述步骤来处理这些嵌套依赖。

#### 缓存模块

一旦模块被成功导入，它通常会被缓存（在__pycache__目录下），以避免下次导入时重复编译。

#### 模块初始化

模块执行完毕后，如果它定义了任何初始化代码（例如在模块顶部的可执行代码），这些代码将被执行。

#### 重复导入处理

如果一个模块已经被导入，再次尝试导入它时，Python解释器会检查模块是否已经在sys.modules字典中。如果已存在，解释器将跳过重新导入的过程，直接使用已加载的模块。

#### 依赖冲突解决

如果脚本中的不同模块依赖于相同库的不同版本，解释器将根据sys.path中的顺序来确定使用哪个版本。这可能导致依赖冲突，尤其是在复杂的项目中。

#### 异常处理

如果在导入过程中遇到任何问题（例如，找不到模块、版本不兼容等），解释器将引发ImportError或其他相关异常。

#### 模块就绪

一旦所有依赖都被成功导入和执行，脚本可以开始使用这些模块提供的功能。

### 输出结果

脚本的输出（如果有）将显示在命令行界面。

### 异常和错误处理

如果在执行过程中遇到错误或异常，它们将被捕获并显示在命令行界面。

### 脚本执行完成

脚本执行完成后，Python 解释器将清理资源并退出。

### 返回命令行提示符

脚本执行完毕后，你将返回到命令行提示符，可以继续输入其他命令。

## 解决

### 临时方案

通过在终端中执行以下命令来临时添加目录到 `PYTHONPATH`

```sh
export PYTHONPATH="/path/to/your/directory:$PYTHONPATH"

# 查看
echo $PYTHONPATH
```

### 永久方案

写入 `.bashrc`, `.bash_profile`, 或 `.zshrc`

```sh
echo 'export PYTHONPATH="/path/to/your/directory:$PYTHONPATH"' >> ~/.bashrc

# 立即生效
source ~/.bashrc
```
