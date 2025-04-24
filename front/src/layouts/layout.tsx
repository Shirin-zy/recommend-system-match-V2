import { Outlet, Link } from "umi";
import styles from "./index.less";
import {
  TeamOutlined,
  DownOutlined,
  UpOutlined,
  RobotFilled,
  UserOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import Side from "./components/side";
import { Button } from "antd";
import MyBreadcrumb from "./components/breadcrumb";
import "../global.less";
import decodeToken from "@/utlis/tokenEncode";
import { history } from "umi";
import ChatRobot from "@/pages/chatRobot";

// 退出登录并清除数据
const LoginOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("tipsVisible");
  localStorage.removeItem("username");
  localStorage.removeItem("collections");
  history.push("/login");
  App.clearState();
};

const role = {
  common: "普通用户",
  admin: "管理员",
  root: "超级管理员",
};

const Layout = () => {
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false); // 控制用户信息显示隐藏
  const [showRobot, setShowRobot] = useState<boolean>(false); // 控制对话机器人显示隐藏

  // 关闭对话机器人
  const closeRobot = () => {
    setShowRobot(false);
  };

  return (
    <div>
      {/* 顶部导航菜单 */}
      <nav className={styles.navs}>
        <img src="https://www.cqut.edu.cn/2024/img/logo.png" alt="" />
        <div className={styles.user_info}>
          <TeamOutlined
            style={{ color: "#ffffff", fontSize: 18 }}
            onClick={() => {
              history.push("/userInfo/detail");
            }}
          />
          <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 300 }}>
            {App.state.username}
          </span>
          <div onClick={() => setShowUserInfo(!showUserInfo)}>
            {showUserInfo ? (
              <UpOutlined style={{ color: "#ffffff", fontSize: 14 }} />
            ) : (
              <DownOutlined style={{ color: "#ffffff", fontSize: 14 }} />
            )}
          </div>
        </div>
        <div
          className={`${styles.detail} ${showUserInfo ? styles.show : styles.hidden}`}
        >
          <div className={styles.header}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#dbeafe",
                display: "inline-block",
                textAlign: "center",
                lineHeight: "30px",
                marginRight: 10,
              }}
            >
              <UserOutlined style={{ color: "#359eff" }} />
            </div>
            当前账号：{App.state.email}
          </div>
          <div className={styles.body}>
            <div className={styles.nick}>
              <UserOutlined
                style={{ color: "#a2a2a2", fontSize: 16, marginRight: 10 }}
              />
              昵称：{App.state.username}
            </div>
            <div className={styles.role}>
              <SafetyCertificateOutlined
                style={{ color: "#a2a2a2", fontSize: 16, marginRight: 10 }}
              />
              角色：{role[App.state.role]}
            </div>
            <div className={styles.loginOut}>
              <Button danger size="small" onClick={LoginOut}>
                <LogoutOutlined />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* 主体 */}
      <div className={styles.body}>
        <div className={styles.side}>
          <Side
            addBreadcrumbRoutes={(href: string, title: JSX.Element) => {
              App.pushRoutes({ href: href, title: title });
            }}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.breadcrumb}>
            <MyBreadcrumb routes={App.state.routes} />
            <div className={styles.scrollingText}>
              <span>{App.state.msgTips}</span>
            </div>
          </div>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
      {showRobot && <ChatRobot close={closeRobot} />}
      <div
        className={styles.showRobotButton}
        onClick={() => setShowRobot(!showRobot)}
      >
        <RobotFilled style={{ color: "#359eff", fontSize: 25 }} />
      </div>
    </div>
  );
};

export default observer(Layout);
