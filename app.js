App({
  onLaunch(opts) {
    wx.cloud.init({
      env: 'zifan-cloud-d1993c',
      traceUser: true,
    })
  },
  globalData: {
    openId: null,
    corpId: null,
    corpName: ''
  },

  getCorpId() {
    return this.globalData.corpId
  },

  setCorpId(corpId) {
    this.globalData.corpId = corpId
  },

  setOpenId(openId) {
    this.globalData.openId = openId
  },
  getOpenId() {
    return this.globalData.openId
  },

  setCorpName(name) {
    this.globalData.corpName = name
  },
  getCorpName() {
    return this.globalData.corpName
  }
})
