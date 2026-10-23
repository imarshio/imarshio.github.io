"""直接提取文档中的完整自检与 SQL；仅操作本机 postgres15 的回滚事务。"""
import ast
import json
import re
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def blocks(name, language):
    return re.findall(r'^```'+language+r'\n(.*?)^```', (ROOT/name).read_text(), re.M|re.S)
for name in ['10-基础打底.md', '13-数据结构与算法.md']:
    codes = [b for b in blocks(name, 'python') if '__main__' in b and 'assert' in b]
    assert len(codes) == 1, (name, len(codes))
    with tempfile.TemporaryDirectory(prefix='interview_verify_') as directory:
        path = Path(directory)/'check.py'
        path.write_text(codes[0])
        run = subprocess.run([sys.executable, '-I', str(path)], text=True, capture_output=True, timeout=30)
        assert run.returncode == 0, run.stderr
        print(name, run.stdout.strip())

# 15 的省略上下文片段只做语法解析；可执行语义另在 verify_15.py 验证。
codes = blocks('15-SQLAlchemy与Celery.md','python')
for i, code in enumerate(codes,1):
    ast.parse(code, filename=f'15-block-{i}')
print('15 Python 片段语法解析通过：', len(codes))

def pg_rollback(sql):
    schema = 'interview_verify_' + uuid.uuid4().hex
    full = f'BEGIN; CREATE SCHEMA {schema}; SET LOCAL search_path={schema};\n'+sql+'\nROLLBACK;\n'
    run = subprocess.run(['docker','exec','-i','postgres15','psql','-U','xknow','-d','xknow',
                          '-v','ON_ERROR_STOP=1','-X','-q','-A','-t'],
                         input=full, text=True, capture_output=True, timeout=30)
    assert run.returncode == 0, run.stderr
    return run.stdout.strip().splitlines()

text14 = (ROOT/'14-SQL与MySQL.md').read_text().split('## SQL 高难',1)[1].split('# 第二部分',1)[0]
bs = re.findall(r'^```sql\n(.*?)^```',text14,re.S|re.M)
assert len(bs)==15
fixture=bs[-1]
# 10 的题干假设已有表，这里复用 14 的 fixture，再补 users/sales。
fixture10 = fixture + """
CREATE TABLE users(id int, email text);
INSERT INTO users VALUES (1,'a'),(2,'a'),(3,'b'),(4,'c');
CREATE TABLE sales(user_id int, month int, amount int);
INSERT INTO sales VALUES (1,1,10),(1,2,20),(2,1,5);
"""
sql10 = blocks('10-基础打底.md','sql')
assert len(sql10) == 1
statements10=[q.strip() for q in re.sub(r'--[^\n]*','',sql10[0]).split(';') if q.strip()]
wrapped10=[]
for q in statements10:
    if q.startswith('DELETE'):
        wrapped10.append(q+';')
    else:
        wrapped10.append("SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM ("+q+") t;")
r10=[json.loads(l) for l in pg_rollback(fixture10+'\n'+'\n'.join(wrapped10))]
assert len(r10)==8
assert r10[0]==[{'second_highest':200}]
assert len(r10[1])==5
assert r10[2]==[{'email':'a'}]
assert sorted(r['id'] for r in r10[3])==[3,4]
assert [r['running_total'] for r in r10[4]]==[10,25,30]
assert r10[5][0]['days']==3
assert sorted(float(r['retention']) for r in r10[6])==[0.,0.5,1.]
assert sorted((r['user_id'],r['jan'],r['feb']) for r in r10[7])==[(1,10,20),(2,5,None)]
print('10 SQL 9 条语句在回滚事务执行及结果断言通过')

queries=[]
for question, block in enumerate(bs[:12],1):
    no_comments = re.sub(r'--[^\n]*','',block)
    for statement in no_comments.split(';'):
        if statement.strip():
            queries.append((question,statement.strip()))
run_sql = fixture + '\n' + '\n'.join(
    "SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM ("+q+") t;" for _,q in queries)
result=[json.loads(l) for l in pg_rollback(run_sql)]
assert len(result)==13
# 对每题结果做语义断言，不只看执行无异常。
assert result[0] == [{'nth':200}]
assert [(r['user_id'],r['days']) for r in result[1]] == [(1,3)]
assert [float(r['retention']) for r in result[2]] == [0.5,1.0,0.0]
assert [r['running_total'] for r in result[3]] == [10,25,30]
assert list(result[4][0].values()) == [200]
assert list(result[5][0].values()) == [200]
assert sorted(r['events'] for r in result[6]) == [1,1,2]
assert result[7] == [{'viewed':3,'carted':2,'ordered':1}]
assert sorted(r['order_id'] for r in result[8]) == [2,3]
assert result[9] == [{'gap_start':3,'gap_end':4},{'gap_start':7,'gap_end':8}]
assert result[10] == [{'follower':1,'followee':2},{'follower':3,'followee':4}]
assert sorted((r['dept'],r['salary']) for r in result[11]) == [('A',200),('A',200),('B',300)]
assert len(result[12])==13 and result[12][-1]['yoy']==0
assert result[12][0]['mom'] is None and all(r['mom']==0 for r in result[12][1:])
# 偶数样本中位数应取中间两行平均，验证通用写法没有漏掉一行。
median_sql = fixture + '\nDELETE FROM employee WHERE id=5;\n'
median_sql += '\n'.join("SELECT jsonb_agg(t) FROM ("+q+") t;" for number,q in queries if number==5)
medians=[json.loads(l) for l in pg_rollback(median_sql)]
assert all(list(r[0].values()) == [150] for r in medians)
print('14 高难 12 题 / 13 条查询执行及结果断言通过')

# 同一事务中执行两次，断言库存/版本的原子条件更新；不冒充多连接并发压测。
extra = """
CREATE TABLE stock(id int primary key, n int); INSERT INTO stock VALUES (1,1);
PREPARE take_stock(int) AS UPDATE stock SET n=n-1 WHERE id=$1 AND n>0 RETURNING n;
EXECUTE take_stock(1); EXECUTE take_stock(1);
CREATE TABLE cards(id int primary key, title text, version int);
INSERT INTO cards VALUES (1,'old',1);
PREPARE edit_card(text,int,int) AS UPDATE cards SET title=$1,version=version+1 WHERE id=$2 AND version=$3;
EXECUTE edit_card('new',1,1); EXECUTE edit_card('stale',1,1);
SELECT title,version FROM cards WHERE id=1;
"""
assert pg_rollback(extra)==['0','new|2']
print('14 高难 13/14 的库存与版本条件更新通过')
