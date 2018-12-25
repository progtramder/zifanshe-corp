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
  onShow: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').where({
      _openid: this.data.openId
    }).limit(10).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          product: res.data,
          isEmpty: res.data.length == 0
        })
    })
  },

  onReachBottom() {
    const db = wx.cloud.database();
    db.collection('product').where({
      _openid: this.data.openId
    }).skip(
      this.data.product.length
    ).limit(10).get().then((res) => {
      let product = this.data.product
      product.push(...res.data)
      this.setData(
        {
          product
        })
    })
  },

  clearProduct(deleted) {
    const files = []
    files.push(deleted.cover)
    deleted.detail.forEach(e => {
      if (e.type != 'text') files.push(e.src)
    })
    wx.cloud.deleteFile({
      fileList: files
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
            console.log(err)
          })
        } else {
          this.selectComponent(`#${e.currentTarget.id}`).reset()
        }
      }
    })
  },
  shelve() {
    wx.navigateTo({
      url: "shelve/index"
    })
  }
})