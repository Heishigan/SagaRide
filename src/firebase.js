// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this line

const firebaseConfig = {
    apiKey: "AIzaSyDRkPJ9QApDwyczb6fFnyMaOyBpZ3ZcCsM",
    authDomain: "saga-stockholm.firebaseapp.com",
    projectId: "saga-stockholm",
    storageBucket: "saga-stockholm.firebasestorage.app",
    messagingSenderId: "213923028665",
    appId: "1:213923028665:web:2d066532269327362e0568",
    measurementId: "G-VSGDPFCPKS"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

export { auth, provider, db }; // Export db