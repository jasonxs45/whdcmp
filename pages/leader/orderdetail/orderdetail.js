const app = getApp()
import {
  colorMap
} from '../../../common/config.js'
import {
  fetch
} from '../../../common/api/index.js'
import {
  baseUrl
} from '../../../common/api/config.js'
import {
  formatTime
} from '../../../common/utils/util.js'
Page({
  data: {
    id: '',
    content: '',
    room: '',
    position: '',
    desc: '',
    imgs: [],
    finishpicture: [],
    uploadImages: [],
    statu: '',
    colorMap
  },
  // 拨打电话
  teleCall(e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  // 获取内容
  getContent(cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetHouseTrouble',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let data = res.data.Data
        // data.AddTime = formatTime(new Date(data.AddTime))
        let imgs = res.data.Data.ScenePicture ? res.data.Data.ScenePicture.split(',') : []
        let arr = imgs.map(item => {
          item = !item.includes(baseUrl) ? baseUrl + item : item
          return item
        })
        let finishpicture = res.data.Data.FinishPicture ? res.data.Data.FinishPicture.split(',') : []
        this.setData({
          content: data,
          imgs: arr,
          finishpicture
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  preview(e) {
    let current = e.currentTarget.dataset.src
    let group = e.currentTarget.dataset.group
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: group // 需要预览的图片http链接列表
    })
  },
  onLoad(options) {
    console.log(this.options)
    this.setData({
      id: options.id || '',
      statu: options.statu || ''
    })
  },
  onReady() { },
  onShow() {
    this.getContent()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.getContent(() => {
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
})