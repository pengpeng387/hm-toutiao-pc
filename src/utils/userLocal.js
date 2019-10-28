const KEY = 'hm-toutiao-pc-key'
const userLocal = {
  // 存储setItem(key,value) key 将来获取时使用的参数  value json字符串格式
  setUser (value) {
    let jsonStr = JSON.stringify(value)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  // 通过key获取数据，转换成对象
  getUser () {
    let jsonStr = window.sessionStorage.getItem(KEY)
    return JSON.parse(jsonStr)
  },
  // 通过KEY删除
  delUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
// 导出userLocal
export default userLocal
