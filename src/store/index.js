import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
    userBean: window.localStorage.getItem('user'),
    commodity: window.localStorage.getItem('commodity'),
    hostServer: '39.105.228.56:8080/shop',
    token: window.localStorage.getItem('token')
}
const mutations = {
    GET_TOKEN: () => {
        return window.localStorage.getItem('token')
    },
    SET_TOKEN: (state, token) => {
        state.token = token
        window.localStorage.token = token
    },
    DEL_TOKEN: (state) => {
        state.token = ''
        window.localStorage.removeItem('token')
    },
    GET_USER: (state, data) => {
        // 把用户信息存起来
        state.userBean = data
        window.localStorage.setItem('user', data)
    },
    LOGOUT: (state) => {
        // 登出的时候要清除用户名
        state.userBean = null
        window.localStorage.removeItem('user')
    },
    GET_COMMODITY: (state, data) => {
        // 把商品存起来
        state.commodity = data
        window.localStorage.setItem('commodity', data)
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {}
})
