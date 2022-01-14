import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import PeoplePage from "./pages/PeoplePage";
import PersonPage from "./pages/PersonPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<MoviesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/people" element={<PeoplePage />}/>
          <Route path="/people/:id" element={<PersonPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
