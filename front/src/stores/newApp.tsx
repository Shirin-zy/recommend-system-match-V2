import { makeAutoObservable, set } from "mobx";
import { HomeOutlined } from "@ant-design/icons";
import decodeToken from "@/utlis/tokenEncode";

class AppState {
  state: {
    email: string;
    username: string;
    isLogin: boolean;
    role: string;
    token: string;
    routes: { href: string; title: JSX.Element }[];
    collections: string[]; // 收藏比赛id
    msgTips: string; // 顶部滚顶播报
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
  setCollectionss = (ids: string) => {
    this.state.collections = ids.split(",");
    localStorage.setItem("collections", JSON.stringify(ids.split(",")));
  };

  setMsgTips = (msg: string) => {
    this.state.msgTips = msg;
  };
}

const App = new AppState();

export default App;
