Page({
  onLoad({id}) {
    console.log(id)
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('product').field({
      detail: false
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          product: res.data
        })
    })
  },

  onShareAppMessage() {
    return {
      title: 'corp-name',
      path: 'page/corp-product/index?id=corp-id'
    }
  }
})
