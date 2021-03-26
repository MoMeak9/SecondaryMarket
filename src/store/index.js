import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
  user: window.sessionStorage.getItem('user'),
  commodity: window.sessionStorage.getItem('commodity'),
  hostServer:'',
  token:''
}
const mutations = {

  SET_TOKEN: (state, token)=>{
    state.token = token
    sessionStorage.token = token
  },
  DEL_TOKEN:(state)=>{
    state.token = ''
    sessionStorage.removeItem('token')
  },
  GET_USER: (state, data) => {
    // 把用户名存起来
    state.user = data
    window.sessionStorage.setItem('user', data)
  },
  LOGOUT: (state) => {
    // 登出的时候要清除用户名
    state.user = null
    window.sessionStorage.removeItem('user')
  },
  GET_COMMODITY: (state, data) => {
    // 把商品存起来
    state.commodity = data
    window.sessionStorage.setItem('commodity', data)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions: {},
  modules: {}
})
