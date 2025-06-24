import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ExerciseLocationScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleNext = () => {
    if (selectedLocation) {
      updateOnboarding({ exerciseLocation: selectedLocation });
      incrementStep();
      navigation.navigate('TargetMuscles');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const locationOptions = [
    {
      title: 'Home',
      description: 'I prefer working out at home',
      icon: 'home',
      value: 'home',
      iconColor: '#4CAF50',
      iconBackground: '#E8F5E9',
    },
    {
      title: 'Gym',
      description: 'I have access to a gym',
      icon: 'weight-lifter',
      value: 'gym',
      iconColor: '#2196F3',
      iconBackground: '#E3F2FD',
    },
    {
      title: 'Outdoors',
      description: 'I prefer outdoor workouts',
      icon: 'nature',
      value: 'outdoors',
      iconColor: '#FF9800',
      iconBackground: '#FFF3E0',
    },
    {
      title: 'Mixed',
      description: 'I work out in multiple locations',
      icon: 'map-marker-multiple',
      value: 'mixed',
      iconColor: '#9C27B0',
      iconBackground: '#F3E5F5',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Workout Location"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={8} totalSteps={12} />
      <Text style={styles.title}>Where do you prefer to work out?</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {locationOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedLocation === option.value}
            onSelect={() => setSelectedLocation(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={!!selectedLocation}
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

export default ExerciseLocationScreen; 