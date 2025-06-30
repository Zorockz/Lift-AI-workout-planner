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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getAuthInstance, db } from '../../config/firebase';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles } from '../../utils/styles';
import { useOnboarding } from '../../contexts/OnboardingContext';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();

  const handleCreateAccount = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth account
      const auth = getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore for future reference
      const saveUserData = async () => {
        try {
          // Wait for auth state to be fully established
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if user is still authenticated
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: new Date(),
            accountCreated: true,
            // You can add more user data here as needed
          });
          return true;
        } catch (firestoreError) {
          return false;
        }
      };

      // Try to save user data, but don't fail the account creation if it doesn't work
      const firestoreSaved = await saveUserData();
      if (!firestoreSaved) {
        console.log('Continuing without Firestore save - user can still use the app');
      }

      // Update onboarding context
      updateOnboarding({ 
        email, 
        password,
        accountCreated: true,
        userId: user.uid
      });
      
      incrementStep();
      navigation.navigate('OnboardingSummary');
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Create Account</Text>
          <Text style={commonStyles.subtitle}>Set up your Lifts AI account</Text>
          <ProgressBar currentStep={13} totalSteps={15} />
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleCreateAccount}
              style={[commonStyles.button, { marginBottom: 16 }]}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
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

export default CreateAccountScreen; 