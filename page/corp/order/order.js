const app = getApp()
Page({
  data: {
    order: [],
    isEmpty: false
  },

  queryorder (e) {
    wx.navigateTo({
      url: `/page/payorder/index?id=${e.currentTarget.dataset.order}`
    });
  },

  onShow () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('order').where({
      beneficiary: app.getCorpId()
    }).orderBy('time_stamp', 'desc').limit(10).field({
      body: true,
      status: true,
      out_trade_no: true
    }).get().then(res => {
      wx.hideNavigationBarLoading()
      this.setData({
        order: res.data,
        isEmpty: res.data.length ? false : true
      });
    })
  },

  onReachBottom() {
    wx.showLoading()
    let order = this.data.order
    const db = wx.cloud.database();
    db.collection('order').where({
      _openid: app.getOpenId()
    }).orderBy('time_stamp', 'desc').skip(
      order.length
    ).limit(5).field({
      body: true,
      status: true,
      out_trade_no: true
    }).get().then((res) => {
      order.push(...res.data)
      wx.hideLoading()
      this.setData(
        {
          order
        })
    })
  }
})
