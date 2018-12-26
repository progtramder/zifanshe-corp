const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false
  },

  onLoad(options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('requirement').where({
      owner: app.getCorpId()
    }).limit(10).get().then((res) => {
      wx.hideNavigationBarLoading()
      this.setData(
        {
          requirement: res.data,
          isEmpty: res.data.length == 0
        })
    })
  },

  onReachBottom() {
    const db = wx.cloud.database();
    db.collection('requirement').where({
      owner: app.getCorpId()
    }).skip(
      this.data.requirement.length
    ).limit(10).get().then((res) => {
      let requirement = this.data.requirement
      requirement.push(...res.data)
      this.setData(
        {
          requirement
        })
    })
  },

  clearRequirement(deleted) {
    const files = []
    files.push(deleted.cover)
    deleted.detail.forEach(e => {
      if (e.type != 'text') files.push(e.src)
    })
    wx.cloud.deleteFile({
      fileList: files
    })
  },

  deleteRequirement(e) {
    const index = e.currentTarget.dataset.index
    let requirement = this.data.requirement
    wx.showModal({
      content: '确定删除吗？',
      confirmColor: '#F56C6C',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('requirement').doc(
            requirement[index]._id
          ).remove().then(res => {
            const deleted = requirement.splice(index, 1)
            this.setData({
              requirement
            })
            this.clearRequirement(deleted[0])
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.selectComponent(`#${e.currentTarget.id}`).reset()
        }
      }
    })
  },
  shelve() {
    wx.navigateTo({
      url: "shelve/index"
    })
  }
})