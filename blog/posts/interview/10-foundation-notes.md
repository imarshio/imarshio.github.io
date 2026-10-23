---
title: "基础打底（地基题）"
lang: zh-CN
date: 2026-10-23
order: 110
category:
  - 面试准备
tag:
  - 面试准备
---

# 基础打底（地基题）

> Python 基础已单独整理到 [21-Python基础.md](/posts/interview/21-python-basics.md)，建议先读；本篇继续用于算法、手撕代码、SQL、操作系统和网络的综合打底。
> 题目来源：综合整理各平台常见的后端八股（语言基础、数据结构、SQL、操作系统、计算机网络、手撕代码）。标 ★ 的是高频题。
>
> 目录：一、Python 基础文档入口 → 二、Python 内置数据结构入口 → 三、数据结构与算法 → 四、手撕代码（Python）→ 五、SQL 基础 → 六、PostgreSQL / Redis 基础类型速查 → 七、操作系统基础 → 八、计算机网络基础 → 九、编码与数值 → 十、高频考点自查清单

---

## 一、Python 基础类型

本节正文已迁移到 [21-Python基础.md](/posts/interview/21-python-basics.md)，包括类型与对象、object 方法表、下划线命名、Python/Java 继承对照，以及新增的 abc 抽象基类。

## 二、Python 内置数据结构

