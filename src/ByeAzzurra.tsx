import React from "react";
import style from "./ByeAzzurra.module.css";

const ByeAzzurra: React.FC = () => {

    const navigate = window.open;

  return (
    <>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1>farewell Azzurra</h1>
            <h3>by tomáš</h3>
            <h5>with love</h5>
        </div>
    </div>
    <div className={style.pageDivider}>
        <p>..ready for the party?</p>
    </div>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1>when?</h1>
            <h4>sunday <span>29/1</span></h4>
            <h4><span>2023</span> ofc</h4>
            <h4><span>21:30</span></h4>
            <div className={style.btn} onClick={() => navigate("")}>add to calendar</div>
        </div>
    </div>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1>where?</h1>
            <h4>Visionsvej <span>2, 2., 2</span></h4>
            <h4>Aalborg C, <span>9000</span></h4>
            <div className={style.btn} onClick={() => navigate("")}>show me the way</div>
        </div>
    </div>
    </>
  );
};

export default ByeAzzurra;
