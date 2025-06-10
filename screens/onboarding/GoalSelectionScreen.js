import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const FITNESS_GOALS = [
  {
    id: 'lose_weight',
    label: 'Lose Weight',
    description: 'Burn fat and get leaner',
  },
  {
    id: 'build_muscle',
    label: 'Build Muscle',
    description: 'Gain strength and muscle mass',
  },
  {
    id: 'improve_fitness',
    label: 'Improve Fitness',
    description: 'Enhance overall fitness and endurance',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    description: 'Stay in shape and maintain current fitness',
  },
];

const GoalSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      updateOnboarding({ goal: selected });
      navigation.navigate('ExperienceLevel');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="What's Your Goal?"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={3} totalSteps={15} />
      <Text style={styles.title}>What's your main fitness goal?</Text>
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {FITNESS_GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.card,
              selected === goal.id ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => handleSelect(goal.id)}
          >
            <View>
              <Text
                style={[
                  styles.label,
                  selected === goal.id ? styles.labelSelected : styles.labelUnselected,
                ]}
              >
                {goal.label}
              </Text>
              <Text
                style={[
                  styles.description,
                  selected === goal.id ? styles.descriptionSelected : styles.descriptionUnselected,
                ]}
              >
                {goal.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <OnboardingButtonRow
        onBack={handleBack}
        onNext={handleNext}
        nextEnabled={!!selected}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  cardList: {
    padding: 24,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  cardUnselected: {
    backgroundColor: '#F7F8FA',
    borderColor: '#E2E5EA',
  },
  cardSelected: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  labelUnselected: {
    color: '#1B365D',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
  },
  descriptionUnselected: {
    color: '#6C7580',
  },
  descriptionSelected: {
    color: '#FFFFFF',
  },
});

export default GoalSelectionScreen; 