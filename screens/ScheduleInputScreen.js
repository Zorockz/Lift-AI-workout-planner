import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButtonRow from '../components/OnboardingButtonRow';
import CustomSlider from '../components/Slider';

const ScheduleInputScreen = ({ navigation }) => {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleValueChange = (value) => {
    setDaysPerWeek(value);
    setHasInteracted(true);
  };

  const handleNext = () => {
    if (hasInteracted) {
      navigation.navigate('EquipmentInput', {
        daysPerWeek: Math.round(daysPerWeek),
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Workout Frequency"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <Text style={styles.title}>How many days per week can you work out?</Text>
      <View style={styles.sliderContainer}>
        <CustomSlider
          value={daysPerWeek}
          onValueChange={handleValueChange}
          minimumValue={1}
          maximumValue={7}
          step={1}
        />
      </View>
      <OnboardingButtonRow
        onBack={handleBack}
        onNext={handleNext}
        nextEnabled={hasInteracted}
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
});

export default ScheduleInputScreen; 