let baseBarOpt = name => {
  return {
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 1000000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      color: ['orangered', 'yellow', 'lightskyblue']
    },
    legend: {
      data: [name],
      bottom: 10,
      show: false
    },
    grid: {
      top: 10,
      left: 70,
      right: 20,
      bottom: 30
    },
    xAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        show: false
      }
    }],
    yAxis: [{
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 8
      }
    }],
    dataset: {},
    series: [{
      name: name,
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside'
        }
      },
      type: 'bar',
      itemStyle: {
        normal: {
          color: function (params) {
            // build a color map as your need.
            var colorList = [
              '#ff2600',
              '#ffc000',
              '#00ad4e',
              '#0073c2',
              '#165868',
              '#e76f00',
              '#316194',
              '#723761',
              '#00b2f1',
              '#4d6022',
              '#4b83bf',
              '#f9c813',
              '#0176c0'
            ];
            return colorList[params.dataIndex]
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  }
}
let houseStatusOpt = {
  legend: {
    data: ['问题房源数'],
    bottom: 10
  },
  grid: {
    top: 10,
    left: 50,
    right: 20,
    bottom: 30
  },
  xAxis: [{
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    },
    axisLabel: {
      color: '#666'
    }
  }],
  yAxis: [{
    type: 'category',
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    },
    axisLabel: {
      color: '#666'
    }
  }],
  dataset: {},
  series: [{
    name: '问题房源数',
    type: 'bar',
    label: {
      normal: {
        show: true,
        position: 'inside'
      }
    },
    type: 'bar',
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 2, 2, 0.3)'
      }
    }
  }]
}
export {
  baseBarOpt
}