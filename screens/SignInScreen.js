import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const { signIn, loading, authError, clearError, user, authStateSettled } = useAuth();
  const { onboardingData } = useOnboarding();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Navigate based on auth state and onboarding completion
  useEffect(() => {
    if (authStateSettled && user && !loading) {
      // Let the AppNavigator handle navigation based on auth state and onboarding completion
      // The AuthContext will update the user state, which will trigger AppNavigator to re-render
    }
  }, [authStateSettled, user, loading]);

  const handleSignIn = async () => {
    clearError();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const result = await signIn(email.trim(), password);

      if (result.success) {
        // For existing users who successfully sign in, they should go to main app
        // The AppNavigator will handle this automatically based on user state and onboarding completion
        // No need to manually navigate - the AppNavigator will detect the user is signed in
        // and onboarding is complete, then show the MainNavigator (HomeScreen)
      } else {
        if (result.shouldShowSignUpOption) {
          Alert.alert(
            'Account Not Found',
            result.error,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Create Account', 
                onPress: () => navigation.navigate('AccountCreation'), 
              },
            ]
          );
        } else {
          setLocalError(result.error || 'Sign in failed');
        }
      }
    } catch (error) {
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  const handleContinue = () => {
    // Check if we have onboarding data to continue
    if (onboardingData && Object.keys(onboardingData).length > 0) {
      // Continue from where we left off
      navigation.navigate('OnboardingSummary');
    } else {
      // Start fresh onboarding
      navigation.navigate('GenderSelection');
    }
  };

  // Clear error when user types
  const handleEmailChange = (text) => {
    setEmail(text);
    setLocalError('');
    clearError();
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setLocalError('');
    clearError();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1B365D" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign In</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="dumbbell" size={60} color="#2075FF" />
            </View>
            
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your fitness journey
            </Text>

            {/* Sign In Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              {(localError || authError) && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{localError || authError}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={styles.signInButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => {
                  // TODO: Implement forgot password functionality
                  Alert.alert('Forgot Password', 'This feature will be available soon.');
                }}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountLink}
                onPress={() => navigation.navigate('AccountCreation')}
                disabled={loading}
              >
                <Text style={styles.createAccountText}>
                  Don't have an account? Create one
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B365D',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B365D',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  errorContainer: {
    backgroundColor: '#FEE',
    borderWidth: 1,
    borderColor: '#FCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#C33',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#2075FF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonDisabled: {
    backgroundColor: '#E2E5EA',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#2075FF',
    fontSize: 14,
    fontWeight: '500',
  },
  createAccountLink: {
    alignItems: 'center',
  },
  createAccountText: {
    color: '#2075FF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignInScreen; 