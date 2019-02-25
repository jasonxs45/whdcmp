import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: '',
    parts: [],
    activePartIndex: 0,
    showFilter: false,
    pulldown: true,
    indexStr: '',
    list: [],
    roomNum: '',
    partID: 0,
    status: '',
    showForm: false,
    reasons: [],
    reasonIndex: 0,
    reasonText: '',
    curTroubleID: '',
    handleBoxShow: false,
    handleReason: '',
    pageIndex: 0,
    nomore: true,
    inputBuilding: '',
    inputUnit: ''
  },
  // 筛选相关
  showFilterBox() {
    if (this.data.parts.length > 0) {
      this.setData({
        showFilter: true
      })
    } else {
      this.getParts()
      this.setData({
        showFilter: true
      })
    }
  },
  hideFilterBox() {
    this.setData({
      showFilter: false
    })
  },
  // 房号input
  roomNumChange (e) {
    let roomNum = e.detail.value
    this.setData({
      roomNum
    })
  },
  buildingChange(e) {
    let inputBuilding = e.detail.value
    this.setData({
      inputBuilding
    })
  },
  unitChange(e) {
    let inputUnit = e.detail.value
    this.setData({
      inputUnit
    })
  },
  // 单选
  radioChange (e) {
    let partID = e.detail.value
    this.setData({
      partID
    })
  },
  // 重置
  clearFilters () {
    this.data.pageIndex = 0
    let parts = this.data.parts.map(item => {
      item.checked = false
      return item
    })
    this.setData({
      roomNum: '',
      partID: 0,
      parts,
      inputBuilding: '',
      inputUnit: ''
    })
  },
  // 筛选
  doFilt () {
    this.data.pageIndex=0
    this.getList(() => {
      this.hideFilterBox()
    })
  },
  // 获取状态
  getParts () {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPart',
      Data: JSON.stringify({
        HouseID: 0
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let parts = res.data.Data
        this.setData({
          parts
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getList (cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    fetch({
      Act: 'HCGetTroubleList',
      Data: JSON.stringify({
        StaffID: store.roleInfo.ID,
        HouseCheckID: this.data.id,
        RoomNum: this.data.roomNum,
        Building: this.data.inputBuilding,
        Unit: this.data.inputUnit,
        PartID: this.data.partID,
        Status: this.data.status,
        PageIndex: this.data.pageIndex
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        if (res.data.Data.list.length < 20) {
          this.data.nomore = true
        } else {
          this.data.nomore = false
        }
        let list = this.data.list
        if (this.data.pageIndex === 0) {
          list = res.data.Data.list
        } else {
          list = list.concat(res.data.Data.list)
        }
        this.setData({
          indexStr: res.data.Data.No,
          list,
          nomore: this.data.nomore
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  openRefuse (e) {
    let curTroubleID = e.target.dataset.tid
    this.setData({
      showForm: true,
      curTroubleID
    })
    if (this.data.reasons.length < 1) {
      this.getReasons()
    }
  },
  closeRefuse() {
    this.setData({
      showForm: false,
      curTroubleID: ''
    })
  },
  // 拒绝受理的理由
  getReasons () {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '拒单理由'
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let reasons = res.data.Data
        this.setData({
          reasons
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  pickerChange (e) {
    let reasonIndex = e.detail.value
    this.setData({
      reasonIndex
    })
  },
  textareaChange (e) {
    let reasonText = e.detail.value
    this.setData({
      reasonText
    })
  },
  // 受理
  getHandle (e) {
    let Status = '处理中'
    let TroubleID = e.target.dataset.tid
    let ReasonID = 0
    let Contents = ''
    let StaffID = store.roleInfo.ID
    wx.showModal({
      title: '提示',
      content: '确定受理吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '施工单位'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '受理成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.getList()
              }, 1000)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  },
  // 拒单
  getRefuse (e) {
    if (!this.data.reasons.length) {
      wx.showToast({
        icon: 'none',
        title: '网络错误请重试',
        mask: true
      })
      return
    }
    let Status = '申请拒绝'
    let TroubleID = this.data.curTroubleID
    let ReasonID = this.data.reasons[this.data.reasonIndex].ID
    let Contents = this.data.reasonText
    let StaffID = store.roleInfo.ID
    if (!Contents.trim()) {
      wx.showToast({
        icon: 'none',
        title: '具体原因不能为空',
        mask: true
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定拒绝吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({mask:true})
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '施工单位'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '提交申请成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.getList(() => {
                  this.closeRefuse()
                })
              }, 1000)
            }
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
        }
      }
    })
  },
  // 完成
  openHandleBox (e) {
    let curTroubleID = e.target.dataset.tid
    this.setData({
      handleBoxShow: true,
      curTroubleID
    })
  },
  closeHandleBox() {
    this.setData({
      handleBoxShow: false,
      curTroubleID: ''
    })
  },
  handleBoxChange (e) {
    let handleReason = e.detail.value
    this.setData({
      handleReason
    })
  },
  getFinish (e) {
    let Status = '已处理'
    let TroubleID = this.data.curTroubleID
    let ReasonID = 0
    let Contents = this.data.handleReason
    let StaffID = store.roleInfo.ID
    if (!Contents.trim()) {
      wx.showToast({
        icon: 'none',
        title: '通过说明不能为空',
        mask: true
      })
      return
    }
    this.closeHandleBox()
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCAccTrouble',
      Data: JSON.stringify({
        TroubleID,
        Status,
        ReasonID,
        Contents,
        StaffID,
        Types: '施工单位'
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        wx.showToast({
          title: '已处理成功',
          mask: true
        })
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          this.getList()
        }, 1000)
      }
    }).catch(err => {
      wx.hideLoading()
      this.getList()
      console.log(err)
    })
  },
  // 恢复并受理
  getReset (e) {
    let Status = '恢复并受理'
    let TroubleID = e.target.dataset.tid
    let ReasonID = 0
    let Contents = ''
    let StaffID = store.roleInfo.ID
    wx.showModal({
      title: '提示',
      content: '确定恢复并受理吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          fetch({
            Act: 'HCAccTrouble',
            Data: JSON.stringify({
              TroubleID,
              Status,
              ReasonID,
              Contents,
              StaffID,
              Types: '施工单位'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '恢复并受理成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                this.getList()
              }, 1000)
            }
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
        }
      }
    })
  },
  getDetail(e) {
    let id = e.currentTarget.dataset.id
    let status = this.data.status
    wx.navigateTo({
      url: `/pages/holder/problemdetail/problemdetail?id=${id}&status=${status}`
    })
  },
  onLoad(options) {
    let id = options.id
    let status = options.status
    console.log(id, status)
    this.setData({
      id,
      status
    })
    wx.setNavigationBarTitle({
      title: `问题列表-${status}`
    })
  },
  onReady() { },
  onShow() {
    // this.getParts()
    this.getList()
    // this.getReasons()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.data.pageIndex = 0
    this.getList(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    if (this.data.nomore) {
      return
    }
    this.data.pageIndex++
    this.getList()
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