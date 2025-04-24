import React, { useEffect } from "react";
import style from "./body.less";
import { FireOutlined, RiseOutlined, HeartOutlined } from "@ant-design/icons";
import { getRecommendItems } from "@/service/recommendItem";
import { updateCollection } from "@/service/userInfo";
import App from "@/stores/newApp";
import { observer } from "mobx-react-lite";
import CollectionItem from "./Item";
import { message, Tooltip } from "antd";

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

const Body = () => {
  const [recommendItems, setRecommendItems] = React.useState<ContestInfo[]>([]); // 推荐项目列表
  // 获取推荐比赛
  const getRecommend = async (email: string) => {
    const data = await getRecommendItems(email);
    setRecommendItems(data.data.list);
  };

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
  };

  useEffect(() => {
    getRecommend(App.state.email);
  }, []);

  return (
    <>
      <div className={style.body}>
        <div className={style.title}>
          <Tooltip
            color="blue"
            title="该推荐结果是基于您的偏好、个人习惯以及热门比赛综合得出，仅供参考"
            style={{ cursor: "pointer" }}
          >
            {" "}
            <h2 className={style.sectionTitle}>
              <span className={style.titleIndicator}></span>
              推荐比赛
              <div className={style.titleUnderline}></div>
            </h2>
          </Tooltip>
          <div className={style.icon}>
            <HeartOutlined style={{ color: "#2563eb" }} />
            &nbsp;精选&nbsp;
            <FireOutlined style={{ color: "#2563eb" }} />
            &nbsp;热门&nbsp;
            <RiseOutlined style={{ color: "#2563eb" }} />
            &nbsp;最新
          </div>
        </div>
        <div className={style.table}>
          {recommendItems.map((item, index) => (
            <CollectionItem
              collectionInfo={item}
              key={item.ID}
              changeCollection={changeCollection}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default observer(Body);
