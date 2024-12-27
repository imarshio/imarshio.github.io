---
icon: pen-to-square
order: 2
title: API 风格
# tag:

---

## 选项式API（Options API）

> 使用选项式API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`，`methods`，`mounted`，`computed` 等，选项所定义的属性都会暴露在函数内部的`this`上，它会指向当前的组件实例。

```typescript
export default {
    name: 'Demo',
    // name 就是一个选项
    data() {
        // data也是一个选项
        return {
            age: 18
        }
    },
    methods: {
        // methods也是一个选项
        grow() {
            this.age+=1
        }
    },
    computed() {
        // computed也是一个选项

    }
}
```

## 组合式API（Composition API）

```typescript
export default {
  name: 'Demo3',
  setup() {
    // import {ref} from 'vue'
    let sum = 0

    function add() {
      // 注意在vue3中不能使用this，vue3已经开始弱化this了
      sum += 1
    }

    // 将数据暴露出去，才可以使用
    return { sum, add }
  }
}
```
