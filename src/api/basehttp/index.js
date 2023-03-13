/**
 * 与后端定义好响应格式
 * //data为服务器提供的响应
 * data:{
 *  data:{},//返回值
 *  code:1,
 *  msg:''//消息
 * }
 */

import BaseHttp from "./basehttp";
import { Message } from 'element-ui'//引入消息提示组件
import store from '@/store'

//实例化一个BaseHttp实例
const http = new BaseHttp({
    withCredential: true,//跨域请求是否提供凭证(cookie、http认证、ssl证明等)
})

/**
 * 
 * @param {showMsg}  
 * @param {needCatch}  接口错误时是否提示错误信息，默认值为空即为展示
 * @param {params}  //url,data,method,paramsType,config,showLoading等
 * @returns 
 */
function ajax({ showMsg = false, needCatch, ...params }) {
    return http.$http(params).then(res => {
        let msg = res.data.msg
        if (res.data) {
            if (params.config && params.config.responseType === 'blob') {
                return res
            } else if (res.data.code === 1 || res.data.data) {
                if (res.data.code === 401) {
                    //表示token过期
                    toLoginPage()
                    return Promise.reject({})//返回一个带有拒绝原因的 Promise 对象
                } else if (res.data.code === 501) {
                    //服务器错误
                    msg = res.data.data
                    msg && Message.error(msg)
                    return Promise.reject({})
                }
            } else {
                msg && Message.error(msg);
                return Promise.reject(err)//抛出实例化后的错误
            }
            showMsg && msg && Message.success(msg)
            return res.data //与Promise.resolve(res.data)相同，返回后都需要then方法接收
        }

        const err = new Error(msg || res.statusText || res.status)
        err.response = res.data || {}
        err.code = res.status
        return Promise.reject(err)
    }).catch(({ response = {}, message }) => {
        //catch和then中第二个参数 reject的callback的参数一样
        //response{data,status,headers},message,config

        !needCatch && response && message && Message.error(message)
        return Promise.reject(response)
    })
}

export default ajax

//返回登陆页
async function toLoginPage() {
    Message.error('登录已过期，请重新登录...')
    await store.dispatch('user/resetToken')//将全局及缓存中的token清空
    //定时跳转到登陆页
    setTimeout(() => {
        window.location.href = "/"
    }, 2000)
}
