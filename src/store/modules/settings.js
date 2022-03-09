import variables from '@/styles/element-variables.scss'
const defaultSettings = require('../../settings')
// {
//   title: '炒饭-新趣、分享、交流',

//   /**
//    * @type {boolean} true | false
//    * @description Whether show the settings right-panel
//    */
//   showSettings: false,

//   /**
//    * @type {boolean} true | false
//    * @description Whether need tagsView
//    */
//   tagsView: true,

//   /**
//    * @type {boolean} true | false
//    * @description Whether fix the header
//    */
//   fixedHeader: true,

//   /**
//    * @type {boolean} true | false
//    * @description Whether show the logo in sidebar
//    */
//   sidebarLogo: true,

//   /**
//    * @type {string | array} 'production' | ['production', 'development']
//    * @description Need show err logs component.
//    * The default is only used in the production env
//    * If you want to also use it in dev, you can pass ['production', 'development']
//    */
//   errorLog: 'production'
// }

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  styles: defaultSettings.styles,
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  leftNav: 'normal',
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_leftNav: (state, data) => {
    state.leftNav = data
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  SET_leftNav({ commit }, data) {
    commit('SET_leftNav', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
