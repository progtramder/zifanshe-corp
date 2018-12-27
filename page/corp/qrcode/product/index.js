const regeneratorRuntime = require("../../../common/runtime")
const app = getApp()
Page({
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').where({
      _id: options.id
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let product = res.data[0]
      wx.setNavigationBarTitle({ title: product.name })
      this.selectComponent("#product").init(product)
      this.setData(
      {
        product,
      })
    }).catch(err => {
      wx.hideNavigationBarLoading()
    })
  },

  async showQrCode() {
    try {
      wx.showLoading()
      const db = wx.cloud.database();
      let qrFile
      const productId = this.data.product._id
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