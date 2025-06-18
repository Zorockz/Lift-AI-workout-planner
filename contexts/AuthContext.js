import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import { Platform } from 'react-native';

// Development flag - set to true during development
const IS_DEVELOPMENT = true;

WebBrowser.maybeCompleteAuthSession();

const defaultContext = {
  user: null,
  isGuest: false,
  loading: true,
  error: null,
  isOnboardingComplete: false,
  signIn: () => {},
  signOut: () => {},
  continueAsGuest: () => {},
  clearError: () => {},
  completeOnboarding: () => {}
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

  // Get the Google Client ID from app.json
  const clientId = Constants.expoConfig?.extra?.googleClientId;
  const authSession = Constants.expoConfig?.extra?.authSession;

  // Initialize Firebase Auth state listener
  useEffect(() => {
    const auth = getAuthInstance();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
      
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL,
        };
        
        setUser(userData);
        setIsGuest(false);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.removeItem('isGuest');
        
        // Check onboarding status - but don't auto-complete for returning users
        const storedOnboarding = await AsyncStorage.getItem('isOnboardingComplete');
        const hasCompletedOnboarding = storedOnboarding === 'true';
        
        // Only set onboarding complete if user has actually completed it
        if (hasCompletedOnboarding) {
          setIsOnboardingComplete(true);
        } else {
          // For new users or users who haven't completed onboarding, stay in onboarding
          setIsOnboardingComplete(false);
        }
      } else {
        // User is signed out from Firebase
        setUser(null);
        setIsGuest(false);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('isGuest');
        
        // Check if there's stored guest data
        const storedGuest = await AsyncStorage.getItem('isGuest');
        if (storedGuest === 'true') {
          setIsGuest(true);
          setUser({ id: 'guest', name: 'Guest User' });
        }
        
        // Check onboarding status for guest users
        const storedOnboarding = await AsyncStorage.getItem('isOnboardingComplete');
        setIsOnboardingComplete(storedOnboarding === 'true');
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Use the redirect URI from app.json if available, otherwise generate one
  const redirectUri = authSession?.redirectUri || AuthSession.makeRedirectUri({
    scheme: 'fitnesspal',
    useProxy: authSession?.useProxy ?? Platform.OS !== 'web'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    iosClientId: clientId,
    androidClientId: clientId,
    webClientId: clientId,
    redirectUri,
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleSignIn(id_token);
    } else if (response?.type === 'error') {
      setError('Google sign in failed. Please try again.');
      console.error('Google sign in error:', response.error);
    }
  }, [response]);

  const handleSignIn = async (idToken) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing in with Google token...');
      const auth = getAuthInstance();
      
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with Firebase using the credential
      await signInWithCredential(auth, credential);
      
      console.log('Sign-in successful');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please try again.');
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
      setError(null);
      
      if (!isGuest) {
        // Sign out from Firebase
        const auth = getAuthInstance();
        await auth.signOut();
      }
      
      // Clear all stored data
      setUser(null);
      setIsGuest(false);
      setIsOnboardingComplete(false);
      
      await AsyncStorage.multiRemove([
        'user',
        'isGuest',
        'isOnboardingComplete',
        'onboardingComplete',
        'onboardingData',
        'onboardingInProgress',
        'workoutPlan',
        'completedExercises'
      ]);
      
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding in AuthContext...');
      setIsOnboardingComplete(true);
      await AsyncStorage.setItem('isOnboardingComplete', 'true');
      console.log('Onboarding completed successfully in AuthContext');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding');
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
        signIn: () => {
          setError(null);
          promptAsync();
        },
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