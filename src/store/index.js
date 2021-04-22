import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
    userBean: window.sessionStorage.getItem('user'),
    commodity: window.sessionStorage.getItem('commodity'),
    token: window.sessionStorage.getItem('token'),
    searchText: window.sessionStorage.getItem('searchText'),
    commNo: window.sessionStorage.getItem('commNo')
}
const mutations = {
    //用户Token
    SET_TOKEN: (state, token) => {
        state.token = token
        window.sessionStorage.token = token
    },
    DEL_TOKEN: (state) => {
        state.token = ''
        window.sessionStorage.removeItem('token')
    },
    //用户信息
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
    //商品编码
    GET_COMM: (state, commNo) => {
        state.commNo = commNo
        window.sessionStorage.commNo = commNo
    },
    DEL_COMM: (state) => {
        state.commNo = ''
        window.sessionStorage.removeItem('commNo')
    },
    //    搜索信息
    GET_SEARCH: (state, searchText) => {
        state.searchText = searchText
        window.sessionStorage.searchText = searchText
    },
    DEL_SEARCH: (state) => {
        state.searchText = ''
        window.sessionStorage.removeItem('searchText')
    },
//    商品类型详细
    GET_COMMTAG:(state,commTag)=>{
        state.commTag = commTag
        window.sessionStorage.searchText = commTag
    },
    DEL_COMMTAG:(state) =>{
        state.commTag = ''
        window.sessionStorage.removeItem('commTag')
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {},
})
