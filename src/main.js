import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueParticles from 'vue-particles'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/main.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueParticles)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next()
    } else if (to.path === '/login') {
        document.title = to.meta.title
        next()
    } else if (to.path === '/repassword') {
        document.title = to.meta.title
        next()
    } else if (to.path === '/home') {
        document.title = to.meta.title
        next()
    } else if (to.path === '/user') {
        document.title = to.meta.title
        next()
    } else if (to.path === '/CommodityInfo') {
        document.title = to.meta.title
        next()
    } else if (to.path === '/search') {
        document.title = to.meta.title
        next()
    } else {
        next({path: '/'})
    }
})

import axios from 'axios'

Vue.prototype.$axios = axios;
axios.defaults.baseURL = window.PLATFROM_CONFIG.baseURL

import qs from 'qs'

Vue.prototype.$qs = qs;

import VueCropper from 'vue-cropper'

Vue.use(VueCropper)
