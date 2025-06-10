import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../OnboardingContext';
import { commonStyles, colors, dimensions } from '../../utils/styles';
import ProgressBar from '../../components/ProgressBar';

const LOCATIONS = [
  {
    id: 'commercial_gym',
    label: 'Commercial Gym',
    icon: 'dumbbell',
  },
  {
    id: 'home_gym',
    label: 'Home Gym',
    icon: 'home',
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: 'run',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'dots-horizontal',
  },
];

const ExerciseLocationScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { updateOnboarding } = useOnboarding();

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      updateOnboarding({ location: selected });
      navigation.navigate('TargetMuscles');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Where do you exercise?"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={8} totalSteps={15} />
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {LOCATIONS.map(location => {
          const isSelected = selected === location.id;
          return (
            <View
              key={location.id}
              style={[styles.card, isSelected ? styles.cardSelected : styles.cardUnselected]}
            >
              <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>{location.label}</Text>
              <MaterialCommunityIcons
                name={location.icon}
                size={24}
                color={isSelected ? '#FFFFFF' : '#1B365D'}
                style={styles.icon}
              />
              <View style={StyleSheet.absoluteFillObject}>
                <Text
                  style={{ width: '100%', height: '100%' }}
                  onPress={() => handleSelect(location.id)}
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

export default ExerciseLocationScreen; 