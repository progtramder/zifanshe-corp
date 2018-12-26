const app = getApp()
module.exports = {
  updateRedDot: updateRedDot,
  updateRedDotAdmin: updateRedDotAdmin
};

function hasNewOrder() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection('order').where({
      beneficiary: app.getCorpId(),
      status: 1
    }).count().then((res) => {
      resolve(res.total > 0)
    })
  })
}
function hasNewMessage() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection('message').where({
      receiver: app.getCorpId(),
    }).get().then((res) => {
      if (res.data.length) {
        resolve(res.data[0].unread)
      } else {
        resolve(false)
      }
    })
  })
}

function hasNewVerifying() {
  const db = wx.cloud.database();
  return new Promise((resolve, reject) => {
    db.collection('corp').where({
      status: 'verifying'
    }).count().then((res) => {
      resolve(res.total > 0)
    })
  })
}

function updateRedDot(hostPage) {
  let promise = Promise.all([hasNewMessage(), hasNewOrder()])
  promise.then(res => {
    if (hostPage) {
      hostPage.setData({
        newMessage: res[0],
        newOrder: res[1]
      })
    }
    if (res[0] || res[1]) {
      wx.showTabBarRedDot({index: 2})
    } else {
      wx.hideTabBarRedDot({index: 2})
    }
  })
}

function updateRedDotAdmin(hostPage) {
  let promise = Promise.all([hasNewVerifying(), hasNewMessage(), hasNewOrder()])
  promise.then(res => {
    if (hostPage) {
      hostPage.setData({
        newVerifying: res[0],
        newMessage: res[1],
        newOrder: res[2]
      })
    }
    if (res[0] || res[1] || res[2]) {
      wx.showTabBarRedDot({index: 2})
    } else {
      wx.hideTabBarRedDot({index: 2})
    }
  })
}
