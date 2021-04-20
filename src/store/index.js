import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
    userBean: window.sessionStorage.getItem('user'),
    commodity: window.sessionStorage.getItem('commodity'),
    token: window.sessionStorage.getItem('token'),
    search: window.sessionStorage.getItem('search'),
    commNo: window.sessionStorage.getItem('commNo')
}
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        window.sessionStorage.token = token
    },
    DEL_TOKEN: (state) => {
        state.token = ''
        window.sessionStorage.removeItem('token')
    },
    GET_USER: (state, data) => {
        // 把用户信息存起来
        state.userBean = data
        window.sessionStorage.setItem('user', data)
    },
    LOGOUT: (state) => {
        // 登出的时候要清除用户名
        state.userBean = null
        window.sessionStorage.removeItem('user')
    },
    GET_COMM: (state, commNo) => {
        state.commNo = commNo
        window.sessionStorage.commNo = commNo
    },
    DEL_COMM: (state) => {
        state.commNo = ''
        window.sessionStorage.removeItem('commNo')
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {},
})
