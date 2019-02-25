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
Page({
  data: {
    id: null,
    house: {},
    activeTabIndex: 0,
    tabs: [
      {
        name: '问题图示'
      },
      {
        name: '问题列表'
      }
    ],
    colorMap,
    categories: categoryMap,
    qrcode: '',
    qrShow: false,
    problems: [],
    showFilter: false,
    selectedstates: '',
    selectedrooms: '',
    selectedroomsID: 0,
    selectedpositions: '',
    selectedpositionsID: 0,
    states,
    rooms: [],
    positions: [],
    roompoints: [],
    fetchAgain: false
  },
  init() {
    this.watchFilters('states')
    this.watchFilters('rooms')
    this.watchFilters('positions')
  },
  swiperChangeHandler (e) {
    let activeTabIndex = e.detail.current
    this.setData({
      activeTabIndex
    })
  },
  // 获取二维码
  getQRCode () {
    if (!this.data.qrcode) {
      wx.showLoading({
        title: '请稍候。。',
        mask: true
      })
      fetch({
        Act: 'HCGetHouseQr',
        Data: JSON.stringify({
          HouseID: this.data.id
        })
      }).then(res => {
        wx.hideLoading()
        if (res.data.IsSuccess) {
          let qrcode = res.data.Data
          this.setData({
            qrcode
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    } else {
      this.setData({
        qrShow: true
      })
    }
  },
  showQRCode () {
    wx.hideLoading()
    this.setData({
      qrShow: true
    })
  },
  // 关闭弹窗
  hideQRCode () {
    this.setData({
      qrShow: false
    })
  },
  // 查看问题详细
  goOrderDetail (e) {
    let id = e.currentTarget.dataset.id
    let statu = e.currentTarget.dataset.state
    wx.navigateTo({
      url: `/pages/checkengineer/orderdetail/orderdetail?id=${id}&statu=${statu}`,
    })
  },
  // 收楼页面
  goAccept () {
    wx.showModal({
      title: '提示',
      content: '是否确认已完成验房？',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/checkengineer/accept/accept?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
          })
        }
      }
    })
  },
  // 不收楼页面
  goRefuse() {
    wx.navigateTo({
      url: '/pages/checkengineer/refuse/refuse?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
    })
  },
  // 获取图片和描点
  _getRoomPoint () {
    return fetch({
      Act: 'HCGetRoomPoint',
      Data: JSON.stringify({
        HouseID: this.data.id
      })
    })
  },
  // 前往添加问题
  goAddNew () {
    wx.navigateTo({
      url: '/pages/checkengineer/addnew/addnew?id=' + this.data.id + '&checkid=' + this.data.house.HouseCheckID,
    })
  },
  // 带参数添加问题
  goAddNewWithPara (e) {
    let RoomID = e.target.dataset.roomid
    wx.navigateTo({
      url: `/pages/checkengineer/addnew/addnew?id=${this.data.id}&checkid=${this.data.house.HouseCheckID}&roomid=${RoomID}`,
    })
  },
  // 筛选相关
  showFilterBox () {
    this.setData({
      showFilter: true
    })
    this.getParts()
  },
  hideFilterBox() {
    this.setData({
      showFilter: false
    })
  },
  checkboxChange (e) {
    let name = e.currentTarget.dataset.target
    let target = this.data[name]
    let value = e.detail.value
    target.map(item => {
      if (value == item.ID) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.watchFilters (name)
    if (name === 'rooms') {
      this.getPartRes()
    }
  },
  watchFilters (name, clear = false) {
    // clear 表示清空
    let arr
    if (clear) {
      arr = this.data[name].map(item => item.checked = false)
      if (arr.length < 1) return
      this.setData({
        [`selected${name}`]: '',
        [`selected${name}ID`]: '',
        [name]: this.data[name]
      })
    } else {
      arr = this.data[name].filter(item => item.checked)
      if (arr.length < 1) return
      this.setData({
        [`selected${name}`]: arr[0].Name,
        [`selected${name}ID`]: arr[0].ID,
        [name]: this.data[name]
      })
    }
  },
  clearFilters () {
    // this.watchFilters('states', true)
    this.watchFilters('rooms', true)
    this.watchFilters('positions', true)
    this.setData({
      positions: []
    })
  },
  // 切换tab
  tabTap (e) {
    let activeTabIndex = e.target.dataset.index
    this.setData({
      activeTabIndex
    })
  },
  // 请求房子信息
  _getHouse () {
    return fetch({
      Act: 'HCGetHouseList',
      Data: JSON.stringify({
        ID: this.data.id
      })
    })
  },
  getHouse () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      fetchAgain: false
    })
    return this._getHouse().then(res => {
      return new Promise((resolve, reject) => {
        if (res.data.IsSuccess) {
          let house = res.data.Data.House
          house.Huxing.Picture = baseUrl + house.Huxing.Picture
          house.fullName = res.data.Data.Name
          this.setData({
            house
          })
          Promise.all([this._getRoomPoint(), this._getProblems()]).then(res => {
            wx.hideLoading()
            if (res[0].data.IsSuccess) {
              let roompoints = res[0].data.Data
              roompoints.forEach(item => {
                item.x = 100 * item.x / this.data.house.Huxing.PicW + '%'
                item.y = 100 * item.y / this.data.house.Huxing.PicH + '%'
              })
              this.setData({
                roompoints
              })
            }
            if (res[1].data.IsSuccess) {
              let problems = res[1].data.Data
              this.setData({
                problems
              })
            }
            resolve(res)
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
        }
      })
    }).catch(err => {
      // wx.hideLoading()
      this.setData({
        fetchAgain: true
      })
      console.log(err)
    })
  },
  // 请求问题列表
  _getProblems(RoomID = 0, PartID = 0, PartResID = 0, Status = '') {
    return fetch({
      Act: 'HCGetHouseTroubleList',
      Data: JSON.stringify({
        HouseID: parseInt(this.data.id),
        HouseCheckID: this.data.house.HouseCheckID,
        RoomID,
        PartID,
        PartResID,
        Status
      })
    })
  },
  // 获取部位
  getParts () {
    if (this.data.rooms.length > 0) {
      return
    }
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPart',
      Data: JSON.stringify({
        HouseID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let rooms = res.data.Data
        this.setData({
          rooms,
          positions: []
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 获取部品
  getPartRes () {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPartRes',
      Data: JSON.stringify({
        ID: this.data.selectedroomsID
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let positions = res.data.Data
        this.setData({
          positions,
          selectedpositions: '',
          selectedpositionsID: 0
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  // 确定筛选
  doFilt () {
    wx.showLoading({
      mask: true
    })
    this._getProblems(0, this.data.selectedroomsID, this.data.selectedpositionsID, '').then(res => {
      wx.hideLoading()
      this.hideFilterBox()
      if (res.data.IsSuccess) {
        let problems = res.data.Data
        this.setData({
          problems
        })
      }
    }).catch(err => {
      wx.hideLoading()
      this.hideFilterBox()
      this.setData({
        fetchAgain: true
      })
      console.log(err)
    })
  },
  onLoad (options) {
    let id = options.id || ''
    let building = options.building
    let floor = options.floor
    let unit = options.unit
    let houseno = options.houseno
    let title = houseno ? building + '-' + unit + '-' + houseno  : '测试房号1203'
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      id
    })
    this.init()
  },
  onReady () {},
  onShow () {
    this.getHouse().then(res => {
      if (!this.data.qrcode) {
        this.getQRCode()
      }
    })
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
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