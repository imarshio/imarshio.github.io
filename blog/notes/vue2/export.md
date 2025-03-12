---
icon: pen-to-square
# category:
  # - Term
title: 暴露模式
# tag:

---

## 默认暴露

在Vue 3中，默认暴露通常指的是使用`setup`函数时，所有返回的对象属性都会被暴露给模板和外部。这意味着，如果你在`setup`函数中返回了一个对象，那么这个对象的所有属性都会默认暴露给组件的模板。

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// 默认暴露方式
export default defineComponent({
  setup() {
    const message = 'Hello from Vue 3';
    const greet = () => {
      alert(message);
    };

    // 暴露已有属性和方法
    return {
      message,
      greet
    };
  }
});
</script>
```

## 分别暴露

分别暴露是指在`setup`函数中，我们可以选择性地暴露某些属性或方法。这可以通过使用`ref`、`reactive`、`computed`、`watch`等响应式API来实现，只有我们明确标记为响应式的属性或方法才会被暴露。

```vue
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const message = ref('Hello from Vue 3');

    // 只有message被暴露，其他局部变量不会被暴露
    return {
      message
    };
  }
});
</script>
```

## 统一暴露

统一暴露通常指的是通过一个统一的对象来管理所有需要暴露的属性和方法。这可以通过在`setup`函数中创建一个对象，并在该对象上设置所有需要暴露的属性和方法来实现。

**例子（Vue 3 + TypeScript）:**

```vue
<template>
  <div>
    <p>{{ state.message }}</p>
    <button @click="state.greet">Greet</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const sum = 0
    const state = reactive({
      message: 'Hello from Vue 3',
      greet: () => {
        alert(state.message);
      }
    });

    // 统一暴露sum引用和state对象
    return {
      sum,
      state
    };
  }
});
</script>
```
