const regeneratorRuntime = require("../../../common/runtime")
const { alert } = require("../../../common/common")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: '',
  },

  onLoad(options) {
    //评估企业的id
    this.data.corp = options.corp
  },

  getPositionName(e) {
    this.data.position = e.detail.value
  },
  
  async createPosition() {
    if (this.data.position == '') {
      alert('请输入岗位名称')
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      const _ = db.command
      await db.collection('eval-positions').add({
        data: {
          owner: this.data.corp,
          name: this.data.position, 
          evalCount: 0
        }
      })
      wx.navigateBack()
    } catch (err) {
      alert(err.errMsg)
      console.log(err)
    } finally {
      wx.hideLoading()
    }
  }
})