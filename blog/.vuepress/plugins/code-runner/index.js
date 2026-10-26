import { fileURLToPath } from "node:url";

const languages = {
  python: ["python", "main.py"],
  py: ["python", "main.py"],
  node: ["nodejs", "index.js"],
  nodejs: ["nodejs", "index.js"],
  javascript: ["javascript", "index.js"],
  js: ["javascript", "index.js"],
  html: ["html", "index.html"],
  java: ["java", "Main.java"],
};

// Opt in with `run` or an existing standalone Python example marker.
export const codeRunnerPlugin = () => ({
  name: "vuepress-plugin-code-runner",
  clientConfigFile: fileURLToPath(new URL("./client.ts", import.meta.url)),
  extendsMarkdown(md) {
    const fence = md.renderer.rules.fence;

    md.renderer.rules.fence = (tokens, index, options, env, self) => {
      const rendered = fence(tokens, index, options, env, self);
      const token = tokens[index];
      const [language, ...flags] = token.info.trim().split(/\s+/);
      const runtime = Object.hasOwn(languages, language) && languages[language];
      const firstLine = token.content.trimStart().split(/\r?\n/, 1)[0];
      const standalonePython = (language === "python" || language === "py") &&
        /^#\s*可独立运行\s*$/u.test(firstLine);

      if (!runtime || flags.includes("no-run") || (!flags.includes("run") && !standalonePython)) return rendered;

      const [runnerLanguage, filename] = runtime;
      const code = md.utils.escapeHtml(JSON.stringify(token.content));

      return `<CodeRunner language="${runnerLanguage}" filename="${filename}" :code="${code}">\n${rendered}\n</CodeRunner>\n`;
    };
  },
});
