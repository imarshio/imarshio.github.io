import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'

export default defineUserConfig({
  lang: 'en-US',
  title: 'marshio',
  description: 'marshio.',
  head: [
    ['link', { rel: 'icon', href: '/images/logo/favicon.ico' }]
  ],
  // 语言选项
  // locales: {
  //   // 键名是该语言所属的子路径
  //   // 作为特例，默认语言可以使用 '/' 作为其路径。
  //   '/': {
  //     lang: 'en-US',
  //     title: 'VuePress',
  //     description: 'Vue-powered Static Site Generator',
  //   },
  //   '/zh/': {
  //     lang: 'zh-CN',
  //     title: 'VuePress',
  //     description: 'Vue 驱动的静态网站生成器',
  //   },
  // },
  // public: './.vuepress/assets',
  theme: defaultTheme({
    logo: '/images/logo/favicon.ico',
    // navgation
    navbar: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Projects',
        link: '/post/projects/',
        children: [
          {
            text: 'Springboot Demo',
            link: '/post/projects/#springboot-demo',
            children: [
              '/post/projects/springboot-demo/annotation/',
              '/post/projects/springboot-demo/log/',

            ]
          },
          {
            text: 'Springcloud Alibaba',
            link: '/post/projects/springcloud-alibaba',
            children: [
              // TODO BUG 
              ''
            ]
          },
          {
            text: 'Bigdata',
            link: '/post/projects/big-data',
            children: [
              'hadoop'
            ]
          }
        ]
      },
      {
        text: 'Blogs',
        link: '/post/blogs/'
      },
      {
        text: 'Books',
        link: '/post/books/'
      },
      {
        text: 'Tools',
        link: '/post/tools/'
      },
      {
        text: 'Me',
        link: '/post/me'
      }
    ],
    sidebarDepth: 3,
    // sidebar: [

    // ]
  })
})

// module.exports = {
//   title: 'marshio',
//   description: 'marshio\'s blog',
//   themeConfig: {

//   }
// }