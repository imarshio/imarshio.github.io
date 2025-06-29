---
icon: fa-solid fa-face-smile-wink
category:
  - interview
title: Java 集合面试题
order: 2

---

## Java 中有哪些集合类？

## 简单说下往 HashMap 中插入一条记录的过程

### HashMap 继承体系

```java
public class HashMap<K,V> extends AbsractMap<K,V> implements Map<K,V>{}

public abstract class AbstractMap<K,V> implements Map<K,V> {}

public interface Map<K,V> {}
```

## HashMap 是如何解决地址冲突的？

- 链地址法（Java 的选择）
- 开放地址法

Java 1.7：数组+链表（头插）

Java 1.8：数组+链表（尾插）/红黑树

在1.8版本中，hash表中单个链表长度超过8时才会进行树化，变成红黑树，当链表长度小于6时，会退化成链表。

## 为什么 HashMap 树化的阈值是8，退化的阈值是6？

为了避免在红黑树化和退化之间反复横跳

## HashMap 扩容流程

## HashMap 扩容时为什么是 2 的 n 次方

## Java 1.8后，HashMap 是头插还是尾插？

## ArrayList

## 栈和队列的区别是什么？
