"""仅连接本机临时 Qdrant 集合和本机 Neo4j 回滚事务，不加载项目配置。"""
import json
import subprocess
import uuid
from collections import defaultdict
from qdrant_client import QdrantClient, models
from neo4j import GraphDatabase

def rrf(branches, k=60):
    if k < 0:
        raise ValueError('k 不能为负')
    scores = defaultdict(float)
    for branch in branches:
        seen = set()
        for rank, pid in enumerate(branch, 1):
            if pid in seen:
                continue
            seen.add(pid)
            scores[pid] += 1 / (k + rank)
    return sorted(scores.items(), key=lambda p: (-p[1], str(p[0])))
assert rrf([['a', 'b'], ['b', 'c']])[0][0] == 'b'
assert abs(dict(rrf([['a'], ['a']]))['a'] - 2 / 61) < 1e-12
assert rrf([]) == []
assert dict(rrf([['a', 'a']]))['a'] == 1 / 61

collection = 'interview_verify_' + uuid.uuid4().hex
q = QdrantClient(url='http://127.0.0.1:6333', timeout=10, check_compatibility=False)
created = False
try:
    q.create_collection(collection,
        vectors_config={'dense': models.VectorParams(size=2, distance=models.Distance.COSINE)},
        sparse_vectors_config={'sparse': models.SparseVectorParams()})
    created = True
    q.upsert(collection, points=[
        models.PointStruct(id=1, vector={'dense': [1., 0.], 'sparse': models.SparseVector(indices=[1], values=[2.])}, payload={'tenant': 'a'}),
        models.PointStruct(id=2, vector={'dense': [1., 0.], 'sparse': models.SparseVector(indices=[1], values=[3.])}, payload={'tenant': 'b'}),
        models.PointStruct(id=3, vector={'dense': [0., 1.], 'sparse': models.SparseVector(indices=[2], values=[1.])}, payload={'tenant': 'a'}),
    ], wait=True)
    f = models.Filter(must=[models.FieldCondition(key='tenant', match=models.MatchValue(value='a'))])
    result = q.query_points(collection, prefetch=[
        models.Prefetch(query=[1., 0.], using='dense', filter=f, limit=3),
        models.Prefetch(query=models.SparseVector(indices=[1], values=[1.]), using='sparse', filter=f, limit=3),
    ], query=models.FusionQuery(fusion=models.Fusion.RRF), limit=3).points
    assert result[0].id == 1 and all(p.payload['tenant'] == 'a' for p in result)
    assert q.count(collection, exact=True).count == 3
finally:
    if created:
        q.delete_collection(collection)
    q.close()

# 仅从指定本机容器配置读取认证，绝不打印凭证、不读取项目 .env。
container = json.loads(subprocess.check_output(['docker', 'inspect', 'neo4j']))[0]
env = dict(x.split('=', 1) for x in container['Config']['Env'] if '=' in x)
auth = env.get('NEO4J_AUTH', '')
if '/' not in auth:
    raise RuntimeError('本机 neo4j 未提供可用 NEO4J_AUTH；需本机认证后重跑')
user, password = auth.split('/', 1)
tag = uuid.uuid4().hex
with GraphDatabase.driver('bolt://127.0.0.1:7687', auth=(user, password), connection_timeout=10) as driver:
    with driver.session(database='neo4j') as session:
        tx = session.begin_transaction(timeout=10)
        try:
            query = '''MERGE (a:InterviewVerify {id: $aid}) SET a.tag=$tag, a.name=$name
                       MERGE (b:InterviewVerify {id: $bid}) SET b.tag=$tag
                       MERGE (a)-[r:INTERVIEW_LINK]->(b) SET r.tag=$tag
                       RETURN a.name AS name'''
            args = dict(aid=tag+'a', bid=tag+'b', tag=tag, name='面试练习')
            assert tx.run(query, **args).single()['name'] == '面试练习'
            tx.run(query, **args).consume()  # 同事务重试不新增第二份
            row = tx.run('MATCH (a:InterviewVerify {tag:$tag})-[r:INTERVIEW_LINK]->(b:InterviewVerify {tag:$tag}) RETURN count(r) AS n', tag=tag).single()
            assert row['n'] == 1
            assert tx.run('UNWIND $xs AS x RETURN sum(x) AS n', xs=[1,2,3]).single()['n'] == 6
        finally:
            tx.rollback()
        assert session.run('MATCH (a:InterviewVerify {tag:$tag}) RETURN count(a) AS n', tag=tag).single()['n'] == 0
print('16 自检通过：RRF / 本机 Qdrant 混合过滤 / 本机 Neo4j MERGE、UNWIND 与回滚')
