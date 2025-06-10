import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [onboarding, setOnboarding] = useState({
    currentStep: 1,
    totalSteps: 13,
    gender: null,
    goal: null,
    height: null,
    weight: null,
    goalWeight: null,
    experienceLevel: null,
    strengthTrainingHistory: null,
    equipment: null,
    schedule: null,
  });

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('onboardingData');
      if (savedData) {
        setOnboarding(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const updateOnboarding = async (data) => {
    const updatedData = { ...onboarding, ...data };
    setOnboarding(updatedData);
    try {
      await AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const incrementStep = () => {
    if (onboarding.currentStep < onboarding.totalSteps) {
      updateOnboarding({ currentStep: onboarding.currentStep + 1 });
    }
  };

  const decrementStep = () => {
    if (onboarding.currentStep > 1) {
      updateOnboarding({ currentStep: onboarding.currentStep - 1 });
    }
  };

  const resetSteps = () => {
    updateOnboarding({ currentStep: 1 });
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      await AsyncStorage.setItem('onboardingData', JSON.stringify(onboarding));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const value = {
    onboarding,
    updateOnboarding,
    incrementStep,
    decrementStep,
    resetSteps,
    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 