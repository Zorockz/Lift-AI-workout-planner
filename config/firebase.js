import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCgrsDA-pOgqot5UCC6SgHXoRT1xKTfpO0",
  authDomain: "fitpal-d4b78.firebaseapp.com",
  projectId: "fitpal-d4b78",
  storageBucket: "fitpal-d4b78.appspot.com",
  messagingSenderId: "455544394958",
  appId: "1:455544394958:web:b1cb0efc2b020b30292c9f",
  measurementId: "G-M8D40Y5P4N",
  databaseURL: "https://fitpal-d4b78-default-rtdb.firebaseio.com"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();

// Configure auth persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { db, auth }; 