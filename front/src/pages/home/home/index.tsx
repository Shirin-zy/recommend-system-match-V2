import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { history } from "umi";
import { getCollection } from "@/service/userInfo";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import style from "./index.less";
const Home = () => {
  const [tipsVisible, setTipsVisible] = useState(false);
  useEffect(() => {
    const getCollectionData = async () => {
      const res = await getCollection(App.state.email);
      const data = res.data.list;
      // 登录后将首次收藏数据保的ID同步至state并缓存到本地
      localStorage.setItem(
        "collections",
        JSON.stringify(data.map((item) => item.ID + ""))
      );
      App.setCollections(data.map((item) => item.ID + ""));
      if (getLatestCollection(data)) {
        App.setMsgTips(
          `亲爱的用户，您订阅的“${getLatestCollection(data).contest_name}”，距离报名截止还有${registerTime(getLatestCollection(data).regist_end_time)}天，请及时关注！`
        );
      } else {
        App.setMsgTips("亲爱的用户，您还没有感兴趣的比赛，快去浏览吧！");
      }
    };
    setTipsVisible(JSON.parse(localStorage.getItem("tipsVisible") || "true"));
    getCollectionData();
  }, [App.state.email]);

  // 从收藏数据中解析出还未报名截止的最近一条比赛信息
  const getLatestCollection = (data: []) => {
    const nowTimeStamp = Date.now();
    data.sort((a, b) => a.regist_end_time - b.regist_end_time);
    const data_filter = data.filter(
      (item) => item.regist_end_time * 1000 > nowTimeStamp
    );
    return data_filter[0];
  };

  // 计算比赛剩余报名时间
  const registerTime = (time: number) => {
    const nowTimes = Date.now();
    return Math.ceil(Math.abs(time * 1000 - nowTimes) / 1000 / 60 / 60 / 24);
  };

  // 确认，不再提示
  const handleOk = () => {
    localStorage.setItem("tipsVisible", JSON.stringify(false));
    setTipsVisible(false);
  };

  // 暂时关闭，稍后提示
  const handleCancel = () => {
    setTipsVisible(false);
  };

  const gotoFinish = () => {
    history.push("/userInfo/detail");
  };
  return (
    <>
      <h1>Home Page</h1>
      <div>This is home page</div>
      <Modal
        centered
        title="温馨提示"
        open={tipsVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="不在提示"
        cancelText="稍后"
      >
        <p>尊敬的用户，</p>
        <br />
        <p style={{ textIndent: "2em" }}>
          您好！为了能够给您提供更加贴心的服务以及更为精准的个性化推荐内容，我们非常需要您能花几分钟时间来补充更多详细的个人资料。完善您的资料将有助于我们更好地理解您的需求和偏好，从而提升您的使用体验
        </p>
        <p style={{ textIndent: "2em" }}>
          请点击下方的“前往完善资料”按钮，开始更新您的个人信息。感谢您对我们服务的支持与信任，我们将不懈努力为您提供更优质的服务！
        </p>
        <br />
        <p style={{ textAlign: "right" }}>祝您使用愉快！</p>
        <Button size="middle" type="primary" onClick={gotoFinish}>
          去完善
        </Button>
      </Modal>
    </>
  );
};

export default observer(Home);
