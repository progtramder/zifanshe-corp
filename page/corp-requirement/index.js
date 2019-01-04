const app = getApp()
Page({

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('requirement').where({
      _id: options.id
    }).get().then((res) => {
      wx.hideNavigationBarLoading()
      let requirement = res.data[0]
      wx.setNavigationBarTitle({ title: requirement.name })
      this.setData({
        requirement,
      })
    }).catch(err => {
      wx.hideNavigationBarLoading()
      console.log(err)
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.requirement.name,
      path: `page/corp-requirement/index?id=${this.data.requirement._id}`
    }
  }
})