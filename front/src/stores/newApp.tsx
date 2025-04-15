import { makeAutoObservable, set } from "mobx";
import { HomeOutlined } from "@ant-design/icons";
import decodeToken from "@/utlis/tokenEncode";

interface matchItem {
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

class AppState {
  state: {
    email: string;
    username: string;
    isLogin: boolean;
    role: string; // 账号角色
    token: string;
    routes: { href: string; title: JSX.Element }[]; // 面包屑
    collections: string[]; // 收藏比赛id
    msgTips: string; // 顶部滚顶播报
    collectionData: matchItem[]; // 收藏比赛数据,詳細信息
  } = {
    email: localStorage.getItem("email") || "请登录",
    username: localStorage.getItem("username") || "请登录",
    isLogin: false,
    role: "common",
    token: localStorage.getItem("token") || "",
    routes: [
      {
        href: "/home",
        title: <HomeOutlined />,
      },
    ],
    collections: JSON.parse(localStorage.getItem("collections") || "[]"),
    msgTips: "",
    collectionData: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  get tokenStatus() {
    return decodeToken(this.state.token);
  }

  pushRoutes(route: { href: string; title: JSX.Element }) {
    // 检查是否存在相同 href 的路由
    const existingIndex = this.state.routes.findIndex(
      (r) => r.href === route.href
    );
    // 如果存在，先移除旧的
    if (existingIndex !== -1) {
      this.state.routes.splice(existingIndex, 1);
    }
    // 添加新的路由（保证唯一性且最新）
    this.state.routes.push(route);
  }

  // 设置用户名
  setUserName = (name: string) => {
    this.state.username = name;
    localStorage.setItem("username", name);
  };

  // 设置token
  setToken = (token: string) => {
    this.state.token = token;
    localStorage.setItem("token", token);
  };

  // 设置邮箱
  setEmail = (email: string) => {
    this.state.email = email;
    localStorage.setItem("email", email);
  };

  // 设置收藏比赛id
  setCollections = (ids: string) => {
    this.state.collections = ids.split(",");
    localStorage.setItem("collections", JSON.stringify(ids.split(",")));
  };

  // 设置顶部滚动提示信息
  setMsgTips = (msg: string) => {
    this.state.msgTips = msg;
  };

  // 设置收藏比赛数据（详细信息）
  setCollectedItems = (items: any) => {
    this.state.collectionData = items;
  };

  clearState = () => {
    this.state.email = "请登录";
    this.state.username = "请登录";
    this.state.isLogin = false;
    this.state.role = "common";
    this.state.token = "";
    this.state.routes = [
      {
        href: "/home",
        title: <HomeOutlined />,
      },
    ];
    this.state.collections = [];
    this.state.msgTips = "";
    this.state.collectionData = [];
  };
}

const App = new AppState();

export default App;
