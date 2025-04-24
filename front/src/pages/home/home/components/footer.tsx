import style from "./footer.less";
const Footer = () => {
  return (
    <>
      <footer className={style.pageFooter}>
        <div className={style.footerDecoration}>
          <div className={`${style.footerLine} ${style.line1}`}></div>
          <div className={`${style.footerLine} ${style.line2}`}></div>
          <div className={`${style.footerLine} ${style.line3}`}></div>
        </div>
        <p className={style.footerText}>探索更多精彩比赛</p>
      </footer>
    </>
  );
};

export default Footer;
