import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const GoalInputScreen = ({ navigation, route }) => {
  const [goal, setGoal] = useState('');
  const { initialGoal } = route.params || {};

  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [initialGoal]);

  const handleNext = () => {
    if (goal.trim()) {
      navigation.navigate('ScheduleInput', { goal: goal.trim() });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎯</Text>
          </View>
          <Text style={styles.title}>What's your main fitness goal?</Text>
          <Text style={styles.subtitle}>Be specific about what you want to achieve</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g., Build muscle, Lose 10kg, Run a marathon"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
          <Text style={styles.inputHint}>
            Tip: Be specific with numbers and timeframes
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Next"
            onPress={handleNext}
            style={[
              styles.nextButton,
              !goal.trim() && styles.nextButtonDisabled,
            ]}
            textStyle={!goal.trim() && styles.nextButtonTextDisabled}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    ...FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    ...FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  inputHint: {
    fontSize: 14,
    ...FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  footer: {
    marginTop: SPACING.lg,
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

export default GoalInputScreen; 