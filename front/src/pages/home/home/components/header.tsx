import style from "./header.less";
const Herder = () => {
  return (
    <>
      <div>
        <h1>
          <div className={style.headerContent}>
            <div className={style.titleDecoration}></div>
            <h1 className={style.pageTitle}>比赛推荐平台</h1>
            <p className={style.pageSubtitle}>
              发现适合你的高校比赛，提升专业技能
            </p>
            <div className={style.titleDots}>
              <span className={`${style.dot} ${style.dot1}`}></span>
              <span className={`${style.dot} ${style.dot2}`}></span>
              <span className={`${style.dot} ${style.dot3}`}></span>
              <span className={`${style.dot} ${style.dot4}`}></span>
              <span className={`${style.dot} ${style.dot5}`}></span>
            </div>
          </div>
        </h1>
      </div>
    </>
  );
};

export default Herder;
