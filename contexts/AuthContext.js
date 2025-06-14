import React, { createContext, useState, useContext, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientId = Constants.expoConfig?.extra?.googleClientId;
  
  if (!clientId) {
    console.error('Google Client ID is not configured. Please check your app.json file.');
  }

  // Generate the redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'fitnesspal',
    useProxy: true
  });

  console.log('Redirect URI:', redirectUri); // Log this URI to add to Google Cloud Console

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    iosClientId: clientId,
    androidClientId: clientId,
    webClientId: clientId,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSignIn(authentication);
    }
  }, [response]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (authentication) => {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      });

      const userInfo = await userInfoResponse.json();
      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: authentication.accessToken,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: () => promptAsync(),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 