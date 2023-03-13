import axios from "axios";
const { VUE_APP_PROXY_KEY } = process.env;
import { getTokenByKey,clearEmptySearch } from "./utils.js";

export default class BaseHttp {
  constructor(options) {
    this.create(options);
  }
  create(options = {}) {
    const {
      headers = {}, //请求头，可以在这里带上token和content-type
      timeout = 45000, //超时时间
      interceptors = {}, //拦截器{request:()=>{},response:()=>{}}
      ...option
    } = options;
    //创建一个axios实例
    this._http = axios.create({
      baseURL: VUE_APP_PROXY_KEY, //拼在url前
      headers: { "Content-Type": "application/json", ...headers }, //请求头
      timeout, //超时时间
      ...option,
    });

    //请求拦截
    this._http.interceptors.request.use(
      (request) => {
        const token = getTokenByKey("token");
        request.headers["token"] = token;
        //可以在这做loding效果

        //若传入的配置中有interceptors.request则使用这个，否则使用默认request
        return interceptors.request ? interceptors.request(request) : request;
      },
      (error) => {
        console.log(error);
      }
    )

    //响应拦截
    this._http.interceptors.response.use(
      (response) => {
        //在这做loding结束

        //若传入的配置中有interceptors.response则使用这个，否则使用默认response
        return interceptors.response ? interceptors.request(response) : response;
      },
      (error) => {
        //也关闭loding效果

        //异步返回错误
        return Promise.reject(error)
      }
    );
  }

  //实际请求方法
  $http({
    url='',//请求路径
    data={},//请求参数
    method = 'get',//请求方法
    paramsType='',//参数对应类型，method为get或delete，则参数为params，其余为data
    config={}
  }){
    return this._http({
      method,
      url,
      ...this._enhanceData({method,paramsType,data}),//格式化参数
      ...config
    })
  }

  //格式化请求参数，如method为get或delete，则参数为params，其余为data
  _enhanceData({method='',paramsType,data}){
    method = method.toLowerCase()//转为小写
    //若paramsType为空则判断method
    const defaultParamsType = paramsType||((method==='get'||method==='delete')?'params':'data')

    //paramsType为params时，过滤xxx=''的字段
    if(defaultParamsType==='params'){
      data = clearEmptySearch(data)
    }
    data = {[defaultParamsType]:data}
    return data
  }
}
