---
icon: pen-to-square
order: 7
title: Typescript接口
# tag:

---

## interface

[typescript中文手册--接口](https://typescript.bootcss.com/interfaces.html)

[typescript官网--接口](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)

### 声明

```typescript
export interface Person {
  id: string;
  name: string;
  age: number;
  // ? 表示这个属性可有可无
  tel?: string;
}

```

### 引用

```vue
<template>
 <div class="demo">
  <h2>Typescript -- 接口</h2>
  <h3>人的信息 {{ p }}</h3>
  <h3>人们的信息 {{ ps }}</h3>
 </div>
</template>

<script setup lang="ts" name="Interfaces">
// 引用
import { type Person } from '@/types'

// 使用
let p: Person = {
 id: '123',
 name: '123',
 age: 18,
}

let ps: Array<Person> = [{
 id: '123',
 name: '123',
 age: 18,
}]
console.log(p)
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
