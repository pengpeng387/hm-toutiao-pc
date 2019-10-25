import Vue from 'vue'
import App from './App.vue'
// 引入element-ui框架
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入router
import router from '@/router'

Vue.use(ElementUi)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
