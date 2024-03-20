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
            text: "Logging Frameworks",
            icon: "pen-to-square",
            link: "Logging Frameworks"
            // prefix: "log/"
          },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux Command" },
          {
            text: "Linux",
            icon: "pen-to-square",
            link: "Linux",
            // prefix: "Linux/",
            // children: [
              // { text: "Linux Command", icon: "pen-to-square", link: "Linux Command" },
            // ]
          },
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
