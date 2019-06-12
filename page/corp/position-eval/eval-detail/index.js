const regeneratorRuntime = require("../../../common/runtime")
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
      this.data.coefficient = res.data.coefficient
      res = await db.collection('eval-positions').doc(options.position).get()
      const position = res.data
      res = await db.collection('evaluation').where({
        corp: options.corp,
        position: position._id
      }).get()
      
      this.setData({
        evals: this.getMeanEvaluation(res.data)
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  getMeanEvaluation(evals) {
    const results = []
    if (evals.length > 0) {
      const evalCounts = evals.length
      const dimensions = evals[0].result.length
      for (let i = 0; i < dimensions; i++) {
        let sum = 0
        evals.forEach(e => {
          sum += e.result[i].score
        })
        results.push({
          dimension: evals[0].result[i].dimension,
          score: (sum * this.data.coefficient / evalCounts).toFixed(0)
        })
      }
    }
    return results
  }
})