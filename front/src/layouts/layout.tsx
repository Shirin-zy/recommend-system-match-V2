import { Outlet, Link } from "umi";
import styles from "./index.less";
import { TeamOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import Side from "./components/side";
import { Button } from "antd";
import MyBreadcrumb from "./components/breadcrumb";
import "../global.less";
import decodeToken from "@/utlis/tokenEncode";
import { history } from "umi";
const Layout = () => {
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);

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
    </div>
  );
};

export default observer(Layout);
