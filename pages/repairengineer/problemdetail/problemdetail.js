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
    status: '',
    timeout: false,
    content: null,
    showForm: false,
    refuseReasons: [],
    refuseReasonIndex: 0,
    refuseReasonText: '',
    showClose: false,
    closeReasons: [],
    closeReasonIndex: 0,
    closeReasonText: ''
  },
  getContent(cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetTrouble',
      Data: JSON.stringify({
        TroubleID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let content = res.data.Data
        content.troubleinfo.FinishPicture = content.troubleinfo.FinishPicture
          ? content.troubleinfo.FinishPicture.split(',') : []
        content.troubleinfo.ScenePicture = content.troubleinfo.ScenePicture
          ? content.troubleinfo.ScenePicture.split(',') : []
        this.setData({
          content,
          status: content.troubleinfo.Status,
          timeout: content.troubleinfo.IsTimeOut
        })
        cb && cb()
      }
    })
    .catch(err =>{
      wx.hideLoading()
      console.log(err)
    })
  },
  openRefuse(e) {
    let curTroubleID = this.data.id
    this.setData({
      showForm: true,
      curTroubleID
    })
    if (this.data.refuseReasons.length < 1) {
      this.getRefuseReasons()
    }
  },
  closeRefuse() {
    this.setData({
      showForm: false,
      curTroubleID: ''
    })
  },
  openClose(e) {
    let curTroubleID = this.data.id
    this.setData({
      showClose: true,
      curTroubleID
    })
    if (this.data.closeReasons.length < 1) {
      this.getCloseReasons()
    }
  },
  closeClose() {
    this.setData({
      showClose: false,
      curTroubleID: ''
    })
  },
  // 驳回理由
  getRefuseReasons() {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '驳回理由'
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let refuseReasons = res.data.Data
        this.setData({
          refuseReasons
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  // 关闭理由
  getCloseReasons() {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCCanCelReasonList',
      Data: JSON.stringify({
        Types: '终止理由'
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let closeReasons = res.data.Data
        this.setData({
          closeReasons
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  pickerChange(e) {
    let refuseReasonIndex = e.detail.value
    this.setData({
      refuseReasonIndex
    })
  },
  textareaChange(e) {
    let refuseReasonText = e.detail.value
    this.setData({
      refuseReasonText
    })
  },
  pickerChange1(e) {
    let closeReasonIndex = e.detail.value
    this.setData({
      closeReasonIndex
    })
  },
  textareaChange1(e) {
    let closeReasonText = e.detail.value
    this.setData({
      closeReasonText
    })
  },
  // 超时提醒
  timeoutAlert(e) {
    let TroubleID = e.target.dataset.tid
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCSendTemp',
      Data: JSON.stringify({
        TroubleID
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        wx.showModal({
          title: '提示',
          content: '超时提醒已发送！',
          showCancel: false
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  DisContractor(e) {
    let TroubleID = e.target.dataset.tid
    let status = this.data.status
    wx.navigateTo({
      url: `/pages/repairengineer/uptrouble/uptrouble?tid=${TroubleID}&status=${status}`
    })
  },
  // 驳回
  getRefuse(e) {
    if (!this.data.refuseReasons.length) {
      wx.showToast({
        icon: 'none',
        title: '网络错误请重试',
        mask: true
      })
      return
    }
    let TroubleID = this.data.curTroubleID
    let ReasonID = this.data.refuseReasons[this.data.refuseReasonIndex].ID
    let Contents = this.data.refuseReasonText
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
      content: '确定驳回吗？',
      success: res => {
        if (res.confirm) {
          let Status = '未受理'
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
              Types: '维修工程师'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '驳回成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.getContent(() => {
                  this.closeRefuse()
                })
              }, 1000)
            }
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
          })
        }
      }
    })
  },
  // 强制关闭
  getClose(e) {
    if (!this.data.closeReasons.length) {
      wx.showToast({
        icon: 'none',
        title: '网络错误请重试',
        mask: true
      })
      return
    }
    let Status = '已终止'
    let TroubleID = this.data.curTroubleID
    let ReasonID = this.data.closeReasons[this.data.closeReasonIndex].ID
    let Contents = this.data.closeReasonText
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
      content: '是否确认关闭并转至客服投诉？',
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
              Types: '维修工程师'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '关闭成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.getContent(() => {
                  this.closeClose()
                })
              }, 1000)
            }
          }).catch(err => {
            wx.hideLoading()
          })
        }
      }
    })
  },
  //重新分配
  gavinOther(e) {
    let TroubleID = this.data.id
    let status = this.data.status
    wx.navigateTo({
      url: `/pages/repairengineer/uptrouble/uptrouble?tid=${TroubleID}&status=${status}`
    })
  },
  // 同意（已废弃）
  getAgree(e) {
    let Status = '已取消'
    let TroubleID = e.target.dataset.tid
    let ReasonID = 0
    let Contents = ''
    let StaffID = store.roleInfo.ID
    wx.showModal({
      title: '提示',
      content: '确定同意取消吗？',
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
              Types: '维修工程师'
            })
          }).then(res => {
            wx.hideLoading()
            if (res.data.IsSuccess) {
              wx.showToast({
                title: '取消成功',
                mask: true
              })
              let timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.getContent()
              }, 1000)
            }
          }).catch(err => {
            wx.hideLoading()
          })
        }
      }
    })
  },
  // 预览
  preview(e) {
    let current = e.currentTarget.dataset.src
    let group = e.currentTarget.dataset.group
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: group // 需要预览的图片http链接列表
    })
  },
  // 打电话
  teleCall(e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  onLoad(options) {
    let id = options.id
    let status = options.status
    this.setData({
      id,
      status
    })
  },
  onReady() { },
  onShow() {
    this.getContent()
    // this.getRefuseReasons()
    // this.getCloseReasons()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.getContent(() => {
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