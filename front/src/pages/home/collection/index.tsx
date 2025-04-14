import React, { useEffect } from "react";
import { Segmented, Select, Tooltip, message } from "antd";
import { useState } from "react";
import style from "./index.less";
import CollectionItem from "./components/item";
import { getCollection } from "@/service/userInfo";
import App from "@/stores/newApp";
import { observer } from "mobx-react-lite";
import { updateCollection } from "@/service/userInfo";

interface ContestInfo {
  ID: number;
  contest_class_first: number;
  contest_class_second: string;
  contest_class_second_id: number;
  contest_end_time: number; // 假设这是一个时间戳
  contest_id: number;
  contest_name: string;
  contest_start_time: number; // 同样假设为时间戳
  contest_url: string;
  enter_range: string;
  is_contest_status: number;
  is_exam: number;
  is_new: number;
  level_name: string;
  module: number;
  organiser: string;
  organiser_name: string;
  rank: number;
  regist_end_time: number; // 时间戳
  regist_start_time: number; // 时间戳
  thumb_pic: string | null;
  time_name: string;
  time_status: number;
}

const Collection = () => {
  const [filterKey, setFilterKey] = useState("全部"); //  初始化筛选条件
  const [sortKey, setSortKey] = useState(1); //  初始化排序条件
  const [collectionData, setCollectionData] = useState<ContestInfo[]>([]); //  初始化收藏数据

  // 更新收藏
  const changeCollection = async (email: string, id: string) => {
    const data = await updateCollection(email, id);
    App.setCollectionss(data.data.collections);
    message.success(data.msg);
    // 重新获取收藏数据
    getCollectionData();
  };

  // 获取收藏数据
  const getCollectionData = async () => {
    const res = await getCollection(App.state.email);
    const data = res.data.list;
    setCollectionData(data);
  };

  useEffect(() => {
    getCollectionData();
  }, [App.state.email]);
  return (
    <>
      <h2
        onClick={() => {
          console.log(collectionData);
        }}
      >
        我的收藏
      </h2>
      <span className={style.subtitle}>查看您收藏的所有比赛</span>
      <div className={style.header}>
        <div className={style.filter}>
          <Segmented
            options={["全部", "报名中", "即将开始", "进行中", "已结束"]}
            onChange={(value) => {
              setFilterKey(value);
            }}
          />
        </div>
        <div className={style.sort}>
          <span>排序方式：</span>
          <Select
            defaultValue={1}
            options={[
              { value: 1, label: "报名截止日期" },
              { value: 2, label: "比赛开始日期" },
            ]}
            onChange={(value) => {
              setSortKey(value);
            }}
          />
        </div>
      </div>
      <div className={style.collection}>
        {collectionData.map((item) => (
          <CollectionItem
            key={item.ID}
            collectionInfo={item}
            changeCollection={changeCollection}
          />
        ))}
      </div>
    </>
  );
};

export default observer(Collection);
