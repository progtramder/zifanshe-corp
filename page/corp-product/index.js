const regeneratorRuntime = require("../common/runtime")
Page({
  async onLoad({id}) {
    this.data.corpId = id
    wx.showNavigationBarLoading()
    try {
      const db = wx.cloud.database();
      let res = await db.collection('corp').doc(id).get()
      this.data.corpName = res.data.name
      wx.setNavigationBarTitle({ title: res.data.name })

      res = await db.collection('product').where({
        owner: id
      }).field({
        detail: false
      }).get()
      this.setData({
        product: res.data
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  onShareAppMessage() {
    const corpId = this.data.corpId
    const corpName = this.data.corpName
    return {
      title: corpName,
      path: `page/corp-product/index?id=${corpId}`
    }
  }
})
