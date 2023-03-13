import request from '@/api/basehttp/index'//引入basehhttp/index.js中的ajax方法
export const apiLogin = (data)=>request({
    url:'/login',
    method:'post',
    data
})