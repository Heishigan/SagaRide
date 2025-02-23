// src/components/Login.js
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Logged in user:", user);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        z-0
      >
        <source src="/videos/cycling.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10">
</div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl font-bold mb-4">SagaRide Stockholm</h1>
        <p className="text-xl mb-8">Cycle smarter, live greener.</p>
        <div className="flex justify-center">
          <div
            className="g-signin2"
            data-onsuccess="handleLogin"
            onClick={handleLogin}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
              alt="Sign in with Google"
            />
          </div> </div>
      </div>
    </div>
  );
};

export default Login;