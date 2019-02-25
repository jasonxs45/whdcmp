import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
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
    id: '',
    status: '',
    content: null,
    showForm: false,
    reasons: [],
    reasonIndex: 0,
    reasonText: '',
    handleBoxShow: false,
    handleReason: '',
    uploadImages: []
  },
  getContent (cb) {
    wx.showLoading({
      title: '加载中',
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
        ? content.troubleinfo.ScenePicture.split(','): []
        this.setData({
          content,
          status: content.troubleinfo.Status
        })
        cb && cb()
      }
    }).catch(err => {
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
  getReasons() {
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
  pickerChange(e) {
    let reasonIndex = e.detail.value
    this.setData({
      reasonIndex
    })
  },
  textareaChange(e) {
    let reasonText = e.detail.value
    this.setData({
      reasonText
    })
  },
  // 受理
  getHandle(e) {
    let Status = '处理中'
    let TroubleID = this.data.id
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
                this.getContent()
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
  // 拒单
  getRefuse(e) {
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
                title: '提交申请成功',
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
  // 完成
  openHandleBox(e) {
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
  handleBoxChange(e) {
    let handleReason = e.detail.value
    this.setData({
      handleReason
    })
  },
  getFinish(e) {
    let Status = '已处理'
    let TroubleID = this.data.id || this.data.curTroubleID
    let ReasonID = 0
    let Contents = this.data.handleReason
    let StaffID = store.roleInfo.ID
   // if (this.data.uploadImages.length < 1) {
   //   wx.showToast({
   //     icon: 'none',
   //     title: '请上传整改后的照片',
   //     mask: true
   //   })
   //   return
   // }
    let uploadImages = this.data.uploadImages.join(',')
   //if (!Contents.trim()) {
   //  wx.showToast({
   //    icon: 'none',
   //    title: '通过说明不能为空',
   //    mask: true
   //  })
   //  return
   //}
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
        Types: '施工单位',
        UploadImages: uploadImages
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
          this.getContent()
        }, 1000)
      }
    }).catch(err => {
      wx.hideLoading()
      this.getContent()
      console.log(err)
    })
  },
  // 恢复并受理
  getReset(e) {
    let Status = '恢复并受理'
    let TroubleID = this.data.id
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
                clearTimeout(timeout)
                this.getContent()
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
  chooseImage() {
    let _self = this
    wx.chooseImage({
      count: 5 - _self.data.uploadImages.length, // 默认9
      success(res) {
        let tempFilePaths = res.tempFilePaths
        let uploadImages = []
        for (let i = 0; i < tempFilePaths.length; i++) {
          _self.uploadFile(tempFilePaths[i], res => {
            uploadImages.push(baseUrl + JSON.parse(res.data).url)
            if (i === tempFilePaths.length - 1) {
              _self.data.uploadImages = _self.data.uploadImages.concat(uploadImages)
              _self.setData({
                uploadImages: _self.data.uploadImages,
                ScenePicture: _self.data.uploadImages.join(',')
              })
            }
          })
        }
      }
    })
  },
  removeImage(e) {
    let index = e.target.dataset.index
    this.data.uploadImages.splice(index, 1)
    this.setData({
      uploadImages: this.data.uploadImages
    })
  },
  // 上传照片
  uploadFile(localId, cb) {
    wx.showLoading({
      mask: true
    })
    wx.uploadFile({
      url: `${baseUrl}/Content/FileUpload/UploadImg.aspx?v=${Math.random().toString(36).substr(2)}`,
      filePath: localId,
      name: 'imgFile',
      success: res => {
        wx.hideLoading()
        cb && cb(res)
      },
      fail: res => {
        wx.hideLoading()
        console.log(res)
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
    // this.getReasons()
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