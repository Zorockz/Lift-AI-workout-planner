import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../OnboardingContext';
import ProgressBar from '../../components/ProgressBar';

const EQUIPMENT_OPTIONS = [
  { 
    id: 'none', 
    label: 'No Equipment', 
    icon: 'weight-off',
    description: 'Bodyweight exercises only'
  },
  { 
    id: 'dumbbells', 
    label: 'Dumbbells', 
    icon: 'dumbbell',
    description: 'Free weights'
  },
  { 
    id: 'resistance_bands', 
    label: 'Resistance Bands', 
    icon: 'bandage',
    description: 'Elastic bands'
  },
  { 
    id: 'barbell', 
    label: 'Barbell', 
    icon: 'weight-lifter',
    description: 'Olympic bar'
  },
  { 
    id: 'kettlebell', 
    label: 'Kettlebell', 
    icon: 'weight',
    description: 'Cast iron weights'
  },
  { 
    id: 'bench', 
    label: 'Bench', 
    icon: 'table-furniture',
    description: 'Weight bench'
  },
  { 
    id: 'pull_up_bar', 
    label: 'Pull-up Bar', 
    icon: 'human-handsup',
    description: 'Overhead bar'
  },
  { 
    id: 'yoga_mat', 
    label: 'Yoga Mat', 
    icon: 'yoga',
    description: 'Exercise mat'
  },
];

const EquipmentInputScreen = ({ navigation }) => {
  const [selected, setSelected] = useState([]);
  const { updateOnboarding } = useOnboarding();

  const handleSelect = (equipment) => {
    setSelected(prev => {
      if (prev.includes(equipment)) {
        return prev.filter(item => item !== equipment);
      }
      return [...prev, equipment];
    });
  };

  const handleNext = () => {
    if (selected.length > 0) {
      updateOnboarding({ equipment: selected });
      navigation.navigate('ScheduleInput');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Equipment</Text>
        <View style={styles.placeholder} />
      </View>

      <ProgressBar currentStep={6} totalSteps={15} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What equipment do you have access to?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.equipmentGrid}>
          {EQUIPMENT_OPTIONS.map((equipment) => {
            const isSelected = selected.includes(equipment.id);
            return (
              <TouchableOpacity
                key={equipment.id}
                style={[
                  styles.equipmentCard,
                  isSelected ? styles.equipmentCardSelected : styles.equipmentCardUnselected
                ]}
                onPress={() => handleSelect(equipment.id)}
              >
                <MaterialCommunityIcons
                  name={equipment.icon}
                  size={32}
                  color={isSelected ? '#FFFFFF' : '#1B365D'}
                  style={styles.equipmentIcon}
                />
                <Text style={[
                  styles.equipmentLabel,
                  isSelected ? styles.equipmentLabelSelected : styles.equipmentLabelUnselected
                ]}>
                  {equipment.label}
                </Text>
                <Text style={[
                  styles.equipmentDescription,
                  isSelected ? styles.equipmentDescriptionSelected : styles.equipmentDescriptionUnselected
                ]}>
                  {equipment.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, selected.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <Text style={[
            styles.nextButtonText,
            selected.length === 0 && styles.nextButtonTextDisabled
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  equipmentCard: {
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  equipmentCardSelected: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  equipmentCardUnselected: {
    backgroundColor: '#FFFFFF',
  },
  equipmentIcon: {
    marginBottom: 12,
  },
  equipmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  equipmentLabelSelected: {
    color: '#FFFFFF',
  },
  equipmentLabelUnselected: {
    color: '#1B365D',
  },
  equipmentDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  equipmentDescriptionSelected: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  equipmentDescriptionUnselected: {
    color: '#666666',
  },
  buttonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E5EA',
  },
  nextButton: {
    backgroundColor: '#2075FF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E2E5EA',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#A3A8AF',
  },
});

export default EquipmentInputScreen; 