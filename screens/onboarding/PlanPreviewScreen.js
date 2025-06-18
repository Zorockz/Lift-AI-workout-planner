import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';

const PlanPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onboarding, completeOnboarding } = useOnboarding();
  const { completeOnboarding: completeAuthOnboarding } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const fadeAnim = new Animated.Value(0);

  // Initialize plan data only once
  useEffect(() => {
    if (hasInitialized) return; // Prevent re-initialization

    // Get plan from route params first, then from context
    const routePlan = route.params?.plan;
    const contextPlan = onboarding.generatedPlan;
    
    if (routePlan && routePlan.weekPlan) {
      setPlan(routePlan);
    } else if (contextPlan && contextPlan.weekPlan) {
      setPlan(contextPlan);
    }
    
    setLoading(false);
    setHasInitialized(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []); // Empty dependency array to run only once

  const handleComplete = useCallback(async () => {
    try {
      // Complete onboarding in both contexts
      await completeOnboarding();
      await completeAuthOnboarding();
      // The navigation will be handled automatically by the AuthContext
      // when isOnboardingComplete changes to true
    } catch (error) {
      console.error('PlanPreviewScreen: Error completing onboarding:', error);
    }
  }, [completeOnboarding, completeAuthOnboarding]);

  const getExerciseEmoji = useCallback((type) => {
    const emojis = {
      strength: '💪',
      cardio: '🏃‍♂️',
      flexibility: '🧘‍♀️',
      rest: '😴',
      hiit: '⚡',
      endurance: '🏃‍♀️',
      recovery: '💆‍♂️',
      yoga: '🧘‍♂️',
      pilates: '🤸‍♀️',
      swimming: '🏊‍♂️',
      cycling: '🚴‍♀️',
      boxing: '🥊',
      dance: '💃',
    };
    return emojis[type] || '💪';
  }, []);

  const getGoalEmoji = useCallback((goal) => {
    const emojis = {
      strength: '💪',
      cardio: '🏃‍♂️',
      maintain: '⚖️',
      hiit: '⚡',
      endurance: '🏃‍♀️',
      flexibility: '🧘‍♀️',
      weight_loss: '🎯',
      muscle_gain: '💪',
    };
    return emojis[goal] || '🎯';
  }, []);

  const getExperienceEmoji = useCallback((level) => {
    const emojis = {
      beginner: '🌱',
      intermediate: '🌿',
      advanced: '🌳',
    };
    return emojis[level] || '👤';
  }, []);

  const getLocationEmoji = useCallback((location) => {
    const emojis = {
      gym: '🏋️‍♂️',
      home: '🏠',
      outdoor: '🌳',
      studio: '🎯',
      pool: '🏊‍♂️',
      track: '🏃‍♂️',
    };
    return emojis[location] || '📍';
  }, []);

  const getEquipmentEmoji = useCallback((equipment) => {
    const emojis = {
      full_gym: '🏋️‍♂️',
      home_gym: '🏠',
      dumbbells: '💪',
      bodyweight: '👤',
      resistance_bands: '🎯',
      yoga_mat: '🧘‍♀️',
      kettlebell: '🏋️‍♀️',
    };
    return emojis[equipment] || '🏋️‍♂️';
  }, []);

  const renderDayCard = useCallback((day, index) => {
    const isRestDay = day.type === 'rest';
    
    return (
      <View key={index} style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Day {index + 1}</Text>
          <Text style={styles.dayType}>{isRestDay ? 'Rest Day' : 'Workout'}</Text>
        </View>
        
        {isRestDay ? (
          <View style={styles.restDayContent}>
            <Text style={styles.restDayEmoji}>😴</Text>
            <Text style={styles.restDayText}>Rest Day</Text>
            <Text style={styles.restDayNote}>{day.notes}</Text>
          </View>
        ) : (
          <View style={styles.workoutContent}>
            {day.exercises && Array.isArray(day.exercises) && day.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets && exercise.reps ? `${exercise.sets} sets × ${exercise.reps} reps` : 
                   exercise.duration ? `${exercise.duration} minutes` : ''}
                </Text>
                {exercise.notes && (
                  <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                )}
              </View>
            ))}
            {day.notes && (
              <Text style={styles.workoutNotes}>{day.notes}</Text>
            )}
          </View>
        )}
      </View>
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2075FF" />
          <Text style={styles.loadingText}>Loading your plan...</Text>
        </View>
      </View>
    );
  }

  if (!plan || !plan.weekPlan) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No workout plan available.</Text>
          <Text style={styles.errorSubText}>Please go back and try generating your plan again.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Ensure we have valid weekPlan data
  const weekPlanEntries = Object.entries(plan.weekPlan || {});
  
  if (weekPlanEntries.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid workout plan format.</Text>
          <Text style={styles.errorSubText}>The plan data is not in the expected format.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Personalized Plan</Text>
          <View style={styles.metadata}>
            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Goal</Text>
                <Text style={styles.metadataValue}>
                  {getGoalEmoji(plan.metadata.goal)} {plan.metadata.goal.replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Level</Text>
                <Text style={styles.metadataValue}>
                  {getExperienceEmoji(plan.metadata.experience)} {plan.metadata.experience}
                </Text>
              </View>
            </View>
            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Location</Text>
                <Text style={styles.metadataValue}>
                  {getLocationEmoji(plan.metadata.location)} {plan.metadata.location.replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Workouts</Text>
                <Text style={styles.metadataValue}>
                  📅 {plan.metadata.daysPerWeek}/week
                </Text>
              </View>
            </View>
            <View style={styles.equipmentContainer}>
              <Text style={styles.equipmentLabel}>Equipment</Text>
              <Text style={styles.equipmentValue}>
                {plan.metadata.equipment.map(eq => `${getEquipmentEmoji(eq)} ${eq.replace('_', ' ')}`).join(' • ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.planContainer}>
          {weekPlanEntries.length === 0 ? (
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 32 }}>
              No workouts generated for your preferences.
            </Text>
          ) : (
            weekPlanEntries.map(([dayKey, day], index) => renderDayCard(day, index))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Start Your Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 12,
    paddingTop: 20,
    marginTop: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 10,
    marginTop: 0,
  },
  metadata: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metadataItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B365D',
  },
  equipmentContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  equipmentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  equipmentValue: {
    fontSize: 14,
    color: '#1B365D',
    lineHeight: 20,
  },
  planContainer: {
    padding: 12,
    marginTop: 24,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B365D',
  },
  dayType: {
    fontSize: 12,
    color: '#666',
  },
  restDayContent: {
    alignItems: 'center',
    padding: 8,
  },
  restDayEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  restDayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 4,
  },
  restDayNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  workoutContent: {
    gap: 8,
  },
  exerciseItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B365D',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
  },
  exerciseNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  workoutNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#2075FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2075FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default PlanPreviewScreen; 