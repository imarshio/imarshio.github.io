import assert from "node:assert/strict";
import test from "node:test";
import { compileTemplate } from "vue/compiler-sfc";
import { createMarkdown } from "vuepress/markdown";
import { codeRunnerPlugin } from "../blog/.vuepress/plugins/code-runner/index.js";

const plain = createMarkdown();
const markdown = createMarkdown();
codeRunnerPlugin().extendsMarkdown(markdown);
const block = (info, code = 'print("你好")') => `\`\`\`${info}\n${code}\n\`\`\``;

test("supported languages opt in without losing the original highlighted block", () => {
  for (const [language, runtime, filename] of [
    ["python", "python", "main.py"],
    ["py", "python", "main.py"],
    ["node", "nodejs", "index.js"],
    ["nodejs", "nodejs", "index.js"],
    ["js", "javascript", "index.js"],
    ["javascript", "javascript", "index.js"],
    ["html", "html", "index.html"],
    ["java", "java", "Main.java"],
  ]) {
    const source = block(`${language} run`);
    const html = markdown.render(source);
    assert.ok(html.includes(plain.render(source).trimEnd()));
    assert.ok(html.includes(`<CodeRunner language="${runtime}" filename="${filename}"`));
    assert.equal((html.match(/<CodeRunner /g) ?? []).length, 1);
    assert.ok(html.indexOf("<CodeRunner ") < html.indexOf("<pre"));
    assert.ok(html.indexOf("</CodeRunner>") > html.indexOf("</pre>"));
  }
});

test("ordinary code, unsupported languages and lookalike flags stay unchanged", () => {
  for (const info of ["python", "python runner", "bash run", "constructor run", "toString run", ""]) {
    const source = block(info);
    assert.equal(markdown.render(source), plain.render(source));
  }
});

test("HTML, Vue expressions and quotes stay inside the code prop", () => {
  const code = '<script>alert("x")</script>\n{{ secret }}\n" @click="oops" & < > \' 中文';
  const html = markdown.render(block("html run", code));
  const runner = html.match(/<CodeRunner [^>]+>/)[0];
  assert.ok(!runner.includes("<script>"));
  assert.ok(!runner.includes(' @click="oops"'));
  const encoded = runner.match(/:code="([^"]*)"/)[1];
  const decoded = encoded.replace(/&(quot|amp|lt|gt);/g, (_, name) => ({
    quot: '"', amp: "&", lt: "<", gt: ">",
  })[name]);
  assert.equal(JSON.parse(decoded), `${code}\n`);
  const compiled = compileTemplate({ source: html, filename: "test.vue", id: "test" });
  assert.deepEqual(compiled.errors, []);
});

test("multiple blocks pass their own complete source independently", () => {
  const html = markdown.render(`${block("python run", "print(1)")}\n\n${block("java run", "class Main {}")}`);
  assert.equal((html.match(/<CodeRunner /g) ?? []).length, 2);
  assert.ok(html.includes("print(1)\\n"));
  assert.ok(html.includes("class Main {}\\n"));
});
