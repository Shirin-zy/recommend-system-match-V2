import App from "@/stores/newApp";
import axios from "axios";
import { history } from "umi";
import { message } from "antd";

// 创建 axios 实例并设置基础 URL
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8444/",
  // timeout: 10000, // 可选：设置请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    if (App.tokenStatus === "expired") {
      // 检查token状态是否为过期
      message.error("登录已过期，请重新登录");
      history.push("/login"); // 跳转到登录页面
      // return Promise.reject(new Error("Token expired")); // 拒绝请求
    }

    const token = App.state.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 添加token到请求头
    }

    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response;
  },
  (error) => {
    // 如果响应错误是由于未授权（可能是token无效或过期），可以在这里处理
    if (error.response && error.response.status === 401) {
      console.error("登录已过期，请重新登录");
      window.location.href = "/login"; // 跳转到登录页面
    }
    // 处理其他响应错误
    return Promise.reject(error);
  }
);

// 创建 axios 实例并设置基础 URL
const LoginAxios = axios.create({
  baseURL: "http://127.0.0.1:8444/",
  timeout: 10000, // 可选：设置请求超时时间
});

// 可以在这里添加请求拦截器、响应拦截器等
axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export { LoginAxios, axiosInstance };
