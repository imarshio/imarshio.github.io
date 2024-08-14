---
icon: pen-to-square
order: 4
category:
  - MySQL
title: MySQL Join 
---

## JOIN

[官方文档](https://dev.mysql.com/doc/refman/8.4/en/join.html)

在使用 `JOIN` 的时候，很多时候对 `RIGHT`、`LEFT`、`INNER`...之后的结果不是很确定，以及发现官方还提供了很多其他的使用方式以及关键字，遂写此文章以作总结。

### `join` 姿势

根据官方文档的描述，`join` 有以下用法

```sql
joined_table: {
    table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
  | table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
  | table_reference NATURAL [INNER | {LEFT|RIGHT} [OUTER]] JOIN table_factor
}
```

其中

- `|`：
- `[]`：
- `{}`：
- `table_factor`：
- `table_reference`：
- `join_specification`：

### `join` 规范

- A table reference can be aliased using tbl_name AS alias_name or tbl_name alias_name
- A table_subquery is also known as a derived table or subquery in the FROM clause.Such subqueries must include an alias to give the subquery result a table name.
- The maximum number of tables that can be referenced in a single join is 61
- INNER JOIN and , (comma) are semantically equivalent in the absence of a join condition: both produce a Cartesian product between the specified tables
- The search_condition used with ON is any conditional expression of the form that can be used in a WHERE clause. Generally, the ON clause serves for conditions that specify how to join tables, and the WHERE clause restricts which rows to include in the result set.
- If there is no matching row for the right table in the ON or USING part in a LEFT JOIN, a row with all columns set to NULL is used for the right table. You can use this fact to find rows in a table that have no counterpart in another table
- 更多请查看[官方文档](https://dev.mysql.com/doc/refman/8.4/en/join.html)

## FULL

## NATURE

## INNER

## OUTER

## LEFT

- `LEFT JOIN` 会不会引起笛卡尔积 ？
- `LEFT JOIN` 的结果数量是取决于左表还是右表 or 其他 ？
- 是否存在 多对多 ？

### 定义 or 解释

我分别从国内和国外找到了两个比较出名的网站，that 对 `LEFT JOIN` 进行了教学性解读并给出了案例。

- [菜鸟教程](https://www.runoob.com/sql/sql-join-left.html)
- [W3Schools](https://www.w3schools.com/mysql/mysql_join_left.asp)

他们的解释基本上是一致的，甚至是图都基本一致。但是我觉得他们写的并不是很完善，并不能解释所有的情况，也可能是因为我对 SQL 规范的了解不深，有信息差。

> The `LEFT JOIN` keyword returns all records from the left table (table1), and the matching records (if any) from the right table (table2).
>
> 补充：if right table (table2) have no match, then return null.

对于他们的解释，我最初的理解是，左表和右表的关系是 (一对一 或 一对空) 且 左表的数据只会出现一次。

但实际上，左表和右表的关系也可能是 一对多，但不会是 多对多

### 细节点

- `LEFT JOIN` 时 `JOIN` 的级别是 行，即进行笛卡尔积时，是 $left_table.Length * right_table.Length$

### 一对一 或 一对空

#### Case 1 一对一、一对空

表A

| id   | name |
| ---- | ---- |
| 1    | a    |
| 2    | b    |
| 3    | c    |

表B

| a_id | age  |
| ---- | ---- |
| 1    | 10   |
| 2    | 20   |

#### Case 2 一对多

### 一对多

### 源码探究

## RIGHT

## INNER

## INNER

## CROSS

流程，对两张表的数据进行笛卡尔积运算。

类似 `LEFT JOIN`,但是可以不加 `ON`。

### 定义

### Case

> In MySQL, JOIN, CROSS JOIN, and INNER JOIN are syntactic equivalents (they can replace each other). In standard SQL, they are not equivalent. INNER JOIN is used with an ON clause, CROSS JOIN is used otherwise.
> 在 `MySQL` 中，`JOIN`, `CROSS JOIN`, and `INNER JOIN` 是语法相等的，可以互相替换，在标准SQL语法中，他们是不相等的。

具体场景：[Students and Examinations](https://leetcode.com/problems/students-and-examinations/?envType=study-plan-v2&envId=top-sql-50)

这个其实很简单，从结果可以看出是`Students`,`Subjects`进行[笛卡尔积](https://en.wikipedia.org/wiki/Cartesian_product)之后，在与`Examinations`分组求和之后的结果进行左连接。

实现其实也是这样实现的

```sql
select t1.student_id,
       t1.student_name,
       t1.subject_name,
       if(attended_exams is null, 0, attended_exams) attended_exams
from (select s1.student_id, student_name, s2.subject_name
      from Students s1,
           Subjects s2
      order by student_id, student_name, subject_name) t1
         left join (select student_id, subject_name, count(*) attended_exams
                    from Examinations
                    group by student_id, subject_name) t2
                   on t1.student_id = t2.student_id and t1.subject_name = t2.subject_name
order by t1.student_id, student_name, subject_name;
```

但是，上面这种写法看起来很臃肿，所以思考一下如何进行优化呢？

优化如下

- `Students` 和 `Subjects` 避免使用子查询，因为他们只是简单的进行了笛卡尔积，可以使用 `? JOIN` 来替换，所以需要知道哪个 `JOIN` 的功能与笛卡尔积一样

```sql
select s1.student_id,
       s1.student_name,
       s2.subject_name,
       if(attended_exams is null, 0, attended_exams) attended_exams
from Students s1
         cross join Subjects s2
         left join (select student_id, subject_name, count(*) attended_exams
                    from Examinations
                    group by student_id, subject_name) t2
                   on s1.student_id = t2.student_id and s2.subject_name = t2.subject_name
order by s1.student_id, student_name, subject_name;
```

### 数据准备

```sql
CREATE TABLE Students
(
    student_id   INT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL
);
CREATE TABLE Subjects
(
    subject_name VARCHAR(255) PRIMARY KEY
);
CREATE TABLE Examinations
(
    student_id   INT,
    subject_name VARCHAR(255),
);
INSERT INTO Students (student_id, student_name)
VALUES (1, 'Alice'),
       (2, 'Bob'),
       (13, 'John'),
       (6, 'Alex');
INSERT INTO Subjects (subject_name)
VALUES ('Math'),
       ('Physics'),
       ('Programming');
INSERT INTO Examinations (student_id, subject_name)
VALUES (1, 'Math'),
       (1, 'Physics'),
       (1, 'Programming'),
       (2, 'Programming'),
       (13, 'Math'),
       (13, 'Programming'),
       (13, 'Physics'),
       (2, 'Math');
```
