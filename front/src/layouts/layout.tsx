import { Outlet, Link } from "umi";
import styles from "./index.less";
import {
  TeamOutlined,
  DownOutlined,
  UpOutlined,
  RobotFilled,
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
          <div>当前账号：{App.state.email}</div>
          <div>
            <Button
              onClick={() => {
                const token = decodeToken(App.state.token);
                console.log(token);
              }}
            >
              测试
            </Button>
            <Button onClick={LoginOut}>退出登录</Button>
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
