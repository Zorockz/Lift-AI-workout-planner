import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import OnboardingOptionCard from '../../components/OnboardingOptionCard';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../contexts/OnboardingContext';

const EquipmentInputScreen = ({ navigation }) => {
  const { updateOnboarding, incrementStep, decrementStep } = useOnboarding();
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const handleNext = () => {
    if (selectedEquipment.length > 0) {
      updateOnboarding({ equipment: selectedEquipment });
      incrementStep();
      navigation.navigate('ScheduleInput');
    }
  };

  const handleBack = () => {
    decrementStep();
    navigation.goBack();
  };

  const toggleEquipment = (equipment) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipment)) {
        return prev.filter(item => item !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };

  const equipmentOptions = [
    {
      title: 'Full Gym',
      description: 'Access to a complete gym with all equipment',
      icon: 'weight-lifter',
      value: 'full_gym',
      iconColor: '#1976D2',
      iconBackground: '#E3F2FD',
    },
    {
      title: 'Home Gym',
      description: 'Basic equipment at home',
      icon: 'home',
      value: 'home_gym',
      iconColor: '#4CAF50',
      iconBackground: '#E8F5E9',
    },
    {
      title: 'Dumbbells Only',
      description: 'Just dumbbells available',
      icon: 'dumbbell',
      value: 'dumbbells',
      iconColor: '#FF9800',
      iconBackground: '#FFF3E0',
    },
    {
      title: 'Bodyweight Only',
      description: 'No equipment, just bodyweight exercises',
      icon: 'human-handsup',
      value: 'bodyweight',
      iconColor: '#9C27B0',
      iconBackground: '#F3E5F5',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Equipment"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={6} totalSteps={12} />
      <Text style={styles.title}>What equipment do you have access to?</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {equipmentOptions.map((option) => (
          <OnboardingOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            isSelected={selectedEquipment.includes(option.value)}
            onSelect={() => toggleEquipment(option.value)}
            iconColor={option.iconColor}
            iconBackground={option.iconBackground}
          />
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
        nextEnabled={selectedEquipment.length > 0}
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

export default EquipmentInputScreen; 