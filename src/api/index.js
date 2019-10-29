// 导入axios
import axios from 'axios'
// 引入工具
import userLocal from '@/utils/userLocal'
import router from '@/router'

// 设置基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 导出axios
export default axios

// 因为登录进去，刷新才能存储cookie
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 1、获取token
  const data = userLocal.getUser || {}
  // 2、头部设置token
  config.headers.Authorization = `Bearer ${data.token}`
  return config
}, err => Promise.reject(err))

// 因为token是服务器生成的，有有效期，当响应状态码是401的时候，跳转回登录页面
// 添加响应拦截器
axios.interceptors.response.use(res => res, err => {
  if (err.response.status === 401) {
    // 跳转回登录页面
    return router.push('/login')
  }
  return Promise.reject(err)
})
