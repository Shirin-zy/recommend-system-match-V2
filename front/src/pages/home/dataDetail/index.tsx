import React, { useEffect, useState } from "react";
import { fetchContestLists } from "./service"; // 引入 fetchContestLists 函数

const dataSync = () => {
  const [contestData, setContestData] = useState<any[]>([]); // 用于存储比赛数据
  const [loading, setLoading] = useState<boolean>(true); // 加载状态

  useEffect(() => {
    const loadContestData = async () => {
      try {
        const data = await fetchContestLists(2, 10); // 调用函数，传入参数
        setContestData(data); // 设置比赛数据
      } catch (error) {
        console.error("加载比赛数据失败:", error);
      } finally {
        setLoading(false); // 设置加载状态为 false
      }
    };

    loadContestData(); // 调用加载数据的函数
  }, []); // 组件挂载时调用
  console.log("data:", contestData);
  return (
    <>
      <h1>竞赛数据</h1>
      {loading ? (
        <div>加载中...</div> // 显示加载状态
      ) : (
        <div>
          {contestData?.length > 0 ? (
            <ul>
              {contestData.map((contest) => (
                <li key={contest.contest_id}>{contest.contest_name}</li> // 显示比赛名称
              ))}
            </ul>
          ) : (
            <div>没有比赛数据</div> // 没有数据时的提示
          )}
        </div>
      )}
    </>
  );
};

export default dataSync;
