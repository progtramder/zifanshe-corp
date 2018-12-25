const config = require('../common/config')
const regeneratorRuntime = require("../common/runtime")
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: '首页',
      path: 'page/main/index'
    }
  },

  data: {
    currentSwiperId: 0,
  },
  swiperItemChanged(e) {
    this.data.currentSwiperId = e.detail.current
  },

  swiperItemTap(e) {
    let bultn = this.data.bulletins[this.data.currentSwiperId]
    if (bultn) {
      wx.navigateTo({
        url: `web-view/web-view?page=${bultn.page}`
      })
    }
  },

  onLoad() {
    this.getBulletins()
  },

  onShow() {
    this.getRequirement()
  },

  logIn() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const { openId } = res.result
    })
  },
  
  async getRequirement() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('requirement').limit(10).field({ 
          detail: false 
        }).get()

      this.setData(
        {
          requirement: res.data,
        })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onReachBottom() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('requirement').skip(
        this.data.requirement.length
      ).limit(10).field({ detail: false }).get()

      let requirement = this.data.requirement
      requirement.push(...res.data)
      this.setData(
        {
          requirement
        })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  getBulletins() {
    const db = wx.cloud.database();
    db.collection('UI').doc('mainpage').get().then((res) => {
      this.setData({ bulletins : res.data.bulletins })
    });
  },
})
