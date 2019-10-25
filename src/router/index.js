import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
import login from '@/views/login'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
    path: '/login',
    component: login
  }
  ]
})
