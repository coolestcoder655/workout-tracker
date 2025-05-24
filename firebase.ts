// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKwT9bRnYxGI3UsznX85-pourPIuV1eAo",
  authDomain: "workout-tracker-47bff.firebaseapp.com",
  projectId: "workout-tracker-47bff",
  storageBucket: "workout-tracker-47bff.firebasestorage.app",
  messagingSenderId: "721549738397",
  appId: "1:721549738397:web:9ba5d1a9747df3fdb0af74",
  measurementId: "G-JYDL1Q56ZX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);