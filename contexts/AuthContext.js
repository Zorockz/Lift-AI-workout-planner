import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import { AppleAuthService, GoogleAuthService } from '../services/authService';

// Development flag - set to false for production
const IS_DEVELOPMENT = false;

const defaultContext = {
  user: null,
  isGuest: false,
  loading: true,
  error: null,
  isOnboardingComplete: false,
  signInWithGoogle: () => {},
  signInWithApple: () => {},
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
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await GoogleAuthService.signIn();
      
      if (result.success) {
        setUser(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await AppleAuthService.signIn();
      
      if (result.success) {
        setUser(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGuest(true);
      setUser({ id: 'guest', name: 'Guest User' });
      await AsyncStorage.setItem('isGuest', 'true');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error setting guest mode:', error);
      setError('Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const auth = getAuthInstance();
      await auth.signOut();
      
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
      
      if (IS_DEVELOPMENT) {
        console.log('Sign out successful');
      }
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.error('Sign out error:', error);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const completeOnboarding = useCallback(async () => {
    try {
      setIsOnboardingComplete(true);
      await AsyncStorage.setItem('isOnboardingComplete', 'true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        error,
        isOnboardingComplete,
        signInWithGoogle: handleGoogleSignIn,
        signInWithApple: handleAppleSignIn,
        signOut,
        continueAsGuest,
        clearError,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 