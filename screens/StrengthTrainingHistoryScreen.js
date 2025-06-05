import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingCard from '../components/OnboardingCard';
import OnboardingButtonRow from '../components/OnboardingButtonRow';

const EXPERIENCE_OPTIONS = [
  { id: '4plus', label: '4+ Years', description: 'Extensive strength training experience' },
  { id: '2to4', label: '2–4 Years', description: 'Consistent training for a few years' },
  { id: '1to2', label: '1–2 Years', description: 'Some experience, still learning' },
  { id: '6to12', label: '6–12 Months', description: 'Recently started strength training' },
  { id: 'none', label: 'None (Just Starting)', description: 'No prior strength training experience' },
];

const StrengthTrainingHistoryScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      navigation.navigate('ExperienceLevel', { experience: selected });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.navigate('ExperienceLevel');
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Strength Training"
        onBack={handleBack}
        onSkip={handleSkip}
        showSkip={true}
      />
      <Text style={styles.title}>How long have you been doing strength training?</Text>
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {EXPERIENCE_OPTIONS.map(option => (
          <OnboardingCard
            key={option.id}
            label={option.label}
            description={option.description}
            isSelected={selected === option.id}
            onPress={() => handleSelect(option.id)}
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

export default StrengthTrainingHistoryScreen; 