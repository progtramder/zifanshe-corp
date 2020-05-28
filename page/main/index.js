const { TabPage } = require('../common/common')
const config = require('../common/config')
const regeneratorRuntime = require("../common/runtime")
const app = getApp()

TabPage({
  data: {
    currentSwiperId: 0,
  },
  swiperItemChanged(e) {
    this.data.currentSwiperId = e.detail.current
  },
  swiperItemTap(e) {
    let corp = this.data.corps[this.data.currentSwiperId]
  },
  onShareAppMessage() {
    return {
      title: '首页',
      path: 'page/main/index'
    }
  },
  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      let openId = app.getOpenId()
      if (!openId) {
        const res = await wx.cloud.callFunction({ name: 'login' })
        openId = res.result.openId
        app.setOpenId(openId)
      }
      const db = wx.cloud.database();
      let res = await db.collection('UI').doc('mainpage').get()
      const image = res.data.image
      res = await db.collection('corp').get()
      const corps = res.data
      this.setData({ 
        image,
        corps
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})
