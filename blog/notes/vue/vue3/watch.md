---
icon: pen-to-square
order: 5
title: 侦听器
# tag:

---

> 文中大多内容来自官网，本文只是简单的`cv`了一下，纯属个人喜欢笔记。

## watch()

[官网watch文档](https://cn.vuejs.org/api/reactivity-core#watch)

`watch()` 默认是懒侦听的，即仅在侦听源发生变化时才执行回调函数。

`watch()` 一共有三个参数，第一个是被侦听元素，可以是一个函数、一个响应式数据、或是以上组成的数组；第二个是回调函数，第三个是可选的一个对象，支持多个参数配置。

如上具体请参考官网。

## watchEffect()

`watch()` 的缺点，可能就是需要明确指出需要监听的对象，也不能说这是一个缺点，可以说是和`watchEffect()`相比，`watch()`需要我们去明确的指出需要监听的对象。

而`watchEffect()`则不需要我们指定需要监听的对象，他会根据函数作用域分析出哪些对象是需要被监听的，即动态监听对象。

## watchPostEffect()

`watchEffect()` 使用 `flush: 'post'` 选项时的别名。

## watchSyncEffect()

`watchEffect()` 使用 `flush: 'sync'` 选项时的别名。
