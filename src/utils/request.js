// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance 常见一个axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout 超时时间
// })

// // request interceptor 请求拦截器
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor 响应拦截器
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 7200 // 设置超时时间
// 创建axios实例
const service = axios.create({
// 当执行npm run dev时 => 开发环境 => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // 设置超时时间，超时自动报错
}
)
// 设置请求拦截器
service.interceptors.request.use(config => {
  // config是请求配置信息，最后必须要返回的
  if (store.getters.token) {
    // 检查token是否过期
    if (IsCheckTimeOut()) {
      // true表示过期了
      store.dispatch('user/lgout') // 退出登录
      router.push('/login')
      return Promise.reject(new Error('token过期了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 设置响应拦截器
service.interceptors.response.use(response => {
  // axios默认会给数据加上一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
  // 业务已经错了，不能继续进then,应该偶直接进catch
    Message.error('提示错误信息') // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error信息里面response对象
  if (error.response && error.response.data && error.response.data.code === 1002) {
    store.dispatch('user/lgout') // 退出登录
    router.push('/login') // 跳转到登录界面
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前执行链跳出成功，直接进入catch
})
// 定义检查是否超时的函数
// 超市逻辑，当前时间-缓存中的时间是否大于设置的超时时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存中的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
