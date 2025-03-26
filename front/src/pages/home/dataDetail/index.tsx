import React, { useEffect, useState } from "react";
import getMatchInfo from "@/service/getMatchInfo";
import style from "./index.less";
import Table from "./components/Table";
import type { PaginationProps } from "antd";
import Filter from "./components/Filter";

const MatchInfo = () => {
  const [matchData, setMatchData] = useState<any[]>([]); // 用于存储比赛数据
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMatchInfo(
          pagination.pageSize,
          pagination.current
        ); // 等待获取数据
        setMatchData(data.data.list); // 更新状态
        setTotal(data.data.total);
      } catch (error) {
        console.error("获取比赛数据时出错:", error);
      } finally {
        setLoading(false); // 无论成功与否，加载状态都要结束
      }
    };

    fetchData();
  }, [pagination]);

  // 分页变化
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPagination({ current, pageSize });
  };

  // 当前页改变
  const onChange: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  return (
    <>
      <div className={style.content}>
        <div className={style.side}>
          <div>
            <Filter />
          </div>
        </div>
        <div className={style.table}>
          <div>
            <Table
              matchInfo={matchData}
              total={total}
              onChange={onChange}
              onShowSizeChange={onShowSizeChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchInfo;
