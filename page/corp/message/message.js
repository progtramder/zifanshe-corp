const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    message: []
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    let corpId = app.getCorpId()
    db.collection('message').doc(corpId).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData({ message : res.data.message })
      db.collection('message').doc(corpId).update({
        data: {
          unread: false
        },
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      this.setData({
        isEmpty: true
      })
    })
  }
})