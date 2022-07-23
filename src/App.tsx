import React from "react";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SectionalPage from "./SectionalPage";
import HomePage from "./HomePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path=":sectionalId" element={<SectionalPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
