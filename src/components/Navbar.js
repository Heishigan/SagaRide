// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png"; // Add your logo image here


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };

    fetchUsername();
  }, []);

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
      <div className="flex items-center space-x-4">
        <span className="text-white">Welcome, {username}</span>
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
      </div>
    <div className={`menu ${isMenuOpen ? "open" : ""}`}>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/stats")}>Stats</button>
      <button onClick={() => navigate("/achievements")}>Achievements</button>
      <button onClick={() => navigate("/leaderboard")}
  className="block w-full px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">Leaderboard</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </nav>
  );
};

export default Navbar;