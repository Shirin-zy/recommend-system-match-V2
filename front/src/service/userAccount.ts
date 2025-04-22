import { LoginAxios, axiosInstance } from "@/utlis/axios";

const Login = async (email: string, password: string) => {
  try {
    const response = await LoginAxios.post("/api/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("登录失败:", error);
    throw error;
  }
};

const Register = async (email: string, password: string, username: string) => {
  try {
    const response = await LoginAxios.post("/api/register", {
      email,
      password,
      username,
      role: "common",
    });
    return response.data;
  } catch (error) {
    console.error("注册失败:", error);
    throw error;
  }
};

// 管理员创建用户
const Register_manger = async (
  email: string,
  password: string,
  username: string,
  role: string
) => {
  try {
    const response = await axiosInstance.post("/api/register", {
      email,
      password,
      username,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("注册失败:", error);
    throw error;
  }
};

// 获取所有用户
const getAllUser = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get("/api/allUser", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("获取用户失败:", error);
    throw error;
  }
};

// 通过关键词搜索
const searchUser = async (keyword: string) => {
  try {
    const response = await axiosInstance.post("/api/searchAccount", {
      keyword,
    });
    return response.data;
  } catch (error) {
    console.error("搜索用户失败:", error);
    throw error;
  }
};

// 更新账户信息
const updateAccount = async (
  email: string,
  username: string,
  role: string,
  status: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post("/api/updateAccount", {
      email,
      username,
      role,
      status,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("更新账户信息失败:", error);
    throw error;
  }
};

// 删除账户
const deleteAccount = async (email: string) => {
  try {
    const response = await axiosInstance.post("/api/user/delete", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("删除账户失败:", error);
    throw error;
  }
};

export {
  Register,
  Login,
  getAllUser,
  updateAccount,
  Register_manger,
  deleteAccount,
  searchUser,
};
