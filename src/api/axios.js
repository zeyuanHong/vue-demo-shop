import axios from 'axios'
import { Notify } from 'vant'; // 引入消息提醒组件

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers = { // 统一给请求添头添加Authorization属性。
        'Authorization': localStorage.getItem("token")
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
});

// 封装axios的then方法
function handleOk(res, callback) {
    if (res.data.success) {//后端返回成功
        callback(res.data)
    } else {
        Notify({//后端返回失败，提示错误信息
            message: res.data.message,
            background: '#f44'
        })
    }
}

// 封装axios 请求错误执行的方法
function handleError(error) {
    console.log(error)
    Notify({
        message: error.message,
        background: '#f44'
    })
}


/**
 * 
 * @param {*} url  请求地址
 * @param {*} callback 请求成功的回调函数
 */

// get请求
export function GET(url, callback) {
    axios.get(url)
        .then(res => handleOk(res, callback))
        .catch(handleError)
}

// post请求
/**
 * 
 * @param {*} url  请求地址
 * @param {*} data 请求发送的数据
 * @param {*} callback 请求成功执行的回调函数
 */

export function POST(url, data, callback) {
    axios.post(url, data)
        .then(data => handleOk(data, callback))
        .catch(handleError)
}