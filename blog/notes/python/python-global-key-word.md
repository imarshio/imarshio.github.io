---
icon: fa-brands fa-python
category:
  - python
title: Python 关键字 -- global
order: 10
# tag:
# - spider
---

[key words](https://docs.python.org/3/reference/lexical_analysis.html#keywords)

## 用法

```python
# 预先全局声明
current_date = datetime.datetime.now().strftime('%Y-%m-%d')

def a():
    global current_date
    current_date = '2024-09-05'
    
if __name__ == '__main__':
    print(current_date)
    # 输出 2024-09-03
    a()
    print(current_date)
    # 输出 2024-09-05
```
