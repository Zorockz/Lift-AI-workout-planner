import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';
import { generateWorkoutPlan } from '../../services/workoutService';
import { commonStyles, colors, dimensions } from '../../utils/styles';

const PlanGenerationScreen = ({ navigation }) => {
  const { onboarding, incrementStep } = useOnboarding();
  const [error, setError] = useState(null);

  useEffect(() => {
    const generatePlan = async () => {
      try {
        const plan = await generateWorkoutPlan(onboarding);
        incrementStep();
        navigation.navigate('PlanPreview', { plan });
      } catch (err) {
        setError(err.message || 'Failed to generate workout plan');
      }
    };

    generatePlan();
  }, [navigation, onboarding, incrementStep]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.spacer} />
        <OnboardingHeader
          title="Error"
          onBack={() => navigation.goBack()}
          onSkip={null}
          showSkip={false}
        />
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Generating Your Plan"
        onBack={null}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={14} totalSteps={15} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#2075FF" />
        <Text style={styles.title}>Creating your personalized workout plan...</Text>
        <Text style={styles.subtitle}>This will only take a moment</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  spacer: {
    height: '15%',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default PlanGenerationScreen; 