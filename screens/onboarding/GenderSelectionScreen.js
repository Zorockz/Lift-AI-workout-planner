import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../OnboardingContext';

const GENDERS = [
  {
    id: 'male',
    label: 'Male',
    icon: 'gender-male',
  },
  {
    id: 'female',
    label: 'Female',
    icon: 'gender-female',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'gender-non-binary',
  },
];

const GenderSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      updateOnboarding({ gender: selected });
      navigation.navigate('GoalSelection');
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
        title="Select Your Gender"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={2} totalSteps={15} />
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {GENDERS.map(gender => {
          const isSelected = selected === gender.id;
          return (
            <View
              key={gender.id}
              style={[styles.card, isSelected ? styles.cardSelected : styles.cardUnselected]}
            >
              <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>{gender.label}</Text>
              <MaterialCommunityIcons
                name={gender.icon}
                size={24}
                color={isSelected ? '#FFFFFF' : '#1B365D'}
                style={styles.icon}
              />
              <View style={StyleSheet.absoluteFillObject}>
                <Text
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => handleSelect(gender.id)}
                />
              </View>
            </View>
          );
        })}
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
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardUnselected: {
    backgroundColor: '#F7F8FA',
    borderColor: '#2075FF',
  },
  cardSelected: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  labelUnselected: {
    color: '#1B365D',
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
});

export default GenderSelectionScreen; 