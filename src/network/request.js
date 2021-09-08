import axios from 'axios'

const request = axios.create({
    baseURL: '/api',
    timeout: 60000
})

// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    // console.log(config);
    //给百度接口添加token
    if (config.url.indexOf("https://aip.baidubce.com/rest/2.0/face/v3") !== -1) {
        config.url+='?access_token=24.b5a99405e4e864ee75267aa50315654e.2592000.1632800342.282335-24767568'
    }
    // config.headers['token'] = user.token;  // 设置请求头
    //
    // if (localStorage.getItem('token')) {
    //     config.headers.token = localStorage.getItem('token');
    //
    // }
    // hideLoading(); // 隐藏加载
    return config
}, error => {

    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
    //     // 如果是返回的文件
    //     if (response.config.responseType === 'blob') {
    //         return res
    //     }
    //     // 兼容服务端返回的字符串数据
    //     if (typeof res === 'string') {
    //         res = res ? JSON.parse(res) : res
    //     }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        // alert(error)
        return error
    }
)


export default request