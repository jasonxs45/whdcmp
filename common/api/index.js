import {
  baseUrl,
  api
} from './config.js'
let fetch = data => {
  return new Promise((resolve, reject) => {
    let _self = this
    wx.request({
      url: baseUrl + api,
      method: 'POST',
      data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '网络错误，请稍后再试',
          showCancel: false
        })
        reject(res)
      }
    })
  })
}
export {
  fetch
}