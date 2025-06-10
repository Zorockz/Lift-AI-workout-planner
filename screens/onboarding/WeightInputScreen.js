import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';
import HeightWeightPicker from '../../components/HeightWeightPicker';

const WeightInputScreen = ({ navigation }) => {
  const [weight, setWeight] = useState(175);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleNext = () => {
    updateOnboarding({ weight });
    navigation.navigate('GoalWeightInput');
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Your Weight"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={11} totalSteps={15} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What's your current weight?</Text>
        <View style={styles.pickerContainer}>
          <HeightWeightPicker
            type="weight"
            value={weight}
            onChange={setWeight}
          />
        </View>
      </ScrollView>
      <OnboardingButtonRow
        onBack={handleBack}
        onNext={handleNext}
        nextEnabled={true}
      />
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
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 32,
    textAlign: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default WeightInputScreen; 