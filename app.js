App({
  onLaunch(opts) {
    wx.cloud.init({
      env: 'zifan-cloud-d1993c'
    })
  },
  globalData: {
    corpId: null,
    corpName: ''
  },

  getCorpId() {
    return this.globalData.corpId
  },

  setCorpId(corpId) {
    this.globalData.corpId = corpId
  },

  setCorpName(name) {
    this.globalData.corpName = name
  },
  getCorpName() {
    return this.globalData.corpName
  }
})
