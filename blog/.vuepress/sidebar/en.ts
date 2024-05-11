import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    // "",
    // {
    //   text: "Demo",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
    // {
    //   text: "posts",
    //   icon: "book",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    // {
    //   text: "notes",
    //   icon: "book",
    //   prefix: "notes/",
    //   children: "structure",
    // },
    // {
    //   text: "books",
    //   icon: "book",
    //   prefix: "books/",
    //   children: "structure",
    // },
    // {
    //   text: "tools",
    //   icon: "book",
    //   prefix: "tools/",
    //   children: "structure",
    // },
    // "intro",
    // {
    //   text: "Slides",
    //   icon: "person-chalkboard",
    //   link: "https://plugin-md-enhance.vuejs.press/guide/content/revealjs/demo.html",
    // },
  ],
  "/posts/": "structure",
  "/notes/": "structure",
  "/tools/": "structure",
  "/books/": "structure",
});
