import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import { Platform } from 'react-native';

// Development flag - set to false for production
const IS_DEVELOPMENT = false;

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

  // Get the Google Client ID from app.json
  const clientId = Constants.expoConfig?.extra?.googleClientId;
  const iosClientId = Constants.expoConfig?.extra?.iosClientId;
  const authSession = Constants.expoConfig?.extra?.authSession;

  // Initialize Firebase Auth state listener
  useEffect(() => {
    const auth = getAuthInstance();
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Use the redirect URI from app.json if available, otherwise generate one
  const redirectUri = authSession?.redirectUri || AuthSession.makeRedirectUri({
    scheme: 'fitnesspal',
    useProxy: authSession?.useProxy ?? Platform.OS !== 'web',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    iosClientId,
    androidClientId: clientId,
    webClientId: clientId,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleSignIn(id_token);
    } else if (response?.type === 'error') {
      setError('Google sign in failed. Please try again.');
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