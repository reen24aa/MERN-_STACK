import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwND3cT-1VKGLrA4A_vVyCYQtf2PIJ6WE",
  authDomain: "to-do-list-77668.firebaseapp.com",
  projectId: "to-do-list-77668",
  storageBucket: "to-do-list-77668.appspot.com",
  messagingSenderId: "694633726714",
  appId: "1:694633726714:web:000aa14de2242ff7a13f43",
  measurementId: "G-GRS1Q2M630"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };

