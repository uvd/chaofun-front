import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import * as api from '../../api/api'
import Vue from 'vue'
import * as permit from './permission'

const state = {
  token: getToken(),
  islogin: false,
  userInfo: {},
  roles: ['admin'],
  logStatus: '',
  showDownApp: true,
  listMode: localStorage.getItem('listMode') || 'normal',
  showChatBox: false,
  wss: null,
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_userInfo: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_islogin: (state, islogin) => {
    state.islogin = islogin
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_logStatus: (state, logStatus) => {
    state.logStatus = logStatus
  },
  SET_showDownApp: (state, showDownApp) => {
    state.showDownApp = showDownApp
  },
  SET_listMode: (state, listMode) => {
    state.listMode = listMode
  },
  SET_showChatBox: (state, data) => {
    // if(!state.wss){
    //   var ws = new WebSocket("wss://chao.fun/ws/v0/forumChat/1");
    //   ws.onopen = function() {
    //     ws.send("{\"type\":\"1\",\"message\":\"你好\"}");
    //   };
    //   ws.onmessage = function(event) {
    //     let data = event.data;
    //     console.log(JSON.parse(data));
    //   };
    //   state.wss = ws;
    // }

    state.showChatBox = data
  },
  SET_wss: (state, fun) => {
    // if(!state.wss){
    //   var ws = new WebSocket("wss://chao.fun/ws/v0/forumChat/1");
    //   ws.onopen = function() {
    //     ws.send("{\"type\":\"1\",\"message\":\"你好\"}");
    //   };
    //   ws.onmessage = function(event) {
    //     let data = event.data;
    //     console.log(JSON.parse(data));
    //   };
    //   state.wss = ws;
    // }
    state.wss = fun()
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const data = {
        token: 'admin-token',
      }
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      resolve()
    }).catch((error) => {
      reject(error)
    })
  },
  SET_showDownApp({ commit }, showDownApp) {
    commit('SET_showDownApp', showDownApp)
  },

  SET_islogin({ commit }, islogin) {
    commit('SET_islogin', islogin)
  },
  SET_userInfo({ commit }, userInfo) {
    commit('SET_userInfo', res.data)
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      // const { data } = response
      // if(!state.userInfo.userName){
      api.getUserInfo().then((res) => {
        // console.log('permit',permit);
        if (res.data) {
          commit('SET_userInfo', res.data)
          commit('SET_islogin', true)
        } else {
          commit('SET_islogin', false)
        }
        resolve(res)
      })
      // }else{
      //   resolve()
      // }
    }).catch((error) => {
      reject(error)
    })
    // })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    api.tologout({}).then((res) => {
      if (res.success) {
        commit('SET_islogin', false)
        Vue.prototype.$toast('已退出登录')
        // Vue.prototype.$message({
        //   message: '已退出登录',
        //   type: 'success',
        //   offset: 20
        // });
        setTimeout(() => {
          if (location.pathname == '/') {
            location.reload()
          } else {
            location.href = '/'
          }
        }, 100)
      }
    })
    // return new Promise((resolve, reject) => {

    //   // logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken()
    //     resetRouter()

    //     // reset visited views and cached views
    //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    //     dispatch('tagsView/delAllViews', null, { root: true })

    //     resolve()
    //   // }).catch(error => {
    //   //   reject(error)
    //   // })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async (resolve) => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true,
      })

      // dynamically add accessible routes

      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      // dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  SET_logStatus({ commit, state }, data) {
    commit('SET_logStatus', data)
  },
  SET_listMode({ commit, state }, data) {
    console.log(data)
    localStorage.setItem('listMode', data)
    commit('SET_listMode', data)
  },
  SET_showChatBox({ commit, state }, data) {
    commit('SET_showChatBox', data)
  },
  SET_wss: ({ commit, state }, fun) => {
    commit('SET_wss', fun)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
