import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import GoalCard from '../components/GoalCard';
import Button from '../components/Button';

// Dummy data for fitness goals
const FITNESS_GOALS = [
  {
    id: '1',
    title: 'Lose Weight',
    description: 'Burn fat and achieve a healthier body composition',
  },
  {
    id: '2',
    title: 'Build Muscle',
    description: 'Increase muscle mass and strength',
  },
  {
    id: '3',
    title: 'Improve Fitness',
    description: 'Enhance overall fitness and endurance',
  },
  {
    id: '4',
    title: 'Maintain Health',
    description: 'Stay active and maintain current fitness level',
  },
];

const GoalSelectionScreen = ({ navigation }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
  };

  const handleNext = () => {
    if (selectedGoal) {
      const selectedGoalData = FITNESS_GOALS.find(goal => goal.id === selectedGoal);
      navigation.navigate('ScheduleInput', { 
        goal: selectedGoalData.title 
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Goal</Text>
        <Text style={styles.subtitle}>Select your primary fitness objective</Text>
      </View>

      <ScrollView style={styles.goalsContainer}>
        {FITNESS_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            description={goal.description}
            isSelected={selectedGoal === goal.id}
            onPress={() => handleGoalSelect(goal.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          style={[
            styles.nextButton,
            !selectedGoal && styles.nextButtonDisabled,
          ]}
          textStyle={!selectedGoal && styles.nextButtonTextDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: 28,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    ...FONTS.regular,
    color: COLORS.textLight,
  },
  goalsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    width: '100%',
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
});

export default GoalSelectionScreen; 