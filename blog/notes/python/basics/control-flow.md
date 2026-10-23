---
title: "条件、循环与推导式"
icon: fa-brands fa-python
lang: zh-CN
category:
  - python
order: 3
article: false
---

# 条件、循环与推导式

有了数据，接下来决定程序按什么顺序处理它。条件表达式选择分支，循环遍历数据，推导式把简单的筛选与映射写成一个表达式。

## 条件与短路

`if` 使用对象的真值；`and`、`or` 会短路，并返回参与运算的对象，不保证返回布尔值。`name or "默认"` 会同时把空字符串当作缺失；只允许 `None` 表示缺失时，应该显式判断。

```python
# 可独立运行
quantity = 0
actual = 10 if quantity is None else quantity
assert actual == 0
assert ("" or "默认") == "默认"
assert ("ready" and 3) == 3
```

## for、while 与迭代

`for` 从可迭代对象逐项取值；`while` 重复检查条件。需要索引用 `enumerate`，并排处理等长数据可用 `zip(..., strict=True)` 检查长度。

```python
# 可独立运行
names = ["alice", "bob"]
scores = [90, 85]
rows = []
for index, (name, score) in enumerate(zip(names, scores, strict=True), start=1):
    rows.append((index, name, score))
assert rows == [(1, "alice", 90), (2, "bob", 85)]
```

`break` 结束当前循环，`continue` 进入下一轮。循环后面的 `else` 在没有执行 `break` 时运行，包括一次都没有迭代的情况。

## 推导式

```python
# 可独立运行
numbers = range(6)
squares = [n * n for n in numbers if n % 2 == 0]
by_number = {n: str(n) for n in range(3)}
unique = {word.lower() for word in ["Py", "py", "SQL"]}
assert squares == [0, 4, 16]
assert by_number[2] == "2"
assert unique == {"py", "sql"}
```

推导式适合一眼能看懂的转换。存在多步副作用、复杂异常处理时，用普通循环更清楚。生成器表达式会在后面的[迭代与生成器](../advanced/iterators.md)继续展开。

## 模式匹配

`match` 是结构化模式匹配，不只是比较一个变量的值。字典模式默认可以匹配包含额外键的对象；守卫条件用 `if` 补充约束。

```python
# 可独立运行
message = {"type": "text", "content": "hello", "id": 1}
match message:
    case {"type": "text", "content": str(content)} if content:
        result = content.upper()
    case _:
        result = "unsupported"
assert result == "HELLO"
```

学习完后，尝试把容器章节的统计练习写成一个函数。下一篇是[函数与参数](./functions.md)。

---

[上一篇](/notes/python/basics/containers.md) · [下一篇](/notes/python/basics/functions.md) · [学习目录](/notes/python/README.md)
