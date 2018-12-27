const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShareAppMessage(res) {
    return {
      title: app.getCorpName(),
      path: `/page/corp/admin-enroll/index?id=${app.getCorpId()}`,
      imageUrl: '/image/invite.jpeg'
    }
  }
})