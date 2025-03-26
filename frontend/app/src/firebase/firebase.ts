// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYfIVnJgCi5WEvHmdGwwfU5CRCUsIanLw",
  authDomain: "forecast-d6214.firebaseapp.com",
  projectId: "forecast-d6214",
  storageBucket: "forecast-d6214.appspot.com",
  messagingSenderId: "852948670192",
  appId: "1:852948670192:web:6caf94e92267b0fd919435",
  measurementId: "G-166JBXKZ82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };