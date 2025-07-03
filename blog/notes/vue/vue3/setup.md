---
icon: pen-to-square
order: 3
title: setup
# tag:

---

## 语法糖

### 什么是语法糖？

语法糖（Syntactic sugar），也称为糖衣语法，是计算机科学中的一个术语，指的是一种编程语言特性，它允许程序员使用更简洁或更易于理解的语法来表达某些操作或概念，而不会改变语言的表达能力。换句话说，语法糖提供了一种编写代码的便捷方式，使得代码更加易读和易写，但最终会被编译器或解释器转换成等效的底层操作。

以下是一些常见的语法糖例子：

1. **条件表达式（Ternary operator）**：在许多编程语言中，如C、C++、Java和JavaScript，`?:` 运算符允许你以更简洁的方式编写条件语句。例如，在C语言中：

   ```c
   int max = (a > b) ? a : b; // 如果a大于b，则max等于a，否则max等于b
   ```

2. **列表推导式（List comprehensions）**：在Python中，列表推导式提供了一种简洁的方式来创建列表，基于现有的列表或可迭代对象。例如：

   ```python
   squares = [x**2 for x in range(10)]  # 创建一个包含0到9的平方的列表
   ```

3. **Lambda表达式**：在支持函数式编程的语言中，如Python和Java，Lambda表达式允许你以简洁的方式定义匿名函数。例如，在Python中：

   ```python
   add = lambda x, y: x + y  # 定义一个匿名函数，用于计算两个数的和
   ```

4. **属性装饰器（Property decorators）**：在Python中，你可以使用装饰器来创建只读或只写的属性，这使得属性访问更加安全和方便。例如：

   ```python
   class Counter:
       def __init__(self):
           self._count = 0

       @property
       def count(self):
           return self._count

       @count.setter
       def count(self, value):
           if value < self._count:
               raise ValueError("Count cannot be decreased")
           self._count = value
   ```

5. **for-each循环**：在Java和C#等语言中，for-each循环允许你直接遍历集合中的元素，而不需要使用传统的for循环和迭代器。例如，在Java中：

   ```java
   for (String item : list) {
       System.out.println(item);
   }
   ```

语法糖的主要优点是提高代码的可读性和编写效率，但它也可能使得代码的执行效率略低，因为编译器需要额外的步骤来转换这些高级语法。不过，现代编译器通常能够优化这些转换，使得最终的执行效率与手动编写等效代码相当。

### setup的语法糖

```vue
<script setup lang="ts">
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
</script>
```

可以写成如下样式，

```vue
<script setup lang="ts">
export default {
  name: 'Demo3'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
let sum = ref(0)

function add() {
 // 注意在vue3中不能使用this，vue3已经开始弱化this了
 sum.value += 1
}
</script>
```

上面的写法还是不完美，因为单独为了一个组件名称而写一个 `script` 标签，感觉很不合理。所以，官方提供了一个插件`vite-plugin-vue-setup-extend`来优化这种写法。

下载插件

```sh
pnpm i vite-plugin-vue-setup-extend
```

引用插件

```typescript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入插件
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 注册插件
    VueSetupExtend()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

```
