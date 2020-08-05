import Vue from 'vue'
import App from './App.vue'
// vuecli框架内部有对文件做自动检索
// index.js 和 index.vue文件不用刻意设置，默认就会自动寻找
import router from './router'
// 引入全局样式控制文件
import '@/assets/css/global.css'

// 引入axios独立文件
import '@/utils/ax.js' // 本质，执行该文件的内容

// 引入elementui组件库
import '@/utils/element.js' // 本质：在该处执行element.js代码

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
