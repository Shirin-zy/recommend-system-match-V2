import style from "./item.less";
import { Tooltip, message } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import React from "react";

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

// 确保 props 包含 collectionInfo
interface CollectionItemProps {
  collectionInfo: ContestInfo;
  changeCollection: (email: string, contestId: string) => void;
}

// 将时间戳转化为当前月份和日期
function convertTimestampToFormattedDate(timestamp: number): string {
  // 将秒级时间戳转换为毫秒
  const date = new Date(timestamp * 1000);

  // 获取月份（注意：getMonth() 返回的值是 0-11，所以需要加 1）
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // 获取日期
  const day = date.getDate().toString().padStart(2, "0");

  // 返回格式化后的日期字符串
  return `${month}-${day}`;
}

// 计算比赛剩余报名时间
const registerTime = (time: number) => {
  const nowTimes = Date.now();
  return Math.ceil((time * 1000 - nowTimes) / 1000 / 60 / 60 / 24);
};

// 通过时间戳获取比赛状态
const getContestStatus = (dataInfo: ContestInfo) => {
  if (registerTime(dataInfo.contest_end_time) < 0) {
    return { class: style.end, label: "已结束" };
  } else if (registerTime(dataInfo.contest_start_time) < 0) {
    return { class: style.during, label: "进行中" };
  } else if (registerTime(dataInfo.contest_start_time) < 7) {
    return { class: style.start, label: "即将开始" };
  } else if (registerTime(dataInfo.regist_end_time) > 0) {
    return { class: style.register, label: "报名中" };
  }
};

const CollectionItem: React.FC<CollectionItemProps> = ({
  collectionInfo,
  changeCollection,
}) => {
  const [color, setColor] = useState("#a2a2a2"); // 收藏按钮颜色
  const [tips, setTips] = useState("收藏");
  const labelInfo = getContestStatus(collectionInfo);
  useEffect(() => {
    // 初始化颜色
    setColor(
      App.state.collections.includes(String(collectionInfo.ID))
        ? "#ff0605"
        : "#a2a2a2"
    );
  }, []);
  return (
    <>
      <div className={style.item}>
        <div className={style.left}>{collectionInfo.contest_name}</div>
        <div className={style.right}>
          <div className={style.cradTitle}>
            <div>{collectionInfo.contest_name}</div>
            <div>
              <Tooltip placement="top" title={tips} color="blue">
                <HeartFilled
                  style={{
                    fontSize: "20px",
                    color: color,
                  }}
                  onClick={() => {
                    // 切换颜色
                    setColor(
                      (prevColor) =>
                        prevColor === "#ff0605" ? "#a2a2a2" : "#ff0605" // 切换收藏按钮颜色
                    );
                    setTips((prevTips) =>
                      prevTips === "收藏" ? "取消收藏" : "收藏"
                    );
                    // 调用 changeCollection 函数
                    changeCollection(
                      App.state.email,
                      String(collectionInfo.ID)
                    );
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <div className={style.cardInfo}>
            <div>
              <span>主办方：</span>
              <span>赛事级别：</span>
              <span>报名时间：</span>
              <span>比赛时间：</span>
            </div>
            <div>
              <Tooltip
                placement="top"
                title={collectionInfo.organiser}
                color="blue"
              >
                <span>{collectionInfo.organiser}</span>
              </Tooltip>
              <span>{collectionInfo.level_name}</span>
              <span>
                {convertTimestampToFormattedDate(
                  collectionInfo.regist_start_time
                )}
                ~
                {convertTimestampToFormattedDate(
                  collectionInfo.regist_end_time
                )}
              </span>
              <span>
                {convertTimestampToFormattedDate(
                  collectionInfo.contest_start_time
                )}
                ~
                {convertTimestampToFormattedDate(
                  collectionInfo.contest_end_time
                )}
              </span>
            </div>
          </div>
          <div className={style.cardEnd}>
            <div>
              <span className={labelInfo?.class}>{labelInfo?.label}</span>
            </div>
            <div>
              {registerTime(collectionInfo.regist_end_time) > 0 &&
                ` 至截止报名还有
              ${registerTime(collectionInfo.regist_end_time)}天`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(CollectionItem);
