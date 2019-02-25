import {
  observer
} from '../../../common/utils/mobx-wxapp'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({
  store
})({
  typeText: '',
  data: {
    building: '',
    unit: '',
    floor: '',
    houseno: '',
    list: []
  },
  getList(cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetHouseCheckForEForListType',
      Data: JSON.stringify({
        StaffID: store.roleInfo.ID,
        Building: this.data.building,
        Unit: this.data.unit,
        Types: this.typeText,
        RoomNum: this.data.houseno
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let data = res.data.Data.map(item => {
          item.Btn = item.Btn.map(btn => {
            btn = {
              name: btn.split(':')[0],
              count: btn.split(':')[1]
            }
            return btn
          })
          return item
        })
        this.setData({
          list: data
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getDetail(e) {
    let id = e.target.dataset.batchid
    let status = e.target.dataset.type
    let houseno = e.target.dataset.houseno
    wx.navigateTo({
      url: `/pages/repairengineer/shproblemlist/shproblemlist?id=${id}&status=${status}&houseno=${houseno}&building=${this.data.building}&unit=${this.data.unit}`
    })
  },
  onLoad(options) {
    this.data.building = options.building
    this.data.unit = options.unit
    this.data.floor = options.floor
    this.data.houseno = options.houseno
    this.typeText = options.typeText
    this.setData({
      building: this.data.building,
      unit: this.data.unit,
      floor: this.data.floor,
      houseno: this.data.houseno
    })
  },
  onReady() {},
  onShow() {
    this.getList()
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {
    this.getListByBuilding(() => {
      wx.stopPullDownRefresh()
    })
  },
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