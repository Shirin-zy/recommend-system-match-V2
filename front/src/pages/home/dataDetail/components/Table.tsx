import React from "react";
import style from "./table.less";
import { Pagination } from "antd";
import { bg_url, icon_url } from "./urlList";

interface item {
  contest_class_first: number;
  contest_class_second: string;
  contest_class_second_id: number;
  contest_end_time: number;
  contest_id: number;
  contest_name: string;
  contest_start_time: number;
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
  regist_end_time: number;
  regist_start_time: number;
  thumb_pic: string;
  time_name: string;
  time_status: number;
}

interface IProps {
  matchInfo: item[];
  total: number;
  onShowSizeChange: (current: number, pageSize: number) => void;
  onChange: (page: number, pageSize: number) => void;
}

// 计算两个时间戳之间的天数差,(报名剩余时间)
const calculateDaysDifference = (timestamp: number) => {
  // 获取当前时间的时间戳（以毫秒为单位）
  const now = Date.now();
  // 确保传入的时间戳是按毫秒给出的
  let time = timestamp;
  // 如果时间戳是按秒给出的，则转换为毫秒
  if (String(timestamp).length <= 10) {
    time *= 1000;
  }
  // 计算两个时间戳之间的差异（以毫秒为单位），不计算绝对值
  const differenceInMilliseconds = time - now;
  // 将毫秒转换为天数
  // 一天有86400000毫秒（24小时 * 60分钟 * 60秒 * 1000毫秒）
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  // 向上取整
  return Math.ceil(differenceInDays);
};

// 将时间戳转化为标准时间
const transformData = (timestamp: number) => {
  // 如果时间戳是按秒给出的，则转换为毫秒
  if (timestamp.toString().length === 10) {
    timestamp *= 1000;
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 单个比赛信息
const Item = ({ item }: { item: item }) => {
  return (
    <>
      <div
        onClick={() =>
          window.open(`https://www.saikr.com/${item.contest_url}`, "_blank")
        }
        className={style.item}
      >
        <div className={style.left}>
          {item.thumb_pic ? (
            <img src={item.thumb_pic} alt="" />
          ) : (
            <div
              className={style.pic}
              style={{
                backgroundImage:
                  bg_url[Math.floor(Math.random() * bg_url.length)],
              }}
            >
              <div>{item.contest_name}</div>
              <span
                style={{
                  backgroundImage:
                    icon_url[Math.floor(Math.random() * icon_url.length)],
                }}
              ></span>
            </div>
          )}
        </div>
        <div className={style.middle}>
          <h2>{item.contest_name}</h2>
          <span>
            <span>主办方:</span>
            <span>{item.organiser}</span>
          </span>
          <span>
            <span>竞赛级别:</span>
            <span>{item.enter_range}</span>
          </span>
          <span>
            <span>报名时间:</span>
            <span>
              {transformData(item.regist_start_time)} ~{" "}
              {transformData(item.regist_end_time)}
            </span>
          </span>
          <span>
            <span> 比赛时间:</span>
            <span>
              {transformData(item.contest_start_time)} ~{" "}
              {transformData(item.contest_end_time)}
            </span>
          </span>
        </div>
        <div className={style.right}>
          {calculateDaysDifference(item.contest_end_time) > 0 && (
            <>
              {calculateDaysDifference(item.contest_start_time) > 0 ? (
                <span className={style.register}>正在报名</span>
              ) : (
                <span className={style.underway}>比赛进行中</span>
              )}
              {calculateDaysDifference(item.regist_end_time) > 0 && (
                <span className={style.time}>
                  <span>举例报名截止还有</span>
                  <span>{calculateDaysDifference(item.regist_end_time)}</span>
                  <span>天</span>
                </span>
              )}
            </>
          )}
          {calculateDaysDifference(item.contest_end_time) <= 0 && (
            <span className={style.end}>比赛结束</span>
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

const Table = (props: IProps) => {
  const { matchInfo, total, onChange, onShowSizeChange } = props;

  return (
    <>
      {matchInfo.map((item, index) => (
        <Item key={index} item={item} />
      ))}
      <Pagination
        style={{ marginTop: "30px" }}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
        align="center"
        defaultCurrent={1}
        total={total}
      />
    </>
  );
};

export default Table;
