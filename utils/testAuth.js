import { getAuthInstance } from '../config/firebase';

export const testFirebaseAuth = () => {
  try {
    const auth = getAuthInstance();
    console.log('✅ Firebase Auth instance created successfully');
    console.log('Auth instance:', auth);
    console.log('Current user:', auth.currentUser);
    return true;
  } catch (error) {
    console.error('❌ Firebase Auth initialization failed:', error);
    return false;
  }
};

export const testAuthState = () => {
  try {
    const auth = getAuthInstance();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
      if (user) {
        console.log('User details:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
    });
    
    // Return cleanup function
    return unsubscribe;
  } catch (error) {
    console.error('❌ Auth state listener failed:', error);
    return null;
  }
}; 