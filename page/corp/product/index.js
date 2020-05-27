const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false
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
      const res  = await db.collection('product').where({
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

  clearProduct(deleted) {
    const db = wx.cloud.database();
    db.collection('qrcode-product').where({
      product: deleted._id
    }).get().then(res => {
      const files = []
      if (res.data.length > 0) {
        const { _id: docId, file } = res.data[0]
        db.collection('qrcode-product').doc(docId).remove()
        files.push(file)
      }
      files.push(deleted.cover)
      deleted.detail.forEach(e => {
        if (e.type != 'text') files.push(e.src)
      })
      wx.cloud.deleteFile({
        fileList: files
      })
    })
  },

  deleteProduct(e) {
    const index = e.currentTarget.dataset.index
    let product = this.data.product
    wx.showModal({
      content: '确定删除吗？',
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('product').doc(
            product[index]._id
          ).remove().then(res => {
            const deleted = product.splice(index, 1)
            this.setData({
              product
            })
            this.clearProduct(deleted[0])
          }).catch(err => {
            wx.showModal({
              content: '没有权限',
              showCancel: false,
              confirmColor: '#F56C6C',
              confirmText: '知道了',
              success: (res) => {
                this.selectComponent(`#${e.currentTarget.id}`).reset()
              }
            })
          })
        } else {
          this.selectComponent(`#${e.currentTarget.id}`).reset()
        }
      },
    })
  },
  shelve() {
    wx.navigateTo({
      url: "shelve/index"
    })
  }
})