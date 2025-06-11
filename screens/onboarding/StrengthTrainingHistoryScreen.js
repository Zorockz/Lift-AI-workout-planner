import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const StrengthTrainingHistoryScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedHistory, setSelectedHistory] = useState(null);

  const handleNext = () => {
    if (selectedHistory) {
      updateOnboarding({ strengthTrainingHistory: selectedHistory });
      incrementStep();
      navigation.navigate('EquipmentInput');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const historyOptions = [
    {
      title: 'Never',
      description: 'No previous strength training experience',
      icon: 'clock-outline',
      value: 'never',
      iconColor: '#9E9E9E',
      iconBackground: '#F5F5F5'
    },
    {
      title: 'Less than 6 months',
      description: 'Some experience but less than 6 months',
      icon: 'clock-time-four-outline',
      value: 'less_than_6_months',
      iconColor: '#4CAF50',
      iconBackground: '#E8F5E9'
    },
    {
      title: '6-12 months',
      description: 'Consistent training for 6-12 months',
      icon: 'clock-time-five-outline',
      value: '6_to_12_months',
      iconColor: '#2196F3',
      iconBackground: '#E3F2FD'
    },
    {
      title: 'More than 1 year',
      description: 'Over a year of consistent training',
      icon: 'clock-time-eight-outline',
      value: 'more_than_1_year',
      iconColor: '#9C27B0',
      iconBackground: '#F3E5F5'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Training History"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={5} totalSteps={12} />
      <Text style={styles.title}>How long have you been strength training?</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {historyOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedHistory === option.value}
            onSelect={() => setSelectedHistory(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={!!selectedHistory}
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

export default StrengthTrainingHistoryScreen; 