// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth.js'
import { login, getUserInfo, getUserInfoById } from '@/api/user.js'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态,初始化的时候就先缓存中读取
  userInfo: {}
}
const mutations = {
  setTokens(state, token) {
    state.token = token // 数据发生变化时，将数据设置给vuex中state中的token
    // 同步给缓存
    setToken(token)
  },
  removeTokens() {
    state.token = null // 将vuex的state数据设置为空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo['username] = result 这样不是响应式
    // state.userInfo = {...result} 这样也是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 执行异步
  async logins(context, data) {
    // 调用API登录接口，api文件下已封装方法
    const result = await login(data) // 拿到token
    context.commit('setTokens', result) // 更新token
    // 拿到token说明登录成功
    setTimeStamp() // 设置当前时间戳
  },
  /* 以上异步操作也可以用下面代码,项目开发一般用上面的async和await
  logins(context,data) {
    login(data).then(reuslt => {
      if (result.data.success) {
        context.commit('setTokens', result.data.data)
      }
    })
  }
  */
  async getUserInfos(context) {
    const result = await getUserInfo()
    // 获取用户详情
    const baseInfo = await getUserInfoById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 这里return和当前更新state中的数据无关，是给后期做权限的时候留下的伏笔
  },
  // 退出操作
  lgout(context) {
    context.commit('removeTokens') // 此时不仅删除了vuex中的，还删除了缓存的
    context.commit('removeUserInfo') // 删除用户资料
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
