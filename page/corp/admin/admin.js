Page({
  onLoad() {
    const db = wx.cloud.database();
    db.collection('consultant').where({
      status: 'verifying'
    }).limit(10).get().then((res) => {
      this.setData(
        {
          consultants: res.data
        })
    })
  },

  onReachBottom() {
    const db = wx.cloud.database();
    db.collection('consultant').where({
      status: 'verifying'
    }).skip(
      this.data.consultants.length
    ).limit(10).get().then((res) => {
      let cons = this.data.consultants
      cons.push(...res.data)
      this.setData(
        {
          consultants: cons
        })
    })
  }
})
