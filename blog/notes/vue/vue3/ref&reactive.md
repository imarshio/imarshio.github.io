---
icon: pen-to-square
order: 4
title: ref & reactive
# tag:

---

## ref

支持定义基本类型、对象类型的数据为响应式数据，且声明的对象类型为`RefImpl`，其数据存储在`value`中。

:::vue-demo ref使用示例

```vue
<template>
 <div class="demo">
  <h2>Vue 3.x ref演示</h2>
  <h3>current sum is {{ sum }}</h3>
  <br />
  <button @click="add()">click sum +1</button>
 </div>
</template>

<script>
const { ref } = Vue
// import { ref } from 'vue';
export default {
 setup() {
  let sum = ref(0)

  function add() {
   // 注意在vue3中不能使用this，vue3已经开始弱化this了
   sum.value += 1
   console.log(sum)
  }

  return {sum,add}
 }
};
</script>

<style>
.demo {
 background-color: skyblue;
 box-shadow: 0 0 10px;
 border-radius: 10px;
 padding: 20px;
 margin-right: 20px;
}
</style>

```

:::

## reactive

只支持定义对象类型的数据为响应式数据，且声明的对象类型为`Proxy`,其数据存储在`Target`元素中。

:::vue-demo reactive使用示例

```vue

<template>
 <div class="demo">
  <h2>响应式测试</h2>
  <h4>姓名：{{ annt.name }}</h4>
  <h4>爱好：{{ annt.hobby }}</h4>
  <h4>年龄：{{ annt.age }}</h4>
  <h4>地址：{{ annt.address }}</h4>
  <h4>电话：{{ annt.tel }}</h4>
  <button @click="grow">生日快乐</button>
  <button @click="migrate">迁移</button>
 </div>
</template>

<script>
const { reactive, ref } = Vue
export default {
 setup() {
  let annt = reactive({
   name: '淑芬',
   hobby: [
    '唱',
    '跳',
    'rap',
   ],
   age: 18,
   address: '上海市浦东新区',
   tel: 13411111111
  })

  function grow() {
   annt.age++
   console.log(annt)
  }

  function migrate() {
   annt.address = '上海市浦西区'
  }
  return {annt,grow,migrate}
 }
}
</script>

<style>
.demo {
 background-color: #aaa;
 box-shadow: 0 0 10px;
 border-radius: 10px;
 padding: 20px;
 margin-right: 20px;
}
</style>
```

:::

## toRefs

```vue
```

## toRef

```vue
```
