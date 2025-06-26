import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles } from '../../utils/styles';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLogo from '../../assets/google_logo.png';
import { useOnboarding } from '../../contexts/OnboardingContext';
import * as AppleAuthentication from 'expo-apple-authentication';

const WelcomeScreen = ({ navigation }) => {
  const { signInWithGoogle, signInWithApple, error, clearError, loading, isOnboardingComplete } = useAuth();
  const { onboarding } = useOnboarding ? useOnboarding() : { onboarding: {} };
  const [userName, setUserName] = React.useState('');
  const [appleSignInAvailable, setAppleSignInAvailable] = React.useState(false);

  // Check if Apple Sign In is available
  useEffect(() => {
    const checkAppleSignInAvailability = async () => {
      if (Platform.OS === 'ios') {
        try {
          const isAvailable = await AppleAuthentication.isAvailableAsync();
          setAppleSignInAvailable(isAvailable);
        } catch (error) {
          console.log('Apple Sign In not available:', error.message);
          setAppleSignInAvailable(false);
        }
      }
    };
    
    checkAppleSignInAvailability();
  }, []);

  // Show error alert when authentication error occurs
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Authentication Error',
        error,
        [
          {
            text: 'OK',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error]);

  React.useEffect(() => {
    // Try to get name from localStorage (web) or onboarding context
    let name = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      name = window.localStorage.getItem('userName') || '';
    }
    if (!name && onboarding && onboarding.name) {
      name = onboarding.name;
    }
    setUserName(name);
  }, [onboarding]);

  // Handler for Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will be handled by the auth state change in App.js
    } catch (error) {
      // Remove all console.error statements for production
    }
  };

  // Handler for Apple sign-in
  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      // Navigation will be handled by the auth state change in App.js
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  const handleSignUp = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('GenderSelection');
    }
  };

  return (
    <ScrollView 
      style={commonStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ProgressBar currentStep={1} totalSteps={15} />
      <View style={[commonStyles.content, { justifyContent: 'center' }]}>
        {userName ? (
          <Text style={[commonStyles.title, { color: '#2075FF' }]}>Welcome, {userName}!</Text>
        ) : (
          <>
            <Text style={commonStyles.title}>Welcome to Lift</Text>
            <Text style={commonStyles.subtitle}>Your AI Workout Planner</Text>
          </>
        )}
        <Button 
          title={isOnboardingComplete ? 'Sign In' : 'Sign Up'}
          onPress={handleSignUp}
          style={[commonStyles.button, { marginBottom: 16 }]}
        />
        <TouchableOpacity 
          style={[styles.googleButton, loading && styles.disabledButton]} 
          onPress={handleGoogleSignIn} 
          activeOpacity={0.8}
          disabled={loading}
        >
          <Image source={GoogleLogo} style={styles.googleLogo} />
          <Text style={styles.googleButtonText}>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>
        
        {appleSignInAvailable && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={10}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  googleLogo: {
    width: 22,
    height: 22,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  googleButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    height: 50,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
});

export default WelcomeScreen; 