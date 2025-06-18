import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingSummary = ({ navigation }) => {
  const { onboarding, completeOnboarding } = useOnboarding();
  const { completeOnboarding: completeAuthOnboarding } = useAuth();

  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return value;
  };

  const formatHeight = (totalInches) => {
    if (!totalInches) return 'Not set';
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}′ ${inches}″`;
  };

  const calculateBMI = (heightInches, weightLbs) => {
    if (!heightInches || !weightLbs) return 'Not set';
    // Convert height from inches to meters
    const heightMeters = heightInches * 0.0254;
    // Convert weight from pounds to kg
    const weightKg = weightLbs * 0.453592;
    // Calculate BMI
    const bmi = weightKg / (heightMeters * heightMeters);
    
    // Get BMI category and emoji
    let category = '';
    let emoji = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      emoji = '⚠️';
    } else if (bmi < 25) {
      category = 'Normal';
      emoji = '✅';
    } else if (bmi < 30) {
      category = 'Overweight';
      emoji = '⚠️';
    } else {
      category = 'Obese';
      emoji = '⚠️';
    }
    
    return `${bmi.toFixed(1)} (${category}) ${emoji}`;
  };

  const personalInfoItems = [
    {
      icon: 'gender-male-female',
      label: 'Gender',
      value: formatValue(onboarding.gender)
    },
    {
      icon: 'map-marker',
      label: 'Workout Location',
      value: formatValue(onboarding.exerciseLocation)
    },
    {
      icon: 'human-male-height',
      label: 'BMI',
      value: calculateBMI(onboarding.height, onboarding.weight)
    }
  ];

  const bodyStatsItems = [
    {
      icon: 'human-male-height',
      label: 'Height',
      value: formatHeight(onboarding.height)
    },
    {
      icon: 'weight',
      label: 'Current Weight',
      value: `${onboarding.weight} lb`
    },
    {
      icon: 'target',
      label: 'Goal Weight',
      value: `${onboarding.goalWeight} lb`
    }
  ];

  const planDetailsItems = [
    {
      icon: 'flag',
      label: 'Goal',
      value: formatValue(onboarding.goal)
    },
    {
      icon: 'star',
      label: 'Experience Level',
      value: formatValue(onboarding.experienceLevel)
    },
    {
      icon: 'history',
      label: 'Strength History',
      value: formatValue(onboarding.strengthTrainingHistory)
    },
    {
      icon: 'dumbbell',
      label: 'Equipment',
      value: onboarding.equipment.map(item => formatValue(item)).join(', ')
    },
    {
      icon: 'calendar',
      label: 'Training Frequency',
      value: `${onboarding.workoutsPerWeek} Days Per Week`
    }
  ];

  const InfoCard = ({ title, items }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.cardRow}>
          <View style={styles.cardRowLeft}>
            <MaterialCommunityIcons name={item.icon} size={24} color="#2075FF" />
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
          <Text style={styles.cardValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const handleGeneratePlan = async () => {
    // Don't complete onboarding here - wait until after plan preview
    // await completeAuthOnboarding(); // REMOVED - this was causing the issue
    navigation.navigate('PlanGeneration');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
        <View style={styles.placeholder} />
      </View>

      <ProgressBar currentStep={13} totalSteps={15} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Review Your Information</Text>
        <Text style={styles.subtitle}>Please confirm your details before we generate your plan</Text>

        <InfoCard title="Personal Info" items={personalInfoItems} />
        <InfoCard title="Body Stats" items={bodyStatsItems} />
        <InfoCard title="Plan Details" items={planDetailsItems} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGeneratePlan}
        >
          <Text style={styles.generateButtonText}>Generate My Plan</Text>
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
    fontSize: 28,
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
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E5EA',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
  },
  cardValue: {
    fontSize: 16,
    color: '#1B365D',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 28, // 16px padding + 12px safe area
    borderTopWidth: 1,
    borderTopColor: '#E2E5EA',
  },
  generateButton: {
    backgroundColor: '#2075FF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingSummary; 