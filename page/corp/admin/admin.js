Page({
  onShow() {
    const db = wx.cloud.database();
    db.collection('corp').where({
      status: 'verifying'
    }).limit(10).get().then((res) => {
      this.setData(
        {
          corps: res.data
        })
    })
  },

  onReachBottom() {
    const db = wx.cloud.database();
    db.collection('corp').where({
      status: 'verifying'
    }).skip(
      this.data.corps.length
    ).limit(10).get().then((res) => {
      let corps = this.data.corps
      corps.push(...res.data)
      this.setData(
        {
          corps
        })
    })
  }
})
