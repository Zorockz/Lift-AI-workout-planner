import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OnboardingHeader from '../../components/OnboardingHeader';
import OnboardingButtonRow from '../../components/OnboardingButtonRow';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const FITNESS_GOALS = [
  {
    id: 'lose_weight',
    label: 'Lose Weight',
    description: 'Burn fat and get leaner',
    icon: 'weight-lifter',
    iconColor: '#4CAF50',
    iconBackground: '#E8F5E9'
  },
  {
    id: 'build_muscle',
    label: 'Build Muscle',
    description: 'Gain strength and muscle mass',
    icon: 'dumbbell',
    iconColor: '#2196F3',
    iconBackground: '#E3F2FD'
  },
  {
    id: 'improve_fitness',
    label: 'Improve Fitness',
    description: 'Enhance overall fitness and endurance',
    icon: 'run',
    iconColor: '#FF9800',
    iconBackground: '#FFF3E0'
  },
  {
    id: 'maintain',
    label: 'Maintain',
    description: 'Stay in shape and maintain current fitness',
    icon: 'heart-pulse',
    iconColor: '#9C27B0',
    iconBackground: '#F3E5F5'
  },
];

const GoalSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const { updateOnboarding, onboarding, incrementStep, decrementStep } = useOnboarding();

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (selected) {
      updateOnboarding({ goal: selected });
      incrementStep();
      navigation.navigate('ExperienceLevel');
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
        title="What's Your Goal?"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <ProgressBar currentStep={3} totalSteps={15} />
      <Text style={styles.title}>What's your main fitness goal?</Text>
      <ScrollView contentContainerStyle={styles.cardList} showsVerticalScrollIndicator={false}>
        {FITNESS_GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.card,
              selected === goal.id ? styles.cardSelected : styles.cardUnselected,
            ]}
            onPress={() => handleSelect(goal.id)}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: goal.iconBackground }]}>
                <MaterialCommunityIcons 
                  name={goal.icon} 
                  size={24} 
                  color={goal.iconColor} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.label,
                    selected === goal.id ? styles.labelSelected : styles.labelUnselected,
                  ]}
                >
                  {goal.label}
                </Text>
                <Text
                  style={[
                    styles.description,
                    selected === goal.id ? styles.descriptionSelected : styles.descriptionUnselected,
                  ]}
                >
                  {goal.description}
                </Text>
              </View>
              {selected === goal.id && (
                <View style={styles.checkmarkContainer}>
                  <MaterialCommunityIcons name="check-circle" size={28} color="#2075FF" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <OnboardingButtonRow
        onNext={handleNext}
        onBack={handleBack}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  cardList: {
    padding: 24,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  cardUnselected: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  cardSelected: {
    borderColor: '#2075FF',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  labelSelected: {
    color: '#1B365D',
  },
  labelUnselected: {
    color: '#333333',
  },
  description: {
    fontSize: 14,
  },
  descriptionSelected: {
    color: '#666666',
  },
  descriptionUnselected: {
    color: '#999999',
  },
  checkmarkContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoalSelectionScreen; 