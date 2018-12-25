const config = require('../common/config')
const regeneratorRuntime = require("../common/runtime");
const app = getApp()
Page({
  data: {
    enrolled: true,
    isVerifying: false,
    logo: 'cloud://zifan-cloud-d1993c.7a69-zifan-cloud-d1993c/image/corp-logo/zifan.png',
    corp: '子繁社'
  },
  onShow() {
  },

  enroll() {
    if (this.data.isVerifying) {
      return
    }
    console.log('enroll')
  },
  changeCorpInfo() {
    console.log('tap')
  }
})
