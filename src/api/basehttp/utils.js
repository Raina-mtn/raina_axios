export const clearEmptySearch = (params) => {
    const obj = {}
    Object.keys(params).forEach(key=>{
        const value = params[key]
        if(typeof value === 'string'){
            if(value){
                obj[key]=value
            }
        }else if(Array.isArray(value)){
            if(value.length){
                obj[key]=value
            }
        }else if(value!==null){
            obj[key]=value
        }
    })
    return obj
}

const TOKEN_KEY = 'shenhao-vuex'
export const getToken = ()=>{
    const storage = window.localStorage.getItem(TOKEN_KEY)
    return storage && JSON.parse(storage)
}

export const removeToken = ()=>{
    return window.localStorage.removeItem(TOKEN_KEY)
}

//箭头函数没有arguments，因此使用函数表达式
export const getTokenByKey = function(){
    //arguments为类数组，因此使用call将array原型上的splice方法指向arguments
    var args = Array.prototype.splice.call(arguments)
    let obj = getToken()
    let res = ''
    args.forEach(i=>{
        if(obj&&obj[i]){
            res = obj[i]
            obj = JSON.parse(JSON.stringify(obj[i]))
        }else{
            res = ''
        }
        return res
    })
}