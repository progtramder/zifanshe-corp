const regeneratorRuntime = require("../../common/runtime")
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

  quit() {
    wx.showModal({
      content: `确定退出${app.getCorpName()}平台管理？`,
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          this.doQuit()
        }
      }
    })
  },
  async doQuit() {
    try {
      wx.showLoading()
      const db = wx.cloud.database();
      const res = await db.collection('corp-admin').where({
        _openid: app.getOpenId()
      }).get()
      const { _id: docId } = res.data[0]
      await db.collection('corp-admin').doc(docId).remove()
      app.setCorpId(null)
      wx.reLaunch({
        url: '../index',
      })
    } finally {
      wx.hideLoading()
    }
  },

  onShareAppMessage(res) {
    return {
      title: app.getCorpName(),
      path: `/page/corp/admin-enroll/index?id=${app.getCorpId()}`,
      imageUrl: '/image/invite.jpeg'
    }
  }
})