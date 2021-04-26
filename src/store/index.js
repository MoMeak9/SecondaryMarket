import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
    userBean: window.localStorage.getItem('user'),
    commodity: window.localStorage.getItem('commodity'),
    token: window.localStorage.getItem('token'),
    searchText: window.localStorage.getItem('searchText'),
    commNo: window.localStorage.getItem('commNo')
}
const mutations = {
    //用户Token
    SET_TOKEN: (state, token) => {
        state.token = token
        window.localStorage.token = token
    },
    DEL_TOKEN: (state) => {
        state.token = ''
        window.localStorage.removeItem('token')
    },
    //用户信息
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
    //商品编码
    GET_COMM: (state, commNo) => {
        state.commNo = commNo
        window.localStorage.commNo = commNo
    },
    DEL_COMM: (state) => {
        state.commNo = ''
        window.localStorage.removeItem('commNo')
    },
    //    搜索信息
    GET_SEARCH: (state, searchText) => {
        state.searchText = searchText
        window.localStorage.searchText = searchText
    },
    DEL_SEARCH: (state) => {
        state.searchText = ''
        window.localStorage.removeItem('searchText')
    },
//    商品类型详细
    GET_COMMTAG:(state,commTag)=>{
        state.commTag = commTag
        window.localStorage.searchText = commTag
    },
    DEL_COMMTAG:(state) =>{
        state.commTag = ''
        window.localStorage.removeItem('commTag')
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {},
})
