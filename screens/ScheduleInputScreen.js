import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import CustomSlider from '../components/Slider';
import Button from '../components/Button';

const ScheduleInputScreen = ({ navigation }) => {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleValueChange = (value) => {
    setDaysPerWeek(value);
    setHasInteracted(true);
  };

  const handleNext = () => {
    if (hasInteracted) {
      navigation.navigate('EquipmentInput', {
        daysPerWeek: Math.round(daysPerWeek),
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How many days per week can you work out?</Text>
        </View>

        <View style={styles.sliderContainer}>
          <CustomSlider
            value={daysPerWeek}
            onValueChange={handleValueChange}
            minimumValue={1}
            maximumValue={7}
            step={1}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Button
              title="Next"
              onPress={handleNext}
              style={[
                styles.nextButton,
                !hasInteracted && styles.nextButtonDisabled,
              ]}
              textStyle={!hasInteracted && styles.nextButtonTextDisabled}
            />
          </View>
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
  title: {
    fontSize: 28,
    ...FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: SPACING.xl,
  },
  footer: {
    marginTop: 'auto',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.md,
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    ...FONTS.medium,
    color: COLORS.primary,
  },
  nextButton: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
});

export default ScheduleInputScreen; 