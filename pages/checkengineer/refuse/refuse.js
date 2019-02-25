import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: 0,
    checkid: 0,
    fixReasons: [
      '设计缺陷', '工程质量瑕疵', '与销售承诺不符', '其他'
    ],
    selectedReasons: [],
    Des: "",
  },
  checkboxChangeHandler(e) {
    let selectedReasons = e.detail.value
    this.setData({
      selectedReasons: selectedReasons
    })

  },
  goRecords() {
    let EngineerID = store.roleInfo.ID
    let HouseCheckID = this.data.checkid
    let HouseID = this.data.id
    wx.navigateTo({
      url: `/pages/checkengineer/refuserecord/refuserecord?EngineerID=${EngineerID}&HouseCheckID=${HouseCheckID}&HouseID=${HouseID}`,
    })
  },
  SetDes: function (e) {
    this.setData({
      Des: e.detail.value
    });
    //console.log(e)
  },
  goListpage() {
    wx.navigateBack()
  },
  Add() {
    var that = this;
    var eninfo = store.roleInfo
    var id = this.data.id
    var des = this.data.Des
    var selectedReasons = this.data.selectedReasons
    if (selectedReasons.length < 1) {
      wx.showToast({
        title: '请选择拒收原因',
        mask: true
      })
      return
    }
    if (!des.trim()) {
      wx.showToast({
        icon: 'none',
        title: '补充说明不能为空',
        mask: true
      })
      return
    }
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCAddNoAcceptLog',
      Data: JSON.stringify({
        HouseID: this.data.id,
        HouseCheckID: this.data.checkid,
        Descriptions: des,
        DefCheck: selectedReasons,
        StaffID: eninfo.ID
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          mask: true
        })
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          that.goListpage()
        }, 1000)
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  onLoad(options) {
    this.setData({ id: options.id, checkid: options.checkid })
  },
  onReady() { },
  onShow() { },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
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
