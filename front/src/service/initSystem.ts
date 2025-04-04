import {axiosInstance} from "@/utlis/axios";

const InitSystem = async () => {
  try {
    const response = await axiosInstance.get("/api/syncMatchInfo");
    return response.data;
  } catch (error) {
    console.error("初始化系统失败:", error);
    throw error;
  }
};

export default InitSystem;
