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
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
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
      }
    ],
  },
  // {
  //   text: "books",
  //   icon: "pen-to-square",
  //   prefix: "books/",
  //   children: [
  //     "1"
  //   ]
  // },
  {
    text: "Tools",
    icon: "book",
    prefix: "/tools/",
    children: [
      {
        text: "Java",
        icon: "pen-to-square",
        link: "Java Tools"
        // prefix: "notes/",
        // children: [
        //   {
        //     text: "Logging Frameworks",
        //     icon: "pen-to-square",
        //     link: "Logging Frameworks"
        //     // prefix: "log/"
        //   }
        // ],
      }
    ],
  },
  {
    text: "V2 Docs",
    icon: "book",
    link: "https://theme-hope.vuejs.press/",
  },
]);
