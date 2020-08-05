// 引入Vue
import Vue from 'vue'

// 引入axios
import axios from 'axios'

// 引入路由模块
import router from '@/router/index.js'

// 引入json-bigint
import JSONBig from 'json-bigint'

// 公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 正常发送请求的逻辑代码
  // userinfo并不是始终存在的，要做判断使用
  let userinfo = window.sessionStorage.getItem('userinfo')

  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 给axios请求头配置token
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 成功请求完毕
  return response
}, function (error) {
  // 失败请求(可以处理例如401这样的错误情况)
  // console.dir(error)
  // 判断401出现
  if (error.response.status === 401) {
    // 强制用户登录
    // 路由对象.push('/login')  this.$router.push()
    router.push('/login')
  }
  return Promise.reject(error)
})

// 响应原生数据转换器
axios.defaults.transformResponse = function (data) {
  // data是服务器端给客户端返回的第一手数据，其是String字符串
  // console.log(typeof data) // string
  // 对服务器端返回的数据做json-bigint处理
  // 服务器端返回信息格式：
  // 1. '{name:value,name:value...}' 实体字符串
  // 2. ''  空字符串
  // 服务器端会返回 实体字符串 和 空字符串 两种信息，所以要做判断处理
  if (data) {
    return JSONBig.parse(data)
  } else {
    return data
  }
}
// 把axios通过原型继承的方式配置给Vue，使得组件内部可以直接访问
// 后期在组件内部就可以通过 this.$http 的方式获得axios对象
// $http:就是自定义名称，可以为其他
Vue.prototype.$http = axios
