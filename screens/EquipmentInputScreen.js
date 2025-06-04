import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';
import Button from '../components/Button';

const EQUIPMENT_OPTIONS = [
  { id: 'none', label: 'No Equipment' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'bench', label: 'Bench' },
  { id: 'pull_up_bar', label: 'Pull-up Bar' },
  { id: 'yoga_mat', label: 'Yoga Mat' },
];

const EquipmentInputScreen = ({ navigation }) => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const handleEquipmentToggle = (equipmentId) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  const handleNext = () => {
    if (selectedEquipment.length > 0) {
      // TODO: Navigate to next screen
      console.log('Selected equipment:', selectedEquipment);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What equipment do you have access to?</Text>
        </View>

        <ScrollView style={styles.equipmentContainer}>
          <View style={styles.chipContainer}>
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <TouchableOpacity
                key={equipment.id}
                style={[
                  styles.chip,
                  selectedEquipment.includes(equipment.id) && styles.chipSelected,
                ]}
                onPress={() => handleEquipmentToggle(equipment.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedEquipment.includes(equipment.id) && styles.chipTextSelected,
                  ]}
                >
                  {equipment.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <Button
              title="Back"
              onPress={handleBack}
              style={styles.backButton}
              textStyle={styles.backButtonText}
            />
            <Button
              title="Next"
              onPress={handleNext}
              style={[
                styles.nextButton,
                selectedEquipment.length === 0 && styles.nextButtonDisabled,
              ]}
              textStyle={selectedEquipment.length === 0 && styles.nextButtonTextDisabled}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
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
  equipmentContainer: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 16,
    ...FONTS.medium,
    color: COLORS.primary,
  },
  chipTextSelected: {
    color: COLORS.background,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: {
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

export default EquipmentInputScreen; 