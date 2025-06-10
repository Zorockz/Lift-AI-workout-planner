import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import CustomSlider from '../../components/Slider';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';
import { commonStyles, colors, dimensions } from '../../utils/styles';

const ScheduleInputScreen = ({ navigation }) => {
  const [frequency, setFrequency] = useState(3);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFrequencyChange = (value) => {
    setFrequency(value);
    setHasInteracted(true);
  };

  const handleNext = () => {
    updateOnboarding({ frequency });
    navigation.navigate('ExerciseLocation');
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Training Schedule"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={7} totalSteps={15} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How many days per week can you work out?</Text>
        <View style={styles.sliderContainer}>
          <CustomSlider
            value={frequency}
            onValueChange={handleFrequencyChange}
            minimumValue={1}
            maximumValue={7}
            step={1}
          />
        </View>
      </ScrollView>
      <OnboardingButtonRow
        onBack={handleBack}
        onNext={handleNext}
        nextEnabled={true}
      />
    </KeyboardAvoidingView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B365D',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sliderContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
});

export default ScheduleInputScreen; 