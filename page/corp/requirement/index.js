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
    db.collection('requirement').where({
      _openid: this.data.openId
    }).limit(10).field({ detail: false }).get().then((res) => {
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
    db.collection('requirement').where({
      _openid: this.data.openId
    }).skip(
      this.data.product.length
    ).limit(10).field({ detail: false }).get().then((res) => {
      let pdt = this.data.product
      pdt.push(...res.data)
      this.setData(
        {
          product: pdt
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
          db.collection('requirement').doc(
            product[index]._id
          ).remove().then(res => {
            product.splice(index, 1)
            this.setData({
              product
            })
          }).catch(err => {
            console.log(err)
          })
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