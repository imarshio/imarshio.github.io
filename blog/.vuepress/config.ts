import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default ({
  base: "/",

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
