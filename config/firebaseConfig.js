// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgrsDA-pOgqot5UCC6SgHXoRT1xKTfpO0",
  authDomain: "fitpal-d4b78.firebaseapp.com",
  projectId: "fitpal-d4b78",
  storageBucket: "fitpal-d4b78.firebasestorage.app",
  messagingSenderId: "455544394958",
  appId: "1:455544394958:web:b1cb0efc2b020b30292c9f",
  measurementId: "G-M8D40Y5P4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);