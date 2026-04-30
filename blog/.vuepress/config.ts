import path from "node:path";
import { fileURLToPath } from "node:url";
import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineUserConfig({
  base: "/",

  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: [
          {
            find: /[/\\]vuepress-theme-hope[/\\]dist[/\\]client[/\\]styles[/\\]_code\.scss$/,
            replacement: path.resolve(
              __dirname,
              "./styles/theme-hope-_code.scss",
            ),
          },
        ],
      },
    },
  }),

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
});
