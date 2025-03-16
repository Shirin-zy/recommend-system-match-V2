import { makeAutoObservable, computed, observable, action } from "mobx";
import { HomeOutlined } from "@ant-design/icons";

class AppStore {
  @observable userName: string = "root";
  @observable isLogin: boolean = false;
  @observable routes: { href: string; title: JSX.Element }[] = [
    {
      href: "/home",
      title: <HomeOutlined />,
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  @action
  pushRoutes(route: { href: string; title: JSX.Element }) {
    // 检查是否存在相同 href 的路由
    const existingIndex = this.routes.findIndex((r) => r.href === route.href);

    // 如果存在，先移除旧的
    if (existingIndex !== -1) {
      this.routes.splice(existingIndex, 1);
    }

    // 添加新的路由（保证唯一性且最新）
    this.routes.push(route);
  }

  @action
  setName(name: string) {
    this.userName = name;
  }
}

const App = new AppStore();

const useApp = () => {
  return { App };
};

export { AppStore, App };
