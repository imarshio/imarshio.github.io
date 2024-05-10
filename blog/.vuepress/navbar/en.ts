import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  // "/demo/",
  {
    text: "Posts(随笔)",
    icon: "code",
    prefix: "/posts/",
    children: [
      {
        text: "Java",
        icon: "pen-to-square",
        prefix: "/Java/",
        children: [
          {
            text: "Stream Usage",
            icon: "pen-to-square",
            link: "StreamUsage",
          }
        ],
      }
    ],
  },
  {
    text: "Notes(笔记)",
    icon: "pen-to-square",
    prefix: "/notes/",
    children: [
      {
        text: "architect",
        icon: "pen-to-square",
        prefix: "architect/",
        children: [
          {
            text: "what's architect",
            icon: "pen-to-square",
            link: "what's architect",
          }
        ],
      }, {
        text: "notes",
        icon: "pen-to-square",
        prefix: "Base/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      }, {
        text: "Git",
        icon: "pen-to-square",
        prefix: "Git/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      }, {
        text: "Linux",
        icon: "pen-to-square",
        prefix: "Linux/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      }, {
        text: "MySQL",
        icon: "pen-to-square",
        prefix: "MySQL/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      }, {
        text: "Postgresql",
        icon: "pen-to-square",
        prefix: "Postgresql/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      }, {
        text: "UnCategory",
        icon: "pen-to-square",
        prefix: "UnCategory/",
        children: [
          { text: "Logging Frameworks", icon: "pen-to-square", link: "Logging Frameworks" },
          { text: "Design Patterns", icon: "pen-to-square", link: "Design Patterns" },
          { text: "ECS Init", icon: "pen-to-square", link: "ECS Init" },
          { text: "How to build a Blog", icon: "pen-to-square", link: "How to build a Blog" },
          { text: "Linux Command", icon: "pen-to-square", link: "Linux/Linux Command" },
          { text: "Linux File System", icon: "pen-to-square", link: "Linux/Linux File System" },
        ]
      },
    ],
  },
  {
    text: "books",
    icon: "book",
    prefix: "/books/",
    children: [
      {
        text: "凤凰架构",
        icon: "pen-to-square",
        link: "凤凰架构",
      },
      {
        text: "操作系统",
        icon: "pen-to-square",
        link: "操作系统",
      },
      {
        text: "数据结构与算法分析",
        icon: "pen-to-square",
        link: "数据结构与算法分析",
      },
      {
        text: "计算机网络",
        icon: "pen-to-square",
        link: "计算机网络",
      },
    ]
  },
  {
    text: "Tools",
    icon: "toolbox",
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
  }
]);
