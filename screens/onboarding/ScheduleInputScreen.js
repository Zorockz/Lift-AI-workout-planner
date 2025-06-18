import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ScheduleInputScreen = ({ navigation }) => {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();

  const handleNext = () => {
    updateOnboarding({ workoutsPerWeek: daysPerWeek });
    incrementStep();
    navigation.navigate('ExerciseLocation');
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Workout Schedule"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={7} totalSteps={15} />
      <View style={styles.content}>
        <Text style={styles.title}>How often can you work out?</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.numberLine}>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.numberContainer,
                  n === daysPerWeek && styles.selectedContainer
                ]}
                onPress={() => setDaysPerWeek(n)}
              >
                <Text 
                  style={[
                    styles.number,
                    n === daysPerWeek && styles.selectedNumber
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.line} />
        </View>
      </View>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
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
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 32,
    textAlign: 'center',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  numberLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  numberContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedContainer: {
    backgroundColor: '#1B365D',
    borderColor: '#1B365D',
  },
  number: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  selectedNumber: {
    color: '#FFFFFF',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
  },
});

export default ScheduleInputScreen; 