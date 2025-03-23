import { Outlet, Link } from "umi";
import styles from "./index.less";
import { TeamOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Provider, observer } from "mobx-react";
import { App, AppStore } from "@/stores/app";
import Side from "./components/side";
import MyBreadcrumb from "./components/breadcrumb";
import { Button } from "antd";

const Layout = observer(() => {
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  return (
    <Provider App={AppStore}>
      <div>
        {/* 顶部导航菜单 */}
        <nav className={styles.navs}>
          <img src="https://www.cqut.edu.cn/2024/img/logo.png" alt="" />
          <div className={styles.user_info}>
            <TeamOutlined style={{ color: "#ffffff", fontSize: 18 }} />
            <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 300 }}>
              {App.userName}
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
            <div>当前账号</div>
            <div>
              <Button
                onClick={() => {
                  App.setName("admin");
                }}
              >
                reset
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
              <MyBreadcrumb routes={App.routes} />
            </div>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
});

export default Layout;
