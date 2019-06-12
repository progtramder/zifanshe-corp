function alert(tilte) {
  wx.showModal({
    content: tilte,
    showCancel: false,
    confirmColor: '#F56C6C'
  })
}

module.exports = {
  alert: alert,
};