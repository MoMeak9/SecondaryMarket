import Vue from 'vue'
import VueRouter from 'vue-router'

import Repassword from "@/views/Login/Repassword";
import Login from "@/views/Login/Login";
import Home from "@/views/Home/Home";
import User from "@/views/User/User";
import CommodityInfo from "@/views/Content/CommodityInfo";
import Search from "@/views/Home/Search";

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/home',
        meta: {
            title: '转小二 校园二手交易平台'
        }
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
            title: '转小二 校园二手交易平台'
        }
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/CommodityInfo',
        name: 'CommodityInfo',
        component: CommodityInfo,
        meta: {
            title: '商品信息'
        }
    },
    {
        path: '/search',
        name: 'search',
        component: Search,
        meta: {
            title: '搜索商品'
        }
    },
]

const router = new VueRouter({
    routes
})

export default router
