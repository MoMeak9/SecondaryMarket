//引入axios和qs插件
import axios from 'axios'
import qs from 'qs'
//创建一个类并导出
const hostlocation = 'https://zhuanxiaoer.cn/market'
// const hostlocation = ''
export const Server = new class {
//    商品相关
    bannerList(params) {
        return axios.get(hostlocation + '/commodity/bannerList', params).then((res) => res.data)
    }

    deleteCommComment(params, token) {
        return axios.post(hostlocation + '/commodity/deleteCommComment', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    initialCommList(params) {
        return axios.get(hostlocation + '/commodity/initialCommList', params).then((res) => res.data)
    }

    preSearchComm(params) {
        return axios.get(hostlocation + '/commodity/preSearchComm', params).then((res) => res.data)
    }

    queryCommByNo(params) {
        return axios.get(hostlocation + '/commodity/queryCommByNo', params).then((res) => res.data)
    }

    queryCommByTag(params) {
        return axios.get(hostlocation + '/commodity/queryCommByTag', params).then((res) => res.data)
    }

    queryUserComm(token) {
        return axios.get(hostlocation + '/commodity/queryUserComm', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    recommendCommList(params) {
        return axios.get(hostlocation + '/commodity/recommendCommList', params).then((res) => res.data)
    }

    releaseComm(params, token) {
        return axios.post(hostlocation + '/commodity/releaseComm', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

    searchComm(params) {
        return axios.get(hostlocation + '/commodity/searchComm', params).then((res) => res.data)
    }

//    通知接口
    orderSendEmail(params, token) {
        return axios.post(hostlocation + '/message/orderSendEmail', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    sendEmail(params) {
        return axios.post(hostlocation + '/message/sendEmail', qs.stringify(params)).then((res) => res.data)
    }

//    用户相关
    login(params) {
        return axios.post(hostlocation + '/user/login', qs.stringify(params)).then((res) => res.data)
    }

    forgetPassword(params) {
        return axios.post(hostlocation + '/user/forgetPassword', qs.stringify(params)).then((res) => res.data)
    }

    changePassword(params, token) {
        return axios.post(hostlocation + '/user/changePassword', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    register(params) {
        return axios.post(hostlocation + '/user/register', qs.stringify(params)).then((res) => res.data)
    }

    updateUserInfo(params, token) {
        return axios.post(hostlocation + '/user/updateUserInfo', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

//    订单相关接口
    deleteOrderRecord(params, token) {
        return axios.post(hostlocation + '/order/deleteOrderRecord', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    queryUserReceiveOrderList(token) {
        return axios.get(hostlocation + '/order/queryUserReceiveOrderList', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    queryUserSubmitOrderList(token) {
        return axios.get(hostlocation + '/order/queryUserSubmitOrderList', {
            headers: {Authorization: token}
        }).then((res) => res.data)
    }

    submitOrder(params, token) {
        return axios.post(hostlocation + '/order/submitOrder', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    updateOrderStatus(params, token) {
        return axios.post(hostlocation + '/order/updateOrderStatus', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

//    商品评论
    insertCommComment(params, token) {
        return axios.post(hostlocation + '/commComment/insertCommComment', qs.stringify(params), {headers: {Authorization: token}}).then((res) => res.data)
    }

    reportCommComment(params) {
        return axios.post(hostlocation + '/commComment/reportCommComment', qs.stringify(params)).then((res) => res.data)
    }

    queryCommCommentList(params) {
        return axios.get(hostlocation + '/commComment/queryCommCommentList', {params}).then((res) => res.data)
    }

    uploadAuthenticationInfo(params, token) {
        return axios.post(hostlocation + '/user/uploadAuthenticationInfo', params, {headers: {Authorization: token}}).then((res) => res.data)
    }

}
