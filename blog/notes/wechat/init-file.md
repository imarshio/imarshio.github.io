---
icon: fa-brands fa-weixin
category:
  - wechat
title: 微信小程序 新手上手
# tag:

---

## 新建小程序

### TS（TypeScript）

```markdown
project
└── miniprogram
    ├── pages
    ├── utils
    ├── app.json
    ├── app.ts
    └── app.wxss
└── typings
    └── index.d.ts
    └── types
        ├── wx
        └── index.d.ts
└── eslintrc.js
└── package.json
└── project.config.json
└── project.private.config.json
└── tspackage.json
```

## 新建页面

找到`app.json`，在其中的`pages`配置下添加页面`路径`如`pages/index/index`，保存就会自动生成对应的页面，包含四个文件`xxxx.json`,`xxxx.ts(js)`,`xxxx.wxml`,`xxxx.wxss`。

## `app.json`

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs",
    "pages/me/me",
    "pages/goods/list/list",
    "pages/goods/detail/detail"
  ],
  "window": {
    "navigationBarTitleText": "状态栏 + 导航条 全局配置",
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#f3514f",
    "enablePullDownRefresh": true,
    "backgroundColor": "#efefef",
    "backgroundTextStyle": "dark"
  },
  "tabBar": {
    "custom": true,
    "color": "#000000",
    "selectedColor": "#000000",
    "backgroundColor": "#000000",
    "list": [
      {
      "pagePath": "pages/index/index",
      "text": "首页"
    },
    {
      "pagePath": "pages/me/me",
      "text": "我的"
    },
    {
      "pagePath": "pages/goods/list/list",
      "text": "商品列表"
    }
  ]
  },
  "style": "v2",
  // 当 render 为 Skyline 的时候，页面默认是不支持上下滑动的   
  "render": "Skyline",
  "rendererOptions": {
    "skyline": {
      "defaultDisplayBlock": true,
      "disableABTest": true,
      "sdkVersionBegin": "3.0.0",
      "sdkVersionEnd": "15.255.255"
    }
  },
  "componentFramework": "glass-easel",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}
```

### pages

```json

```

### window

支持配置全局

```json
{
    // 全局导航栏设置，当 render 为 Skyline 的时候不生效
    "navigationBarTitleText": "状态栏 + 导航条 全局配置",
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#f3514f",
    "enablePullDownRefresh": true,
    "backgroundColor": "#efefef",
    "backgroundTextStyle": "dark"
}
```

### tabBar

底部导航栏

## `pages`

### `xxxx.json`

```json
{
  "usingComponents": {}
}
```

### `xxxx.ts` or `xxxx.js`

```ts
// pages/goods/detail/detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
```

### `xxxx.wxml`

```wxml
<!--pages/goods/detail/detail.wxml-->
<text>pages/goods/detail/detail.wxml</text>
```

### `xxxx.wxss`

```wxss
/* pages/goods/detail/detail.wxss */
```
