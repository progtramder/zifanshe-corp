const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    name: '',
    phone: '',
    intro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({ id }) {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database()
      const res = await db.collection('corp').doc(id).get()
      const corp = res.data
      this.setData({
        corpId: id,
        corpAdmin: corp._openid,
        logo: corp.logo,
        name: corp.name,
        phone: corp.phone,
        intro: corp.intro
      })
      wx.setNavigationBarTitle({
        title: corp.name,
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  alert(tilte) {
    wx.showModal({
      content: tilte,
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  },

  approve() {
    wx.showModal({
      content: '确定审核通过？',
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          this.doApprove()
        }
      }
    })
  },

  async doApprove() {
    try {
      wx.showLoading()
      await wx.cloud.callFunction({
        name: 'database',
        data: {
          func: 'dbupdate',
          collect: 'corp',
          docId: this.data.corpId,
          data: {
            status: 'approved'
          }
        }
      })
      await wx.cloud.callFunction({
        name: 'database',
        data: {
          func: 'addaccount',
          corpId: this.data.corpId
        }
      })
      const db = wx.cloud.database()
      await db.collection('corp-admin').add({
        data: {
          corp: this.data.corpId,
          admin: this.data.corpAdmin
        }
      })
      wx.navigateBack()
    } catch(err) {
      this.alert(err.errMsg)
    } finally {
      wx.hideLoading()
    }
  }
})