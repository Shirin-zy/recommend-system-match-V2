import {axiosInstance} from "@/utlis/axios";

const getMatchInfo = async (
  limit: number, // 每页条数
  page: number, // 页码
  ids?: string, // 类别
  level?: number, // 等级
  sort?: number // 排序方式
) => {
  try {
    const response = await axiosInstance.get("/api/getMatchInfo", {
      params: {
        limit: limit,
        page: page,
        class_id: ids,
        level: level,
        sort: sort,
      },
    });
    return response.data; // 返回请求得到的数据
  } catch (error) {
    // 处理错误，可以选择抛出错误或返回默认值
    console.error("获取比赛信息失败:", error);
    throw error; // 重新抛出错误以便调用者处理
  }
};

export default getMatchInfo;
