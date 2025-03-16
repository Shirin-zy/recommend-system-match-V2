import { Menu, Breadcrumb } from "antd";
import { Link } from "umi";
import {
  SettingOutlined,
  BarChartOutlined,
  BankOutlined,
  TeamOutlined,
  DownOutlined,
  UpOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface Iprpos {
  addBreadcrumbRoutes: (href: string, title: JSX.Element) => void;
}

const Side = ({ addBreadcrumbRoutes }: Iprpos) => {
  const orerMenu = [
    {
      name: "主页",
      router: "/",
      icon: <BankOutlined />,
      children: [
        { name: "主页", router: "/home" },
        { name: "数据概览", router: "/option-2" },
      ],
    },
    {
      name: "数据概览",
      router: "/navigation-two",
      icon: <BarChartOutlined />,
    },
    {
      name: "设置",
      router: "/",
      icon: <SettingOutlined />,
      children: [
        { name: "设置", router: "/setting" },
        { name: "登录", router: "/login" },
      ],
    },
  ];

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

export default Side;
