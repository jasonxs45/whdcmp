import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  $,
  $$
} from '../../../common/utils/util.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  engineerInfo: {},
  data: {
    tabMenus: [
      {
        name: '正式验房',
        target: 'formal'
      },
      {
        name: '模拟验房',
        target: 'mock'
      }
    ],
    activeTabIndex: 0,
    moveBarStyle: '',
    pulldown: true,
    list: {
      mock: [],
      formal: []
    },
    listByBuilding: {
      mock: [],
      formal: []
    },
    listModes: [
      'problems',
      'buildings'
    ],
    activelistMode: 1
  },
  // 切换显示列表显示方式
  toggleListMode() {
    this.data.activelistMode = Math.abs(this.data.activelistMode - 1)
    if (this.data.activelistMode === 0) {
      this.getList()
    }
    if (this.data.activelistMode === 1) {
      this.getListByBuilding()
    }
    this.setData({
      activelistMode: this.data.activelistMode
    })
  },
  tabChangeHandler(e) {
    let activeTabIndex = e.target.dataset.index
    this.setData({
      activeTabIndex
    })
    this.moveBar()
  },
  swiperChangeHandler(e) {
    this.setData({
      activeTabIndex: e.detail.current
    })
    this.moveBar()
    if (this.data.activelistMode === 0) {
      this.getList()
    }
    if (this.data.activelistMode === 1) {
      this.getListByBuilding()
    }
  },
  moveBar() {
    if (wx.canIUse('vibrateShort')) {
      wx.vibrateShort()
    }
    $$('.tabnav-item').boundingClientRect(rect => {
      let target = rect[this.data.activeTabIndex]
      this.setData({
        moveBarStyle: `left:${target.left + target.width * .2}px;width:${target.width * .6}px`
      })
    }).exec()
  },
  getList(cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetHouseCheckForD',
      Data: JSON.stringify({
        StaffID: store.roleInfo.ID,
        Types: this.data.tabMenus[this.data.activeTabIndex].name
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let target = this.data.tabMenus[this.data.activeTabIndex].target
        let str = `list.${target}`
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
          [str]: res.data.Data
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getListByBuilding(cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetHouseCheckListForListType',
      Data: JSON.stringify({
        StaffID: store.roleInfo.ID,
        Statu: this.data.tabMenus[this.data.activeTabIndex].name
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let target = this.data.tabMenus[this.data.activeTabIndex].target
        let str = `listByBuilding.${target}`
        this.setData({
          [str]: res.data.Data
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
    wx.navigateTo({
      url: `/pages/holder/problemlist/problemlist?id=${id}&status=${status}`
    })
  },
  tenlist() {
    wx.navigateTo({
      url: `/pages/holderlist/batchlist/check`
    })
  },
  getDetailByBuilding(e) {
    let HouseCheckID = e.target.dataset.batchid
    let name = e.target.dataset.name
    let typeText = this.data.tabMenus[this.data.activeTabIndex].name
    wx.navigateTo({
      url: `/pages/holder/batchdetail/batch-list?HouseCheckID=${HouseCheckID}&name=${name}&typeText=${typeText}`,
    })
  },
  onLoad(options) {},
  onReady() { },
  onShow() {
    this.moveBar()
    if (this.data.activelistMode === 0) {
      this.getList()
    }
    if (this.data.activelistMode === 1) {
      this.getListByBuilding()
    }
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    if (this.data.activelistMode === 0) {
      this.getList(() => {
        wx.stopPullDownRefresh()
      })
    }
    if (this.data.activelistMode === 1) {
      this.getListByBuilding(() => {
        wx.stopPullDownRefresh()
      })
    }
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