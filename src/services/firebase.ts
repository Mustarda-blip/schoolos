import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAva-jeeK1siKEV0dwSUIbkGXc6O00YNSE",
  authDomain: "schoolos-4a1b4.firebaseapp.com",
  projectId: "schoolos-4a1b4",
  storageBucket: "schoolos-4a1b4.firebasestorage.app",
  messagingSenderId: "1076856901143",
  appId: "1:1076856901143:web:8519893252159b54849652",
  measurementId: "G-217XNWB3H5"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);