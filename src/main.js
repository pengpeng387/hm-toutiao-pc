import Vue from 'vue'
import App from './App.vue'
// 引入element-ui框架
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入router
import router from '@/router'
// 引入axios
import axios from '@/api'

Vue.use(ElementUi)

// 挂载axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
