const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00'
  },

  onLoad: function () {
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'database',
      data: {
        func: 'balance',
        corpId: app.getCorpId()
      }
    }).then(res => {
      wx.hideNavigationBarLoading()
      let account = res.result.data
      if (account.length > 0) {
        this.setData(
          {
            balance: Number(account[0].balance).toFixed(2)
          })
      }
    }).catch(err => {
      wx.hideNavigationBarLoading()
      console.log(err)
    })
  },

  withdraw() {
    wx.showModal({
      content: '暂时还不支持',
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  }
})