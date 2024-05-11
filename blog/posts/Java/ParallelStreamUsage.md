---
icon: pen-to-square
date: 2024-05-11
category:
  - ECS
title: Parallel Stream Usage
# tag:

---

## 背景

项目需要对一批数据进行跑批，由于背靠Java，且时间有限，考虑到便利性直接使用了Java自带的stream API。

## 实现

### 默认行为

```java
    public static void main(String[] args) {
        // 模拟数据
        var stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
         11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
         21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
         31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
         51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
         61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
         71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
         81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
         91, 92, 93, 94, 95, 96, 97, 98, 99, 100);

        // 批处理数据
        stream.parallel().forEach(i -> {
            log.info("{} {} {}", Thread.currentThread().getName(), LocalDateTime.now(), i);
            try {
                // 前置处理
                // ...
                // 业务API Call
                // ...
                // 业务逻辑
                // ...
                // 后置处理
                
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
    }
```

enmmm，跑批速度很快，唰唰唰的，但是突然console中打印出几个不同寻常的ERROR日志，与此同时，其他同事收到业务API的告警，超限了（触发限流策略）！！！

### 收敛行为

在得知业务API Call经不起如此折腾的时候（触发限流策略），我们就有必要调整一下我们的调用姿势了。

```java
    public static void main(String[] args) {
        // 模拟数据
        var stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
         11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
         21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
         31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
         51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
         61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
         71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
         81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
         91, 92, 93, 94, 95, 96, 97, 98, 99, 100);

        // ForkJoinPool 默认会启v-cpu（逻辑处理器）数量个线程，比如8核16线程的电脑默认会起16个线程执行任务
        // 也可以指定线程数量，此处我指定了使用5个线程进行同时跑批
        new ForkJoinPool(5).submit(() -> stream.parallel().forEach(i -> {
            log.info("{} {} {}", Thread.currentThread().getName(), LocalDateTime.now(), i);
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        })).join();
    }
```

接下来进行跑批，速度虽然慢了一点，但是业务API Call不会在触发限流了，win-win，成功。

## Why 5？

有的人可能会好奇，为什么将线程数量限制在5就行了？那么我们需要先了解下，Stream默认会开启多少个线程，知道了是多少个线程并发导致的限流我们才好根据这个数据进行调整。

Stream底层使用的是ForkJoinPool，ForkJoinPool 默认会起v-cpu（逻辑处理器）数量个线程，比如8核16线程的电脑默认会起16个线程执行任务。

我的电脑是8核16线程（逻辑处理器）的配置，所以我这里的并发数量是16，那么如何验证一下呢？

### 验证

```java
    public static void main(String[] args) {
        // 模拟数据
        var stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
         11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
         21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
         31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
         51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
         61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
         71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
         81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
         91, 92, 93, 94, 95, 96, 97, 98, 99, 100);

        // 指定并发数量
        new ForkJoinPool(5).submit(() -> stream.parallel().forEach(i -> {
            log.info("{} {} {}", Thread.currentThread().getName(), LocalDateTime.now(), i);
            try {
                // sleep 2秒为了更好的观察当前有多少个线程同时再跑
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        })).join();

        // 默认并发数量
        new ForkJoinPool().submit(() -> stream.parallel().forEach(i -> {
            log.info("{} {} {}", Thread.currentThread().getName(), LocalDateTime.now(), i);
            try {
                // sleep 2秒为了更好的观察当前有多少个线程同时再跑
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        })).join();
    }
```

查看console输出，发现每隔2秒就会输出一批日志，以此验证了并发数量确实为5.

```log
22:30:15.363 [ForkJoinPool-1-worker-5] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-5 2024-05-10T22:30:15.357577700 32
22:30:15.363 [ForkJoinPool-1-worker-3] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-3 2024-05-10T22:30:15.357577700 66
22:30:15.363 [ForkJoinPool-1-worker-9] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-9 2024-05-10T22:30:15.358579500 72
22:30:15.363 [ForkJoinPool-1-worker-7] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-7 2024-05-10T22:30:15.358579500 91
22:30:15.363 [ForkJoinPool-1-worker-11] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-11 2024-05-10T22:30:15.357577700 57
22:30:17.386 [ForkJoinPool-1-worker-9] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-9 2024-05-10T22:30:17.386405400 73
22:30:17.386 [ForkJoinPool-1-worker-11] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-11 2024-05-10T22:30:17.386405400 58
22:30:17.386 [ForkJoinPool-1-worker-5] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-5 2024-05-10T22:30:17.386405400 33
22:30:17.386 [ForkJoinPool-1-worker-3] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-3 2024-05-10T22:30:17.386405400 67
22:30:17.386 [ForkJoinPool-1-worker-7] INFO com.marshio.demo.boot.stream.StreamUsage - ForkJoinPool-1-worker-7 2024-05-10T22:30:17.386405400 92
```

默认并发数？

