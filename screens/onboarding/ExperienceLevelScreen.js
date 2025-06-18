import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ExperienceLevelScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleNext = () => {
    if (selectedLevel) {
      updateOnboarding({ experienceLevel: selectedLevel });
      incrementStep();
      navigation.navigate('StrengthTrainingHistory');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const experienceOptions = [
    {
      title: 'Beginner',
      description: 'New to strength training',
      icon: 'weight-lifter',
      value: 'beginner',
      iconColor: '#4CAF50',
      iconBackground: '#E8F5E9'
    },
    {
      title: 'Intermediate',
      description: '1-2 years of experience',
      icon: 'dumbbell',
      value: 'intermediate',
      iconColor: '#FF9800',
      iconBackground: '#FFF3E0'
    },
    {
      title: 'Advanced',
      description: '3+ years of experience',
      icon: 'weight',
      value: 'advanced',
      iconColor: '#F44336',
      iconBackground: '#FFEBEE'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Experience Level"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={4} totalSteps={12} />
      <Text style={styles.title}>What's your experience level?</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {experienceOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedLevel === option.value}
            onSelect={() => setSelectedLevel(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={!!selectedLevel}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
});

export default ExperienceLevelScreen; 