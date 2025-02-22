// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
export { auth, provider };
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRkPJ9QApDwyczb6fFnyMaOyBpZ3ZcCsM",
  authDomain: "saga-stockholm.firebaseapp.com",
  projectId: "saga-stockholm",
  storageBucket: "saga-stockholm.firebasestorage.app",
  messagingSenderId: "213923028665",
  appId: "1:213923028665:web:2d066532269327362e0568",
  measurementId: "G-VSGDPFCPKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

