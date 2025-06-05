import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingCard from '../components/OnboardingCard';
import OnboardingButtonRow from '../components/OnboardingButtonRow';

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Little to no gym experience',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Regular gym-goer, some experience',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Competitive or coach level',
  },
];

const ExperienceLevelScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      navigation.navigate('ScheduleInput', { experienceLevel: selected });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.navigate('ScheduleInput');
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Fitness Experience"
        onBack={handleBack}
        onSkip={handleSkip}
        showSkip={true}
      />
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