const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('product').where({
        owner: app.getCorpId()
      }).limit(10).field({ detail: false }).get()
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
      ).limit(10).field({ detail: false }).get()
      let product = this.data.product
      product.push(...res.data)
      this.setData({
        product
      })
    } finally {
      wx.hideLoading()
    }
  },
  
  async showQrCode(e) {
    const productId = e.currentTarget.dataset.product
    try {
      wx.showLoading()
      const db = wx.cloud.database();
      let qrFile
      const res = await db.collection('qrcode-product').where({
        product: productId
      }).get()
      if (res.data.length > 0) {
        qrFile = res.data[0].file
      } else {
        const path = `page/corp-product/product-detail/index?id=${productId}`
        const res = await wx.cloud.callFunction({
          name: 'qrcode',
          data: {
            cloudPath: `qrcode/product/${productId}.jpg`,
            path
          }
        })
        const { fileID: file } = res.result
        qrFile = file
        await db.collection('qrcode-product').add({
          data: {
            product: productId,
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
  }
})
