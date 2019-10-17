/**
 * 统一请求发起配置
 */
import axios from 'axios'

export default {
  // 在Vue实例中添加$http方法
  install(Vue) {
    Vue.prototype.$http = axios
    Vue.$http = axios
  },
  $http: axios
}
// 默认响应超时时间
axios.defaults.timeout = 30000
// 请求发起的 url头路径 (自己在本地开发环境进行手工配置)
axios.defaults.baseURL = 'http://localhost:8082/demo/'

axios.interceptors.request.use((config) => {
  config.headers.Accept = 'application/json' // 默认
  config.headers['Access-Control-Allow-Origin'] = '*'
  return config
}, (error) => {
  return Promise.reject(error)
})
axios.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response && error.response.status) {
    error.code = error.response.status
    switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break;
      case 401:
        error.message = '未授权，请登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '未找到资源'
        break;
      case 500:
        error.message = '服务器错误'
    }
  }
  return Promise.reject(error)
});

export const Http = axios

