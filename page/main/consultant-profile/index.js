const regeneratorRuntime = require("../../common/runtime");
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: this.data.consultant.name,
      path: `page/main/consultant-profile/index?id=${this.data.consultant._id}`
    }
  },

  async onLoad(options) {
    const db = wx.cloud.database();
    wx.showNavigationBarLoading()
    try {
      let resConsultant = await db.collection('corp').doc(options.id).get()
      wx.setNavigationBarTitle({
        title: resConsultant.data.name
      })

      let resProduct = await db.collection('product').where({
        owner: options.id
      }).limit(10).field({ detail: false }).get()
      this.setData({
        consultant: resConsultant.data,
        products: resProduct.data
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  async onReachBottom() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database()
      let products = this.data.products
      const res = await db.collection('product').where({
        owner: this.data.consultant._id
      }).skip(products.length).limit(10).field({ detail: false }).get()
      products.push(...res.data)
      this.setData({
        products
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})
