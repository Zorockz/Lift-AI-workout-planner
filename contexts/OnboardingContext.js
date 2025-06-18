import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingContext = createContext();

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
    equipment: [],
    workoutsPerWeek: 3,
    exerciseLocation: null,
    targetMuscles: [],
    generatedPlan: null,
  });

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = useCallback(async () => {
    try {
      const savedData = await AsyncStorage.getItem('onboardingData');
      if (savedData) {
        setOnboarding(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  }, []);

  const updateOnboarding = useCallback(async (data) => {
    setOnboarding(prevOnboarding => {
      const updatedData = { ...prevOnboarding, ...data };
      // Save to AsyncStorage asynchronously
      AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData)).catch(error => {
        console.error('Error saving onboarding data:', error);
      });
      return updatedData;
    });
  }, []);

  const incrementStep = useCallback(() => {
    setOnboarding(prevOnboarding => {
      if (prevOnboarding.currentStep < prevOnboarding.totalSteps) {
        const updatedData = { ...prevOnboarding, currentStep: prevOnboarding.currentStep + 1 };
        AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData)).catch(error => {
          console.error('Error saving onboarding data:', error);
        });
        return updatedData;
      }
      return prevOnboarding;
    });
  }, []);

  const decrementStep = useCallback(() => {
    setOnboarding(prevOnboarding => {
      if (prevOnboarding.currentStep > 1) {
        const updatedData = { ...prevOnboarding, currentStep: prevOnboarding.currentStep - 1 };
        AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData)).catch(error => {
          console.error('Error saving onboarding data:', error);
        });
        return updatedData;
      }
      return prevOnboarding;
    });
  }, []);

  const resetSteps = useCallback(() => {
    setOnboarding(prevOnboarding => {
      const updatedData = { ...prevOnboarding, currentStep: 1 };
      AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData)).catch(error => {
        console.error('Error saving onboarding data:', error);
      });
      return updatedData;
    });
  }, []);

  const setGeneratedPlan = useCallback(async (plan) => {
    setOnboarding(prevOnboarding => {
      const updatedData = { ...prevOnboarding, generatedPlan: plan };
      AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData)).catch(error => {
        console.error('Error saving onboarding data:', error);
      });
      return updatedData;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      // Save the final onboarding data including the generated plan
      await AsyncStorage.setItem('onboardingData', JSON.stringify(onboarding));
      // Clear any temporary onboarding state
      await AsyncStorage.removeItem('onboardingInProgress');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [onboarding]);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('onboardingComplete');
      await AsyncStorage.removeItem('onboardingData');
      await AsyncStorage.removeItem('onboardingInProgress');
      setOnboarding({
        currentStep: 1,
        totalSteps: 13,
        gender: null,
        goal: null,
        height: null,
        weight: null,
        goalWeight: null,
        experienceLevel: null,
        strengthTrainingHistory: null,
        equipment: [],
        workoutsPerWeek: 3,
        exerciseLocation: null,
        targetMuscles: [],
        generatedPlan: null,
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, []);

  const value = useMemo(() => ({
    onboarding,
    updateOnboarding,
    incrementStep,
    decrementStep,
    resetSteps,
    completeOnboarding,
    setGeneratedPlan,
    resetOnboarding,
  }), [onboarding, updateOnboarding, incrementStep, decrementStep, resetSteps, completeOnboarding, setGeneratedPlan, resetOnboarding]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 