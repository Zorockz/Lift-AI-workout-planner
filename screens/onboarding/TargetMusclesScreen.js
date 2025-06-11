import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const TargetMusclesScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const handleNext = () => {
    if (selectedMuscles.length > 0) {
      updateOnboarding({ targetMuscles: selectedMuscles });
      incrementStep();
      navigation.navigate('HeightInput');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const toggleMuscle = (muscle) => {
    setSelectedMuscles(prev => {
      if (prev.includes(muscle)) {
        return prev.filter(item => item !== muscle);
      } else {
        return [...prev, muscle];
      }
    });
  };

  const muscleOptions = [
    {
      title: 'Chest',
      description: 'Focus on chest development',
      icon: 'weight-lifter',
      value: 'chest',
      iconColor: '#1976D2',
      iconBackground: '#E3F2FD'
    },
    {
      title: 'Back',
      description: 'Strengthen your back muscles',
      icon: 'human-handsup',
      value: 'back',
      iconColor: '#4CAF50',
      iconBackground: '#E8F5E9'
    },
    {
      title: 'Legs',
      description: 'Build lower body strength',
      icon: 'run',
      value: 'legs',
      iconColor: '#FF9800',
      iconBackground: '#FFF3E0'
    },
    {
      title: 'Shoulders',
      description: 'Develop shoulder strength',
      icon: 'weight',
      value: 'shoulders',
      iconColor: '#9C27B0',
      iconBackground: '#F3E5F5'
    },
    {
      title: 'Arms',
      description: 'Focus on biceps and triceps',
      icon: 'arm-flex',
      value: 'arms',
      iconColor: '#F44336',
      iconBackground: '#FFEBEE'
    },
    {
      title: 'Core',
      description: 'Strengthen your abs and core',
      icon: 'human-handsup',
      value: 'core',
      iconColor: '#009688',
      iconBackground: '#E0F2F1'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Target Muscles"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={9} totalSteps={12} />
      <Text style={styles.title}>Which muscles do you want to focus on?</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {muscleOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedMuscles.includes(option.value)}
            onSelect={() => toggleMuscle(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={selectedMuscles.length > 0}
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

export default TargetMusclesScreen; 