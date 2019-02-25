import {
  observer
} from '../../../common/utils/mobx-wxapp'
import {
  watch,
  computed
} from '../../../common/utils/vuefy.js'
import {
  $,
  $$
} from '../../../common/utils/util.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({
  store
})({
  data: {
    FansID: '',
    buildingName: '',
    HouseCheckID: '',
    Building: '',
    curUnitIndex: 0,
    unitList: [],
    activeFilterIndex: 0,
    filters: [{
        name: '全部',
        dot: 'all'
      },
      {
        name: '待检查',
        dot: 'default'
      },
      {
        name: '处理中',
        dot: 'warn'
      },
      {
        name: '已处理',
        dot: 'success'
      }
      // ,{
      //   name: '已确认',
      //   dot: 'passed'
      // }
    ],
    pulldown: true,
    list: []
  },
  init() {
    let title = this.data.buildingName ? this.data.buildingName + '栋' : '测试楼'
    wx.setNavigationBarTitle({
      title
    })
    this.moveBar()
  },
  filterChangeHandler(e) {
    let activeFilterIndex = e.target.dataset.index || e.currentTarget.dataset.index
    this.setData({
      activeFilterIndex
    })
    this.moveBar()
    // 过滤的逻辑
    let keywords = this.data.filters[this.data.activeFilterIndex].name
    this.getFloors(keywords)
  },
  moveBar() {
    if (wx.canIUse('vibrateShort')) {
      wx.vibrateShort()
    }
    $$('.filter').boundingClientRect(rect => {
      let target = rect[this.data.activeFilterIndex]
      this.setData({
        moveBarStyle: `left:${target.left + target.width * .2}px;width:${target.width * .6}px`
      })
    }).exec()
  },
  pickerChangeHandler(e) {
    let curUnitIndex = e.detail.value
    this.setData({
      curUnitIndex
    })
    let keywords = this.data.filters[this.data.activeFilterIndex].name
    this.getFloors(keywords)
  },
  // 获取单元
  getUnits(status, cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetUnitList',
      Data: JSON.stringify({
        HouseCheckID: this.data.HouseCheckID,
        FansID: this.data.FansID,
        Building: this.data.buildingName
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let unitList = res.data.Data
        this.setData({
          unitList
        })
        this.getFloors(status, cb)
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取楼层
  getFloors(Statu = '', cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetBuildUnitList',
      Data: JSON.stringify({
        HouseCheckID: this.data.HouseCheckID,
        FansID: this.data.FansID,
        Building: this.data.buildingName,
        Unit: this.data.unitList[this.data.curUnitIndex],
        Statu
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let list = res.data.Data
        list.forEach(item => {
          item.infolosts.forEach(house => {
            let classname = house.statu === '已确认' ?
              'passed' :
              house.statu === '已处理' ?
              'success' :
              house.statu === '处理中' ?
              'warn' :
              'default'
            house.classname = classname
          })
        })
        this.setData({
          list,
          computedList: list
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
      cb && cb()
    })
  },
  // 跳转页面
  goHouseDetail(e) {
    let id = e.target.dataset.houseid
    let houseno = e.target.dataset.houseno
    let statu = e.target.dataset.statu
    let building = e.target.dataset.building
    let floor = e.target.dataset.floor
    let unit = e.target.dataset.unit

    if (statu == "已处理" || statu == "已确认") {
      wx.navigateTo({
        url: `/pages/checkengineer/acceptdetail/acceptdetail?id=${id}&checkid=${this.data.HouseCheckID}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/leader/housedetail/housedetail?id=${id}&houseno=${houseno}&building=${building}&floor=${floor}&unit=${unit}`,
      })
    }
  },
  onLoad(options) {
    let buildingName = options.name || ''
    let HouseCheckID = options.HouseCheckID || ''
    let Building = options.Building || ''
    console.log()
    this.setData({
      FansID: store.roleInfo.FansID,
      HouseCheckID,
      buildingName
    })
    this.init()
  },
  onReady() {},
  onShow() {
    this.getUnits()
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {
    this.getUnits(this.data.filters[this.data.activeFilterIndex].name, () => {
      console.log(1)
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {},
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