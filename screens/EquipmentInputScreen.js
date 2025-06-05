import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButtonRow from '../components/OnboardingButtonRow';

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
      <View style={styles.spacer} />
      <OnboardingHeader
        title="Equipment Input"
        onBack={handleBack}
        onSkip={null}
        showSkip={false}
      />
      <Text style={styles.title}>What equipment do you have access to?</Text>
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
      <OnboardingButtonRow
        onBack={handleBack}
        onNext={handleNext}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B365D',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  equipmentContainer: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
    borderWidth: 2,
    borderColor: '#2075FF',
    marginBottom: 16,
    marginRight: 12,
    marginTop: 0,
  },
  chipSelected: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  chipText: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EquipmentInputScreen; 