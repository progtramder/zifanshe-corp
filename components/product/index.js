Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    product: [],
    customer: {
      name: '',
      phone: '',
      note: ''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getName(e) {
      this.data.customer.name = e.detail.value
    },
    getPhone(e) {
      this.data.customer.phone = e.detail.value
    },
    getNote(e) {
      this.data.customer.note = e.detail.value
    },
    init(product) {
      this.setData({
        product
      })
    },
    setUserInfo(customer) {
      this.setData({
        customer
      })
    },
    popUserInfo() {
      this.setData({
        showUserInfo: true
      })
    },
    hideUserInfo() {
      this.setData({
        showUserInfo: false
      })
    },
    confirm() {
      this.triggerEvent("submit");
    },
    cancel() {
      this.hideUserInfo()
    },
    previewCover() {
      wx.previewImage({
        urls: [this.data.product.cover],
        current: this.data.product.cover
      })
    },
    previewDetail(e) {
      let urls = []
      this.data.product.detail.forEach(item => {
        if (item.type == 'image') {
          urls.push(item.src)
        }
      })
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.imgpath
      })
    }
  }
})
