import {
  fetch
} from '../../../common/api/index.js'
import {
  formatTime
} from '../../../common/utils/util.js'
Page({
  data: {
    EngineerID: '',
    HouseCheckID: '',
    HouseID: '',
    records: []
  },
  _getRecords () {
    return fetch({
      Act: 'HCGetNoAcceptLogList',
      Data: JSON.stringify({
        StaffID: this.data.EngineerID,
        HouseCheckID: this.data.HouseCheckID,
        HouseID: this.data.HouseID
      })
    })
  },
  getRecords (cb) {
    wx.showLoading({
      mask: true
    })
    this._getRecords().then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let records = res.data.Data.map(item => {
          item.Time = formatTime(new Date(item.Time))
          item.Tip = item.Tip ? item.Tip.split(',') : []
          return item
        })
        this.setData({
          records
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      cb && cb()
    })
  },
  onLoad (options) {
    this.setData({
      EngineerID: options.EngineerID,
      HouseCheckID: options.HouseCheckID,
      HouseID: options.HouseID
    })
  },
  onReady () {},
  onShow () {
    this.getRecords()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {
    this.getRecords(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom () {},
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