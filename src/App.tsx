import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ByeAzzurra from "./ByeAzzurra";
import Links from "./Links";
import ProjectCases from "./ProjectCases";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Links />} />
        <Route path="byeazzurra" element={<ByeAzzurra />} />
        <Route
        path="projectcases"
        element={ <ProjectCases/> }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
