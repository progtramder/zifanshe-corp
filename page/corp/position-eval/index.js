const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad(options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('eval-corp').where({
        owner: app.getCorpId()
      }).get()
      this.setData({
        corps: res.data,
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  createCorp() {
    wx.navigateTo({
      url: "create-corp/index"
    })
  }
})