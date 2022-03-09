const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  logStatus: (state) => state.user.logStatus,
  islogin: (state) => state.user.islogin,
  showDownApp: (state) => state.user.showDownApp,
  avatar: () =>
    'https://dss0.baidu.com/73x1bjeh1BF3odCf/it/u=2849344276,1397424293&fm=85&s=3800317240C1F7115333F5C60200E0A9',
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  formRoute: (state) => state.permission.formRoute,
  errorLogs: (state) => state.errorLog.logs,
  searchKeyword: (state) => state.var.searchKeyword,
  formName: (state) => state.var.formName,
  backgroundManage: (state) => state.settings.backgroundManage,
  leftNav: (state) => state.settings.leftNav,
}
export default getters
