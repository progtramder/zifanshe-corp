const regeneratorRuntime = require("../../../common/runtime")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    name:  '',
    brief: '',
    price: '',
    category: 'diagnosis',
    detail: [],
    deletedFiles: [] //对于视频和图片两种类型删除数据库的同时还要删除文件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = "产品上架"
    if (options.id) {
      title = "产品编辑"
      this.setData({
        productId: options.id
      })
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      db.collection('product').where({
        _id: options.id
      }).get().then((res) => {
        wx.hideNavigationBarLoading()
        let product = res.data[0]
        this.selectComponent("#rich_editor").init(product.detail)
        this.setData({
          cover: product.cover,
          name: product.name,
          brief: product.brief,
          price: product.price / 100,
          category: product.category,
          detail: product.detail
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

  getProductBrief(e) {
    this.data.brief = e.detail.value
  },

  getProductPrice(e) {
    //价格变动需要更新文档或视频的locker状态，所以需要setData
    this.setData({
      price: e.detail.value
    })
  },

  getProductName(e) {
    this.data.name = e.detail.value
  },

  radioChange(e) {
    this.data.category = e.detail.value
  },

  check() {
    if (this.data.name == '') {
      this.alert('产品名称不能为空')
      return false
    } else if (this.data.cover == '') {
      this.alert('请选择封面图片')
      return false
    }

    return true
  },

  async onFinish() {
    if (!this.check()) {
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      let productId = this.data.productId
      if (!productId) {
        const res = await db.collection('product').add({
          data: {
            owner: app.getCorpId()
          },
        })
        productId = res._id
      }

      const suffix = (file) => {
        let suffix = file.match(/\.\w+$/)
        if (suffix) return suffix[0]
        return ''
      }
      if (!this.data.cover.match(/^cloud:\/\//)) {
        const res = await new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `product/${productId}-cover-${new Date().getMilliseconds()}${suffix(this.data.cover)}`,
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
              cloudPath: `product/${productId}-${Date.now()}${suffix(e.src)}`,
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
          collect: 'product',
          docId: productId,
          data: {
            cover: this.data.cover,
            name: this.data.name,
            brief: this.data.brief,
            category: this.data.category,
            price: this.data.price * 100,
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
    } catch(err) {
      this.alert(err.errMsg)
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
    const {nodeList, node} = event.detail
    this.setData({
      detail: nodeList
    })
    if (node.type != 'text' && node.src.match(/^cloud:\/\//)) {
      this.data.deletedFiles.push(node.src)
    }
  }
})