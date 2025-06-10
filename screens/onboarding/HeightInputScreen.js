import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';
import HeightWeightPicker from '../../components/HeightWeightPicker';

const HeightInputScreen = ({ navigation }) => {
  const [height, setHeight] = useState(67); // Default to 5'7"
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleNext = () => {
    const feet = Math.floor(height / 12);
    const inches = height % 12;
    updateOnboarding({ height: { feet, inches } });
    navigation.navigate('WeightInput');
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Your Height"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={10} totalSteps={15} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>How tall are you?</Text>
        <View style={styles.pickerContainer}>
          <HeightWeightPicker
            type="height"
            value={height}
            onChange={setHeight}
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

export default HeightInputScreen; 