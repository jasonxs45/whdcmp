import { observer } from '../../../common/utils/mobx-wxapp'
import {
  fetch
} from '../../../common/api/index.js'
import {
  colorMap
} from '../../../common/config.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: '',
    checkid: '',
    houseid: '',
    content: null,
    colorMap
  },
  getData(cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetHouseDeliver',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let content = res.data.Data
        console.log(content)
        this.setData({
          content
        })
      }
      cb && cb()
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
      cb && cb()
    })
  },
  goProblemDetail (e) {
    let id = e.currentTarget.dataset.pid
    let statu = e.currentTarget.dataset.statu
    wx.navigateTo({
      url: `/pages/checkengineer/orderdetail/orderdetail?id=${id}&statu=${statu}`
    })
  },
  teleCall (e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  goAccept () {
    let id = this.data.id
    let checkid = this.data.checkid
    wx.navigateTo({
      url: `/pages/checkengineer/accept/accept?id=${id}&checkid=${checkid}`,
    })
  },
  onLoad(options) {
    let id = options.id
    let checkid = options.checkid
    this.setData({
      id,
      checkid
    })
  },
  onReady() { },
  onShow() {
     this.getData()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.getData(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() { },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.shareConf.title,
      path: app.globalData.shareConf.path,
      imageUrl: app.globalData.shareConf.imgUrl,
      success(res) {
        // 转发成功
      },
      fail(res) {
        // 转发失败
      }
    }
  }
}))