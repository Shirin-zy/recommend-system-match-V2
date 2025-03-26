import { defineConfig } from "umi";
import routes from "./config/routes";

export default defineConfig({
  routes: routes,
  npmClient: "pnpm",
  title: "高校竞赛系统",
});
