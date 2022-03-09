/* eslint-disable */
import Vue from 'vue'
import logins from './login.vue'

const NoticeConstructor = Vue.extend(logins)

const login = (option = {}) => {
  // 对外调用的方法
  const Instance = new NoticeConstructor({
    data: {
      // 传入组件的data
      //   content: option.text,
      //   duration: option.time || 1500
      callBack: option.callBack,
    },
  })
  // console.log('Instance:', Instance)
  Instance.vm = Instance.$mount() // 挂载
  // console.log('mounted', Instance.vm.$el)
  Instance.vm.logStatus = option.logStatus || 'login'
  Instance.vm.show = true
  document.body.appendChild(Instance.vm.$el) // 插入到body
}
export default login

// 直接挂到vue上
// export default {
//   install: (Vue) => {
//     Vue.prototype.$login = login
//   }
// }
