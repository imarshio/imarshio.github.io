---
title: 在线代码执行器
icon: code
article: false
---

点击代码块右上角复制按钮旁的 **run**，即可展开在线编辑器，修改示例并点击编辑器里的 **Run** 查看结果。再次点击「收起」可隐藏编辑器并保留本次编辑内容。支持 Python、Node.js、JavaScript、HTML 和 Java。

编辑器由 [OneCompiler](https://onecompiler.com/apis/embed-editor) 提供，需要联网。只有展开时才加载第三方编辑器；代码会交给第三方处理，请勿输入密钥或私密数据。运行时版本、依赖安装、网络访问和执行时长以该服务的限制为准，不适合启动长期运行的服务。编辑内容不会保存回博客，刷新后恢复文章示例。

## Python

```python run
numbers = [1, 2, 3, 4, 5]
print("平方：", [n ** 2 for n in numbers])
print("总和：", sum(numbers))
```

## Node.js

需要 Node.js 内置模块时，使用 `node` 或 `nodejs`。

```nodejs run
const path = require("node:path");

console.log("Node.js:", process.version);
console.log("文件名：", path.basename("/blog/hello.js"));
```

## JavaScript

`js` / `javascript` 用于普通脚本；需要 `document`、DOM 或页面交互时，请使用下方的 HTML 模式。

```js run
const languages = ["Python", "Node.js", "HTML", "JavaScript", "Java"];
console.log(languages.map((name) => `Hello, ${name}!`).join("\n"));
```

## HTML / CSS / JavaScript

可以在同一个 HTML 文件里写 `<style>` 和 `<script>`，点击 Run 查看页面效果。

```html run
<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8">
  <title>计数器</title>
  <style>
    body { font-family: sans-serif; padding: 24px; }
    button { padding: 8px 16px; cursor: pointer; }
  </style>
  <h1>在博客里运行 HTML</h1>
  <button id="counter">点击次数：0</button>
  <script>
    let count = 0;
    document.querySelector("#counter").onclick = (event) => {
      event.target.textContent = `点击次数：${++count}`;
    };
  </script>
</html>
```

## Java

单文件示例使用 `Main.java`，公开类名请写为 `Main`。

```java run
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("1 + 2 + 3 = " + (1 + 2 + 3));
    }
}
```

## 在文章中启用

只需在 Markdown 代码块的语言后添加 `run`，例如：

````md
```python run
print("Hello from the blog!")
```
````

支持的语言标记：`python` / `py`、`nodejs` / `node`、`javascript` / `js`、`html`、`java`。未添加 `run` 的代码块和不支持的语言仍按普通代码展示。每个代码块是独立的单文件示例，不共享变量或文件。
