// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwRDMmhzBMzoODDySFjw9CCxEkOyYxKHI",
  authDomain: "osure-a932e.firebaseapp.com",
  projectId: "osure-a932e",
  storageBucket: "osure-a932e.firebasestorage.app",
  messagingSenderId: "1046602301002",
  appId: "1:1046602301002:web:f87ae1fb99c855530ab0b3",
  measurementId: "G-9QJHZZB1K2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);