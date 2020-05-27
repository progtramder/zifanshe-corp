const regeneratorRuntime = require("../../common/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('corp').where({
        status: 'approved'
      }).limit(10).get()
      this.setData({
        cosultants: res.data,
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database()
      let consultants = this.data.consultants
      const res = await db.collection('corp').where({
        status: 'approved'
      }).skip(consultants.length).limit(10).get()
      consultants.push(...res.data)
      this.setData({
        cosultants
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})