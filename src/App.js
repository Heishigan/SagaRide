// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";
import Achievements from "./components/Achievements"; // Import the Achievements component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/achievements" element={<Achievements />} /> {/* Add the Achievements route */}
      </Routes>
    </Router>
  );
}

export default App;