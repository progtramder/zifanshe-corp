const config = require('../common/config')
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: '首页',
      path: 'page/main/index'
    }
  },

  data: {
    currentSwiperId: 0,
  },
  swiperItemChanged(e) {
    this.data.currentSwiperId = e.detail.current
  },

  swiperItemTap(e) {
    let bultn = this.data.bulletins[this.data.currentSwiperId]
    if (bultn) {
      wx.navigateTo({
        url: `web-view/web-view?page=${bultn.page}`
      })
    }
  },

  onShow() {
    this.getBulletins()
  },

  logIn() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const { openId } = res.result
      console.log(openId)
    })
  },
  
  getBulletins() {
    const db = wx.cloud.database();
    db.collection('UI').doc('mainpage').get().then((res) => {
      this.setData({ bulletins : res.data.bulletins })
    });
  },
})
