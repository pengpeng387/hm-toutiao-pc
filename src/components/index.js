
// 引入面包屑
import crumbs from '@/components/my-crumbs'
// 引入频道
import myChannel from '@/components/my-channel'

// 封装一个插件，注册所有全局组件
export default {
  // 默认传参Vue，基于vue对象实现功能
  install (Vue) {
    Vue.component(crumbs.name, crumbs)
    Vue.component(myChannel.name, myChannel)
  }
}
