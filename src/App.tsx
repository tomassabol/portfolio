import React from 'react';
import style from './App.module.css';
import Links from './Links';

const  App: React.FC = () => {
  return (
    <div className={style.pageContainer}>
      <Links />
    </div>
  );
}

export default App;
