import React from "react";
import style from "./filter.less";

const Filter = () => {
  return (
    <>
      <div className={style.filter}>
        <div className={style.category}>
          <h3>竞赛类别</h3>
          <div>
            <h5>工科</h5>
          </div>
          <div>
            <h5>文体</h5>
          </div>
          <div>
            <h5>理科</h5>
          </div>
          <div>
            <h5>商科</h5>
          </div>
          <div>
            <h5>综合</h5>
          </div>
        </div>
        <div className={style.category}>
          <h3>竞赛级别</h3>
        </div>
        <div className={style.category}>
          <h3>排序方式</h3>
        </div>
      </div>
    </>
  );
};

export default Filter;
