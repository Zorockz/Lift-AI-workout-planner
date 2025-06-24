import { getAuthInstance } from '../config/firebase';

export const testFirebaseAuth = () => {
  try {
    const auth = getAuthInstance();
    return true;
  } catch (error) {
    return false;
  }
};

export const testAuthState = () => {
  try {
    const auth = getAuthInstance();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Auth state changed - handle silently in production
    });
    
    // Return cleanup function
    return unsubscribe;
  } catch (error) {
    return null;
  }
}; 