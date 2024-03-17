import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  // "/demo/",
  {
    text: "Posts",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "notes",
        icon: "pen-to-square",
        prefix: "notes/",
        children: [
          {
            text: "log frame",
            icon: "pen-to-square",
            link: "1",
            prefix: "log/"
          },
          // { text: "Apple2", icon: "pen-to-square", link: "2" },
          // "3",
          // "4",
        ],
      },
      {
        text: "architect",
        icon: "pen-to-square",
        prefix: "architect/",
        children: [
          {
            text: "what's architect",
            icon: "pen-to-square",
            link: "1",
          },
          // {
          //   text: "Banana 2",
          //   icon: "pen-to-square",
          //   link: "2",
          // },
          // "3",
          // "4",
        ],
      },
      // {
      //   text: "Cherry", icon: "pen-to-square", link: "cherry"
      // },
      // {
      //   text: "Dragon Fruit", icon: "pen-to-square", link: "dragonfruit"
      // },
      // "tomato",
      // "strawberry",
    ],
  },
  // {
  //   text: "V2 Docs",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/",
  // },
]);
