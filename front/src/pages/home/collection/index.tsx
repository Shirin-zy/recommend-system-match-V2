import React, { useEffect } from "react";
import { Segmented, Select, Tooltip, message } from "antd";
import { useState } from "react";
import style from "./index.less";
import CollectionItem from "./components/item";
import { getCollection } from "@/service/userInfo";
import App from "@/stores/newApp";
import { observer } from "mobx-react-lite";
import { updateCollection } from "@/service/userInfo";
import { set } from "mobx";

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
  const [sortKey, setSortKey] = useState("registryEnd"); //  初始化排序条件
  const [collectionData, setCollectionData] = useState<ContestInfo[]>([]); //  初始化收藏数据

  // 更新收藏,(取消收藏)
  const changeCollection = async (email: string, id: string) => {
    // 更新后端收藏数据
    const data = await updateCollection(email, id);
    App.setCollections(data.data.collections);
    message.success(data.msg);
    // 重新获取收藏数据
    // getCollectionData();
    // 重新筛选收藏数据
    // filterCollection();
    App.setCollectedItems(
      // 再全局states中删除被取消收藏的item
      App.state.collectionData.filter((item) => String(item.ID) !== id)
    );
    // 更新当前筛选下的收藏数据
    setCollectionData(collectionData.filter((item) => String(item.ID) !== id));
  };

  // 获取收藏数据
  const getCollectionData = async () => {
    const res = await getCollection(App.state.email);
    const data = res.data.list;
    const sort_data = data.sort((a, b) => {
      return a.regist_end_time - b.regist_end_time;
    });
    App.setCollectedItems(data);
    setCollectionData(data);
  };

  // 计算时间间隔
  const TimeInterval = (time: number) => {
    const nowTimes = Date.now();
    return Math.ceil((time * 1000 - nowTimes) / 1000 / 60 / 60 / 24);
  };

  // 筛选收藏比赛
  const filterCollection = () => {
    if (filterKey === "全部") {
      setCollectionData(App.state.collectionData);
    }
    if (filterKey === "已结束") {
      setCollectionData(
        App.state.collectionData.filter(
          // 比赛截止时间减去当前时间小于0的
          (item) => TimeInterval(item.contest_end_time) < 0
        )
      );
    }
    if (filterKey === "进行中") {
      setCollectionData(
        App.state.collectionData.filter(
          (item) =>
            // 比赛开始时间减去当前时间小于0且比赛截止时间减去当前时间大于0
            TimeInterval(item.contest_start_time) < 0 &&
            TimeInterval(item.contest_end_time) > 0
        )
      );
    }
    if (filterKey === "即将开始") {
      setCollectionData(
        App.state.collectionData.filter(
          (item) =>
            // 比赛开始时间减去当前时间大于0且小于7
            TimeInterval(item.contest_start_time) > 0 &&
            TimeInterval(item.contest_start_time) < 7
        )
      );
    }
    if (filterKey === "报名中") {
      setCollectionData(
        App.state.collectionData.filter(
          (item) =>
            // 报名开始时间减去当前时间大于0且比赛开始时间前去当前时间大于7
            TimeInterval(item.regist_end_time) > 0 &&
            TimeInterval(item.contest_start_time) > 7
        )
      );
    }
  };

  // 账号变化重新获取数据
  useEffect(() => {
    getCollectionData();
  }, [App.state.email]);

  // 筛选字段变化后重新筛选数据
  useEffect(() => {
    filterCollection();
  }, [filterKey]);

  // 排序字段变化后重新排序数据
  useEffect(() => {
    if (sortKey === "registryEnd") {
      App.setCollectedItems(
        App.state.collectionData.sort((a, b) => {
          return a.regist_end_time - b.regist_end_time;
        })
      );
      setCollectionData(
        collectionData.sort((a, b) => {
          return a.regist_end_time - b.regist_end_time;
        })
      );
    } else if (sortKey === "MatchStart") {
      App.setCollectedItems(
        App.state.collectionData.sort((a, b) => {
          return a.contest_start_time - b.contest_start_time;
        })
      );
      setCollectionData(
        collectionData.sort((a, b) => {
          return a.contest_start_time - b.contest_start_time;
        })
      );
    }
  }, [sortKey]);
  return (
    <>
      <div className={style.body}>
        <h2
          onClick={() => {
            console.log("筛选条件：", filterKey);
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
              defaultValue={"registryEnd"}
              options={[
                { value: "registryEnd", label: "报名截止日期" },
                { value: "MatchStart", label: "比赛开始日期" },
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
      </div>
    </>
  );
};

export default observer(Collection);
