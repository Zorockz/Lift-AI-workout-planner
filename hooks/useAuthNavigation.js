import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';

export const useAuthNavigation = () => {
  const navigation = useNavigation();
  const { user, authStateSettled } = useAuth();
  const { onboardingCompleted } = useOnboarding();
  const prevState = useRef({ user: null, onboardingCompleted: false });

  useEffect(() => {
    const currentState = { user: !!user, onboardingCompleted };
    const previousState = prevState.current;
    
    // If we're transitioning from onboarding (no user or incomplete onboarding) to main app (user + completed onboarding)
    if (!previousState.user && currentState.user && !previousState.onboardingCompleted && currentState.onboardingCompleted) {
      // Reset the navigation stack to prevent going back to onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
    
    prevState.current = currentState;
  }, [user, onboardingCompleted, navigation]);
}; 