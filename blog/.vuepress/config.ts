import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import theme from "./theme.js";

export default {
  base: "/",

  markdown: {
    headers: {
      // 用到哪一级就提取哪一级
      level: [2, 3, 4],
    },
  },

  locales: {
    "/": {
      lang: "en-US",
      title: "Blog",
      description: "Marshio's Blog",
    }
  },

  theme,

  // Enable it with pwa
  shouldPrefetch: false,
};
