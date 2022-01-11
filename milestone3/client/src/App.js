import React from "react";
import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import PeoplePage from "./pages/PeoplePage";

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<MoviesPage/>}/>
                    <Route path="/movies" element={<MoviesPage/>}/>
                    <Route path="/people" element={<PeoplePage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;