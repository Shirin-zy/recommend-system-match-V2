const routes = [
  // 不需要布局的路由
  {
    path: "/login",
    component: "@/pages/login/index",
  },
  {
    path: "/404",
    component: "@/pages/404",
  },

  // 需要布局的路由组
  {
    path: "/",
    component: "@/layouts/layout.tsx",
    routes: [
      {
        path: "/home",
        component: "@/pages/home/home/index",
      },
      {
        path: "/setting",
        component: "@/pages/setting/index",
      },
      {
        path: "/dataSync",
        component: "@/pages/data/dataSync/index",
      },
      {
        path: "/matchInfo",
        component: "@/pages/home/dataDetail/index",
      },
    ],
  },

  // 正确放置的重定向项
  {
    path: "/",
    redirect: "/home",
  },

  // 通配符路由必须放在最后
  {
    path: "*",
    redirect: "/404",
  },
];

export default routes;
