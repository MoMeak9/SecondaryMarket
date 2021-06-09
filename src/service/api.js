//引入axios和qs插件
import axios from 'axios'
import qs from 'qs'
//创建一个类并导出
const hostlocation = 'https://zhuanxiaoer.cn'
// const hostlocation = ''
export const Server = new class {
//    商品相关
    bannerList(params) {
        return axios.get(hostlocation + '/shop/commodity/bannerList', params).then((res) => res.data)
    }

    deleteComm(params, token) {
        return axios.post(hostlocation + '/shop/commodity/deleteCommComment', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    initialCommList(params) {
        return axios.get(hostlocation + '/shop/commodity/initialCommList', params).then((res) => res.data)
    }

    preSearchComm(params) {
        return axios.get(hostlocation + '/shop/commodity/preSearchComm', params).then((res) => res.data)
    }

    queryCommByNo(params) {
        return axios.get(hostlocation + '/shop/commodity/queryCommByNo', params).then((res) => res.data)
    }

    queryCommByTag(params) {
        return axios.get(hostlocation + '/shop/commodity/queryCommByTag', params).then((res) => res.data)
    }

    queryUserComm(token) {
        return axios.get(hostlocation + '/shop/commodity/queryUserComm', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    recommendCommList(params) {
        return axios.get(hostlocation + '/shop/commodity/recommendCommList', params).then((res) => res.data)
    }

    releaseComm(params, token) {
        return axios.get(hostlocation + '/shop/commodity/releaseComm', {
            headers: {Authorization: token},
            params
        }).then((res) => res.data)
    }

    searchComm(params) {
        return axios.get(hostlocation + '/shop/commodity/searchComm', params).then((res) => res.data)
    }

//    通知接口
    orderSendEmail(params, token) {
        return axios.post(hostlocation + '/shop/message/orderSendEmail', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    sendEmail(params) {
        return axios.post(hostlocation + '/shop/message/sendEmail', params).then((res) => res.data)
    }

//    用户相关
    login(params) {
        return axios.post(hostlocation + '/shop/user/login', qs.stringify(params)).then((res) => res.data)
    }

    forgetPassword(params) {
        return axios.post(hostlocation + '/shop/user/forgetPassword', qs.stringify(params)).then((res) => res.data)
    }

    changePassword(params, token) {
        return axios.post(hostlocation + '/shop/user/changePassword', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    register(params) {
        return axios.post(hostlocation + '/shop/user/register', qs.stringify(params)).then((res) => res.data)
    }

    updateUserInfo(params) {
        return axios.post(hostlocation + '/shop/user/updateUserInfo', qs.stringify(params)).then((res) => res.data)
    }

//    订单相关接口
    deleteOrderRecord(params, token) {
        return axios.post(hostlocation + '/shop/order/deleteOrderRecord', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    queryUserReceiveOrderList(token) {
        return axios.get(hostlocation + '/shop/order/queryUserReceiveOrderList', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    queryUserSubmitOrderList(token) {
        return axios.get(hostlocation + '/shop/order/queryUserSubmitOrderList', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    submitOrder(params, token) {
        return axios.post(hostlocation + '/shop/order/submitOrder', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    updateOrderStatus(params, token) {
        return axios.post(hostlocation + '/shop/order/updateOrderStatus', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

//    商品评论
    insertCommComment(params, token) {
        return axios.post(hostlocation + '/shop/commComment/insertCommComment', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    reportCommComment(params) {
        return axios.post(hostlocation + '/shop/commComment/reportCommComment', qs.stringify(params)).then((res) => res.data)
    }

    queryCommCommentList(params) {
        return axios.get(hostlocation + '/shop/commComment/queryCommCommentList', {params}).then((res) => res.data)
    }
}
