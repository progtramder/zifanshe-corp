const regeneratorRuntime = require("../../../common/runtime")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    name:  '',
    brief: '',
    price: '',
    detail: []
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
        this.setData(
          {
            cover: product.cover,
            name: product.name,
            brief: product.brief,
            price: product.price / 100,
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
    if (e.detail.value == '') {
      return
    }
    if (e.detail.value < 0.01) {
      this.alert("金额太小")
      this.setData({
        price: ''
      })
      return
    }
    this.data.price = e.detail.value
  },

  getProductName(e) {
    this.data.name = e.detail.value
  },

  async onFinish() {
    if (this.data.name == '' || this.data.price == '' || this.data.cover == '') {
      this.alert('请完整填写内容')
      return
    }

    try {
      wx.showLoading()
      const db = wx.cloud.database()
      let productId = this.data.productId
      if (!productId) {
        const res = await db.collection('product').add({
          data: {
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
            cloudPath: `product/${productId}-cover${suffix(this.data.cover)}`,
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
              cloudPath: `product/${productId}-${index}${suffix(e.src)}`,
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
      await db.collection('product').doc(productId).update({
        data: {
          cover: this.data.cover,
          name: this.data.name,
          brief: this.data.brief,
          price: this.data.price * 100,
          detail: this.data.detail
        },
      })

      wx.navigateBack()
    } catch(err) {
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

  detailChanged(event) {
    let nodeList = event.detail
    this.setData({
      detail: nodeList
    })
  },
})