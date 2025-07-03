---
icon: pen-to-square
# category:
  # - Term
title: JavaScript
# tag:

---

## JavaScript

简称`JS`，文件以`.js`为后缀。

### ECMAScript

`ECMAScript` （简称`ES`）是`JavaScript`的标准化版本，由`ECMA`国际（前身为欧洲计算机制造商协会）的`TC39`技术委员会负责制定。以下是`ECMAScript`的主要版本迭代历程：

1. **ECMAScript 1（1997年）**
   - 初始版本，确立了JavaScript作为一门编程语言的基础。

2. **ECMAScript 2（1998年）**
   - 一个小更新，增加了一些新特性和错误修复。

3. **ECMAScript 3（1999年）**
   - 引入了正则表达式、`try...catch`异常处理等重要特性。

4. **ECMAScript 4（未能发布）**
   - 计划引入面向对象编程、模块化等特性，但由于争议过大，该版本最终被废弃。

5. **ECMAScript 5（2009年）**
   - 重新聚焦于小的、一致的更新，引入了严格模式、JSON等。

6. **ECMAScript 5.1（2011年）**
   - 一个小更新，主要是一些bug修复和一些新的API。

7. **ECMAScript 6（ES2015，2015年）**
   - 引入了类、模块、箭头函数、模板字符串、解构赋值、`let`和`const`、`Promise`、`Map`和`Set`等大量新特性。

   类演示

   ```js
   ```

   模块演示

   ```js
   ```

   箭头函数示例

   ```js
   ```

   其余新特性示例

   ```js
   ```

8. **ECMAScript 2016（ES2016）**
   - 引入了`Array.prototype.includes`方法和指数运算符（`**`）。

9. **ECMAScript 2017（ES2017）**
   - 引入了`async`/`await`、`Object.values`和`Object.entries`等。

10. **ECMAScript 2018（ES2018）**
    - 引入了`Promise.prototype.finally`、`Object.getOwnPropertyDescriptors`等。

11. **ECMAScript 2019（ES2019）**
    - 引入了`Array.prototype.flat`和`Array.prototype.flatMap`、`String.prototype.trimStart`和`String.prototype.trimEnd`等。

12. **ECMAScript 2020（ES2020）**
    - 引入了空值合并运算符（`??`）、`globalThis`、`Promise.allSettled`等。

13. **ECMAScript 2021（ES2021）**
    - 引入了逻辑赋值运算符（`||=`和`&&=`）、`Promise.any`等。

14. **ECMAScript 2022（ES2022）**
    - 引入了`Array.prototype.at`、`String.prototype.replaceAll`、`Object.hasOwn`、`FinalizationRegistry`等。

15. **ECMAScript 2023（ES2023）**
    - 引入了`Array.prototype.findLast`、`Array.prototype.findLastIndex`、`String.prototype.codePoints`等。

16. **ECMAScript 2024（ES2024）**（预计）
    - 正在讨论中，预计会引入新的语法和API。

ECMAScript规范每年都会更新，引入新特性以保持JavaScript的现代化和竞争力。开发者需要关注这些更新，以便利用新特性提高开发效率和代码质量。

## 声明数据

### var

- `var`是ES6之前JavaScript中唯一的变量声明关键字。
- 它有**函数作用域**，而不是块作用域（例如`if`语句或`for`循环）。
- 可以被重新赋值（可变）。

```javascript
var message = 'Hello';
message = 'Hello Vue'; // 可以重新赋值
```

### let

- `let`是ES6中引入的，它有**块作用域**。
- 可以被重新赋值（可变）。

```javascript
let message = 'Hello';
message = 'Hello Vue'; // 可以重新赋值
```

### const

- `const`也是ES6中引入的，它有**块作用域**。
- 一旦声明，其值不能被重新赋值（不可变），但若其值为对象或数组，则对象或数组内部的属性可以改变。

```javascript
const message = 'Hello';
// message = 'Hello Vue'; // 错误：Assignment to constant variable.
```

## 版本
