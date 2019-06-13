const regeneratorRuntime = require("../../../common/runtime")
const { alert } = require("../../../common/common")

const model = [
  {
    factor: '影响力',
    definition: '反映职位在收入、成本的控制，决策制定等方面对于组织的影响',
    subItem: [
      {
        desc: '影响的性质',
        standard: [
          {
            evaluation: '基本没影响',
            score: 20
          },
          {
            evaluation: '只对当时的工作有影响',
            score: 40
          },
          {
            evaluation: '所做的决策对企业有短期影响',
            score: 60
          },
          {
            evaluation: '所做的决策对企业有一段时间的影响',
            score: 80
          },
          {
            evaluation: '所做的决策对企业有长期的影响',
            score: 100
          },
        ]
      },
      {
        desc: '影响的程度',
        standard: [
          {
            evaluation: '无大经济责任，工作差错可忽略，无大的影响',
            score: 20
          },
          {
            evaluation: '有限的经济责任，如有差错也只是在小范围内引起的推迟或影响本部门的工作和利益',
            score: 40
          },
          {
            evaluation: '有一定的经济责任，如有差错会影响部门之间的工作或影响公司的工作和利益',
            score: 60
          },
          {
            evaluation: '负有较大的经济责任，如有差错，其结果直接影响公司较大的经济利益',
            score: 80
          },
          {
            evaluation: '负有很大的经济责任，如有错会严重影响公司的利益和名誉',
            score: 100
          },
        ]
      },
    ]
  },
  {
    factor: '解决问题的能力',
    definition: '衡量职位工作复杂程度和未能解决问题给公司带来的风险大小',
    subItem: [
      {
        desc: '复杂程度',
        standard: [
          {
            evaluation: '进行简单的重复性工作，无须个人判断',
            score: 10
          },
          {
            evaluation: '按工作程序要求进行工作，只需简单的指示即可完成工作，不需计划和独立判断',
            score: 20
          },
          {
            evaluation: '需进行专门训练才可胜任工作，大部分时候只需一种专业技术，偶尔需要进行独立判断或计划',
            score: 30
          },
          {
            evaluation: '工作时需运用多种专业技能，经常做独立判断和计划，要有相当高的解决问题的能力',
            score: 40
          },
          {
            evaluation: '工作要求高度的判断力和计划性，要求积极地适应不断变化的环境和问题',
            score: 50
          },
        ]
      },
      {
        desc: '风险程度',
        standard: [
          {
            evaluation: '无任何风险',
            score: 20
          },
          {
            evaluation: '仅有一些小风险，一旦发生问题不会给公司造成多大影响',
            score: 40
          },
          {
            evaluation: '有一定的风险，一旦发生问题，给公司造成的影响能明显感觉到',
            score: 60
          },
          {
            evaluation: '有较大风险，一旦发生问题，会给公司带来较严重的损害',
            score: 80
          },
          {
            evaluation: '有极大风险，一旦发生问题，对公司造成重大影响，甚至会致使公司经济发生危机乃至倒闭',
            score: 100
          },
        ]
      },
    ]
  },
  {
    factor: '领导力',
    definition: '指在正常工作中需要参与的决策以及对工作结果承担的责任',
    subItem: [
      {
        desc: '决策的层次',
        standard: [
          {
            evaluation: '工作中常做一些小的决定，一般不影响他人',
            score: 10
          },
          {
            evaluation: '工作中需要做一些大的决定，只影响与自己有工作关系的部分一般职工',
            score: 20
          },
          {
            evaluation: '工作中需要做一些对所属人员有影响的决策',
            score: 30
          },
          {
            evaluation: '工作中需要做一些大的决策，但必须与其它部门负责人共同协商方可',
            score: 40
          },
          {
            evaluation: '工作需要参加最高层决策',
            score: 50
          },
        ]
      },
      {
        desc: '对工作结果负责',
        standard: [
          {
            evaluation: '只对自己的工作结果负责',
            score: 20
          },
          {
            evaluation: '需对自己和所监督、指导者的工作结果负责',
            score: 40
          },
          {
            evaluation: '对整个部门的全部工作结果负责',
            score: 60
          },
          {
            evaluation: '对整个公司几个部门的工作结果负责',
            score: 80
          },
          {
            evaluation: '对整个公司的工作结果负责',
            score: 100
          },
        ]
      },
    ]
  },
  {
    factor: '沟通能力',
    definition: '主要反映该职位要求任职者应具备的沟通能力',
    subItem: [
      {
        desc: '沟通的难度',
        standard: [
          {
            evaluation: '为了达成工作目标，与沟通对象进行简单的沟通和交流',
            score: 10
          },
          {
            evaluation: '与沟通对象做一般性的沟通和交流',
            score: 20
          },
          {
            evaluation: '与沟通对象做比较困难的沟通和交流',
            score: 30
          },
          {
            evaluation: '与沟通对象做复杂的沟通和交流',
            score: 40
          },
          {
            evaluation: '与沟通对象艰难的沟通和交流',
            score: 50
          },
        ]
      },
      {
        desc: '沟通的范围',
        standard: [
          {
            evaluation: '很少与外界联系，只要管理好自己的工作，基本无配合要求',
            score: 10
          },
          {
            evaluation: '本部门范围内的工作联系，进行内部工作配合',
            score: 20
          },
          {
            evaluation: '在本部门或其他部门之间进行较多的工作配合',
            score: 30
          },
          {
            evaluation: '经常在部门之间进行较多的配合，工作联系频繁',
            score: 40
          },
          {
            evaluation: '进行广泛的公司内外工作联系， 配合要求较高',
            score: 50
          },
        ]
      },
    ]
  },
  {
    factor: '岗位知识',
    definition: '主要反映该职位要求任职者应具备的知识范围和专业深度',
    subItem: [
      {
        desc: '知识的专业深度',
        standard: [
          {
            evaluation: '对工作所属的专业领域有基本的了解',
            score: 10
          },
          {
            evaluation: '对工作所属的专业领域有一定的专业知识和工作方法',
            score: 20
          },
          {
            evaluation: '对工作所属的专业领域有丰富的专业知识和工作方法',
            score: 30
          },
          {
            evaluation: '熟练掌握所属工作领域的专业知识和工作方法',
            score: 40
          },
          {
            evaluation: '熟练掌握所属工作领域的专业知识和工作方法，并能根据工作需要不断改进和优化',
            score: 50
          },
        ]
      },
      {
        desc: '知识的广度',
        standard: [
          {
            evaluation: '企业运营管理需要的某一个专业领域的简单知识和方法',
            score: 10
          },
          {
            evaluation: '企业运营管理需要的某一个专业领域部分的知识和方法',
            score: 20
          },
          {
            evaluation: '企业运营管理需要的某一个专业领域的知识和方法',
            score: 30
          },
          {
            evaluation: '企业运营管理需要的某几个专业领域的知识和方法',
            score: 40
          },
          {
            evaluation: '企业运营管理需要的全面知识和方法',
            score: 50
          },
        ]
      },
    ]
  },
  {
    factor: '工作范围和区域',
    definition: '主要反映该职位工作的范围',
    subItem: [
      {
        desc: '工作的地域范围',
        standard: [
          {
            evaluation: '工作只在单一项目的工作区域',
            score: 10
          },
          {
            evaluation: '工作涉及城市内不同项目的工作区域',
            score: 20
          },
          {
            evaluation: '工作涉及跨城市的工作区域',
            score: 30
          },
          {
            evaluation: '工作涉及跨地区的工作区域',
            score: 40
          },
          {
            evaluation: '工作涉及全国性的工作区域',
            score: 50
          },
        ]
      },
      {
        desc: '工作的专业范围',
        standard: [
          {
            evaluation: '工作涉及企业运营的单一职能体系下面的个别工作领域',
            score: 10
          },
          {
            evaluation: '工作涉及企业运营的单一职能体系下面的多个工作领域',
            score: 20
          },
          {
            evaluation: '工作涉及企业运营的单一职能体系的全面工作',
            score: 30
          },
          {
            evaluation: '工作涉及企业运营的2个以上职能体系',
            score: 40
          },
          {
            evaluation: '工作涉及企业运营全部的职能体系',
            score: 50
          },
        ]
      },
    ]
  },
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: [
      { name: '岗位直接主管', weight: 0.5},
      { name: '公司分管领导', weight: 0.15 },
      { name: 'HR负责人', weight: 0.25 },
      { name: '外部专家顾问', weight: 0.1 },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try {
      wx.showNavigationBarLoading()
      //获取评估人的openId
      let res = await wx.cloud.callFunction({ name: 'login' })
      const { openId } = res.result

      //检查是否已经评估过
      const db = wx.cloud.database();
      res = await db.collection('evaluation').where({
        corp: options.corp,
        position: options.position,
        _openid: openId
      }).get()
      const docId = res.data.length == 0 ? '' : res.data[0]._id
      const result = []
      model.forEach(e1 => {
        e1.subItem.forEach(e2 => {
          result.push({ dimension: `${e1.factor}/${e2.desc}`, score: 0 })
        })
      })

      this.setData({
        evalId: docId,
        showModal: docId == '' ? true : false,
        evaluatorName: '',
        evaluatorRole: '',
        corp: options.corp, //评估企业的id
        position: options.position, //待评估岗位的id
        evalModel: model,
        result
      })
      wx.setNavigationBarTitle({
        title: options.title || '岗位评估',
      })

      //处理因为网络问题引起的问题
      this.exception = {status: false}
    } catch(err) {
      //异常发生后需要重新加载页面，所以保存好options
      this.exception = {status: true, data: options}
      alert('网络异常，请下拉页面重新加载')
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onPullDownRefresh() {
    if (this.exception.status) {
      await this.onLoad(this.exception.data)
    }
    wx.stopPullDownRefresh()
  },

  async submitEval() {
    const result = this.data.result
    for (let i = 0; i < result.length; i++) {
      if (result[i].score == 0) {
        alert(`请选择<${result[i].dimension}>`)
        return
      }
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database();
      if (this.data.evalId == '') {
        //如果没有评估过则添加字段
        await db.collection('evaluation').add({
          data: {
            corp: this.data.corp,
            position: this.data.position,
            evaluatorName: this.data.evaluatorName,
            evaluatorRole: this.data.evaluatorRole,
            weight: this.data.weight,
            result: this.data.result
          }
        })
        //更新评估人总数
        await wx.cloud.callFunction({
          name: 'database',
          data: {
            func: 'incEvalCount',
            docId: this.data.position
          }
        })
      } else {
        //修改原有字段
        await db.collection('evaluation').doc(this.data.evalId).update({
          data: {
            result: this.data.result
          }
        })
      }

      wx.showModal({
        content: '提交成功',
        showCancel: false,
        confirmColor: '#F56C6C',
        success: (res) => {
          wx.switchTab({
            url: '/page/corp/index',
          })
        }
      })
    } catch(err) {
      alert('网络异常')
      console.log(err)
    } finally {
      wx.hideLoading()
    }
  },

  radioChange(e) {
    const indexString = e.currentTarget.dataset.index
    const indices = indexString.split('-')
    const factorIndex = Number(indices[0])
    const subIndex = Number(indices[1])
    const evalIndex = Number(e.detail.value)
    const dimension = `${model[factorIndex].factor}/${model[factorIndex].subItem[subIndex].desc}`
    const score = model[factorIndex].subItem[subIndex].standard[evalIndex].score
    const result = this.data.result
    result.forEach((e, index) => {
      if (e.dimension == dimension) {
        this.data.result[index].score = score
        return
      }
    })
  },

  getEvaluatorName(e) {
    this.data.evaluatorName = e.detail.value
  },

  roleChange(e) {
    const index = e.detail.value
    this.setData({
      evaluatorRole: this.data.role[index].name
    })
  },

  closeModal() {
    if (this.data.evaluatorName == '') {
      alert('请输入评估人姓名')
      return
    }
    if (this.data.evaluatorRole == '') {
      alert('请选择评估人角色')
      return
    }

    this.data.role.forEach(e => {
      if (e.name == this.data.evaluatorRole) {
        this.data.weight = e.weight
        return
      }
    })

    this.setData({
      showModal: false
    })
  }
})