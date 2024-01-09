import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'

export default defineUserConfig({
  lang: 'en-US',
  title: 'marshio',
  description: 'marshio.',
  public: '${sourceDir}/.vuepress/assets',
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
    sidebar: [

    ]
  })
})

// module.exports = {
//   title: 'marshio',
//   description: 'marshio\'s blogs',
//   themeConfig: {

//   }
// }