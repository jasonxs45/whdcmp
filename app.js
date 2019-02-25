import {
  login,
  getRoles
} from 'common/api/login.js'
import {
  fetch
} from 'common/api/index.js'
import { 
  baseUrl,
  api
} from '/common/api/config.js'
import store from 'store/index'
import { observer } from 'common/utils/mobx-wxapp'
App(observer({store})({
  onLaunch () {
    wx.login({
      success: res => {
        if (res.code) {
          // 如果本地已经有unionid 直接去请求角色信息
          if (wx.getStorageSync('unionid')) {
            console.log('本地存在uid，直接用来请求个人信息')
            let UID = wx.getStorageSync('unionid')
            // 更新全局store
            store.upunionid(UID)
            wx.showLoading({
              title: '获取信息中'
            })
            getRoles(UID).then(res => {
              wx.hideLoading()
              if (res.data.IsSuccess) {
                store.upRoleInfo(res.data.Data)
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.data.Message
                })
              }
            }).catch(err => {
              console.log(err)
            })
          // 如果本地没有unionid，调用服务器login方法
          } else {
            console.log('本地没有uid， 去微信服务器换取uid')
            wx.showLoading({
              title: '获取信息中'
            })
            wx.request({
              url: baseUrl + api,
              data: {
                Act: 'HCLogin',
                Data: JSON.stringify({
                  code: res.code
                })
              },
              success: res => {
                let openid = res.data.Data.OpenID
                store.upopenid(openid)
                /**
                 * 分情况
                 * 1.在其他地方授权，已经有unionid
                 * 2.从未授权,返回值不存在unionid
                 * */
                if (res.data.Data.UID) {
                  console.log('拿到unionid')
                  let UID = res.data.Data.UID
                  console.log(UID)
                  store.upunionid(UID)
                  /**===================缓存在本地================= */
                  wx.setStorageSync('unionid', UID)
                  getRoles(UID).then(res => {
                    wx.hideLoading()
                    if (res.data.IsSuccess) {
                      store.upRoleInfo(res.data.Data)
                    } else {
                      wx.showToast({
                        icon: 'none',
                        title: res.data.Message
                      })
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                } else {
                  console.log('没拿到unionid，按钮触发授权')
                  wx.hideLoading()
                  // 没有unionid,指向首页
                  wx.redirectTo({
                    url: '/pages/index/index'
                  })
                  wx.setStorageSync('unionid', '')
                  store.upunionid('')
                }
              },
              fail: () => {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '登录失败，请检查网络',
                  showCancel: false
                })
              }
            })
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  onShow() {
  },
  globalData: {
    store,
    signImage: '',
    shareConf: {
      title: '武汉地产移动验房',
      path: '/pages/mine/mine',
      imgUrl: '/images/share.png'
    }
  }
}))
