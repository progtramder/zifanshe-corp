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
      }).field({ detail: false }).get()
      this.setData({
        consultant: resConsultant.data,
        product: resProduct.data
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})
