"""只读核对本轮写到的关键项目事实，不启动应用、不读取 .env。"""
import ast
import json
import re
import subprocess
from pathlib import Path
import yaml
ROOT = Path(__file__).resolve().parents[2]
AI = ROOT/'xknow-ai'
def read(path):
    return (AI/path).read_text()
compose = yaml.safe_load(read('docker-compose/docker-compose-prd.yaml'))['services']
for name in ['backend','console','gateway']:
    assert compose[name]['stop_grace_period']=='120s'
    assert compose[name]['deploy']['update_config']['order']=='start-first'
assert compose['worker']['stop_grace_period']=='3900s'
assert compose['worker']['deploy']['update_config']['order']=='start-first'
assert compose['beat']['stop_grace_period']=='30s'
assert compose['beat']['deploy']['update_config']['order']=='stop-first'
assert compose['beat']['deploy']['replicas']==1
assert 'SYS_ADMIN' in compose['backend']['cap_add']
assert 'SYS_ADMIN' in compose['worker']['cap_add']
entry = read('docker/entrypoint.sh')
assert 'APP_SCOPE=console flask db upgrade' in entry
assert 'exec celery' in entry and 'exec gunicorn' in entry
assert 'celery,ontology_doc,ontology_chat,scheduled,bench' in entry
assert 'PLATFORMS="linux/amd64,linux/arm64"' in read('docker/build.sh')
assert 'engine.dispose(close=False)' in read('app/gunicorn_conf.py')
assert '_DRAIN_WAIT = int(os.getenv("BACKEND_DRAIN_WAIT", "15"))' in read('app/gunicorn_conf.py')
vector = read('app/extended/ext_vector.py')
assert 'models.FusionQuery(fusion=models.Fusion.RRF)' in vector
assert 'model_name="Qdrant/bm25"' in vector
assert '_RRF_K = 60' in read('app/core/graph/graph_store.py')
assert 'read_scope.filter_documents' in read('app/core/agent/tools/vector_tools.py')
reg = read('app/core/agent/tools/__init__.py')
assert len(re.findall(r'^\s+restricted_to_agent="ariadne",', reg, re.M)) == 3
spec = ast.parse(read('app/core/agent/agent_spec.py'))
skeleton = next(n.value for n in spec.body if isinstance(n,ast.AnnAssign) and isinstance(n.target,ast.Name) and n.target.id=='AGENT_SKELETONS')
assert {'vesper','ariadne','cooker','doppel'} <= {ast.literal_eval(k) for k in skeleton.keys}
assert 'backend_for(self.spec.protocol)' in read('app/core/llm/client.py')
assert 'organization > user > global' in read('app/core/agent/tools/skill_tools.py')
assert '_SHUTDOWN_DEADLINE_SECONDS = 3600' in read('app/extended/ext_celery.py')
assert 'time_limit=3600' in read('app/worker/tasks/scheduled_task_task.py')
bench=ast.parse(read('app/worker/tasks/agent_bench_task.py'))
fn=next(n for n in bench.body if isinstance(n,ast.FunctionDef) and n.name=='run_agent_bench')
kw={k.arg:k.value for k in fn.decorator_list[0].keywords}
assert ast.literal_eval(kw['acks_late']) is False and ast.literal_eval(kw['queue'])=='bench'
for repo,versions in [('xknow-frontend',{'next':'15.3.6','react':'19.1.0'}),
                      ('xknow-console',{'next':'16.2.9','react':'19.2.7'}),
                      ('xknow-gateway',{'next':'16.2.9','react':'19.2.7'})]:
    deps=json.loads((ROOT/repo/'package.json').read_text())['dependencies']
    assert all(deps[k]==v for k,v in versions.items())
    assert 'rewrites' in (ROOT/repo/'next.config.ts').read_text()
server=(ROOT/'xknow-payment/src/server.js').read_text()
assert server.index('mountNotifyRoute(app, config, wechatPay)') < server.index('app.use(express.json')
assert 'express.raw' in (ROOT/'xknow-payment/src/routes/api.js').read_text()
subprocess.run(['bash','-n',str(AI/'docker/entrypoint.sh')],check=True)
subprocess.run(['bash','-n',str(AI/'docker/build.sh')],check=True)
print('关键源码/版本/部署配置与 bash 语法核对通过（只读）')
