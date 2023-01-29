import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ByeAzzurra from './ByeAzzurra';
import Links from './Links';

const  App: React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Links />} />
      <Route path="byeazzurra" element={<ByeAzzurra />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
