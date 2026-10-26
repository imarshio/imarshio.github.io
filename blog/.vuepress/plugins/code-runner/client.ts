import { defineClientConfig } from "vuepress/client";
import CodeRunner from "./CodeRunner.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("CodeRunner", CodeRunner);
  },
});
