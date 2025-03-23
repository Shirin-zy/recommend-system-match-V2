import React, { useEffect, useState } from "react";
import { fetchContestLists } from "./service"; // 引入 fetchContestLists 函数
import { saveAs } from "file-saver"; // 引入 file-saver 库

const dataSync = () => {
  const [contestData, setContestData] = useState<any[]>([]); // 用于存储比赛数据
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [progress, setProgress] = useState<number>(0); // 进度
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 模态框状态

  const loadContestData = async () => {
    const allContestData: any[] = []; // 用于存储所有页的数据
    setLoading(true); // 开始加载数据
    setIsModalOpen(true); // 打开模态框
    setProgress(0); // 重置进度

    try {
      for (let page = 1; page <=10 ; page++) {
        // 循环请求826页数据
        const data = await fetchContestLists(page, 10); // 调用函数，传入参数
        allContestData.push(...data); // 合并数据
        setProgress((page / 10) * 100); // 更新进度
      }
      setContestData(allContestData); // 设置所有比赛数据
      const jsonBlob = new Blob([JSON.stringify(allContestData)], {
        type: "application/json",
      }); // 创建JSON Blob
      saveAs(jsonBlob, "contestData.json"); // 保存为JSON文件
      alert("数据下载完成！"); // 提示用户
    } catch (error) {
      console.error("加载比赛数据失败:", error);
    } finally {
      setLoading(false); // 设置加载状态为 false
      setIsModalOpen(false); // 关闭模态框
    }
  };

  return (
    <>
      <h1>数据同步</h1>
      <button onClick={loadContestData}>开始获取数据</button> {/* 添加按钮 */}
      {isModalOpen && (
        <div className="modal">
          <h2>加载中...</h2>
          <progress value={progress} max={100}></progress> {/* 显示进度条 */}
          <p>{progress}%</p>
        </div>
      )}
    </>
  );
};

export default dataSync;
