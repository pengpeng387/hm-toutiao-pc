import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import welcome from '@/views/welcome'
import NotFound from '@/views/404'

// 引入工具
import userLogin from '@/utils/userLocal'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: home,
    children: [{
      path: '/',
      component: welcome
    }]
  },
  {
    path: '*',
    component: NotFound
  }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 跳转目标路由对象
  // from 从哪里跳过来的路由对象
  // next() 放行  next("/login") 拦截到登录
  const token = userLogin.getUser()
  to.path !== '/login' && !token ? next('/login') : next()
})

export default router
