const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  data: {
  },
  onLoad(options) {
    this.data.product_id = options.id
  },
  async onShow() {
    try {
      wx.showNavigationBarLoading()
      if (!app.getOpenId()) {
        const res = await wx.cloud.callFunction({ name: 'login' })
        const { openId } = res.result
        app.setOpenId(openId)
      }

      let product = this.data.product
      let logo = this.data.logo
      const db = wx.cloud.database();
      if (!product) {
        let res = await db.collection('product').where({
          _id: this.data.product_id
        }).get()
        product = res.data[0]
        wx.setNavigationBarTitle({ title: product.name })
        res = await db.collection('corp').doc(product.owner).get()
        logo = res.data.logo
      }
      
      //判断用户是否已经购买该产品
      let purchased = false
      const res = await db.collection('order').where({
        payer: app.getOpenId(),
        product: product._id,
        status: 1 //已支付
      }).get()
      if (res.data.length > 0) {
        for (let i = 0; i < product.detail.length; i++) {
          if (product.detail[i].locker === true) {
            product.detail[i].locker = false
          }
        }
        purchased = true
      }
      this.selectComponent("#product").init(product)
      
      this.setData({
        product,
        logo,
        purchased
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onPay() {
    if (this.data.purchased) {
      return
    }

    this.data.customer = {
      name: '',
      phone: '',
      note: ''
    }
    try {
      wx.showLoading()
      const db = wx.cloud.database()
      const res = await db.collection('customer').where({
        _openid: app.getOpenId()
      }).get()
      if (res.data.length > 0) {
        const { name, phone, note } = res.data[0]
        this.data.customer = { name, phone, note }
      } 
    } finally {
      wx.hideLoading()
    }
    this.selectComponent("#product").setUserInfo(this.data.customer)
    this.selectComponent("#product").popUserInfo()
  },

  async viewDocument(event) {
    const document = event.detail
    const locker = document.locker
    const product = this.data.product
    if (product.price > 0 && locker) {
      const db = wx.cloud.database()
      const res = await db.collection('order').where({
        payer: app.getOpenId(),
        product: product._id,
        status: 1 //已支付
      }).get()
      if (res.data.length == 0) {
        wx.showModal({
          content: '付费内容，购买后可解锁',//'付费内容，输入验证码或购买后可解锁',
          showCancel: false,
          confirmColor: '#F56C6C',
          confirmText: '知道了'
        })
        return
      }
    }
    const docPath = document.src
    wx.showLoading({
      title: '正在下载文件',
    })
    wx.cloud.downloadFile({
      fileID: docPath,
      success: function (res) {
        wx.openDocument({
          filePath: res.tempFilePath,
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  async playVideo(event) {
    const component = event.detail
    const product = this.data.product
    const db = wx.cloud.database()
    const res = await db.collection('order').where({
      payer: app.getOpenId(),
      product: product._id,
      status: 1 //已支付
    }).get()
    if (res.data.length == 0) {
      wx.showModal({
        content: '付费内容，购买后可解锁',//'付费内容，输入验证码或购买后可解锁',
        showCancel: false,
        confirmColor: '#F56C6C',
        confirmText: '知道了'
      })
    } else {
      component.unlockVideo()
    }
  },

  onSubmitOrder() {
    const customer = this.data.customer
    if (customer.name == '' || customer.phone == '') {
      wx.showModal({
        content: '请留下姓名和电话以便购买成功后我们联系您',
        showCancel: false,
        confirmColor: '#F56C6C'
      })
      return
    }
    const db = wx.cloud.database()
    db.collection('customer').where({
      _openid: app.getOpenId()
    }).get().then(res => {
      if (res.data.length == 0) {
        db.collection('customer').add({
          data: {
            name: customer.name,
            phone: customer.phone,
            note: customer.note
          }
        })
      } else {
        const docId = res.data[0]._id
        db.collection('customer').doc(docId).update({
          data: {
            name: customer.name,
            phone: customer.phone,
            note: customer.note
          }
        })
      }
    })
    
    wx.showLoading({ title: '正在下单' });
    let id = this.data.product._id;
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'unifiedorder',
        data:
        {
          customer,
          goodId: id
        }
      }
    }).then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: `../pay/index?id=${res.result.data.out_trade_no}`
      })
      this.selectComponent("#product").hideUserInfo()
      
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      path: `page/corp-product/product-detail/index?id=${this.data.product._id}`
    }
  }
})