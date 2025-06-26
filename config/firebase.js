import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCgrsDA-pOgqot5UCC6SgHXoRT1xKTfpO0',
  authDomain: 'fitpal-d4b78.firebaseapp.com',
  projectId: 'fitpal-d4b78',
  storageBucket: 'fitpal-d4b78.appspot.com',
  messagingSenderId: '455544394958',
  appId: '1:455544394958:web:b1cb0efc2b020b30292c9f',
  measurementId: 'G-M8D40Y5P4N',
  databaseURL: 'https://fitpal-d4b78-default-rtdb.firebaseio.com',
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
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error) {
      if (error.code === 'auth/duplicate-instance') {
        authInstance = getAuth(app);
      } else {
        // Fallback to getAuth if initialization fails
        authInstance = getAuth(app);
      }
    }
  }
  return authInstance;
};

// Get auth instance (initialize if needed)
export const getAuthInstance = () => {
  if (!authInstance) {
    return initializeAuthInstance();
  }
  return authInstance;
};

// Initialize auth immediately
initializeAuthInstance();

export { app, db, onAuthStateChanged };

// App Configuration
export const config = {
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API Configuration
  apiTimeout: 30000, // 30 seconds
  
  // Firebase Configuration
  firebase: {
    enablePersistence: true,
    enableOffline: true,
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB
  },
  
  // App Configuration
  app: {
    maxWorkoutHistory: 100, // Maximum number of workout logs to keep
    maxOfflineDays: 7, // Maximum days to store offline data
    autoBackup: true, // Enable automatic backup
  },
  
  // Error Reporting
  errorReporting: {
    enabled: true,
    sampleRate: 1.0, // Report 100% of errors in production
  },
  
  // Performance
  performance: {
    enableProfiling: false, // Disable profiling in production
    enableDebugging: false, // Disable debugging in production
  },
}; 