const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('product').where({
        owner: app.getCorpId()
      }).limit(10).get()
      this.setData({
        product: res.data,
        isEmpty: res.data.length == 0
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onReachBottom() {
    try {
      wx.showLoading()
      const db = wx.cloud.database();
      const res = await db.collection('product').where({
        owner: app.getCorpId()
      }).skip(
        this.data.product.length
      ).limit(10).get()
      let product = this.data.product
      product.push(...res.data)
      this.setData({
        product
      })
    } finally {
      wx.hideLoading()
    }
  },
  
  /*async showQrCode() {
    try {
      wx.showLoading()
      let qrFile
      const db = wx.cloud.database();
      const corpId = app.getCorpId()
      const res = await db.collection('qrcode-main').where({
        corp: corpId
      }).get()
      if (res.data.length > 0) {
        qrFile = res.data[0].file
      } else {
        const path = `page/corp-product/index?id=${corpId}`
        const res = await wx.cloud.callFunction({
          name: 'qrcode',
          data: {
            cloudPath: `qrcode/main/${corpId}.jpg`,
            path
          }
        })
        const { fileID: file } = res.result
        qrFile = file
        await db.collection('qrcode-main').add({
          data: {
            corp: corpId,
            file
          }
        })
      }

      const paths = []
      paths.push(qrFile)
      wx.previewImage({
        current: qrFile,
        urls: paths
      })
    } finally {
      wx.hideLoading()
    }
  }*/
})
