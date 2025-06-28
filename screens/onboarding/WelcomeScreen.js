import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
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
          title="Sign Up"
          onPress={handleSignUp}
          style={[commonStyles.button, { marginBottom: 16 }]}
        />
        <Button 
          title="Sign In"
          onPress={handleSignIn}
          style={[commonStyles.button, { marginBottom: 16, backgroundColor: '#666' }]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Styles removed as they're no longer needed
});

export default WelcomeScreen; 