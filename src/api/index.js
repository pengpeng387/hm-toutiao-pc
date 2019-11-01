// 导入axios
import axios from 'axios'
// 引入工具
import userLocal from '@/utils/userLocal'
import router from '@/router'

import JSONBIG from 'json-bigint'

// 设置基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 解决js有最大安全数值，引用第三方插件
axios.defaults.transformResponse = [(data) => {
  // 后台原始数据
  try {
    // 有错误就用JSONBIG解决
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 因为登录进去，刷新才能存储cookie
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 1、获取token
  const user = userLocal.getUser() || {}
  // 2、头部设置token
  config.headers.Authorization = `Bearer ${user.token}`
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

// 导出axios
export default axios
