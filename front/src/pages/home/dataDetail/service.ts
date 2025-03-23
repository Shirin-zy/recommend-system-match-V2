import axios from "axios"; // 确保引入 axios

/**
 * 获取比赛列表
 * @param page 页码
 * @param limit 每页数量
 * @param univs_id 大学ID
 * @param class_id 班级ID
 * @param level 等级
 * @param sort 排序方式
 * @returns 比赛列表数据
 */
export const fetchContestLists = async (
  page: number,
  limit: number,
  univs_id: string = "",
  class_id: string = "",
  level: number = 0,
  sort: number = 0
) => {
  const url = `https://apiv4buffer.saikr.com/api/pc/contest/lists?page=${page}&limit=${limit}&univs_id=${univs_id}&class_id=${class_id}&level=${level}&sort=${sort}`;

  try {
    const response = await axios.get(url);
    return response.data.data.list; // 返回请求的数据列表
  } catch (error) {
    console.error("获取比赛列表失败:", error);
    throw error; // 抛出错误以便调用者处理
  }
};
