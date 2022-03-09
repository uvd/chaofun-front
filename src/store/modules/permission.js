import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import * as api from '../../api/api'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: localStorage.getItem('accessedRoutes')
    ? JSON.parse(localStorage.getItem('accessedRoutes'))
    : [],
  addRoutes: [],
  formRoute: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    localStorage.setItem('accessedRoutes', JSON.stringify(state.routes))
  },
  SET_formRoute: (state, data) => {
    state.formRoute = data
  },
}
function doRoute(item2) {
  if (
    item2.link != '/all' &&
    item2.link != '/recommend' &&
    item2.link != '/trends'
  ) {
    return 'list/home'
  } else if (item2.link == '/trends') {
    return 'list/attention'
  } else {
    return 'dashboard/index'
  }
}
const actions = {
  SET_formRoute({ commit }, data) {
    commit('SET_formRoute', data)
  },
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      var arr = []
      api.getMenu({ pageNum: 1, order: 'new' }).then((res) => {
        let a = ['first', 'second', 'third', 'forth']
        let icon = ['documentation', 'user', 'guide', 'money', 'pepoles']
        let d = res.data

        d.forEach((item, index) => {
          if (item.menues.length) {
            var obj = {
              name: a[index],
              path: `/${a[index]}`,
              component: Layout,
              redirect: `${item.menues[0].link}`,
              hide: false,
              meta: {
                title: item.name,
                icon: icon[index],
                forumId: item.menues[0].forumId,
              },
            }
            var b = []
            item.menues.forEach((item2) => {
              var obj2 = {
                name: item2.link + index + parseInt(Math.random() * 1000),
                path: `${item2.forumId == 'all' ? '/all' : item2.link}`,
                hide: false,
                // component: () => import(`@/views/${doRoute(item2)}`),
                meta: {
                  title: item2.title,
                  icon:
                    'https://i.chao.fun/' +
                    item2.icon +
                    '?x-oss-process=image/resize,h_80/format,webp/quality,q_75',
                  forumId: item2.forumId,
                  forumName: item2.title,
                  keepAlive: true,
                },
              }
              b.push(obj2)
            })
            obj.children = b
            arr.push(obj)
          }
        })
        let accessedRoutes
        accessedRoutes = asyncRoutes.concat(arr) || []
        console.log('accessedRoutes', accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
