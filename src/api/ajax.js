// 导入axios
import axios from 'axios';

// 进行一些全局配置
// 公共路由(网络请求地址)
axios.defaults.baseURL = 'http://localhost:8080/config-center';
// 请求响应超时时间
axios.defaults.timeout = 5000;

// 封装自己的get/post方法
export default {
    get: function(path = '', data = {}) {
        return new Promise(function(resolve, reject) {
            axios.get(path, { params: data })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error);
            });
        });
    },
    post: function(path = '', data = {}) {
        return new Promise(function(resolve, reject) {
            axios.post(path, data)
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    }
};