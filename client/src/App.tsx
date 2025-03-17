
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import ProjectCategory from "@/pages/projects/project-category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:category" element={<ProjectCategory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
