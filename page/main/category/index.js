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
    wx.setNavigationBarTitle({
      title: options.title,
    })
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('product').where({
        category: options.category
      }).limit(10).get()
      this.setData({
        category: options.category,
        products: res.data,
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
      let products = this.data.products
      const res = await db.collection('product').where({
        category: this.data.category
      }).skip(products.length).limit(10).get()
      products.push(...res.data)
      this.setData({
        products
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})