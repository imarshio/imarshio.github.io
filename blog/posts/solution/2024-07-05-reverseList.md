---
title: 2024-07-05 反转链表
icon: calculator
category:
  - nowcoder
tag:
  - nowcoder
---


[反转链表](https://www.nowcoder.com/practice/75e878df47f24fdc9dc3e400ec6058ca?tpId=295&tqId=23286&ru=/exam/oj&qru=/ta/format-top101/question-ranking&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3D%25E7%25AE%2597%25E6%25B3%2595%25E7%25AF%2587%26topicId%3D295%26fromPut%3Dpc_kol_aaaxiu)

## 解题思路

## 亮点

- 使用了 `char` 类型，如果已知一个 `char` 为数字，那么 `valueOf(char) - 48` 就可以得到对应的数字。
- 时间复杂度为 O(n)
- 空间复杂度为 O(max(n,m) + 1)

## 实现

```java
public class Test {

    public static class ListNode {
        int val;
        ListNode next = null;

        public ListNode(int val) {
            this.val = val;
        }
    }

    /**
     * <a href="https://www.nowcoder.com/practice/75e878df47f24fdc9dc3e400ec6058ca?tpId=295&tqId=23286&ru=/exam/oj&qru=/ta/format-top101/question-ranking&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3D%25E7%25AE%2597%25E6%25B3%2595%25E7%25AF%2587%26topicId%3D295%26fromPut%3Dpc_kol_aaaxiu">反转链表</a>
     * 输入：{1,2,3}
     *
     * @param head ListNode类
     * @return ListNode类
     */
    public ListNode ReverseList(ListNode head) {
        // write code here
        return null;
    }
}
```
