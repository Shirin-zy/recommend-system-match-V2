import {
  SettingOutlined,
  BarChartOutlined,
  BankOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const orerMenu_admin = [
  {
    name: "主页",
    router: "/",
    icon: <BankOutlined />,
    children: [
      { name: "主页", router: "/home" },
      { name: "比赛信息", router: "/matchInfo" },
      { name: "我的收藏", router: "/collection" },
    ],
  },
  {
    name: "数据概览",
    router: "/",
    icon: <BarChartOutlined />,
    children: [{ name: "数据同步", router: "/dataSync" }],
  },
  {
    name: "用户管理",
    router: "/",
    icon: <UnlockOutlined />,
    children: [{ name: "用户管理", router: "/manage/user" }],
  },
  {
    name: "设置",
    router: "/",
    icon: <SettingOutlined />,
    children: [
      { name: "设置", router: "/setting" },
      { name: "登录", router: "/login" },
      { name: "系统管理", router: "/system" },
    ],
  },
];

const orerMenu_common = [
  {
    name: "主页",
    router: "/",
    icon: <BankOutlined />,
    children: [
      { name: "主页", router: "/home" },
      { name: "比赛信息", router: "/matchInfo" },
      { name: "我的收藏", router: "/collection" },
    ],
  },
  {
    name: "数据概览",
    router: "/",
    icon: <BarChartOutlined />,
    children: [{ name: "数据同步", router: "/dataSync" }],
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

export { orerMenu_common, orerMenu_admin };
