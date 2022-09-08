// import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

import request from '@/utils/request'
// 登录接口封装
export function login(data) {
  // 返回一个promise对象
  return request({
    url: 'sys/login',
    method: 'POST',
    data
  })
}
// 获取用户基本资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 根据用户Id获取用户的详情
export function getUserInfoById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}
export function logout() {

}
