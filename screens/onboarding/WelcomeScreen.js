import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles } from '../../utils/styles';
import { useOnboarding } from '../../OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLogo from '../../assets/google_logo.png';

const WelcomeScreen = ({ navigation }) => {
  const { onboarding } = useOnboarding();
  const { signIn } = useAuth();

  // Handler for Google sign-in, then continue onboarding
  const handleGoogleSignIn = async () => {
    await signIn();
    navigation.navigate('GenderSelection');
  };

  return (
    <ScrollView 
      style={commonStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ProgressBar currentStep={1} totalSteps={15} />
      <View style={[commonStyles.content, { justifyContent: 'center' }]}>
        <Text style={commonStyles.title}>Welcome to FitBuddy</Text>
        <Text style={commonStyles.subtitle}>Your AI Fitness Companion</Text>
        <Button 
          title="Sign Up"
          onPress={() => navigation.navigate('GenderSelection')}
          style={[commonStyles.button, { marginBottom: 16 }]}
        />
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} activeOpacity={0.8}>
          <Image source={GoogleLogo} style={styles.googleLogo} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
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
});

export default WelcomeScreen; 