import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  colorMap,
  categoryMap,
  states,
  positions
} from '../../../common/config.js'
import {
  fetch
} from '../../../common/api/index.js'
import {
  baseUrl
} from '../../../common/api/config.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: null,
    house: {},
    colorMap,
    categories: categoryMap.filter(item => item.name !== '已通过'),
    problems: []
  },
  init() {
  },
  // 查看问题详细
  goOrderDetail(e) {
    let id = e.currentTarget.dataset.id
    let statu = e.currentTarget.dataset.state
    wx.navigateTo({
      url: `/pages/leader/orderdetail/orderdetail?id=${id}&statu=${statu}`,
    })
  },
  // 请求房子信息
  getHouse(cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetHouseList',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let house = res.data.Data.House
        house.Huxing.Picture = baseUrl + house.Huxing.Picture
        this.setData({
          house
        })
        this.getProblems(0, 0, 0, '', cb)
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  // 请求问题列表
  getProblems(RoomID = 0, PartID = 0, PartResID = 0, Status = '', cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetHouseTroubleList',
      Data: JSON.stringify({
        HouseID: parseInt(this.data.id),
        HouseCheckID: this.data.house.HouseCheckID,
        RoomID,
        PartID,
        PartResID,
        Status
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let problems = res.data.Data
        this.setData({
          problems
        })
      }
      cb && cb()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  // 暂不接收记录
  goRefuse () {
    let EngineerID = store.roleInfo.ID
    let HouseCheckID = this.data.house.HouseCheckID
    let HouseID = this.data.id
    wx.navigateTo({
      url: `/pages/leader/refuserecord/refuserecord?EngineerID=${EngineerID}&HouseCheckID=${HouseCheckID}&HouseID=${HouseID}`,
    })
  },
  onLoad(options) {
    console.log(options)
    let id = options.id || ''
    let building = options.building
    let floor = options.floor
    let unit = options.unit
    let houseno = options.houseno
    let title = houseno ? building + '-' + unit + '-' + houseno : '测试房号1203'
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      id
    })
    this.init()
  },
  onReady() { },
  onShow() {
    this.getHouse()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.getHouse(() => {
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