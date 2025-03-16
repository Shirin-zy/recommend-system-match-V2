import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "umi";
import styles from "./breadcrumb.less";

interface Iprpos {
  routes: { href: string; title: JSX.Element }[];
}

// 自定义比较函数
const areEqual = (prevProps: Iprpos, nextProps: Iprpos) => {
  // 比较 routes 的长度
  if (prevProps.routes.length !== nextProps.routes.length) {
    return false;
  }
  // 比较每个 route 的内容
  for (let i = 0; i < prevProps.routes.length; i++) {
    if (
      prevProps.routes[i].href !== nextProps.routes[i].href ||
      prevProps.routes[i].title !== nextProps.routes[i].title
    ) {
      return false;
    }
  }
  return true;
};

const MyBreadcrumb = ({ routes }: Iprpos) => {
  return (
    <>
      <li className={styles.li}>
        {routes.map((item, index) => (
          <ol className={styles.ol}>
            <Link className={styles.link} to={item.href}>
              {item.title}
            </Link>
            &nbsp;&nbsp;/
          </ol>
        ))}
      </li>
    </>
  );
};

// 使用自定义比较函数
export default React.memo(MyBreadcrumb, areEqual);
