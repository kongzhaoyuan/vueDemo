import Vue from 'vue'
import VueRouter from 'vue-router'

// 把进度条相关的js和css引入进来
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  // @ 是系统给封装好的别名，代表src目录的"绝对路径名"信息
  // @：E:\Vue86-87\86\86everyday\02daypro\topline\src\
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/', redirect: '/welcome' },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/fans', name: 'fans', component: () => import('@/views/fans') },
      { path: '/material', name: 'material', component: () => import('@/views/material') },
      { path: '/account', name: 'account', component: () => import('@/views/account') },
      // 当前路由有参数，名称为aid
      {
        path: '/articleedit/:aid',
        name: 'articleedit',
        component: () => import('@/views/articleedit')
      },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 展示加载进度条
  NProgress.start()
  // 如果没有，userinfo是null的信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 非登录状态，访问非登录页面，就强制登录
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }

  next() // 默认放行
})

// 路由后置守卫(路由执行完毕、组件显示完毕后就执行了)
router.afterEach(() => {
  // 完成加载进度条
  NProgress.done()
})

export default router
