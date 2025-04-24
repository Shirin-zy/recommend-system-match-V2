import { LoginAxios, axiosInstance } from "@/utlis/axios";

const getRecommendItems = async (email: string) => {
  try {
    const response = await axiosInstance.get("/api/recommend/items", {
      params: {
        email,
      },
    });
    return response.data;
  } catch (error) {
    console.error("获取推荐商品失败:", error);
    throw error;
  }
};

export { getRecommendItems };
