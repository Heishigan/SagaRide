// src/components/Navbar.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">SagaRide Stockholm</h1>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
        >
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

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => navigate("/dashboard")}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/stats")}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Stats
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;