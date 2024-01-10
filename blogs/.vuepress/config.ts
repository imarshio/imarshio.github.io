import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'

export default {
  lang: 'en-US',
  title: 'marshio',
  description: 'marshio.',
  head: [
    ['link', { rel: 'icon', href: '/public/images/horse.ico' }]
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
    logo: '/assets/image/horse.ico',
    // navgation
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Projects', link: '/projects' },
      { text: 'Blogs', link: '/blogs' },
      { text: 'Books', link: '/books' },
      { text: 'Tools', link: '/tools' },
      { text: 'Me', link: '/me' }
    ],
    sidebarDepth: 3,
    // sidebar: [

    // ]
  })
}

// module.exports = {
//   title: 'marshio',
//   description: 'marshio\'s blogs',
//   themeConfig: {

//   }
// }