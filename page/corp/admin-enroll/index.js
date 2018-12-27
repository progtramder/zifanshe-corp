const regeneratorRuntime = require("../../common/runtime");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({ id }) {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database()
      const res = await db.collection('corp').doc(id).get()
      const { logo, name } = res.data
      this.setData({
        corpId: id,
        logo,
        name
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async accept() {
    try {
      wx.showLoading()
      let res = await wx.cloud.callFunction({ name: 'login' })
      const { openId } = res.result
      const db = wx.cloud.database()
      res = await db.collection('corp-admin').where({
        admin: openId
      }).get()
      if (res.data.length == 0) {
        await db.collection('corp-admin').add({
          data: {
            corp: this.data.corpId,
            admin: openId
          }
        })
      }
      wx.reLaunch({
        url: '/page/corp/index',
      })
    } finally {
      wx.hideLoading()
    }
  }
})