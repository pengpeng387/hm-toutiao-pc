import Vue from 'vue'
import App from './App.vue'
// 引入element-ui框架
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入router
import router from '@/router'
// 引入axios
import axios from '@/api'
// 引入样式
import '@/styles/index.less'

// 引入自己封装的全局插件
import plugin from '@/components'

Vue.use(plugin)
Vue.use(ElementUi)

// 挂载axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
