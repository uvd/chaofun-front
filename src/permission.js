import router from './router'
import store from './store'
import { ElMessage as Message } from 'element-plus'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

var doRoute = async () => {
  const accessRoutes = await store.dispatch('permission/generateRoutes', [
    'admin',
  ])
  // dynamically add accessible routes

  router.addRoutes(accessRoutes)
}
doRoute()

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start()

  if (!to.path.includes('/f')) {
    store.dispatch('var/SET_formName', '')
  }
  // set page title
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  const { roles } = ['admin']
  await store.dispatch('user/getInfo')
  next()
})

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})
