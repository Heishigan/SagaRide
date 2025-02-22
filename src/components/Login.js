// src/components/Login.js
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Logged in user:", user);
        navigate("/dashboard"); // Redirect to the dashboard after login
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <div>
      <h1>SagaRide Stockholm</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;