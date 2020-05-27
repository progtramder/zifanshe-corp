const { TabPage } = require('../common/common')
const config = require('../common/config')
const regeneratorRuntime = require("../common/runtime")

TabPage({
  onShareAppMessage() {
    return {
      title: '首页',
      path: 'page/main/index'
    }
  },
  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('UI').doc('mainpage').get()
      this.setData({ image: res.data.image })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})
