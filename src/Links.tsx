import React from "react";
import style from "./Links.module.css";

const Links: React.FC = () => {

const navigate = window.open;

  return (
    <div className={style.pageContainer}>
      <div className={style.header}>
        <h1>tomáš sabol</h1>
        <h3>web, ios & .net developer</h3>
      </div>
      <div className={style.btn} onClick={() => navigate("https://github.com/tomassabol")}>GitHub</div>
      <div className={style.btn} onClick={() => navigate("https://www.linkedin.com/in/tomas-sabol/")}>LinkedIn</div>
      <div className={style.btn} onClick={() => navigate("https://www.behance.net/tomassabol750d")}>Behance</div>
      <div className={style.btn} onClick={() => navigate("https://foodpanda.dev")}>FoodPanda.dev</div>
      <div className={style.btn} onClick={() => navigate("https://instagram.com/_tomassabol")}>Instagram</div>
      <div className={style.btn} onClick={() => navigate("https://www.facebook.com/tomassbl/")}>Facebook</div>
    </div>
  );
};

export default Links;
