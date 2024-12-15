// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAQTAhPAWIFrykuPB57a3s9gUu8lvTiy0",
  authDomain: "quick-vip-74a0a.firebaseapp.com",
  projectId: "quick-vip-74a0a",
  storageBucket: "quick-vip-74a0a.firebasestorage.app",
  messagingSenderId: "645524547591",
  appId: "1:645524547591:web:122a7d81b9ea90309262a2",
  measurementId: "G-VHKVECTH8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);