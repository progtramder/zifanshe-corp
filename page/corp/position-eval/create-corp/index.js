const regeneratorRuntime = require("../../../common/runtime")
const {alert} = require("../../../common/common")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gdp: [
      '1亿以下',
      '1亿-2亿',
      '2亿-3亿',
      '3亿-5亿',
      '5亿-10亿',
      '10亿以上'
    ],
    personnel: [
      '50人以下',
      '50-100人',
      '100-300人',
      '300-500人',
      '500-1000人',
      '1000人以上'
    ],

    //coeffinect for evaluation
    coefficient: [
      [1, 0.95, 0.9, 0.85, 0.8, 0.75],
      [1.1, 1, 0.95, 0.9, 0.85, 0.8],
      [1.2, 1.1, 1, 0.95, 0.9, 0.85],
      [1.3, 1.2, 1.1, 1, 0.95, 0.9],
      [1.4, 1.3, 1.2, 1.1, 1, 0.95],
      [1.5, 1.4, 1.3, 1.2, 1.1, 1]
    ],

    corpName: '',
    corpGDP: '',
    corpPersonnel : ''
  },

  onLoad(options) {
  },

  getCorpName(e) {
    this.data.corpName = e.detail.value
  },
  gdpChange(e) {
    const index = e.detail.value
    this.setData({
      corpGDP: this.data.gdp[index]
    })
  },
  personnelChange(e) {
    const index = e.detail.value
    this.setData({
      corpPersonnel: this.data.personnel[index]
    })
  },
  getCoefficient(corpGDP, corpPersonnel) {
    let indexGDP, indexPersonnel
    this.data.gdp.forEach((e, index) => {
      if (e == corpGDP) {
        indexGDP = index
        return
      }
    })
    this.data.personnel.forEach((e, index) => {
      if (e == corpPersonnel) {
        indexPersonnel = index
        return
      }
    })

    return this.data.coefficient[indexGDP][indexPersonnel];
  },
  async createCorp() {
    if (this.data.corpName == '') {
      alert('请输入企业名称')
      return
    }
    if (this.data.corpGDP == '') {
      alert('请选择企业产值规模')
      return
    }
    if (this.data.corpPersonnel == '') {
      alert('请选择企业人员规模')
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      await db.collection('eval-corp').add({
        data: {
          owner: app.getCorpId(),
          corpName: this.data.corpName,
          corpGDP: this.data.corpGDP,
          corpPersonnel: this.data.corpPersonnel,
          coefficient: this.getCoefficient(this.data.corpGDP, this.data.corpPersonnel),
        }
      })
      wx.navigateBack()
    } catch (err) {
      alert('网络异常')
      console.log(err)
    } finally {
      wx.hideLoading()
    }
  }
})