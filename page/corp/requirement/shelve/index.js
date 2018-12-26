const regeneratorRuntime = require("../../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    name: '',
    brief: '',
    detail: [],
    deletedFiles: [] //对于视频和图片两种类型删除数据库的同时还要删除文件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = "需求上架"
    if (options.id) {
      title = "需求编辑"
      this.setData({
        requirementId: options.id
      })
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      db.collection('requirement').where({
        _id: options.id
      }).get().then((res) => {
        wx.hideNavigationBarLoading()
        let requirement = res.data[0]
        this.selectComponent("#rich_editor").init(requirement.detail)
        this.setData(
          {
            cover: requirement.cover,
            name: requirement.name,
            brief: requirement.brief,
            detail: requirement.detail
          })
      })
    }

    wx.setNavigationBarTitle({
      title
    })
  },

  addCover() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          cover: res.tempFilePaths[0]
        })
      },
    })
  },

  getBrief(e) {
    this.data.brief = e.detail.value
  },

  getName(e) {
    this.data.name = e.detail.value
  },

  async onFinish() {
    if (this.data.name == '' || this.data.brief == '' || this.data.cover == '') {
      this.alert('请完整填写内容')
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      let requirementId = this.data.requirementId
      if (!requirementId) {
        const res = await db.collection('requirement').add({
          data: {
            owner: app.getCorpId()
          },
        })
        requirementId = res._id
      }

      const suffix = (file) => {
        let suffix = file.match(/\.\w+$/)
        if (suffix) return suffix[0]
        return ''
      }
      if (!this.data.cover.match(/^cloud:\/\//)) {
        const res = await new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `requirement/${requirementId}-cover${suffix(this.data.cover)}`,
            filePath: this.data.cover,
            success: res => {
              resolve({ file: res.fileID })
            },
            fail: err => {
              reject(err)
            },
          })
        })
        this.data.cover = res.file
      }
      for (let index = 0; index < this.data.detail.length; index++) {
        const e = this.data.detail[index]
        if (e.type != 'text' && !e.src.match(/^cloud:\/\//)) {
          const res = await new Promise((resolve, reject) => {
            wx.cloud.uploadFile({
              cloudPath: `requirement/${requirementId}-${Date.now()}${suffix(e.src)}`,
              filePath: e.src,
              success: res => {
                resolve({ file: res.fileID })
              },
              fail: err => {
                reject(err)
              },
            })
          })
          e.src = res.file
        }
      }

      await wx.cloud.callFunction({
        name: 'database',
        data: {
          func: 'dbupdate',
          collect: 'requirement',
          docId: requirementId,
          data: {
            cover: this.data.cover,
            name: this.data.name,
            brief: this.data.brief,
            detail: this.data.detail
          }
        }
      })

      if (this.data.deletedFiles.length > 0) {
        wx.cloud.deleteFile({
          fileList: this.data.deletedFiles
        })
      }
      wx.navigateBack()
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
  },

  addDetail(event) {
    let nodeList = event.detail
    this.setData({
      detail: nodeList
    })
  },

  deleteDetail(event) {
    const { nodeList, node } = event.detail
    this.setData({
      detail: nodeList
    })
    if (node.type != 'text' && node.src.match(/^cloud:\/\//)) {
      this.data.deletedFiles.push(node.src)
    }
  }
})