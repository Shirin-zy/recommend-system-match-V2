import { LoginAxios } from "@/utlis/axios";

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
    });
    return response.data;
  } catch (error) {
    console.error("注册失败:", error);
    throw error;
  }
};

export { Register, Login };
