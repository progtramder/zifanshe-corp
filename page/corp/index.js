const { TabPage } = require('../common/common')
const config = require('../common/config')
const regeneratorRuntime = require("../common/runtime");
const app = getApp()

TabPage({
  data: {
    enrolled: null,
    logo: '',
    corp: ''
  },

  onShow() {
    if (this.data.enrolled) {
      this.data.superAdmin ? config.updateRedDotAdmin(this) : config.updateRedDot(this)
    }
  },

  async onLoad() {
    try {
      wx.showNavigationBarLoading()
      let openId = app.getOpenId()
      if (!openId) {
        const res = await wx.cloud.callFunction({ name: 'login' })
        openId = res.result.openId
        app.setOpenId(openId)
      }
      const db = wx.cloud.database()
      let res = await db.collection('corp-admin').where({
        admin: openId
      }).get()
      if (res.data.length > 0) {
        const { corp: corpId } = res.data[0]
        res = await db.collection('corp').doc(corpId).get()
        const { logo, name } = res.data
        res = await db.collection('super-admin').where({
          who: openId
        }).get()
        if (res.data.length > 0) {
          this.setData({
            superAdmin: true
          })
          config.updateRedDotAdmin(this)
        } else {
          config.updateRedDot(this)
        }
        app.setCorpId(corpId)
        app.setCorpName(name)
        this.setData({
          enrolled: true,
          logo: logo,
          corp: name
        })
      } else {
        this.setData({
          enrolled: false
        })
      }
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async enroll() {
    const corpId = app.getCorpId()
    if (corpId) {
      wx.navigateTo({ url: `corp-info/index?id=${corpId}` })
    } else {
      wx.navigateTo({ url: 'corp-info/index' })
    }
  },

  changeCorpInfo() {
    wx.navigateTo({
      url: `corp-info/index?id=${app.getCorpId()}`
    })
  },
})
