---
title: "基础与对象"
icon: fa-solid fa-face-smile-wink
lang: zh-CN
category:
  - interview
order: 1
redirectFrom:
  - /posts/interview/21-python-basics.html
---

# Python 基础自查

详细讲解和完整示例已按学习顺序整理到 [Python 学习笔记](/notes/python/README.md)。本页用于快速复习。

## 1. 名字、类型与身份

赋值绑定对象；重新绑定、原地修改、复制是三个不同动作。

[展开学习](/notes/python/basics/types.md)

<a id="二、python-内置数据结构"></a>

## 2. list、tuple、dict、set

按序列、固定组合、映射和成员关系选型，再比较复杂度。

[展开学习](/notes/python/basics/containers.md)

## 3. 参数与默认值

默认表达式在定义时求值，避免意外共享可变对象。

[展开学习](/notes/python/basics/functions.md)

## 4. 作用域与模块

区分局部绑定、global、nonlocal，以及导入缓存。

[展开学习](/notes/python/basics/scope-modules.md)

## 5. 类、属性与方法

区分实例属性、类属性、property、classmethod 和 staticmethod。

[展开学习](/notes/python/objects/classes.md)

## 6. 继承与抽象接口

理解名称改写、MRO、super 与 abc，不把下划线当成安全边界。

[展开学习](/notes/python/objects/inheritance-abc.md)

## 7. object 与可调用对象

语法和内置操作通过对象协议连接到特殊方法。

[展开学习](/notes/python/objects/data-model.md)

## 8. 异常与资源

明确异常传播和 with 的关闭区间，避免依赖 __del__。

[展开学习](/notes/python/basics/exceptions-io.md)

## 继续练习

- [语言与并发](./Questions.md)
- [内存与执行](./Runtime.md)
- [综合问答](./Overview.md)
