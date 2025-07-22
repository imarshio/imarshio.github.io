---
icon: pen-to-square
order: 2
title: CSS
# tag:

---


## 盒子模型

## 网页布局

- 标准流
- 浮动
- 定位
- `Flexbox` 和 `Grid`

## display

- `flex`
  
效果类似于 `float`，但是 `flex` 后的元素仍然在文档(`DOM`)流上.

::: vue-demo display="flex"

```vue
<template>
 <div class="outer">
  <span>
   display 为默认值
  </span>
  <div class="inner">
   <div class="box1">
    div 1
   </div>
   <div class="box2">
    div 2
   </div>
  </div>
  <span>
   display 为 flex
  </span>
  <div class="inner flex">
   <div class="box1">
    div 3
   </div>
   <div class="box2">
    div 4
   </div>
  </div>
 </div>
</template>
<script></script>
<style>
div {
 padding: 5px 10px;
}

.outer {
 font-size: 20px;
}

.inner {
 line-height: 1.5;
}

.flex {
 display: flex;
}

.box1 {
 background-color: rgba(255, 0, 0, 0.5);
}

.box2 {
 background-color: rgba(0, 255, 0, 0.5);
}
</style>
```

:::
