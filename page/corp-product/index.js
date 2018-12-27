Page({
  onLoad({id}) {
    this.data.corpId = id
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('corp').doc(id).get().then((res) => {
      this.data.corpName = res.data.name
    })
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

  onShareAppMessage() {
    const corpId = this.data.corpId
    const corpName = this.data.corpName
    return {
      title: corpName,
      path: `page/corp-product/index?id=${corpId}`
    }
  }
})
