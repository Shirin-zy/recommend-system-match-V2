import { axiosInstance } from "@/utlis/axios";

const getUserInfo = async (email: string) => {
  const encodedEmail = encodeURIComponent(email);
  try {
    const response = await axiosInstance.get(
      `/api/getUserInfo?email=${encodedEmail}`
    );
    return response.data;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw error;
  }
};

const updateUserInfo = (
  email: string,
  professional: string,
  purpose: number,
  experience: number,
  interest: number,
  level: string,
  nature: number,
  starttime: number,
  endtime: number
) => {
  try {
    const response = axiosInstance.post("/api/editUserInfo", {
      email,
      professional,
      purpose,
      experience,
      interest,
      level,
      nature,
      starttime,
      endtime,
    });
    return response;
  } catch (error) {
    console.error("更新用户信息失败:", error);
    throw error;
  }
};

const updateCollection = async (email: string, id: string) => {
  try {
    const response = await axiosInstance.post("/api/updateCollection", {
      email,
      id,
    });
    return response.data;
  } catch (error) {
    console.error("更新收藏失败:", error);
    throw error;
  }
};

const getCollection = async (email: string) => {
  const encodedEmail = encodeURIComponent(email);
  try {
    const response = await axiosInstance.get(
      `/api/collections?email=${encodedEmail}`
    );
    return response.data;
  } catch (error) {
    console.error("获取收藏失败:", error);
    throw error;
  }
};

export { getUserInfo, updateUserInfo, updateCollection, getCollection };
