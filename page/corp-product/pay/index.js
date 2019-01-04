const regeneratorRuntime = require("../../common/runtime")
Page({
  data: {
    order: {}
  },

  onLoad({ id }) {
    this.setData({
      out_trade_no: id
    })
    this.getOrder(id)
  },

  pay() {
    let orderQuery = this.data.order
    const {
      time_stamp,
      nonce_str,
      sign,
      prepay_id,
    } = orderQuery;
    wx.requestPayment({
      timeStamp: time_stamp,
      nonceStr: nonce_str,
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5',
      paySign: sign,
      success: res => {
        this.finishPay()
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  async finishPay() {
    wx.showLoading()
    try {
      let out_trade_no = this.data.out_trade_no
      const res  = await wx.cloud.callFunction({
        name: 'pay',
        data: {
          type: 'finishPay',
          data: {
            out_trade_no
          }
        }
      })
      await this.getOrder(out_trade_no)
    } finally {
      wx.hideLoading()
    }
  },

  async close() {
    wx.showLoading({
      title: '正在取消订单'
    })
    try {
      let out_trade_no = this.data.out_trade_no
      const res = await wx.cloud.callFunction({
        name: 'pay',
        data: {
          type: 'closeorder',
          data: {
            out_trade_no
          }
        }
      })
      await this.getOrder(out_trade_no)
      wx.hideLoading()
      wx.showToast({
        title: '订单已取消'
      })
    } catch(err) {
      wx.hideLoading()
    }
  },

  async getOrder(id) {
    const res = await wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'orderquery',
        data: {
          out_trade_no: id
        }
      }
    })
    this.setData({
      order: res.result.data
    });
  }
})
