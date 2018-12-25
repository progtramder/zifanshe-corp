App({
  onLaunch(opts) {
    wx.cloud.init({
      env: 'zifan-cloud-d1993c'
    })
  },
  globalData: {
    openId: null,
  },

  getOpenId() {
    return this.globalData.openId
  },

  setOpenId(openId) {
    this.globalData.openId = openId
  }
})
