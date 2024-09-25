// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4XyHefKoMIwmCllfxloTe-l84OrNVULk",
  authDomain: "tech-home-3838d.firebaseapp.com",
  projectId: "tech-home-3838d",
  storageBucket: "tech-home-3838d.appspot.com",
  messagingSenderId: "403517900752",
  appId: "1:403517900752:web:f15ac4a6da74a994185bd5",
  measurementId: "G-KSGFNQZ7Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

const analytics = getAnalytics(app);