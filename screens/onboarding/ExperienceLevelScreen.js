import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingCard from '../../components/OnboardingCard';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';
import { commonStyles, colors, dimensions } from '../../utils/styles';

const EXPERIENCE_LEVELS = [
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Competitive or coach level',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Regular gym-goer, some experience',
  },
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Little to no gym experience',
  },
];

const ExperienceLevelScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleSelect = (level) => {
    setSelected(level);
  };

  const handleNext = () => {
    if (selected) {
      updateOnboarding({ experienceLevel: selected });
      navigation.navigate('StrengthTrainingHistory');
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
        title="Experience Level"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={4} totalSteps={15} />
      <Text style={styles.title}>How would you describe your training experience?</Text>
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {EXPERIENCE_LEVELS.map(level => (
          <OnboardingCard
            key={level.id}
            label={level.label}
            description={level.description}
            isSelected={selected === level.id}
            onPress={() => handleSelect(level.id)}
          />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B365D',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});

export default ExperienceLevelScreen; 