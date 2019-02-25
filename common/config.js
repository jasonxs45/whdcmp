const colorMap = {
  '未受理': '#d18ae4',
  '处理中': '#f05b5e',
  '已处理': '#5fb9f0',
  '已通过': '#61c290'
}
const categoryMap = [
  {
    name: '未受理',
    color: '#d18ae4',
    num: 0
  },
  {
    name: '处理中',
    color: '#f05b5e',
    num: 0
  },
  {
    name: '已处理',
    color: '#5fb9f0',
    num: 0
  },
  {
    name: '已通过',
    color: '#61c290',
    num: 0
  }
]
const states = [
  { name: '待派单', value: '待派单' },
  { name: '待整改', value: '待整改' },
  { name: '已处理', value: '已处理' },
  { name: '已通过', value: '已通过' },
  { name: '已作废', value: '已作废' },
  { name: '非正常关闭', value: '非正常关闭' }
]
const rooms = [
  { name: '玄关', value: '玄关' },
  { name: '客厅', value: '客厅' },
  { name: '主卧', value: '主卧' },
  { name: '次卧', value: '次卧' },
  { name: '阳台', value: '阳台' },
  { name: '洗手间', value: '洗手间' },
  { name: '储物间', value: '储物间' }
]
const positions = [
  { name: '墙壁', value: '墙壁' },
  { name: '天花板', value: '天花板' },
  { name: '地板', value: '地板' },
  { name: '水管', value: '水管' },
  { name: '橱柜', value: '橱柜' },
  { name: '地暖', value: '地暖' },
  { name: '电路', value: '电路' }
]
export {
  colorMap,
  categoryMap,
  states,
  rooms,
  positions
}