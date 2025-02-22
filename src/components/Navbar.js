// src/components/Navbar.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png"; // Add your logo image here

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="navbar">
    <h1>
      <img src={logo} alt="SagaRide Stockholm Logo" />
      SagaRide Stockholm
    </h1>
    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16m-7 6h7"
        ></path>
      </svg>
    </button>
    <div className={`menu ${isMenuOpen ? "open" : ""}`}>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/stats")}>Stats</button>
      <button onClick={() => navigate("/achievements")}>Achievements</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </nav>
  );
};

export default Navbar;