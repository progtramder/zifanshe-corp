App({
  onLaunch(opts) {
    wx.cloud.init({
      env: 'zifan-cloud-d1993c'
    })
  },
  globalData: {
    corpId: null,
  },

  getCorpId() {
    return this.globalData.corpId
  },

  setCorpId(corpId) {
    this.globalData.corpId = corpId
  }
})
