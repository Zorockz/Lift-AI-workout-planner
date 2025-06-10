import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../OnboardingContext';

const OnboardingSummary = ({ navigation }) => {
  const { onboarding } = useOnboarding();

  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return value;
  };

  const summaryItems = [
    {
      icon: 'gender-male-female',
      label: 'Gender',
      value: formatValue(onboarding.gender),
      valueColor: '#2075FF'
    },
    {
      icon: 'map-marker',
      label: 'Location',
      value: formatValue(onboarding.location),
      valueColor: '#2075FF'
    },
    {
      icon: 'human-male-height',
      label: 'Height',
      value: `${onboarding.height.feet} ft ${onboarding.height.inches} in`,
      valueColor: '#2075FF'
    },
    {
      icon: 'weight',
      label: 'Current Weight',
      value: `${onboarding.weight} lb`,
      valueColor: '#2075FF'
    },
    {
      icon: 'target',
      label: 'Goal Weight',
      value: `${onboarding.goalWeight} lb`,
      valueColor: '#2075FF'
    },
    {
      icon: 'flag',
      label: 'Goal',
      value: formatValue(onboarding.goal),
      valueColor: '#2075FF'
    },
    {
      icon: 'star',
      label: 'Experience Level',
      value: formatValue(onboarding.experienceLevel),
      valueColor: '#2075FF'
    },
    {
      icon: 'history',
      label: 'Strength History',
      value: formatValue(onboarding.strengthHistory),
      valueColor: '#2075FF'
    },
    {
      icon: 'dumbbell',
      label: 'Equipment',
      value: onboarding.equipment.map(item => formatValue(item)).join(', '),
      valueColor: '#2075FF'
    },
    {
      icon: 'calendar',
      label: 'Training Frequency',
      value: `${onboarding.frequency} Days Per Week`,
      valueColor: '#2075FF'
    }
  ];

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
        <Text style={styles.headerTitle}>Summary</Text>
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

        <View style={styles.summaryGrid}>
          {summaryItems.map((item, index) => (
            <View key={index} style={styles.summaryCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={24} 
                  color="#2075FF" 
                  style={styles.cardIcon}
                />
                <Text style={styles.cardLabel}>{item.label}</Text>
              </View>
              <Text style={[styles.cardValue, { color: item.valueColor }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => navigation.navigate('PlanGeneration')}
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  summaryCard: {
    width: '47%',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E5EA',
    shadowColor: '#2075FF22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2075FF',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E5EA',
  },
  generateButton: {
    backgroundColor: '#2075FF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2075FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default OnboardingSummary; 