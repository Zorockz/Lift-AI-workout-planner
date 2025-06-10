import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../OnboardingContext';
import ProgressBar from '../../components/ProgressBar';
import { commonStyles, colors, dimensions } from '../../utils/styles';

const MUSCLES = [
  { id: 'chest', label: 'Chest', icon: require('../../assets/TargetMuscles/chest.png') },
  { id: 'back', label: 'Back', icon: require('../../assets/TargetMuscles/back.png') },
  { id: 'arms', label: 'Arms', icon: require('../../assets/TargetMuscles/barbell.png') },
  { id: 'legs', label: 'Legs', icon: require('../../assets/TargetMuscles/legs.png') },
  { id: 'abs', label: 'Abs', icon: require('../../assets/TargetMuscles/abs.png') },
];

const TargetMusclesScreen = ({ navigation }) => {
  const [selected, setSelected] = useState([]);
  const { updateOnboarding } = useOnboarding();

  const toggleMuscle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length > 0) {
      updateOnboarding({ targetMuscles: selected });
      navigation.navigate('HeightInput');
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
        <Text style={styles.headerTitle}>Target Muscles</Text>
        <View style={styles.placeholder} />
      </View>

      <ProgressBar currentStep={9} totalSteps={15} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Which muscles do you want to focus on?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.muscleGrid}>
          {MUSCLES.map((muscle) => {
            const isSelected = selected.includes(muscle.id);
            return (
              <TouchableOpacity
                key={muscle.id}
                style={[
                  styles.muscleCard,
                  isSelected ? styles.muscleCardSelected : styles.muscleCardUnselected
                ]}
                onPress={() => toggleMuscle(muscle.id)}
              >
                <Image
                  source={muscle.icon}
                  style={[
                    styles.muscleIcon,
                    { tintColor: isSelected ? '#FFFFFF' : '#1B365D' }
                  ]}
                  resizeMode="contain"
                />
                <Text style={[
                  styles.muscleLabel,
                  isSelected ? styles.muscleLabelSelected : styles.muscleLabelUnselected
                ]}>
                  {muscle.label}
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
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  muscleCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  muscleCardSelected: {
    backgroundColor: '#2075FF',
    borderColor: '#2075FF',
  },
  muscleCardUnselected: {
    backgroundColor: '#FFFFFF',
  },
  muscleIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  muscleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  muscleLabelSelected: {
    color: '#FFFFFF',
  },
  muscleLabelUnselected: {
    color: '#1B365D',
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

export default TargetMusclesScreen; 