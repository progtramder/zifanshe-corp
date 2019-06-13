const regeneratorRuntime = require("../../../common/runtime")
const { formatEvaluation } = require("../../../common/common")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      let res = await db.collection('eval-corp').doc(options.corp).get()
      const coefficient = res.data.coefficient
      res = await db.collection('evaluation').where({
        corp: options.corp,
        position: options.position
      }).get()
      
      const evaluation = formatEvaluation(res.data, coefficient)
      this.setData({
        evals: evaluation.mean,
        totalScore: evaluation.total
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
})