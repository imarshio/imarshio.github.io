---
icon: fa-solid fa-face-smile-wink
category:
  - interview
title: Java 并发面试题
order: 3
---


## 进程（process）

狭义：是正在运行的一个程序

广义：是一个具有一定独立功能的程序关于某个数据集合的一次运行活动，是操作系统进行资源分配与调度的基本单位

进程的概念主要有两点：

- 进程是一个实体
- 进程是一个**执行中**的程序，只有当操作系统赋予进程生命时，才成为一个活动的实体，称之为进程

## 线程（thread）

线程是进程的一个执行单元，每个线程有自己的线程栈，自己的寄存器环境，自己的线程本地存储。

线程是操作系统可进行运算调度的最小运行单元。

一个进程至少有一个线程

多线程运行调度由线程调度器管理，不一定根据线程创建顺序执行

## 创建线程有哪些方式？

### 1、继承 Thread 类

### 2、实现 Callable 接口

### 3、实现 Runnable 接口

### 代码demo

#### 继承Thread

```java
public class MyThread extends Thread{
 @override
 public void run(){
  //重写方法体
 }
}
```

#### 实现Runnable接口

```java
public class MyThread implements Runnable{
    @Override
    public void run(){
        System.out.println("runnable thread");
    }
}

public static void main(String args[]){
    MyThread mt = new MyThread()
    Thread thread = new Thread(mt);
    thread.start();
    
}
```

#### 实现Callable接口

```java
public class CallableThread implements Callable<String>{
    @Override
    public String call() throws Exception{
        System.out.println("Callable");
        return null;
    }
}
```

在操作系统中以进程为单位分配资源，如虚拟空间

生命周期，线程的生命周期共6种状态：**New（初始化状态）、Runnable（可运行/运行状态）、Blocked（阻塞状态）、Waiting（等待状态）、Timed_Waiting（有时间限制的等待）、Terminated（终止状态）**

![image-20210414225118178](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701224948.png)

## 主线程与子线程

JVM在启动时，会创建一个主线程，该线程负责执行main方法，Java中线程是不孤立的，

## 线程之间运行的状态

![image-20210512105021210](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701224959.png)

![image-20210512105040500](https://masuo-github-image.oss-cn-beijing.aliyuncs.com/image/20210701225011.png)

### 串行

​ 依次运行

### 并行

​ 同时运行

### 并发

​ 同时发生，但不能同时运行，在较小的时间内串行。

（同步/异步）参考：<https://zhuanlan.zhihu.com/p/67452727>

## 异步

可发生请求，有等待时间，在等待时可进行下一任务

## 同步

可发生请求，有等待，在等待时不可进行下一任务，必须等当前任务完成才能进行下一任务。

## 线程池的核心参数有哪些？

线程池有七个核心参数

- 核心线程数

## ConcurrentHashMap

## Future

## CompletableFuture

## synchronized

非公平锁，重量级锁，JDK 6之后性能大幅提升，接近Lock

## 偏向锁

## 轻量级锁

## Lock

## ReentrantLock

莫认为非公平锁，可配置为公平锁
