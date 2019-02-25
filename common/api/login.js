import {
  baseUrl,
  api
} from './config.js'
import {
  fetch
} from './index.js'
// 获取角色身份
let getRoles = (UID, Types = '') => {
  return fetch({
    Act: 'HCGetStaff',
    Data: JSON.stringify({
      UID,
      Types
    })
  })
}
// 获取授权
let getUserInfo = (OpenID, encryptedData, iv) => {
  return fetch({
    Act: 'HCGetUserInfo',
    Data: JSON.stringify({
      OpenID,
      iv,
      encryptedData
    })    
  })
}
export {
  getRoles,
  getUserInfo
}