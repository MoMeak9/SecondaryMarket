import Vue from 'vue'
import VueRouter from 'vue-router'

import Repassword from "@/views/Login/Repassword";
import Login from "@/views/Login/Login";
import Home from "@/views/Home/Home";
import AdminHome from "@/views/Home/AdminHome";
import AdminLogin from "@/views/Login/AdminLogin";

Vue.use(VueRouter)
//添加跳转与404跳转
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '用户登入'
        }
    },
    {
        path: '/repassword',
        name: 'repassword',
        component: Repassword,
        meta: {
            title: '密码找回'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            title: '商城主页'
        }
    },
    {
        path: '/adminHome',
        name: 'AdminHome',
        component: AdminHome,
        meta: {
            title: '管理审核'
        }
    },
    {
        path: '/adminLogin',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: {
            title: '管理员登入'
        }
    }
]

const router = new VueRouter({
    routes
})

export default router
