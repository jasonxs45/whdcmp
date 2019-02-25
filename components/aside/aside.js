import {
  $
} from '../../common/utils/util.js'
Component({
  properties: {
    direction: {
      type: String,
      value: 'right',
      observer (newVal, oldVal, path) {
      }
    },
    show: {
      type: Boolean,
      value: null,
      observer(newVal, oldVal, path) {
        if (newVal) {
          this._show()
          // this.setData({
          //   open: newVal
          // })
        } else {
          this.starttransition()
        }
      }
    }
  },
  data: {
    animate: true,
    open: false
  },
  methods: {
    init () {
      let direction = this.properties.direction
    },
    starttransition () {
      this.setData({
        animate: true
      })
    },
    _show () {
      this.setData({
        open: true
      })
      let timeout = setTimeout(() => {
        clearTimeout(timeout)
        this.setData({
          animate: false
        })
      }, 20)
    },
    _close () {
      if (!this.data.animate) {
        return
      }
      this.properties.open = false
      this.setData({
        open: false
      })
      let myEventDetail = {
        open: this.data.open
      } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('close', myEventDetail, myEventOption)
    },
    ts (e) {
      if (e.changedTouches.length > 1) {
        return
      }
      let touch = e.changedTouches[0]
      this.downTime = Date.now()
      this.downX = touch.pageX
      this.downY = touch.pageY
    },
    tm (e) {
    },
    te (e) {
      if (e.changedTouches.length > 1) {
        return
      }
      let touch = e.changedTouches[0]
      if (touch.pageX - this.downX > 50) {
        this.starttransition()
      }
    }
  },
  ready () {
    this.init()
  }
})
