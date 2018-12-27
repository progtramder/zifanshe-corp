const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  onLoad() {
    wx.setNavigationBarTitle({ title: app.getCorpName() })
    const id = app.getCorpId()
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').where({
      owner: id
    }).field({
      detail: false
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
      {
        product: res.data
      })
    }).catch(err => {
      wx.hideNavigationBarLoading()
    })
  },

  async showQrCode() {
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
  }
})
