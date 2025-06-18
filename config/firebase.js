import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with proper error handling
let authInstance = null;

const initializeAuthInstance = () => {
  if (!authInstance) {
    try {
      // Try to initialize auth with AsyncStorage persistence
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('Firebase Auth initialized successfully with AsyncStorage persistence');
    } catch (error) {
      if (error.code === 'auth/duplicate-instance') {
        console.log('Auth instance already exists, using existing instance');
        authInstance = getAuth(app);
      } else {
        console.error('Error initializing Firebase Auth:', error);
        // Fallback to getAuth if initialization fails
        authInstance = getAuth(app);
      }
    }
  }
  return authInstance;
};

// Get auth instance (initialize if needed)
const getAuthInstance = () => {
  if (!authInstance) {
    return initializeAuthInstance();
  }
  return authInstance;
};

// Initialize auth immediately
initializeAuthInstance();

export { app, db, getAuthInstance, onAuthStateChanged }; 