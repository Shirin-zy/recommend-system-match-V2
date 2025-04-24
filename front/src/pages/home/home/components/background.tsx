import style from "./background.less";

const Background = () => {
  return (
    <>
      {" "}
      <div className={style.decorativeBackground}>
        {/* 顶部波浪 */}
        <div className={style.waveTop}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#d1eaff"
              fillOpacity="0.5"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* 底部波浪 */}
        <div className={style.waveBottom}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#d1eaff"
              fillOpacity="0.5"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* 右侧圆形 */}
        <div className={style.circleRight}></div>

        {/* 左侧圆形 */}
        <div className={style.circleLeft}></div>

        {/* 浮动圆点 */}
        <div className={(style.floatingDot, style.dot1)}></div>
        <div className={(style.floatingDot, style.dot2)}></div>
        <div className={(style.floatingDot, style.dot3)}></div>
        <div className={(style.floatingDot, style.dot4)}></div>
        <div className={(style.floatingDot, style.dot5)}></div>
        <div className={(style.floatingDot, style.dot6)}></div>
        <div className={(style.floatingDot, style.dot7)}></div>
        <div className={(style.floatingDot, style.dot8)}></div>

        {/* 背景点阵图案 */}
        <div className={style.dotPattern}></div>

        {/* 右上角装饰 */}
        <div className={(style.cornerDecoration, style.topRight)}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="40" stroke="#d1eaff" strokeWidth="2" />
            <circle cx="60" cy="60" r="30" stroke="#d1eaff" strokeWidth="2" />
            <circle cx="60" cy="60" r="20" stroke="#d1eaff" strokeWidth="2" />
          </svg>
        </div>

        {/* 左下角装饰 */}
        <div className={(style.cornerDecoration, style.bottomLeft)}>
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="25"
              y="25"
              width="100"
              height="100"
              stroke="#d1eaff"
              strokeWidth="2"
            />
            <rect
              x="40"
              y="40"
              width="70"
              height="70"
              stroke="#d1eaff"
              strokeWidth="2"
            />
            <rect
              x="55"
              y="55"
              width="40"
              height="40"
              stroke="#d1eaff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Background;
