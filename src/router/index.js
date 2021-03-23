import Vue from 'vue'
import VueRouter from 'vue-router'

import Page404 from '../views/404/Page404'

Vue.use(VueRouter)
//添加跳转与404跳转
const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue')
  },
  {
    path: "/page404",
    name: "page404",
    component: Page404,
    meta:{
      title: '未知页面'
    }
  }, {
    path: "*",
    redirect: "/page404"
  }

]

const router = new VueRouter({
  routes
})

export default router
