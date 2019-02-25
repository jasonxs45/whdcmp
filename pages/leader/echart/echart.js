import { observer } from '../../../common/utils/mobx-wxapp'
import { watch, computed } from '../../../common/utils/vuefy'
import * as echarts from '../../../components/ec-canvas/echarts'
import {
  baseBarOpt
} from './chart-config'
import {
  fetch
} from '../../../common/api/index.js'
const app = getApp()
const store = app.globalData.store
Page(observer({ store })({
  data: {
    id: '',
    troubleStatus: {
      lazy: true
    },
    houseStatus: {
      lazy: true
    },
    holderStatus: {
      lazy: true
    },
    partStatus: {
      lazy: true
    },
    partResStatus: {
      lazy: true
    },
    fetchAgain: false
  },
  // 问题
  getTroubles() {
    return fetch({
      Act: 'HCStatisticsForTrouble',
      Data: JSON.stringify({
        HouseCheckID: this.data.id
      })
    })
  },
  initTroubleBar () {
    this.getTroubles().then(res => {
      if (res.data.IsSuccess) {
        let data = []
        for (let i = 0; i < res.data.Data.length; i++) {
          let item = {}
          item.name = res.data.Data[i].Name
          item.value = res.data.Data[i].Count
          data.push(item)
        }
        let troubleStatusOpt = baseBarOpt('问题状态')
        this.lazyInit(this.troubleBarComp, chart => {
          troubleStatusOpt.dataset.source = data
          chart.setOption(troubleStatusOpt)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 房源
  getHouses () {
    return fetch({
      Act: 'HCStatisticsForHouse',
      Data: JSON.stringify({
        HouseCheckID: this.data.id
      })
    })
  },
  initHouseBar () {
    this.getHouses().then(res => {
      if (res.data.IsSuccess) {
        let data = []
        for (let i = 0; i < res.data.Data.length; i++) {
          let item = {}
          item.name = res.data.Data[i].Name
          item.value = res.data.Data[i].Count
          data.push(item)
        }
        let houseStatusOpt = baseBarOpt('房源状态')
        this.lazyInit(this.houseBarComp, chart => {
          houseStatusOpt.dataset.source = data
          chart.setOption(houseStatusOpt)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 施工单位
  getHolders() {
    return fetch({
      Act: 'HCStatisticsForContractor',
      Data: JSON.stringify({
        HouseCheckID: this.data.id
      })
    })
  },
  initHolderBar() {
    this.getHolders().then(res => {
      if (res.data.IsSuccess) {
        let data = []
        for (let i = 0; i < res.data.Data.length; i++) {
          let item = {}
          item.name = res.data.Data[i].Name
          item.value = res.data.Data[i].Count
          data.push(item)
        }
        let holderStatusOpt = baseBarOpt('施工单位状态')
        this.lazyInit(this.holderBarComp, chart => {
          holderStatusOpt.dataset.source = data
          chart.setOption(holderStatusOpt)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 施工部位
  getParts() {
    return fetch({
      Act: 'HCStatisticsForPart',
      Data: JSON.stringify({
        HouseCheckID: this.data.id
      })
    })
  },
  initPartBar() {
    this.getParts().then(res => {
      if (res.data.IsSuccess) {
        let data = []
        for (let i = 0; i < res.data.Data.length; i++) {
          let item = {}
          item.name = res.data.Data[i].Name
          item.value = res.data.Data[i].Count
          data.push(item)
        }
        let partStatusOpt = baseBarOpt('施工部位状态')
        this.lazyInit(this.partBarComp, chart => {
          partStatusOpt.dataset.source = data
          chart.setOption(partStatusOpt)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 施工部品
  getPartRess() {
    return fetch({
      Act: 'HCStatisticsForPartRes',
      Data: JSON.stringify({
        HouseCheckID: this.data.id
      })
    })
  },
  initPartResBar() {
    this.getPartRess().then(res => {
      if (res.data.IsSuccess) {
        let data = []
        for (let i = 0; i < res.data.Data.length; i++) {
          let item = {}
          item.name = res.data.Data[i].Name
          item.value = res.data.Data[i].Count
          data.push(item)
        }
        let partResStatusOpt = baseBarOpt('施工部品状态')
        this.lazyInit(this.partResBarComp, chart => {
          partResStatusOpt.dataset.source = data
          chart.setOption(partResStatusOpt)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  // 初始化图表基础方法
  lazyInit (chartComp, cb) {
    chartComp.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      cb && cb(chart)
      return chart
    })
  },
  onLoad(options) {
    let id = options.id
    this.setData({
      id
    })
    computed(this, {
      roleInfo() {
        return app.globalData.store.roleInfo
      }
    })
  },
  onReady() {
    this.troubleBarComp = this.selectComponent('#trouble-bar')
    this.initTroubleBar()
    this.houseBarComp = this.selectComponent('#house-bar')
    this.initHouseBar()
    this.holderBarComp = this.selectComponent('#holder-bar')
    this.initHolderBar()
    this.partBarComp = this.selectComponent('#part-bar')
    this.initPartBar()
    this.partResBarComp = this.selectComponent('#partres-bar')
    this.initPartResBar()
  },
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