list、tuple、dict、set、collections、切片与复制等内容也已迁入 [Python 基础的内置数据结构部分](/posts/interview/21-python-basics.md#二、python-内置数据结构)。

---

## 三、数据结构与算法基础

### 1. ★ 时间复杂度怎么算？常见的有哪些？

看输入规模 n 增大时，操作次数的增长量级，忽略常数和低阶项。
`O(1)` < `O(log n)`（二分）< `O(n)`（遍历）< `O(n log n)`（好的排序）< `O(n²)`（双重循环）< `O(2ⁿ)`（穷举子集）< `O(n!)`（全排列）。
空间复杂度同理，看额外占用的内存。**均摊复杂度**：偶尔一次很贵、平均下来很便宜（list 的 append）。

### 2. ★ 数组和链表的区别？

| | 数组 | 链表 |
| --- | --- | --- |
| 内存 | 连续 | 不连续，节点通过指针相连 |
| 随机访问 | O(1) | O(n) |
| 头部插入 / 删除 | O(n) | O(1) |
| 已知位置插入 / 删除 | O(n)（要移动元素） | O(1)（改指针） |
| 缓存友好 | 是（CPU 预读连续内存） | 否 |
| 代表 | Python list、Java ArrayList | Java LinkedList、Redis 的 quicklist（链表 + 数组的混合） |

### 3. ★ 栈和队列？

- 栈：后进先出（LIFO）。用途：函数调用栈、括号匹配、表达式求值、DFS、浏览器后退。Python 用 list 的 `append` / `pop`。
- 队列：先进先出（FIFO）。用途：BFS、任务队列、消息队列。Python 用 `deque` 的 `append` / `popleft`（不要用 list 的 `pop(0)`，O(n)）。
- 优先队列：按优先级出队，底层是堆。

### 4. ★ 哈希表的原理？哈希冲突怎么解决？

- 用哈希函数把键映射到数组下标，平均 O(1) 增删查。
- 冲突（不同的键映射到同一个位置）的解决：
  - **链地址法**：每个槽位挂一个链表（Java HashMap，链表太长转红黑树）；
  - **开放寻址法**：冲突了就按规则探测下一个空位（Python dict）。
- **负载因子** = 元素数 / 槽位数，太高冲突多，超过阈值就扩容 rehash。Redis 的字典用**渐进式 rehash** 避免一次性迁移卡住。
- 缺点：不支持范围查询、不保证有序（Python dict 有序是额外设计的）。

### 5. ★ 树的几种类型，各用在哪？

| 结构 | 特点 | 应用 |
| --- | --- | --- |
| 二叉搜索树（BST） | 左 < 根 < 右；中序遍历是有序的 | 基础，极端情况退化成链表 O(n) |
| AVL 树 | 严格平衡（左右高度差 ≤ 1），查询快，插入删除旋转多 | 读多写少 |
| **红黑树** | 近似平衡（最长路径 ≤ 最短的 2 倍），插入删除旋转少 | Java TreeMap / HashMap 的树化、C++ map、Linux 进程调度 |
| B 树 | 多路平衡树，每个节点存多个键和数据 | 文件系统 |
| **B+ 树** | 数据只在叶子，叶子之间有链表；非叶子只存键，一个节点能放更多键 → 树更矮 | **MySQL / PG 的索引** |
| 字典树（Trie） | 按字符逐层分支 | 前缀匹配、自动补全、敏感词过滤 |
| 堆 | 完全二叉树，父节点 ≤（或 ≥）子节点 | 优先队列、Top K、堆排序 |

### 6. ★ 为什么数据库索引用 B+ 树，不用哈希、红黑树、B 树？

- **哈希**：等值查询 O(1)，但**不支持范围查询和排序**（`WHERE a > 10`、`ORDER BY`）。
- **红黑树**：二叉，树太高。1000 万数据红黑树高约 24 层，每层可能一次磁盘 IO；B+ 树一个节点（16KB 页）能放上千个键，**3–4 层就能存千万级数据**，IO 次数少得多。
- **B 树**：非叶子节点也存数据，一个节点能放的键更少、树更高；范围查询要中序遍历跳来跳去。B+ 树叶子节点有链表，**范围查询顺着链表走**就行。
- 一句话：**数据库瓶颈是磁盘 IO，B+ 树矮胖、范围查询友好**。

### 7. ★ 为什么 Redis 的 ZSet 用跳表而不是红黑树？

跳表实现简单；范围查询（`ZRANGEBYSCORE`）找到起点后顺着链表走即可；插入删除只改局部指针；内存里不需要考虑磁盘 IO。（详见 08 文档第二节）

### 8. ★ 堆是什么？怎么用堆求 Top K？

- 完全二叉树，用数组存储（节点 i 的子节点是 2i+1、2i+2）；小顶堆父节点 ≤ 子节点，堆顶是最小值。插入、弹出 O(log n)，建堆 O(n)。
- **求最大的 K 个数**：维护一个大小为 K 的**小顶堆**，遍历每个数，比堆顶大就替换堆顶。最后堆里就是最大的 K 个。时间 O(n log K)，空间 O(K)，适合海量数据（不用全部排序）。

### 9. 图的基础？

- 存储：邻接矩阵（稠密图）、邻接表（稀疏图，常用）。
- 遍历：**BFS**（队列，求无权图最短路径、层序）、**DFS**（栈 / 递归，求连通性、路径、拓扑）。
- 常见算法：拓扑排序（任务依赖、编译顺序）、Dijkstra（带权最短路径）。
- 我们的知识图谱（Neo4j）本质就是图，多跳查询就是图遍历。

### 10. ★ 常见排序算法对比

| 算法 | 平均 | 最坏 | 空间 | 稳定 | 说明 |
| --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | 是 | 教学用 |
| 选择 | O(n²) | O(n²) | O(1) | 否 | |
| 插入 | O(n²) | O(n²) | O(1) | 是 | 基本有序时接近 O(n) |
| **快速排序** | O(n log n) | O(n²) | O(log n) | 否 | 实际最快之一；基准选得差会退化，随机选基准 |
| **归并排序** | O(n log n) | O(n log n) | O(n) | 是 | 稳定，适合外部排序（大文件） |
| **堆排序** | O(n log n) | O(n log n) | O(1) | 否 | |
| 计数 / 桶 / 基数 | O(n + k) | — | O(n + k) | 是 | 数据范围有限时 |
| Timsort | O(n log n) | O(n log n) | O(n) | 是 | Python、Java 对象排序 |
「稳定」：相等元素排序后保持原来的相对顺序。

### 11. ★ 二分查找

前提是有序。O(log n)。易错点：边界（`left <= right` 还是 `<`）、中点溢出（Python 不用担心，Java 写 `left + (right - left) / 2`）、找第一个 / 最后一个满足条件的位置。

### 12. 其他常考结构

- **LRU 缓存**：哈希表 + 双向链表，get / put 都 O(1)（手撕见第四节）。
- **布隆过滤器**：一个位数组 + 多个哈希函数。判断「一定不存在」或「可能存在」，有误判、不能删除。用于缓存穿透防护、爬虫 URL 去重。
- **LSM 树**：写先进内存、再顺序刷成有序文件、后台合并。写入极快、读较慢。用于 RocksDB、LevelDB、HBase、Cassandra（对比 B+ 树：读快写慢）。
- **一致性哈希**：哈希环，节点增减只影响相邻一段的数据，用于分布式缓存、负载均衡（我们的 HAProxy 按用户 ID 一致性哈希）。
- **倒排索引**：词 → 包含这个词的文档列表。Elasticsearch、PG 的 GIN 索引、BM25 检索的基础。
- **HNSW**：分层的近似最近邻图，向量数据库（Qdrant、pgvector）的主流索引。

### 13. 常见算法思想

双指针、滑动窗口、前缀和、哈希计数、二分、递归与回溯、动态规划（最优子结构 + 重叠子问题）、贪心、分治、BFS / DFS、拓扑排序、单调栈。

---

## 四、手撕代码（Python 版，必练）

> 面试手撕优先级：LRU > 反转链表 > Top K > 两数之和 > 有效括号 > 合并有序链表 > 二分查找 > 快排 > 层序遍历 > 最长无重复子串。
> 写完要能说出时间 / 空间复杂度。下面的代码都可以直接运行。

```python
from collections import OrderedDict, deque
import heapq
import random


# 1. LRU 缓存（力扣 146）——方法一：OrderedDict（先写这个，再被要求手写链表）
class LRUCacheSimple:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = OrderedDict()

    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)          # 访问过就移到末尾（最新）
        return self.data[key]

    def put(self, key, value):
        if key in self.data:
            self.data.move_to_end(key)
        self.data[key] = value
        if len(self.data) > self.cap:
            self.data.popitem(last=False)   # 弹出最前面（最久未用）


# 1. LRU 缓存——方法二：哈希表 + 双向链表（面试官要的版本），get / put 都是 O(1)
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}                       # key -> Node
        self.head, self.tail = Node(), Node()   # 哨兵节点，省去判空
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_to_front(self, node):          # 头部 = 最近使用
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._add_to_front(node)
        if len(self.map) > self.cap:
            lru = self.tail.prev            # 尾部 = 最久未用
            self._remove(lru)
            del self.map[lru.key]


# 2. 反转链表（力扣 206），O(n) 时间 O(1) 空间
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def reverse_list(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev


# 3. Top K：最大的 K 个数，小顶堆 O(n log k)
def top_k(nums, k):
    heap = []
    for x in nums:
        if len(heap) < k:
            heapq.heappush(heap, x)
        elif x > heap[0]:
            heapq.heapreplace(heap, x)      # 弹出堆顶再压入，比先 pop 再 push 快
    return sorted(heap, reverse=True)       # 实际工作中直接 heapq.nlargest(k, nums)


# 4. 两数之和（力扣 1），哈希表 O(n)
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []


# 5. 有效的括号（力扣 20），栈
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack


# 6. 合并两个有序链表（力扣 21）
def merge_two(l1, l2):
    dummy = cur = ListNode()
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next, l1 = l1, l1.next
        else:
            cur.next, l2 = l2, l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next


# 7. 二分查找：返回 target 的下标，不存在返回 -1
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


# 8. 快速排序（原地，随机基准防止退化）
def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    p = random.randint(lo, hi)
    a[p], a[hi] = a[hi], a[p]
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
    return a


# 9. 二叉树层序遍历（力扣 102），BFS
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res


# 10. 无重复字符的最长子串（力扣 3），滑动窗口
def length_of_longest_substring(s):
    last, start, best = {}, 0, 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1
        last[ch] = i
        best = max(best, i - start + 1)
    return best


if __name__ == "__main__":
    for cls in (LRUCacheSimple, LRUCache):
        c = cls(2)
        c.put(1, 1); c.put(2, 2)
        assert c.get(1) == 1
        c.put(3, 3)                          # 淘汰 2
        assert c.get(2) == -1 and c.get(3) == 3
    h = ListNode(1, ListNode(2, ListNode(3)))
    r = reverse_list(h)
    assert [r.val, r.next.val, r.next.next.val] == [3, 2, 1]
    assert top_k([3, 1, 5, 12, 2, 11], 3) == [12, 11, 5]
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    assert is_valid("()[]{}") and not is_valid("(]")
    m = merge_two(ListNode(1, ListNode(3)), ListNode(2, ListNode(4)))
    out = []
    while m:
        out.append(m.val); m = m.next
    assert out == [1, 2, 3, 4]
    assert binary_search([1, 3, 5, 7], 5) == 2 and binary_search([1, 3], 2) == -1
    assert quick_sort([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9]
    assert level_order(TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4)))) == [[1], [2, 3], [4]]
    assert length_of_longest_substring("abcabcbb") == 3
    print("all ok")
```

**多线程手撕题**（Java 面试常考，Python 也可能问）：两个线程交替打印奇偶数、三个线程按顺序打印 ABC。思路：`threading.Condition` 或多个 `Semaphore` 轮流放行；注意虚假唤醒要用 `while` 而不是 `if` 判断条件。

---

## 五、SQL 基础

### 1. ★ SQL 语句分类？

DDL（定义：`CREATE` / `ALTER` / `DROP` / `TRUNCATE`）、DML（操作：`INSERT` / `UPDATE` / `DELETE`）、DQL（查询：`SELECT`）、DCL（权限：`GRANT` / `REVOKE`）、TCL（事务：`BEGIN` / `COMMIT` / `ROLLBACK` / `SAVEPOINT`）。

### 2. ★ SELECT 的逻辑执行顺序？

**FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT / OFFSET**
推论：

- WHERE 里不能用聚合函数（还没分组）；
- WHERE 里不能用 SELECT 里起的别名（MySQL 的 HAVING / ORDER BY 可以，PG 的 ORDER BY 可以、HAVING 不行）；
- 窗口函数在 SELECT 阶段计算，所以不能直接在 WHERE 里过滤窗口函数结果，要包一层子查询 / CTE。

### 3. ★ 几种 JOIN 的区别？

| JOIN | 结果 |
| --- | --- |
| `INNER JOIN` | 两边都匹配上的行 |
| `LEFT JOIN` | 左表全部 + 右表匹配上的（匹配不上补 NULL） |
| `RIGHT JOIN` | 右表全部（通常改写成 LEFT JOIN） |
| `FULL OUTER JOIN` | 两边全部（MySQL 不支持，用 LEFT UNION RIGHT 模拟） |
| `CROSS JOIN` | 笛卡尔积 |
| 自连接 | 同一张表和自己连（员工表查上级） |
| 半连接（semi） | `WHERE EXISTS (...)`：左表中「在右表里有匹配」的行，不重复 |
| 反连接（anti） | `WHERE NOT EXISTS (...)` 或 `LEFT JOIN ... WHERE 右.id IS NULL`：左表中「在右表里没有匹配」的行 |

**LEFT JOIN 的坑**：把右表的过滤条件写在 WHERE 里会把 LEFT JOIN 变成 INNER JOIN（NULL 行被过滤掉了），应该写在 `ON` 里。

### 4. ★ WHERE 和 HAVING 的区别？

WHERE 在分组前过滤**行**，不能用聚合函数；HAVING 在分组后过滤**组**，可以用聚合函数。能用 WHERE 的条件尽量放 WHERE（先减少数据量）。

### 5. ★ `COUNT(*)`、`COUNT(1)`、`COUNT(列)` 的区别？

`COUNT(*)` 和 `COUNT(1)` 都统计行数（包括 NULL 行），性能基本一样；`COUNT(列)` 只统计该列**不为 NULL** 的行；`COUNT(DISTINCT 列)` 去重计数。

### 6. ★ `UNION` 和 `UNION ALL`？

UNION 去重（要排序或哈希，慢）；UNION ALL 不去重，快。确定没有重复时用 UNION ALL。

### 7. ★ `DELETE`、`TRUNCATE`、`DROP` 的区别？

| | DELETE | TRUNCATE | DROP |
| --- | --- | --- | --- |
| 作用 | 删行（可带 WHERE） | 清空所有行 | 删整张表（结构也没了） |
| 速度 | 慢（逐行，记日志） | 快 | 快 |
| 回滚 | 可以 | MySQL 不能（隐式提交）；**PG 可以** | MySQL 不能；PG 在事务里可以 |
| 自增 | 不重置 | 重置 | — |
| 触发器 | 触发 | 不触发 | — |

### 8. ★ NULL 的坑（三值逻辑）

- 任何值和 NULL 比较（`=`、`<>`、`>`）结果都是 **UNKNOWN**（不是 true 也不是 false），WHERE 只保留 true → 判断要用 `IS NULL` / `IS NOT NULL`；
- `NOT IN` **的经典坑**：`WHERE id NOT IN (SELECT uid FROM t)`，如果子查询结果里有一个 NULL，整个条件永远不为 true，一行都查不出来 → 用 `NOT EXISTS`；
- 聚合函数（SUM、AVG、COUNT(列)）忽略 NULL；`AVG` 是「非 NULL 值的平均」；
- `COALESCE(a, 0)` 把 NULL 换成默认值；
- 唯一约束里多个 NULL 不算重复（PG15 可改）。

### 9. ★ 约束有哪些？主键和唯一约束的区别？

约束：`PRIMARY KEY`、`UNIQUE`、`NOT NULL`、`CHECK`、`FOREIGN KEY`、`DEFAULT`（PG 还有 `EXCLUDE`）。
主键：唯一 + 非空，一张表只能有一个；唯一约束：可以有多个，允许 NULL。

### 10. ★ 数据库三大范式？

- 第一范式：每列不可再分（原子性）；
- 第二范式：在 1NF 基础上，非主键列完全依赖于整个主键（不能只依赖联合主键的一部分）；
- 第三范式：在 2NF 基础上，非主键列不传递依赖于主键（不能 A → B → C）。
- **反范式**：为了查询性能故意冗余（订单表里冗余用户名），代价是更新时要同步多处。实际业务常在 3NF 基础上适度反范式。

### 11. 视图是什么？

保存的查询语句，像虚拟表一样用。用途：简化复杂查询、权限控制（只暴露部分列）。普通视图不存数据；物化视图存结果，要刷新。

### 12. 子查询和 JOIN 哪个好？

现代优化器很多情况下会把子查询改写成 JOIN，性能差不多；**相关子查询**（子查询里引用外层的列，外层每一行都要执行一次）容易慢，能改成 JOIN 就改。可读性优先，有性能问题看执行计划。

### 13. `CHAR` 和 `VARCHAR`？

CHAR 定长，不足补空格；VARCHAR 变长。MySQL 里定长短字段（手机号、MD5）用 CHAR 有一点优势；PG 里没区别，统一用 `text` / `varchar`。

### 14. ★ 事务的 ACID 和隔离级别（基础版）

- 原子性（全做或全不做）、一致性（数据始终满足约束）、隔离性（并发事务互不干扰）、持久性（提交后不丢）。
- 并发问题：**脏读**（读到别人未提交的）、**不可重复读**（同一事务两次读同一行结果不同，因为别人改了并提交）、**幻读**（同一事务两次范围查询，行数不同，因为别人插入了）。
- 隔离级别：读未提交（都可能发生）→ 读已提交（防脏读，**PG 默认**）→ 可重复读（再防不可重复读，**MySQL 默认**）→ 可串行化（全防）。
- 深入见 07 文档第六节。

### 15. ★ 索引基础

- 索引是什么：帮助快速查找的数据结构（通常是 B+ 树），像书的目录；
- 优点：加速查询、排序、分组；缺点：占空间、**拖慢写入**（每次增删改都要维护索引）；
- 什么列适合建索引：WHERE / JOIN / ORDER BY 常用的列、区分度高的列；
- 什么情况不适合：区分度低（性别）、频繁更新、小表；
- 联合索引的最左前缀原则（MySQL）；
- 深入见 07 文档第四节。

### 16. ★ 手写 SQL 高频题

```sql
-- (1) 第二高的薪水（力扣 176），没有则返回 NULL
SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;

-- (2) 每个部门工资最高的前 3 名（每组 Top N），窗口函数
SELECT * FROM (
  SELECT d.name AS dept, e.name, e.salary,
         DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) AS rk
  FROM employee e JOIN dept d ON d.id = e.dept_id
) t WHERE rk <= 3;
-- ROW_NUMBER：1,2,3,4（同分也不同号）；RANK：1,1,3（跳号）；DENSE_RANK：1,1,2（不跳号）

-- (3) 查找重复的邮箱
SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;

-- (4) 删除重复行，只保留 id 最小的（PG）
DELETE FROM users a USING users b WHERE a.email = b.email AND a.id > b.id;

-- (5) 从没下过单的用户（反连接）
SELECT u.* FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- (6) 累计求和、环比
SELECT day, amount,
       SUM(amount) OVER (ORDER BY day) AS running_total,
       amount - LAG(amount) OVER (ORDER BY day) AS diff_vs_prev_day
FROM daily_sales;

-- (7) 连续登录 3 天以上的用户（gaps and islands：日期减去行号，连续的日期结果相同）
SELECT user_id, MIN(d) AS start_day, COUNT(*) AS days
FROM (
  SELECT user_id, d, d - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d))::int AS grp
  FROM (SELECT DISTINCT user_id, login_at::date AS d FROM logins) x
) t
GROUP BY user_id, grp HAVING COUNT(*) >= 3;

-- (8) 次日留存率
SELECT a.d, COUNT(DISTINCT b.user_id)::numeric / COUNT(DISTINCT a.user_id) AS retention
FROM (SELECT DISTINCT user_id, login_at::date d FROM logins) a
LEFT JOIN (SELECT DISTINCT user_id, login_at::date d FROM logins) b
  ON a.user_id = b.user_id AND b.d = a.d + 1
GROUP BY a.d;

-- (9) 行转列（条件聚合）
SELECT user_id,
       SUM(amount) FILTER (WHERE month = 1) AS jan,     -- MySQL 写 SUM(CASE WHEN month = 1 THEN amount END)
       SUM(amount) FILTER (WHERE month = 2) AS feb
FROM sales GROUP BY user_id;
```

---

## 六、PostgreSQL / Redis 基础类型速查

### PostgreSQL 常用数据类型

| 类别 | 类型 | 说明 |
| --- | --- | --- |
| 整数 | `smallint`（2 字节）、`integer`（4）、`bigint`（8） | 主键用 bigint |
| 自增 | `GENERATED ALWAYS AS IDENTITY`（推荐）、`serial` / `bigserial` | 底层是序列 |
| 精确小数 | `numeric(p, s)` / `decimal` | 金额 |
| 浮点 | `real`（4）、`double precision`（8） | 有精度误差 |
| 字符串 | `text`、`varchar(n)`、`char(n)` | 一般用 text |
| 布尔 | `boolean` | MySQL 是 `tinyint(1)` |
| 时间 | `timestamp`、`timestamptz`、`date`、`time`、`interval` | 我们用 naive timestamp（东八区） |
| JSON | `json`、`jsonb` | 用 jsonb |
| UUID | `uuid` | |
| 数组 | `integer[]`、`text[]` | MySQL 没有 |
| 二进制 | `bytea` | |
| 网络 | `inet`、`cidr` | |
| 范围 | `int4range`、`tstzrange` | |
| 全文检索 | `tsvector`、`tsquery` | |
| 向量 | `vector(n)`（pgvector 扩展） | |

### Redis 数据类型和常用命令

| 类型 | 常用命令 |
| --- | --- |
| String | `SET k v [EX 秒] [NX]`、`GET`、`INCR` / `INCRBY`、`MSET` / `MGET`、`SETNX`、`GETSET`、`STRLEN` |
| Hash | `HSET k f v`、`HGET`、`HMGET`、`HGETALL`（大 hash 慎用）、`HINCRBY`、`HDEL`、`HEXISTS`、`HSCAN` |
| List | `LPUSH` / `RPUSH`、`LPOP` / `RPOP`、`BLPOP`（阻塞）、`LRANGE k 0 -1`、`LLEN`、`LTRIM`（只保留一段） |
| Set | `SADD`、`SREM`、`SISMEMBER`、`SMEMBERS`（大集合慎用）、`SCARD`、`SINTER` / `SUNION` / `SDIFF`、`SRANDMEMBER` / `SPOP`（抽奖） |
| ZSet | `ZADD k score m`、`ZINCRBY`、`ZRANGE` / `ZREVRANGE ... WITHSCORES`、`ZRANGEBYSCORE`、`ZRANK`、`ZSCORE`、`ZREM`、`ZREMRANGEBYSCORE`、`ZCARD` |
| Bitmap | `SETBIT`、`GETBIT`、`BITCOUNT`、`BITOP` |
| HyperLogLog | `PFADD`、`PFCOUNT`、`PFMERGE` |
| Geo | `GEOADD`、`GEOSEARCH` |
| Stream | `XADD`、`XREAD`、`XGROUP`、`XREADGROUP`、`XACK`、`XPENDING` |
| 通用 | `EXPIRE` / `TTL`、`DEL` / `UNLINK`、`EXISTS`、`TYPE`、`SCAN`（不要用 `KEYS`）、`RENAME` |

---

## 七、操作系统基础

### 1. ★ 进程、线程、协程的区别？

| | 进程 | 线程 | 协程 |
| --- | --- | --- | --- |
| 是什么 | 资源分配的单位 | CPU 调度的单位 | 用户态的「轻量线程」 |
| 内存 | 独立地址空间 | 共享所在进程的内存 | 共享线程的内存 |
| 切换开销 | 大（切页表、刷缓存） | 中（内核态切换） | 小（用户态切换，不进内核） |
| 调度 | 操作系统 | 操作系统（抢占式） | 程序自己（协作式，在 IO 处让出） |
| 崩溃影响 | 不影响其他进程 | 一个线程崩溃可能拖垮整个进程 | 同线程 |
| 例子 | gunicorn 的多个 worker | Java 线程池 | Python 的 asyncio / gevent、Go 的 goroutine、Java 21 的虚拟线程 |

### 2. ★ 进程间通信（IPC）有哪些方式？

管道（匿名管道、命名管道）、消息队列、共享内存（最快，要自己同步）、信号量（同步用）、信号（`kill -9`、SIGTERM）、套接字（Socket，可以跨机器）。实际工程里更多用 Redis / MQ / 数据库这类外部系统。

### 3. 线程间同步方式？

互斥锁、读写锁、条件变量、信号量、原子操作（CAS）。

### 4. ★ 死锁的四个必要条件？怎么预防？

1. 互斥（资源一次只能被一个占用）；2. 持有并等待（拿着一个等另一个）；3. 不可剥夺；4. 循环等待。

预防：破坏其中一个，最常用的是**破坏循环等待：所有人按相同顺序加锁**；或者加锁设超时（`tryLock`）。数据库死锁也是同样的道理。

### 5. 进程的几种状态？

新建 → 就绪 → 运行 → 阻塞（等 IO）→ 就绪 …… → 终止。还有僵尸进程（子进程退出了，父进程没调用 `wait` 回收）和孤儿进程（父进程先退出，被 init 收养）。

### 6. ★ 用户态和内核态？

CPU 的两种权限级别。用户程序在用户态运行，访问硬件、文件、网络时要通过**系统调用**切到内核态，由内核执行后再返回。切换有开销，所以「减少系统调用次数」是常见的优化方向（批量读写、零拷贝）。

### 7. ★ 虚拟内存是什么？为什么需要？

每个进程都以为自己独占一块完整连续的内存（虚拟地址），由操作系统和 CPU 的 MMU 通过**页表**映射到物理内存。好处：进程之间隔离；可以使用比物理内存更大的空间（不常用的页换到磁盘 swap）；共享内存和写时复制（fork）都基于它。内存按**页**（通常 4KB）管理，访问的页不在物理内存里就触发**缺页中断**。

### 8. ★ 五种 IO 模型？

1. **阻塞 IO**：调用后一直等到数据就绪并拷贝完成；
2. **非阻塞 IO**：数据没就绪立即返回，要不断轮询；
3. **IO 多路复用**：一个线程用 `select` / `poll` / `epoll` 同时监听多个连接，哪个就绪处理哪个（**Redis、Nginx、Node.js、gevent、asyncio 都基于它**）；
4. 信号驱动 IO；
5. **异步 IO**：发起后直接返回，内核把数据拷贝完再通知（Linux 的 io_uring）。

前四种都属于「同步 IO」（数据从内核拷到用户空间这一步要自己等）。

### 9. ★ select、poll、epoll 的区别？

| | select | poll | epoll |
| --- | --- | --- | --- |
| 连接数上限 | 1024（FD_SETSIZE） | 无 | 无 |
| 每次调用 | 把所有 fd 从用户态拷到内核 | 同 | fd 只在注册时拷一次 |
| 找就绪的 fd | 遍历全部，O(n) | 遍历全部，O(n) | 内核回调把就绪的放进就绪列表，O(就绪数) |
| 适合 | 少量连接 | 少量连接 | **大量连接、少量活跃**（C10K） |
epoll 两种触发模式：**水平触发 LT**（只要还有数据就一直通知，默认，编程简单）、**边缘触发 ET**（只在状态变化时通知一次，要一次读完，效率更高）。macOS 上对应的是 kqueue。

### 10. ★ 零拷贝是什么？

传统「读文件发网络」要 4 次拷贝（磁盘 → 内核缓冲 → 用户缓冲 → socket 缓冲 → 网卡）和 4 次用户态 / 内核态切换。零拷贝（`sendfile`、`mmap`）让数据不经过用户空间，直接在内核里从文件缓冲送到网卡。Kafka、Nginx 发静态文件都用它。

### 11. 页缓存（Page Cache）？

操作系统把读过的文件内容缓存在内存里，下次读直接命中；写入先写页缓存，后台再刷盘（所以需要 `fsync` 保证落盘）。PG 依赖它做第二层缓存，Kafka 依赖它实现高吞吐。

### 12. 常见调度算法？

先来先服务、短作业优先、时间片轮转、优先级调度、多级反馈队列。Linux 的 CFS（完全公平调度器）用红黑树按虚拟运行时间排序。

---

## 八、计算机网络基础

> 这里是浓缩版，完整的三档 75 题见 [11-计算机网络.md](/posts/interview/11-computer-networks.md)。

### 1. ★ OSI 七层和 TCP/IP 四层？

| OSI 七层 | TCP/IP 四层 | 协议举例 |
| --- | --- | --- |
| 应用层、表示层、会话层 | 应用层 | HTTP、HTTPS、DNS、SSH、FTP、SMTP、WebSocket |
| 传输层 | 传输层 | TCP、UDP |
| 网络层 | 网络层 | IP、ICMP（ping）、ARP（有的归到链路层） |
| 数据链路层、物理层 | 网络接口层 | 以太网、Wi-Fi |

### 2. ★ TCP 和 UDP 的区别？

| | TCP | UDP |
| --- | --- | --- |
| 连接 | 面向连接（三次握手） | 无连接 |
| 可靠性 | 可靠：不丢、不重、有序 | 不保证 |
| 传输方式 | 字节流（没有消息边界，会「粘包」） | 数据报（有边界） |
| 速度 / 开销 | 慢一些，头部 20 字节起 | 快，头部 8 字节 |
| 拥塞控制 | 有 | 无 |
| 应用 | HTTP（1.1 / 2）、数据库连接、SSH | DNS、视频直播、游戏、HTTP/3（QUIC 在 UDP 上自己实现可靠性） |

### 3. ★ 三次握手的过程？为什么是三次不是两次？

1. 客户端发 `SYN`（seq = x），进入 SYN_SENT；
2. 服务端回 `SYN + ACK`（seq = y，ack = x + 1），进入 SYN_RCVD；
3. 客户端发 `ACK`（ack = y + 1），双方进入 ESTABLISHED。

为什么三次：

- 双方都要确认「自己能发、对方能收」以及对方的初始序列号；
- 防止**历史连接**：网络里滞留的旧 SYN 到达服务端时，如果两次握手服务端就直接建立连接了，浪费资源；三次握手时客户端会发现这不是自己想要的连接，回 RST。
- **SYN 洪水攻击**：攻击者只发 SYN 不回 ACK，把服务端的半连接队列占满。防护：SYN Cookie。

### 4. ★ 四次挥手的过程？为什么是四次？

1. 主动方发 `FIN`，进入 FIN_WAIT_1；
2. 被动方回 `ACK`，进入 CLOSE_WAIT（主动方进入 FIN_WAIT_2）—— 此时被动方还可以继续发数据；
3. 被动方发完数据后发 `FIN`，进入 LAST_ACK；
4. 主动方回 `ACK`，进入 **TIME_WAIT**，等 2MSL 后关闭。

为什么四次：TCP 是全双工的，两个方向要分别关闭；被动方收到 FIN 时可能还有数据没发完，所以 ACK 和 FIN 分两次发。

- **TIME_WAIT 为什么等 2MSL**：保证最后一个 ACK 能到达（丢了对方会重发 FIN）；让本连接的旧报文在网络里消失，不干扰后续用同样端口的新连接。
- **大量 CLOSE_WAIT**：通常是**程序没有调用 close**（连接泄漏），是代码 bug。

### 5. ★ TCP 怎么保证可靠传输？

- **序列号 + 确认应答**：每个字节有序号，接收方回 ACK；
- **超时重传**：没收到 ACK 就重发；**快速重传**：连续收到 3 个重复 ACK 就立刻重传；
- **校验和**：检查数据损坏；
- **流量控制**：接收方通过**滑动窗口**告诉发送方自己还能收多少，防止把接收方撑爆；
- **拥塞控制**：防止把网络撑爆。四个算法：**慢启动**（拥塞窗口从小开始指数增长）→ 到阈值后**拥塞避免**（线性增长）→ 丢包时**快重传 + 快恢复**（窗口减半而不是归零）。
- 流量控制和拥塞控制的区别：前者照顾接收方，后者照顾整个网络。

### 6. ★ 什么是粘包？怎么解决？

TCP 是字节流，没有消息边界，发送方发的两条消息接收方可能一次读到（粘在一起），也可能一条分两次读到。解决：应用层自己定义边界 —— 固定长度、特殊分隔符（SSE 用空行 `\n\n` 分隔事件）、**消息头带长度**（最常用）。UDP 没有这个问题。

### 7. ★ DNS 解析过程？

浏览器缓存 → 操作系统缓存（hosts 文件）→ 本地 DNS 服务器（运营商）→ 根域名服务器 → 顶级域名服务器（.com）→ 权威域名服务器 → 返回 IP，逐级缓存。DNS 主要用 UDP（53 端口），响应太大或区域传输时用 TCP。

### 8. ★ HTTP 请求和响应的结构？

请求：请求行（方法 URL 版本）+ 请求头 + 空行 + 请求体。响应：状态行（版本 状态码 原因）+ 响应头 + 空行 + 响应体。常用头：`Host`、`Content-Type`、`Content-Length`、`Authorization`、`Cookie` / `Set-Cookie`、`Cache-Control`、`User-Agent`。

### 9. ★ HTTP 缓存：强缓存和协商缓存？

- **强缓存**：`Cache-Control: max-age=3600`（或老的 `Expires`），有效期内浏览器直接用本地缓存，不发请求；
- **协商缓存**：过期后带上 `If-None-Match: <ETag>` 或 `If-Modified-Since` 问服务端，没变就返回 **304**（不带内容），变了返回 200 和新内容。

### 10. ★ Cookie 和 Session 的区别？

Cookie 存在浏览器，每次请求自动带上，有大小限制（约 4KB）；Session 存在服务端，浏览器的 Cookie 里只存 session id。多副本部署时 Session 要放 Redis 共享（或者用 JWT 这种无状态令牌）。

### 11. ★ HTTP 和 HTTPS 的区别？

HTTPS = HTTP + TLS：加密（防窃听）、完整性校验（防篡改）、证书身份验证（防冒充）。默认端口 80 / 443。TLS 握手用**非对称加密**协商出会话密钥，之后用**对称加密**传输数据（对称加密快）。

### 12. 对称加密和非对称加密？

对称：加解密同一个密钥（AES），快，问题是密钥怎么安全地交给对方；非对称：公钥加密、私钥解密（RSA、ECC），慢，用来交换对称密钥和做数字签名。

### 13. ★ 从输入 URL 到页面显示

DNS 解析 → TCP 三次握手 → TLS 握手 → 发送 HTTP 请求 → 服务端处理（负载均衡 → 应用 → 数据库）→ 返回响应 → 浏览器解析 HTML / CSS / JS、渲染 → 连接复用或四次挥手。（每一步都可以展开，面试官会挑一个追问）

### 14. ping 用的什么协议？

ICMP，网络层协议，没有端口。

---

## 九、编码与数值

1. **★ ASCII、Unicode、UTF-8 的关系？** ASCII 只有 128 个字符（英文）；Unicode 给全世界每个字符分配一个编号（码点）；UTF-8 是 Unicode 的一种**存储方式**：变长 1–4 字节，英文 1 字节（兼容 ASCII）、中文通常 3 字节、emoji 4 字节。MySQL 的 `utf8` 只支持 3 字节，存 emoji 要用 `utf8mb4`。
2. **大端和小端？** 多字节数据在内存里的存储顺序：大端高位字节在低地址（网络字节序），小端低位字节在低地址（x86、ARM 默认）。
3. **原码、反码、补码？** 计算机用补码存储有符号整数：正数补码等于原码；负数是反码 + 1。好处是加减法统一用加法电路，0 只有一种表示。
4. **常用位运算？** `x & 1` 判断奇偶；`x & (x - 1)` 去掉最低位的 1（判断 2 的幂：`x > 0 and x & (x - 1) == 0`）；`a ^ a == 0`、`a ^ 0 == a`（找只出现一次的数）；`<<` / `>>` 乘除 2 的幂。
5. **Base64 是加密吗？** 不是，是**编码**：把二进制转成可打印字符（每 3 字节变 4 个字符，体积增大约 1/3），任何人都能解码。JWT 的 payload 就只是 Base64，所以不能放敏感信息。
6. **哈希和加密的区别？** 哈希单向不可逆（MD5、SHA-256，用于校验、签名、存密码要加盐用慢哈希）；加密可以用密钥解密还原。

---

## 十、高频考点自查清单

> 每条能脱口而出 30 秒的回答就打勾。

**Python**

基础内容和自查清单见 [21-Python基础.md](/posts/interview/21-python-basics.md)；分级题见 [02-后端八股.md](/posts/interview/02-backend-fundamentals.md)，内存与执行原理见 [20](/posts/interview/20-python-memory-runtime.md)。

**数据结构与算法**

- [ ] 数组 vs 链表
- [ ] 哈希表原理和冲突解决
- [ ] 为什么数据库用 B+ 树
- [ ] 为什么 Redis ZSet 用跳表
- [ ] 堆和 Top K
- [ ] 排序算法的复杂度和稳定性，快排原理
- [ ] 手撕：LRU、反转链表、Top K、两数之和、有效括号、二分查找

**SQL / 数据库**

- [ ] SELECT 执行顺序
- [ ] 各种 JOIN、WHERE vs HAVING
- [ ] NULL 和 NOT IN 的坑
- [ ] DELETE / TRUNCATE / DROP
- [ ] 三大范式
- [ ] ACID、四种隔离级别、脏读 / 不可重复读 / 幻读
- [ ] 索引原理、最左前缀、索引失效
- [ ] 手写：每组 Top N、连续登录、去重

**操作系统**

- [ ] 进程 / 线程 / 协程
- [ ] 死锁四条件
- [ ] 用户态 / 内核态
- [ ] 虚拟内存
- [ ] IO 多路复用，select / poll / epoll
- [ ] 零拷贝

**网络**

- [ ] TCP vs UDP
- [ ] 三次握手、四次挥手、TIME_WAIT
- [ ] TCP 可靠传输、流量控制、拥塞控制
- [ ] HTTP 状态码、方法、缓存
- [ ] HTTPS 握手
- [ ] HTTP/1.1 vs 2 vs 3
- [ ] 输入 URL 到页面显示

**Redis（详见 08）**

- [ ] 五种数据类型及底层结构
- [ ] 为什么快、单线程模型
- [ ] RDB vs AOF
- [ ] 过期删除 + 内存淘汰
- [ ] 缓存穿透 / 击穿 / 雪崩
- [ ] 分布式锁
- [ ] 主从 / 哨兵 / 集群
