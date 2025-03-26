import axios from 'axios';

// 创建 axios 实例并设置基础 URL
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8444/',
    timeout: 10000, // 可选：设置请求超时时间
});

// 可以在这里添加请求拦截器、响应拦截器等
axiosInstance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config;
    },
    error => {
        // 处理请求错误
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        // 处理响应数据
        return response;
    },
    error => {
        // 处理响应错误
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default axiosInstance;
