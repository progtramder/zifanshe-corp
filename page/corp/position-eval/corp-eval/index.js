const regeneratorRuntime = require("../../../common/runtime")
const { formatEvaluation } = require("../../../common/common")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positions: []
  },

  async onLoad(options) {
    wx.hideShareMenu({})
    const {id, corp} = options
    this.setData({
      docId: id
    })
    wx.setNavigationBarTitle({
      title: corp,
    })

    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      const res = await db.collection('eval-corp').doc(id).get()
      this.setData({
        coefficient: res.data.coefficient
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      let positions = this.data.positions
      while(1) {
        const res = await db.collection('eval-positions').where({
          owner: this.data.docId
        }).skip(positions.length).limit(20).get()
        positions.push(...res.data)
        if (res.data.length < 20) {
          break
        }
      }
      this.setData({
        positions,
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  createPosition() {
    wx.navigateTo({
      url: `../position/index?corp=${this.data.docId}`
    })
  },

  onShareAppMessage(res) {
    this.setData({
      showModal: false
    })

    const position = this.data.positions[this.data.shareIndex]
    const title = `${position.name}岗位评估`
    return {
      title,
      path: `/page/corp/position-eval/eval/index?corp=${this.data.docId}&position=${position._id}&title=${title}`,
      imageUrl: '/image/evaluation.png'
    }
  },

  onShare(e) {
    this.setData({
      shareIndex: e.currentTarget.dataset.index,
      showModal: true
    })
  },
  closeModal() {
    this.setData({
      showModal: false
    })
  },
  async createReport() {
    try {
      wx.showLoading({
        title: '正在生成评估报告',
      })
      const evaluations = []
      const positions = this.data.positions
      const db = wx.cloud.database()
      for(let i = 0; i < positions.length; i++) {
        let res = await db.collection('evaluation').where({
          corp: positions[i].owner,
          position: positions[i]._id
        }).get()
        evaluations.push({
          position: positions[i].name,
          evaluation: formatEvaluation(res.data, this.data.coefficient)
        })
      }

      const res = await wx.cloud.callFunction({
        name: 'evaluation',
        data: {
          cloudPath: `eval-report/${this.data.docId}.xlsx`,
          coefficient: this.data.coefficient,
          evaluations
        }
      })
      const { fileID: file } = res.result
      wx.navigateTo({
        url: `../eval-report/index?file=${file}`,
      })
    } finally {
      wx.hideLoading()
    }
  },
})