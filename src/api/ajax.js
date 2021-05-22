/*可发送ajax请求的函数模块
封装了axios库
函数返回值是promise对象
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') {//发送GET请求
            promise = axios.get(url, {
                params: data //指定请求参数
            })
        } else { //发送POST请求
            promise = axios.post(url, data)
        }
        //2.如果成功，调用resolve(value)
        promise.then(response => {
            //将现有对象转为 Promise 对象  异步得到response.data
            resolve(response.data)
            //3.失败，不调用reject(reason),而是提示异常信息
        }).catch(error => {
            message.error('请求出错了,请仔细检查是否操作不当：' + error.message)
        })
    })
}
