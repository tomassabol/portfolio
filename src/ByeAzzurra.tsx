import React from "react";
import style from "./ByeAzzurra.module.css";

const ByeAzzurra: React.FC = () => {

    const navigate = window.open;

  return (
    <>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1 id={style.header}>farewell Azzurra</h1>
            <h3>by tomáš</h3>
            <h5>with love</h5>
        </div>
    </div>
    <div className={style.pageDivider}>
        <p>..ready for the party?</p>
    </div>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1 id={style.header}>when?</h1>
            <h4>sunday <span>29/1</span></h4>
            <h4><span>2023</span> ofc</h4>
            <h4><span>21:30</span></h4>
            <div className={style.btn} onClick={() => window.alert("hehe i didn't have time to implement this")}>add to calendar</div>
        </div>
    </div>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1 id={style.header}>where?</h1>
            <h4>Visionsvej <span>2, 2., 2</span></h4>
            <h4>Aalborg C, <span>9000</span></h4>
            <div className={style.btn} onClick={() => navigate("https://www.google.com/maps/place/Visionsvej+2,+9000+Aalborg,+Denmark/@57.0357846,9.9311852,17z/data=!3m1!4b1!4m5!3m4!1s0x464932e88e545c95:0x2cb8a7d435d5338c!8m2!3d57.0357817!4d9.9333792?hl=en")}>show me the way</div>
        </div>
    </div>
    <div className={style.page}>
        <div className={style.textContainer}>
            <h1 id={style.header}>any questions?</h1>
            <h4>feel free to contact me</h4>
            <h4><span>+45 81 91 63 80</span></h4>
            <h4><span>+421 950 895 731</span></h4>
            <h4><span>@</span>_tomassabol</h4>
        </div>
    </div>
    <div className={style.footer}>
        <p className={style.footerText}>see you! ♥</p>
    </div>
    </>
  );
};

export default ByeAzzurra;
