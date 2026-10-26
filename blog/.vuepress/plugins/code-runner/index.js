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

// Keep the theme's highlighted code block; opt in to the editor with `python run`.
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

      if (!flags.includes("run") || !runtime) return rendered;

      const [runnerLanguage, filename] = runtime;
      const code = md.utils.escapeHtml(JSON.stringify(token.content));

      return `<CodeRunner language="${runnerLanguage}" filename="${filename}" :code="${code}">\n${rendered}\n</CodeRunner>\n`;
    };
  },
});
