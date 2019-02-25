import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy.js'
import {
  baseUrl,
  api,
} from '../../../common/api/config.js'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: '',
    rooms: [],
    part: [],
    partres: [],
    partrestouble: [],
    partresContractor: [],
    roomIndex: 0,
    partIndex: 0,
    partresIndex: 0,
    partrestoubleIndex: 0,
    partresContractorIndex: 0,
    uploadImages: [],
    Urgency: ["一般", "紧急", "加急"],
    Description: "",//描述
    PartID: '',//部位
    PartResID: '',//部品
    PartResTroubleID: '',//问题
    PartResContractorID: '',//施工单位
    RoomID: '',//房间
    ScenePicture: '',//图片
    tid:'',//问题ID
    trouble:[]
  },
  bindInputHandler(e) {
    let Description = e.detail.value
    this.setData({
      Description
    })
  },
  bindPickerChange(e) {
    let name = e.currentTarget.dataset.target
    this.setData({
      [`${name}Index`]: e.detail.value
    })
    if (name === 'room') {
      this.getPart(this.data.rooms[this.data.roomIndex].ID)
      this.setData({
        RoomID: this.data.rooms[this.data.roomIndex].ID,
        partIndex: 0,
        partresIndex: 0,
        partrestoubleIndex: 0,
        partresContractorIndex: 0
      })
    }
    if (name === 'part') {
      this.getPartRes(this.data.part[this.data.partIndex].ID)
      this.setData({
        PartID: this.data.part[this.data.partIndex].ID,
        partresIndex: 0,
        partrestoubleIndex: 0,
        partresContractorIndex: 0
      })
    }
    if (name === 'partres') {
      this.getPartResTouble(this.data.partres[this.data.partresIndex].ID)
      this.getPartResContractor(this.data.partres[this.data.partresIndex].ID, parseInt(this.data.id))
      this.setData({
        PartResID: this.data.partres[this.data.partresIndex].ID,
        partrestoubleIndex: 0,
        partresContractorIndex: 0
      })
    }
    if (name === 'partrestouble') {
      this.setData({
        PartResTroubleID: this.data.partrestouble[this.data.partrestoubleIndex].ID
      })
    }
    if (name === 'partresContractor') {
      this.setData({
        PartResContractorID: this.data.partresContractor[this.data.partresContractorIndex].ID
      })
    }
  },
  chooseImage() {
    let _self = this
    wx.chooseImage({
      count: 5 - _self.data.uploadImages.length, // 默认9
      success(res) {
        let tempFilePaths = res.tempFilePaths
        let uploadImages = []
        wx.showLoading()
        for (let i = 0; i < tempFilePaths.length; i++) {
          _self.uploadFile(tempFilePaths[i], res => {
            uploadImages.push(baseUrl + JSON.parse(res.data).url)
            if (uploadImages.length === tempFilePaths.length) {
              _self.data.uploadImages = _self.data.uploadImages.concat(uploadImages)
              _self.setData({
                uploadImages: _self.data.uploadImages,
                ScenePicture: _self.data.uploadImages.join(',')
              })
              wx.hideLoading()
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
  previewImages() { },
  // 上传照片
  uploadFile(localId, cb) {
    wx.uploadFile({
      url: `${baseUrl}/Content/FileUpload/UploadImg.aspx?v=${Math.random().toString(36).substr(2)}`,
      filePath: localId,
      name: 'imgFile',
      success: res => {
        cb && cb(res)
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
      }
    })
  },
  getRooms() {
    this.setData({
      fetchAgain: false
    })
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetRoom',
      Data: JSON.stringify({
        HouseID: parseInt(this.data.id),
      })
    }).then(res => {
      this.setData({
        fetchAgain: false
      })
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let rooms = res.data.Data
        let roomIndex = this.data.RoomID === '' ? 0 : rooms.findIndex(item => item.ID == this.data.RoomID)
        let RoomID = this.data.RoomID || rooms[this.data.roomIndex].ID
        this.setData({
          rooms,
          RoomID,
          roomIndex
        })
        this.getPart(this.data.RoomID)
      }
    }).catch(err => {
      this.setData({
        fetchAgain: true
      })
      wx.hideLoading()
      console.log(err)
    })
  },
  getPart(id) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPartByRooms',
      Data: JSON.stringify({
        RoomID: id,
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let part = res.data.Data
        let partIndex = part.findIndex(item => item.Name == this.data.trouble.Part)
        partIndex = partIndex === -1 ? 0 : partIndex
        let PartID = part[partIndex].ID
        this.setData({
          part,
          PartID,
          partIndex
        })
        if (!(this.data.PartID !== 0 && !this.data.PartID)) {
          this.getPartRes(PartID)
        }
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getPartRes(id) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPartRes',
      Data: JSON.stringify({
        ID: id
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let partres = res.data.Data
        let partresIndex = partres.findIndex(item => item.Name == this.data.trouble.PartRes) 
        partresIndex = partresIndex === -1 ? 0 : partresIndex
        let PartResID = partres[partresIndex].ID
        this.setData({
          partres,
          partresIndex,
          PartResID
        })
        if (!(this.data.PartResID !== 0 && !this.data.PartResID)) {
          let partresIndex = partres.findIndex(item => item.ID == this.data.PartResID)
          this.setData({
            partresIndex
          })
          this.getPartResTouble(PartResID)
          this.getPartResContractor(PartResID, parseInt(this.data.id))
        }
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getPartResTouble(id) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPartResTrouble',
      Data: JSON.stringify({
        ID: id,
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let partrestouble = res.data.Data
        let partrestoubleIndex = partrestouble.findIndex(item => item.Description == this.data.trouble.PartResTrouble)
        partrestoubleIndex = partrestoubleIndex === -1 ? 0 : partrestoubleIndex
        let PartResTroubleID = partrestouble[partrestoubleIndex].ID
        this.setData({
          partrestouble,
          partrestoubleIndex,
          PartResTroubleID
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  getPartResContractor(id, houseid) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetPartResContractorProE',
      Data: JSON.stringify({
        PartResID: id,
        HouseID: houseid,
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let partresContractor = res.data.Data
        let partresContractorIndex = partresContractor.findIndex(item => item.ID == this.data.trouble.ContractorID)
        partresContractorIndex = partresContractorIndex === -1 ? 0 : partresContractorIndex
        let PartResContractorID = partresContractor[this.data.partresContractorIndex].ID
        this.setData({
          partresContractor,
          partresContractorIndex,
          PartResContractorID
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  }, 
  getTroubleInfo(cb) {
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCGetTrouble',
      Data: JSON.stringify({
        TroubleID: this.data.tid
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        let trouble = res.data.Data.troubleinfo
        let id = trouble.HouseID
        let RoomID = trouble.RoomID
        this.setData({
          trouble,
          RoomID,
          id,
          Description: trouble.Description
        })
        this.getRooms()
        cb && cb()
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },
  goListpage() {
    wx.navigateBack()
  },
  Add() {
    var that = this;
    var eninfo = store.roleInfo
    var id = this.data.id
    var des = this.data.Description
    var selectedReasons = this.data.selectedReasons
    if (this.data.RoomID === '') {
      wx.showToast({
        title: '请选择房间',
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.PartID === '') {
      wx.showToast({
        title: '请选择部位',
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.PartResID === '') {
      wx.showToast({
        title: '请选择部品',
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.PartResTroubleID === '') {
      wx.showToast({
        title: '请选择问题',
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.PartResContractorID === '') {
      wx.showToast({
        title: '请选择施工单位',
        icon: 'none',
        mask: true
      })
      return
    }
    let names = [
      this.data.part[this.data.partIndex].Name,
      this.data.partres[this.data.partresIndex].Name,
      this.data.partrestouble[this.data.partrestoubleIndex].Description
    ]
    if (names.some(item => item === '其他') && !des.trim()) {
      wx.showToast({
        icon: 'none',
        title: '问题描述不能为空',
        mask: true
      })
      return
    }
    wx.showLoading({
      mask: true
    })
    fetch({
      Act: 'HCUpTrouble',
      Data: JSON.stringify({
        TroubleID: this.data.tid,
        PartID: this.data.PartID,//部位
        PartResID: this.data.PartResID,//部品
        PartResTroubleID: this.data.PartResTroubleID,//问题
        RoomID: this.data.RoomID,//房间
        ContractorID: this.data.PartResContractorID,
        Description: this.data.Description//描述
      })
    }).then(res => {
      wx.hideLoading()
      if (res.data.IsSuccess) {
        // that.goListpage()
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          mask: true,
          duration: 1000
        })
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          wx.navigateBack()
        }, 1000)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad(options) { 
    this.setData({
      tid: options.tid
    })
  },
  onReady() { },
  onShow() {
    this.getTroubleInfo()
  },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() {
    this.getTroubleInfo(() => {
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