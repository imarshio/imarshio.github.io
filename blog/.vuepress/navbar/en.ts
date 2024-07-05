import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  "/posts/",
  "/notes/",
  "/tools/",
  "/books/",
  { text: "小站", link: "/release", icon: "fa-solid fa-blog" },
  { text: "me", link: "/me", icon: "fa-solid fa-user-graduate" }
]);
