Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      file: options.file
    })
  },

  viewDocument() {
    const file = this.data.file
    wx.cloud.downloadFile({
      fileID: file,
      success: function (res) {
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  copyLink() {
    const file = this.data.file
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: file,
      }]
    }).then(res => {
      const link = res.fileList[0].tempFileURL
      wx.setClipboardData({
        data: link,
        success(res) {
          wx.showToast({
            title: '复制成功',
            duration: 1000,
          })
        }
      })
    }).catch(error => {
      console.log(err)
    })
  }
})