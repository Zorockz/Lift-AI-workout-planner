import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthInstance, db } from '../config/firebase';
import { BasicAuthService } from '../services/authService';

const defaultContext = {
  user: null,
  isGuest: false,
  loading: true,
  error: null,
  isOnboardingComplete: false,
  signOut: () => {},
  continueAsGuest: () => {},
  clearError: () => {},
  completeOnboarding: () => {},
};

const AuthContext = createContext(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Initialize Firebase Auth state listener
  useEffect(() => {
    const auth = getAuthInstance();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // If user is signed in, check onboarding completion status
      if (firebaseUser) {
        const onboardingCompleted = await AsyncStorage.getItem('isOnboardingComplete');
        const hasCompletedOnboardingBefore = await AsyncStorage.getItem('hasCompletedOnboardingBefore');
        
        if (onboardingCompleted === 'true') {
          // User has explicitly completed onboarding before
          setIsOnboardingComplete(true);
        } else if (hasCompletedOnboardingBefore === 'true') {
          // User has completed onboarding in a previous session
          await AsyncStorage.setItem('isOnboardingComplete', 'true');
          setIsOnboardingComplete(true);
        } else {
          // New user or user who hasn't completed onboarding yet
          // Don't auto-set onboarding complete - let them go through the flow
          setIsOnboardingComplete(false);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const continueAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGuest(true);
      setUser({ id: 'guest', name: 'Guest User' });
      await AsyncStorage.setItem('isGuest', 'true');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      setError('Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await BasicAuthService.signOut();
      
      // Clear local storage but preserve onboarding completion
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
      await AsyncStorage.clear();
      
      // Restore onboarding completion and user profile
      if (onboardingCompleted) {
        await AsyncStorage.setItem('onboardingCompleted', onboardingCompleted);
      }
      if (userProfile) {
        await AsyncStorage.setItem('userProfile', userProfile);
      }
      
      setUser(null);
      setIsOnboardingComplete(onboardingCompleted === 'true');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const signIn = async (email, password, isNewAccount = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple validation
      if (!email || !password) {
        return { success: false, error: 'Please fill in all fields' };
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Use Firebase Auth for sign in
      const auth = getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get or create user data in Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userRef, {
            email: user.email,
            createdAt: new Date(),
            accountCreated: true,
          });
        }
        // You can store additional user data here if needed
      } catch (firestoreError) {
        // Optionally log or handle Firestore error
      }
      
      // Only auto-set onboarding complete for existing users (sign-ins), not new accounts
      if (!isNewAccount) {
        const onboardingCompleted = await AsyncStorage.getItem('isOnboardingComplete');
        if (onboardingCompleted !== 'true') {
          // If onboarding completion status is not explicitly set, assume it's complete for existing users
          await AsyncStorage.setItem('isOnboardingComplete', 'true');
          setIsOnboardingComplete(true);
        } else {
          setIsOnboardingComplete(true);
        }
      }
      // For new accounts, don't set onboarding complete - let them go through onboarding flow
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = useCallback(async () => {
    try {
      setIsOnboardingComplete(true);
      await AsyncStorage.setItem('isOnboardingComplete', 'true');
      await AsyncStorage.setItem('hasCompletedOnboardingBefore', 'true');
    } catch (error) {
      // Handle onboarding completion error silently
    }
  }, []);

  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      await BasicAuthService.deleteCurrentUser();
      setUser(null);
      setIsOnboardingComplete(false);
      await AsyncStorage.clear();
    } catch (error) {
      setError(error.message || 'Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        error,
        isOnboardingComplete,
        signOut,
        continueAsGuest,
        clearError,
        completeOnboarding,
        signIn,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 