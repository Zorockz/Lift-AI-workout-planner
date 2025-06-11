import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const GenderSelectionScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = () => {
    if (selectedGender) {
      updateOnboarding({ gender: selectedGender });
      incrementStep();
      navigation.navigate('GoalSelection');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const genderOptions = [
    {
      title: 'Male',
      description: 'I identify as male',
      icon: 'gender-male',
      value: 'male',
      iconColor: '#1976D2',
      iconBackground: '#E3F2FD'
    },
    {
      title: 'Female',
      description: 'I identify as female',
      icon: 'gender-female',
      value: 'female',
      iconColor: '#C2185B',
      iconBackground: '#FCE4EC'
    },
    {
      title: 'Other',
      description: 'I identify as other',
      icon: 'account',
      value: 'other',
      iconColor: '#7B1FA2',
      iconBackground: '#F3E5F5'
    },
    {
      title: 'Prefer not to say',
      description: 'I prefer not to specify my gender',
      icon: 'account-question',
      value: 'prefer-not-to-say',
      iconColor: '#757575',
      iconBackground: '#F5F5F5'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="What's your gender?"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={2} totalSteps={12} />
      <Text style={styles.title}>Select your gender</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {genderOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedGender === option.value}
            onSelect={() => setSelectedGender(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={!!selectedGender}
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

export default GenderSelectionScreen; 