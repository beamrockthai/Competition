// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOb6rCwTZRzmD15vyDed_4ItUzYymLT80",
  authDomain: "comp-90904.firebaseapp.com",
  projectId: "comp-90904",
  storageBucket: "comp-90904.firebasestorage.app",
  messagingSenderId: "666002515137",
  appId: "1:666002515137:web:e22277b4e006ea1b7e6040",
  measurementId: "G-N852KWMPBX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };
