---
title: JVM 是什么
icon: pen-to-square
order: 1
category:
  - java
tag:
  - base
---

Java 虚拟机是一台包含类加载、运行时数据区、垃圾收集算法、Java 虚拟机指令优化等功能的一台【虚拟机】，就像一个接口，只是定义了一些方法和参数类型等，但是其内部的具体实现是没有的。

所以，说 Hotspot 是 Java 虚拟机没错，但是如果说 Java 虚拟机就是 Hotspot 则是错的，因为 Hotspot 虚拟机只是 Oracle JDK 的实现罢了，曾经的我也一度以为 Java 虚拟机就是 Hotspot ，Hotspot 就是 Java 虚拟机，后来也是在拜读了周志明老师的《深入理解Java虚拟机：JVM高级特性与最佳实践》一书后恍然。

此处引用官方对 Java 虚拟机的描述即
> **CHAPTER 2 : The Structure of the Java Virtual Machine**
>
> THIS document specifies an abstract machine. It does not describe any particular implementation of the Java Virtual Machine.
>
> To implement the Java Virtual Machine correctly, you need only be able to read the class file format and correctly perform the operations specified therein. Implementation details that are not part of the Java Virtual Machine's specification would unnecessarily constrain the creativity of implementors. For example, the memory layout of run-time data areas, the garbage-collection algorithm used, and any internal optimization of the Java Virtual Machine instructions (for example, translating them into machine code) are left to the discretion of the implementor.  
