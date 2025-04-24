import { Menu } from "antd";
import { Link } from "umi";
import {
  SettingOutlined,
  BarChartOutlined,
  BankOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import routes from "config/routes";
import App from "@/stores/newApp";
import { observer } from "mobx-react-lite";
import { orerMenu_common, orerMenu_admin } from "./orerMenu";
import { fromPairs } from "lodash";

interface Iprpos {
  addBreadcrumbRoutes: (href: string, title: JSX.Element) => void;
}

const Side = ({ addBreadcrumbRoutes }: Iprpos) => {
  const orerMenu =
    App.state.role === "common" ? orerMenu_common : orerMenu_admin;

  return (
    <>
      {" "}
      <Menu
        mode="inline"
        style={{ lineHeight: "50px" }}
        defaultSelectedKeys={["0"]}
        theme="light"
      >
        {orerMenu.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <Menu.SubMenu key={index} icon={item.icon} title={item.name}>
                {item.children.map((child, childIndex) => (
                  <Menu.Item
                    key={`${index}-${childIndex}`}
                    onClick={() => {
                      addBreadcrumbRoutes(
                        child.router,
                        <>
                          {item.icon}
                          <span>{child.name}</span>
                        </>
                      );
                    }}
                  >
                    <Link to={child.router}>{child.name}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={index}
                icon={item.icon}
                onClick={() => {
                  addBreadcrumbRoutes(
                    item.router,
                    <>
                      {item.icon}
                      <span>{item.name}</span>
                    </>
                  );
                }}
              >
                <Link to={item.router}>{item.name}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </>
  );
};

export default observer(Side);
