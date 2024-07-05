---
title: 2024-07-04 大数加法
icon: calculator
category:
  - nowcoder
tag:
  - nowcoder
---


[大数加法](https://www.nowcoder.com/practice/11ae12e8c6fe48f883cad618c2e81475?tpId=196&tqId=37176&rp=1&ru=/exam/oj&qru=/exam/oj&sourceUrl=%2Fexam%2Foj%3Ftab%3D%25E7%25AE%2597%25E6%25B3%2595%25E7%25AF%2587%26topicId%3D196%26page%3D1&difficulty=undefined&judgeStatus=undefined&tags=&title=)

中等难度

## 解题思路

## 亮点

- 使用了 `char` 类型，如果已知一个 `char` 为数字，那么 `valueOf(char) - 48` 就可以得到对应的数字。
- 时间复杂度为 O(n)
- 空间复杂度为 O(max(n,m) + 1)

## 实现

```java
public String solve(String s, String t) {
    // write code here
    int sLength = s.length();
    int tLength = t.length();
    int maxLength = Math.max(sLength, tLength);
    int[] result = new int[maxLength + 1];
    int index = 0;
    int carry = 0;
    for (int i = maxLength; i > 0; i--) {
        int mid = carry;
        if (index < sLength) {
            mid += s.charAt(sLength - index - 1) - 48;
        }
        if (index < tLength) {
            mid += t.charAt(tLength - index - 1) - 48;
        }
        result[index++] = mid % 10;
        carry = mid >= 10 ? 1 : 0;
    }
    if (carry == 1) {
        result[index] = carry;
    }
    StringBuilder b = new StringBuilder();
    for (int i = maxLength; i >= 0; i--) {
        if (i == maxLength && result[i] == 0) {
            continue;
        }
        b.append(result[i]);
    }
    return b.toString();
}
```
