import React, { useEffect, useState } from "react";
import getMatchInfo from "@/service/getMatchInfo";
import style from "./index.less";
import Table from "./components/Table";
import type { PaginationProps } from "antd";
import { Empty } from "antd";
import Filter from "./components/Filter";

const MatchInfo = () => {
  const [matchData, setMatchData] = useState<any[]>([]); // 用于存储比赛数据
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [total, setTotal] = useState<number>(0); // 复合条件的数据总数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  }); // 分页信息
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // 比赛类型筛选列表
  const [selectLevel, setSelectLevel] = useState<number>(0); // 比赛级别
  const [selectSort, setSelectSort] = useState<number>(0); // 排序方式

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMatchInfo(
          pagination.pageSize,
          pagination.current,
          selectedCategories.join("|"),
          selectLevel,
          selectSort
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
    console.log(
      "赛选参数:",
      "类别:",
      selectedCategories,
      "级别:",
      selectLevel,
      "排序:",
      selectSort
    );
  }, [pagination, selectedCategories, selectLevel, selectSort]);

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
            <Filter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectLevel={selectLevel}
              setSelectLevel={setSelectLevel}
              selectSort={selectSort}
              setSelectSort={setSelectSort}
            />
          </div>
        </div>
        <div className={style.table}>
          <div>
            {total === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Table
                matchInfo={matchData}
                total={total}
                onChange={onChange}
                onShowSizeChange={onShowSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchInfo;
