import {
  observer
} from '../../common/utils/mobx-wxapp'
import {
  watch,
  computed
} from '../../common/utils/vuefy.js'
import {
  fetch
} from '../../common/api/index'
import {
  baseUrl,
  api
} from '../../common/api/config.js'
import {
  getRoles,
  getUserInfo
} from '../../common/api/login.js'
const app = getApp()
let store = app.globalData.store
const roles = [{
    name: '验房管理员',
    icon: '../../images/checkengineer.png',
    type: 3
  },
  {
    name: '施工单位',
    icon: '../../images/repairengineer.png',
    type: 2
  },
  {
    name: '维修管理员',
    icon: '../../images/manager.png',
    type: 1
  },
  {
    name: '数据报表',
    icon: '../../images/leader.png',
    type: 4
  }
]
Page(observer({
  store
})({
  data: {
    roles
  },
  check(Types) {
    let UID = wx.getStorageSync('unionid')
    return getRoles(UID, Types)
  },
  start(e) {
    let type = e.target.dataset.type
    let roleArr
    wx.showLoading({
      mask: true
    })
    this.check(type).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        store.upRoleInfo(res.data.Data)
        roleArr = store.roleInfo.Type
        let url = ''
        switch (type) {
          case 3:
            url = '/pages/checkengineer/check/check'
            break
          case 2:
            url = '/pages/holder/batchlist/batchlist'
            break
          case 1:
            url = '/pages/repairengineer/batchlist/batchlist'
            break
          case 4:
            url = '/pages/leader/batchlist/batchlist'
            break
          default:
            url = ''
            break
        }
        wx.navigateTo({
          url
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '对不起，您没有查看此栏目的权限！',
          showCancel: false
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 极端网络情况下登录和授权
  login() {
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
  getUserInfoHandler(e) {
    if (!e.detail.iv) {
      wx.showModal({
        title: '提示',
        content: '授权失败，请重新登录',
        showCancel: false
      })
      return
    }
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    getUserInfo(store.openid, encryptedData, iv).then(res => {
      if (res.data.IsSuccess) {
        // 拿到个人unionid
        let UID = res.data.Data.unionId
        wx.setStorageSync('unionid', UID)
        store.upunionid(UID)
        getRoles(UID).then(res => {
          wx.hideLoading()
          if (res.data.IsSuccess) {
            store.upRoleInfo(res.data.Data)
          }
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  onLoad(options) {},
  onReady() {},
  onShow() {},
  onHide() {
    app.globalData.store = store
  },
  onUnload() {
    app.globalData.store = store
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
}))