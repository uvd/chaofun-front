import Vue from 'vue'
import Router from 'vue-router'

// import store from '../store'
// console.log('storestorestore',store)
import * as api from '../api/api'
Vue.use(Router)

import visRoutes from './webview'

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
var visRoute = []
// if(process.env.NODE_ENV !== 'production'&&process.env.VUE_APP_BASE_WEB){
visRoute = visRoutes
// }

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/down_test',
    component: () => import('@/views/app/down'),
    hidden: true,
  },
  {
    path: '/app',
    component: () => import('@/views/app/downs'),
    hidden: true,
  },
  {
    path: '/app回T退订',
    component: () => import('@/views/app/downs'),
    hidden: true,
  },
  {
    path: '/userRank',
    component: () => import('@/views/activity/userRank'),
    // name: 'webViewUserRank',
    meta: { title: '用户排名' },
    hidden: true,
  },
  {
    path: '/forumRank',
    component: () => import('@/views/activity/forumRank'),
    // name: 'webViewForumRank',
    meta: { title: '板块排名' },
    hidden: true,
  },
  {
    path: '/chatpage/:id',
    component: () => import('@/views/chat/chatpage'),
    // name: 'webViewForumRank',
    meta: { title: '板块排名' },
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: '/help',
        component: () => import('@/views/activity/help'),
        meta: { title: '板块排名' },
        redirect: '/help/forumIntro',
        children: [
          {
            path: 'forumIntro',
            component: () => import('@/views/activity/help/forumIntro'),
            // name: 'webViewForumRank',
            meta: { title: '板块排名', keepAlive: false },
            hidden: true,
          },
        ],
        hidden: true,
      },
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true,
          keepAlive: true,
        },
        // redirect: '',
        hidden: true,
      },
      {
        path: '/middles',
        component: () => import('@/views/dashboard/index'),
        name: 'middles',
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true,
          keepAlive: true,
        },
        hidden: true,
      },
      {
        path: '/trends',
        component: () => import('@/views/list/attention'),
        name: 'trends',
        meta: {
          title: '关注',
          icon: 'dashboard',
          affix: true,
          keepAlive: true,
        },
        hidden: true,
      },
      {
        path: '/p/:postId',
        component: () => import('@/views/list/articleDetail'),
        name: 'articleDetail',
        meta: { title: '', icon: 'dashboard', affix: true },
        hidden: true,
      },
      {
        path: '/submit',
        name: 'submit',
        component: () => import('@/views/submit/submit'),
        meta: { keepAlive: false },
        hidden: true,
      },
      // 新版发布
      {
        path: '/f/submit',
        name: 'submitV2',
        component: () => import('@/views/submit/v2'),
        hidden: true,
      },
      // 新版论坛发布
      {
        path: '/f/:forumId/submit',
        name: 'submitV2',
        component: () => import('@/views/submit/v2'),
        hidden: true,
      },
      {
        path: '/f/:id/setting',
        component: () => import('@/views/list/forumSetting'),
        name: 'forumSetting',
        meta: { title: '板块设置', keepAlive: false },
        hidden: true,
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/list/my'),
        meta: { keepAlive: true },
        hidden: true,
      },
      {
        path: '/my/fbi',
        name: 'myfbi',
        component: () => import('@/views/list/fbi'),
        hidden: true,
      },
      {
        path: '/secret',
        name: 'secret',
        component: () => import('@/views/secret/secret'),
        meta: { keepAlive: false },
        hidden: true,
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/views/list/search'),
        props: (route) => ({ q: route.query.q }),
        meta: { title: '', keepAlive: true },
        hidden: true,
      },
      {
        path: `/f/:forumId`,
        component: () => import('@/views/list/home'),
        name: '/f/:forumId',
        meta: { title: '', keepAlive: true },
        hidden: true,
      },
      {
        path: `/f/:forumId/:type`,
        component: () => import('@/views/list/home'),
        name: '/f/:forumId/:type',
        meta: { title: '', keepAlive: true },
        hidden: true,
      },
      {
        path: '/user/:id',
        component: () => import('@/views/list/user'),
        name: 'userhome',
        meta: { title: '', keepAlive: true },
        hidden: true,
      },
      {
        path: '/setting',
        component: () => import('@/views/list/setting'),
        name: 'setting',
        meta: { title: '设置', keepAlive: false },
        hidden: true,
      },

      {
        path: '/submitH5',
        component: () => import('@/views/h5/submit'),
        name: 'submitH5',
        meta: { title: '设置', keepAlive: false },
        hidden: true,
      },
      {
        path: '/board',
        component: () => import('@/views/dashboard/board'),
        name: 'board',
        meta: { title: '设置', keepAlive: false },
        hidden: true,
      },
      {
        path: '/gamePage',
        component: () => import('@/views/game/gamePage'),
        name: 'gamePage',
        meta: { title: '设置', keepAlive: false },
        hidden: true,
      },
      {
        path: '/message',
        component: () => import('@/views/users/message'),
        name: 'message',
        meta: { title: '我的消息', keepAlive: false },
        hidden: true,
      },
      {
        path: '/h5forward',
        component: () => import('@/components/h5/forward'),
        name: 'h5forward',
        meta: { title: '转发', keepAlive: false },
        hidden: true,
      },
      {
        path: '/lists',
        component: () => import('@/views/list/lists'),
        name: 'lists',
        meta: { title: '全部板块', keepAlive: false },
        hidden: true,
      },
      {
        path: '/manager',
        component: () => import('@/views/manager/manager'),
        name: 'manager',
        meta: { title: '管理', keepAlive: false },
        hidden: true,
      },
      {
        path: '/all',
        component: () => import('@/views/dashboard/index'),
        name: 'all',
        meta: { title: '全站', keepAlive: true },
        hidden: true,
      },
      {
        path: '/recommend',
        component: () => import('@/views/dashboard/index'),
        name: 'recommend',
        meta: { title: '推荐', keepAlive: true },
        hidden: true,
      },
      {
        path: '/predictions/:forumId/:id',
        component: () => import('@/views/activity/prediction'),
        name: 'prediction',
        meta: { title: '竞猜', keepAlive: true },
        hidden: true,
      },

      // {
      //   path: '/webview/userRank',
      //   component: () => import('@/views/chaofun-webview/activity/userRank'),
      //   name: 'webViewUserRank',
      //   meta: { title: '用户排名'},
      //   hidden: true
      // },
      // {
      //   path: '/webview/forumRank',
      //   component: () => import('@/views/chaofun-webview/activity/forumRank'),
      //   name: 'webViewForumRank',
      //   meta: { title: '板块排名'},
      //   hidden: true
      // },
      { path: '*', redirect: '/404', hidden: true },
    ],
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
const asyncRoutesTest = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]
export const asyncRoutes = []
const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: [...visRoute, ...constantRoutes],
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
