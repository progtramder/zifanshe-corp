const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    name: '',
    phone: '',
    intro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id}) {
    if (id) {
      const db = wx.cloud.database()
      const res = await db.collection('corp').doc(id).get()
      const corp = res.data
      this.setData({
        corpId: id,
        logo: corp.logo,
        name: corp.name,
        phone: corp.phone,
        intro: corp.intro
      })
    }
  },

  changeLogo() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          logo: res.tempFilePaths[0]
        })
      },
    })
  },

  getName(e) {
    this.data.name = e.detail.value
  },

  getPhone(e) {
    this.data.phone = e.detail.value
  },

  getIntro(e) {
    this.data.intro = e.detail.value
  },
  
  async onFinish() {
    if (this.data.name == '' || this.data.phone == '') {
      this.alert('请完整填写内容')
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      let corpId = this.data.corpId
      const newApply = corpId ? false : true
      if (!corpId) {
        const res = await db.collection('corp').add({
          data: {
            status: 'verifying'
          },
        })
        corpId = res._id
        app.setCorpId(corpId)
        this.setData({
          corpId
        })
      }

      const suffix = (file) => {
        let suffix = file.match(/\.\w+$/)
        if (suffix) return suffix[0]
        return ''
      }
      if (!this.data.logo.match(/^cloud:\/\//)) {
        const res = await new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `image/corp-logo/${corpId}${suffix(this.data.logo)}`,
            filePath: this.data.logo,
            success: res => {
              resolve({ file: res.fileID })
            },
            fail: err => {
              reject(err)
            },
          })
        })
        this.data.logo = res.file
      }
     
      await wx.cloud.callFunction({
        name: 'database',
        data: {
          func: 'dbupdate',
          collect: 'corp',
          docId: corpId,
          data: {
            logo: this.data.logo,
            name: this.data.name,
            phone: this.data.phone,
            intro: this.data.intro
          }
        }
      })

      newApply ? this.alert('提交成功，请耐心等待审核通过') : this.alert('保存成功')
    } catch (err) {
      this.alert('请检查网络')
      console.log(err)
    } finally {
      wx.hideLoading()
    }
  },

  alert(tilte) {
    wx.showModal({
      content: tilte,
      showCancel: false,
      confirmColor: '#F56C6C'
    })
  }
})