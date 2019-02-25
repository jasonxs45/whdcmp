import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  colorMap
} from '../../../common/config.js'
import {
  fetch
} from '../../../common/api/index.js'
import {
  baseUrl
} from '../../../common/api/config.js'
import {
  formatTime
} from '../../../common/utils/util.js'
const app = getApp()
const store = app.globalData.store
Page(observer({store})({
  data: {
    id: '',
    content: '',
    room: '',
    position: '',
    desc: '',
    imgs: [],
    finishpicture: [],
    uploadImages: [],
    statu: '',
    colorMap
  },
  // 拨打电话
  teleCall (e) {
    let phoneNumber = e.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber
    })
  },
  // 获取内容
  getContent (cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetHouseTrouble',
      Data: JSON.stringify({
        ID: this.data.id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let data = res.data.Data
        //data.AddTime = formatTime(new Date(data.AddTime))
        let imgs = res.data.Data.ScenePicture ? res.data.Data.ScenePicture.split(',') : []
        let arr = imgs.map(item => {
          item = !item.includes(baseUrl) ? baseUrl + item : item
          return item
        })
        let finishpicture = res.data.Data.FinishPicture ? res.data.Data.FinishPicture.split(',') : []
        this.setData({
          content: data,
          imgs: arr,
          finishpicture
        })
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
      cb && cb()
    })
  },
  // 提交通过
  getPass () {
    var engineerid = store.roleInfo.ID
    // if (this.data.uploadImages.length < 1) {
    //   wx.showModal({
    //     showCancel: false,
    //     title: '',
    //     content: '请上传整改后的照片！'
    //   })
    //   return
    // }
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCPassHouseTrouble',
      Data: JSON.stringify({
        ID: this.data.id,
        StaffID:engineerid,
        FinishPicture: this.data.uploadImages.join(',')
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        wx.showToast({
          title: '提交成功',
          mask: true
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
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
  preview (e) {
    let current = e.currentTarget.dataset.src
    let group = e.currentTarget.dataset.group
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: group // 需要预览的图片http链接列表
    })
  },
  onLoad (options) {
    console.log(this.options)
    this.setData({
      id: options.id || '',
      statu: options.statu || ''
    })
  },
  onReady () {},
  onShow () {
    this.getContent()
  },
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {
    this.getContent(() => {
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
}))