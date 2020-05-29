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
    },
    lockVideo: true
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
    },
    viewDocument(e) {
      const document = e.currentTarget.dataset.document
      this.triggerEvent("viewDocument", document)
    },

    dismiss() {
      //当mask接收到touchmove消息时默认会传递给其他节点，这样会导致
      //视频误打开，产生严重bug，所以此处截获后不再传递
    },
    unlockVideo(e) {
      this.setData({
        lockVideo: false
      })
    },

    playVideo(e) {
      this.triggerEvent("playVideo", this)
    }
  }
})
