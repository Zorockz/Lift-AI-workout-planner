import { getAuthInstance } from '../config/firebase';

/**
 * Utility to ensure Firebase Auth is properly initialized
 * This helps prevent the "Component auth has not been registered yet" error
 */
export const ensureFirebaseAuth = () => {
  return getAuthInstance();
};

/**
 * Check if Firebase Auth is ready for use
 */
export const isFirebaseAuthReady = () => {
  try {
    getAuthInstance();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get the current auth instance safely
 */
export const getAuthInstanceSafe = () => {
  return getAuthInstance();
}; 