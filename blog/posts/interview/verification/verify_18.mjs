import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// 一次运行内只接受更新序号，终态不被进度事件回退。
function reduceRun(state, event) {
  if (event.run !== state.run || event.seq <= state.seq) return state;
  if (['completed', 'failed', 'cancelled'].includes(state.status)) return state;
  return { ...state, seq: event.seq, status: event.status ?? state.status,
    text: state.text + (event.delta ?? '') };
}
const initial = {run:'a', seq:0, status:'streaming', text:''};
const next = reduceRun(initial, {run:'a', seq:1, delta:'你好'});
assert.equal(initial.text, '');
assert.equal(next.text, '你好');
assert.equal(reduceRun(next, {run:'b', seq:2, delta:'错会话'}), next);
assert.equal(reduceRun(next, {run:'a', seq:1, delta:'重复'}), next);
const done = reduceRun(next, {run:'a', seq:2, status:'completed'});
assert.equal(reduceRun(done, {run:'a', seq:3, status:'streaming'}), done);

// 把每个字节都分成一块，验证跨中文字符的增量解码。
const bytes = new TextEncoder().encode('data: 你好\n\ndata: 完成\n\n');
const decoder = new TextDecoder('utf-8', {fatal:true});
let decoded = '';
for (const byte of bytes) decoded += decoder.decode(new Uint8Array([byte]), {stream:true});
decoded += decoder.decode();
assert.equal(decoded, 'data: 你好\n\ndata: 完成\n\n');
// 此处只验证 UTF-8 解码，不把它当完整 SSE parser（还需字段、多行、CRLF 等）。

const source = `console.log('sync');process.nextTick(()=>console.log('tick'));Promise.resolve().then(()=>console.log('promise'));setImmediate(()=>console.log('immediate'));setTimeout(()=>console.log('timer'),0);`;
const cjs = spawnSync(process.execPath, ['--input-type=commonjs', '-e', source], {encoding:'utf8'});
const esm = spawnSync(process.execPath, ['--input-type=module', '-e', source], {encoding:'utf8'});
assert.equal(cjs.status, 0, cjs.stderr);
assert.equal(esm.status, 0, esm.stderr);
const c = cjs.stdout.trim().split('\n'), m = esm.stdout.trim().split('\n');
assert.deepEqual(c.slice(0,3), ['sync','tick','promise']);
assert.deepEqual(m.slice(0,3), ['sync','promise','tick']);
for (const lines of [c,m]) {
  assert.ok(lines.indexOf('timer') > 2 && lines.indexOf('immediate') > 2);
}
console.log('18 自检通过：状态归属/乱序/终态、UTF-8 增量解码、CJS/ESM 调度');
console.log('Node', process.version);
