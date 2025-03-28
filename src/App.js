// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";
import Achievements from "./components/Achievements";
import Leaderboard from "./components/Leaderboard"; // Import the Leaderboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* Add the Leaderboard route */}
      </Routes>
    </Router>
  );
}

export default App;