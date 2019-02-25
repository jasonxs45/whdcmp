import { observable } from '../common/utils/mobx'
let store = observable({
  openid: '',
  unionid: '',
  baseInfo: null,
  roleInfo: null, 
  // action
  upopenid (str) {
    this.openid = str
  },
  upunionid (str) {
    this.unionid = str
  },
  upRoleInfo (obj) {
    this.roleInfo = obj
  }
})
export default store