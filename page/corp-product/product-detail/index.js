const regeneratorRuntime = require("../../common/runtime")
const app = getApp()
Page({
  data: {
  },
  async onLoad(options) {
    try {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database();
      let res = await db.collection('product').where({
        _id: options.id
      }).get()
      let product = res.data[0]
      wx.setNavigationBarTitle({ title: product.name })
      this.selectComponent("#product").init(product)
      res = await db.collection('corp').doc(product.owner).get()
      this.setData({
        product,
        logo: res.data.logo
      })
    } finally {
      wx.hideNavigationBarLoading()
    }
  },

  async onPay() {
    this.data.customer = {
      name: '',
      phone: '',
      note: ''
    }
    try {
      wx.showLoading()
      if (!app.getOpenId()) {
        const res = await wx.cloud.callFunction({ name: 'login' })
        const { openId } = res.result
        app.setOpenId(openId)
      }
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