```java
    public static void main(String[] args) {
        // 模拟数据
        var stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
         11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
         21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 
         31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
         41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
         51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
         61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
         71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 
         81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 
         91, 92, 93, 94, 95, 96, 97, 98, 99, 100);

        // 默认并发数量
        new ForkJoinPool().submit(() -> stream.parallel().forEach(i -> {
            log.info("{} {} {}", Thread.currentThread().getName(), LocalDateTime.now(), i);
            try {
                // sleep 2秒为了更好的观察当前有多少个线程同时再跑
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        })).join();
    }
```

查看console输出，一批次为16个，确认默认并发数是逻辑处理器的数量。

## Stream

> [!NOTE]
>
> Stream API是从Java 8开始引入的一个重要特性，它为集合对象如List、Set等提供了一种高效、灵活且易于并行处理的方式来处理数据。Stream API将函数式编程的概念引入到了Java中，使得开发者能够以声明式而非命令式的方式来处理数据集合。

- 流（Stream）：不是数据结构，而是一种对数据集合进行操作的高级抽象。它本身不存储数据，而是对数据源（如集合、数组）进行运算的管道，通过一系列中间操作（如过滤、映射）以及最终操作（如收集、归约）来处理数据。
- 中间操作：如 filter, map, sorted 等，它们是延迟执行的，也就是说这些操作不会立即执行，而是在最终操作时一起执行，以优化整体性能。中间操作返回一个新的流，允许链式调用。
- 最终操作：如 collect, forEach, reduce 等，它们会触发实际的计算，并消费掉流。最终操作执行后，流不能再被使用。
- 无状态与有状态操作：无状态操作如 map 对每个元素独立操作，不受其他元素影响；有状态操作如 distinct 需要记住已处理过的元素信息。
- 并行处理：Stream API支持并行处理，通过调用 parallelStream() 可以轻松地将串行流转换为并行流，从而在多核处理器上利用多线程提高处理速度。但需要注意，不是所有的操作都适合并行化，且并行并不总是意味着更快。

## ForkJoinPool

Java中的ForkJoinPool是Java 7引入的并发框架的一部分，它是基于Fork/Join框架设计的。这个框架特别适用于解决那些可以被分解为更小子问题的计算任务，通常称为“分而治之”(Divide and Conquer)算法，如快速排序、大整数乘法等。以下是关于ForkJoinPool的一些关键点：

### 基本概念

- Fork/Join框架：灵感来源于计算机科学中的分治策略，它将一个大任务拆分成若干个小任务，然后将这些小任务分别执行，最后将结果合并得到原任务的解。
- ForkJoinPool：是一个特殊的线程池，它专门为Fork/Join框架设计，能够高效地处理这种任务分解和结果合并。它使用工作窃取算法（Work-Stealing Algorithm），每个线程不仅处理分配给它的任务，还会“窃取”其他线程尚未处理的任务，以保持工作负载均衡。
- ForkJoinTask：ForkJoinPool处理的任务类型是ForkJoinTask，这个抽象类有两个主要子类：
- RecursiveAction：用于没有返回值的任务。
- RecursiveTask：用于有返回值的任务。
- 工作窃取算法：避免线程饥饿，当一个线程完成自己的任务后，它会尝试从其他线程的队列中“窃取”任务，而不是等待新任务被提交，这样提高了线程的利用率。

### 使用方式

- 创建实例：可以通过new ForkJoinPool()或ForkJoinPool.commonPool()创建一个ForkJoinPool，后者是默认的共享线程池。
- 任务提交：使用submit(ForkJoinTask task)方法提交任务。
- 任务执行：任务通过invoke()或invokeAll()方法执行，invoke()会阻塞直到任务完成，invokeAll()用于批量执行任务。
- 任务分解：在RecursiveTask或RecursiveAction的compute()方法中实现任务分解和执行逻辑，通过fork()将子任务提交回ForkJoinPool，join()则等待子任务完成并合并结果。

### 注意事项

- 任务粒度：为了最大化效率，任务应该足够小，以便快速完成，但也不能过于细碎，以免线程调度开销过大。
- 阻塞操作：ForkJoinPool不是为I/O密集型任务设计的，尽量避免在任务中使用阻塞操作，如Thread.sleep()或同步块，因为这会阻碍工作窃取。
- 并行度：默认情况下，ForkJoinPool的线程数与系统处理器核心数相同，但可以通过构造函数或系统属性ForkJoinPool.common.parallelism调整。
- ForkJoinPool和Fork/Join框架在处理大量可并行的计算任务时，能显著提高性能，尤其是在多核处理器系统中。

## 逻辑处理器

如图

![逻辑处理器](/assets/images/StreamUsage-20240510-0001.png)

## 代码演示

<https://github.com/imarshio/springboot-demo/blob/main/demo-spring-framework/demo-boot-process/src/main/java/com/marshio/demo/boot/stream/StreamUsage.java>
