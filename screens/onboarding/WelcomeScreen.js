import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { commonStyles } from '../../utils/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const WelcomeScreen = ({ navigation }) => {
  const { error, clearError, isOnboardingComplete } = useAuth();
  const { onboarding } = useOnboarding ? useOnboarding() : { onboarding: {} };
  const [userName, setUserName] = React.useState('');

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

  const handleSignUp = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('GenderSelection');
    }
  };

  const handleSignIn = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.gradientContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="dumbbell" size={80} color="#8B5CF6" />
          </View>
          {userName ? (
            <Text style={styles.welcomeTitle}>Welcome, {userName}!</Text>
          ) : (
            <>
              <Text style={styles.welcomeTitle}>Welcome to Lifts AI</Text>
              <Text style={styles.welcomeSubtitle}>Your AI Workout Planner</Text>
            </>
          )}
          <View style={styles.buttonContainer}>
            <Button 
              title="Sign Up"
              onPress={handleSignUp}
              style={styles.signUpButton}
              textStyle={styles.buttonText}
            />
            <Button 
              title="Sign In"
              onPress={handleSignIn}
              style={styles.signInButton}
              textStyle={styles.signInButtonText}
            />
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        colors={['transparent', 'rgba(32, 117, 255, 0.1)', 'rgba(32, 117, 255, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientTransition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    minHeight: '100%',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1B365D',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 28,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.03)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 16,
  },
  signUpButton: {
    backgroundColor: '#2075FF',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2075FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signInButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  gradientTransition: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
});

export default WelcomeScreen; 