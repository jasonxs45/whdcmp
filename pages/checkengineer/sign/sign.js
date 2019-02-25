import {
  $
} from '../../../common/utils/util.js'
import {
  baseUrl
} from '../../../common/api/config.js'
const app = getApp()
let content = null
let touchs = []
let canvasw = 0
let canvash = 0
Page({
  data: {
    signing: false,
    drawed: false
  },
  start(event) {
    // console.log("触摸开始" + event.changedTouches[0].x)
    // console.log("触摸开始" + event.changedTouches[0].y)
    //获取触摸开始的 x,y
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
    touchs.push(point)
  },
  move(e) {
    let point = { x: e.touches[0].x, y: e.touches[0].y }
    touchs.push(point)
    if (touchs.length >= 2) {
      this.draw(touchs)
    }
  },
  end(e) {
    console.log("触摸结束" + e)
    //清空轨迹数组
    for (let i = 0; i < touchs.length; i++) {
      touchs.pop()
    }
  },
  cancel(e) {
    console.log("触摸取消" + e)
  },
  tap(e) {
    console.log("长按手势" + e)
  },
  error(e) {
    console.log("画布触摸错误" + e)
  },
  draw(touchs) {
    let point1 = touchs[0]
    let point2 = touchs[1]
    touchs.shift()
    content.moveTo(point1.x, point1.y)
    content.lineTo(point2.x, point2.y)
    content.stroke()
    content.draw(true)
    this.setData({
      drawed: true
    })
  },
  clearClick() {
    content.clearRect(0, 0, canvasw, canvash)
    content.draw(true)
    this.setData({
      drawed: false
    })
  },
  saveClick() {
    if (!this.data.drawed) {
      wx.showToast({
        title: '请手写签名',
        mask: true
      })
      return
    }
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success(res) {
        //打印图片路径
        //设置保存的图片
        that.uploadFile(res.tempFilePath, res => {
          let url = JSON.parse(res.data).url
          wx.showToast({
            title: '保存成功',
            mask: true
          })
          app.globalData.signImage = baseUrl + url
          let timeout = setTimeout(() => {
            clearTimeout(timeout)
            wx.navigateBack()
          }, 1000)
        })
      }
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
        cb && cb(res)
        wx.hideLoading()
      },
      fail: res => {
        console.log(res)
        wx.hideLoading()
      }
    })
  },
  onLoad(options) {
    //获得Canvas的上下文
    content = wx.createCanvasContext('firstCanvas')
    //设置线的颜色
    content.setStrokeStyle("#333")
    //设置线的宽度
    content.setLineWidth(4)
    //设置线两端端点样式更加圆润
    content.setLineCap('round')
    //设置两条线连接处更加圆润
    content.setLineJoin('round')
    $('.firstCanvas').boundingClientRect(rect => {
      canvasw = rect.width
      canvash = rect.height
    }).exec()
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
})