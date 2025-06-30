import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuthInstance } from '../../config/firebase';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles } from '../../utils/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, isOnboardingComplete } = useAuth();
  const { onboarding } = useOnboarding();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // For existing users who successfully sign in, they should go to main app
        // The AppNavigator will handle this automatically based on user state and onboarding completion
        // No need to manually navigate - the AppNavigator will detect the user is signed in
        // and onboarding is complete, then show the MainNavigator (HomeScreen)
      } else {
        // Show error inline instead of alert
        setError(result.error || 'Sign in failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setResetLoading(true);

    try {
      const auth = getAuthInstance();
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for a password reset link. If you don\'t see it, check your spam folder.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Password reset email sent to:', email)
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many reset attempts. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ProgressBar currentStep={1} totalSteps={15} />
        
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Sign In</Text>
          <Text style={commonStyles.subtitle}>Welcome back to Lifts AI</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(''); // Clear error when user types
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(''); // Clear error when user types
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              style={[commonStyles.button, { marginBottom: 16 }]}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={resetLoading}
            >
              <Text style={styles.forgotPasswordText}>
                {resetLoading ? 'Sending Reset Email...' : 'Forgot Password?'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back to Welcome</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
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
  forgotPasswordButton: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#2075FF',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignInScreen; 