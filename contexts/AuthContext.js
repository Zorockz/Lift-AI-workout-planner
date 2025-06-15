import React, { createContext, useState, useContext, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { GoogleAuthProvider } from 'firebase/compat/auth';
import { auth } from '../config/firebase';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const defaultContext = {
  user: null,
  loading: true,
  error: null,
  signIn: () => {},
  signOut: () => {},
  clearError: () => {}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the Google Client ID from app.json
  const clientId = Constants.expoConfig?.extra?.googleClientId;
  const authSession = Constants.expoConfig?.extra?.authSession;

  // Initialize auth state listener
  useEffect(() => {
    let unsubscribe;
    
    const initializeAuth = async () => {
      try {
        // Wait for auth to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        unsubscribe = auth.onAuthStateChanged(
          (user) => {
            setUser(user);
            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error('Auth state change error:', error);
            setError('Authentication error. Please try again.');
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
      
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with Firebase using the credential
      await auth.signInWithCredential(credential);
      
      // Store user data in AsyncStorage
      const userData = {
        id: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        picture: auth.currentUser.photoURL,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await auth.signOut();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn: () => {
          setError(null);
          promptAsync();
        },
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 