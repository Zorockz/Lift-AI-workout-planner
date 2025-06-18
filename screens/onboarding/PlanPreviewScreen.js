import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

  // Track re-renders
  console.log('PlanPreviewScreen render:', { loading, hasPlan: !!plan, hasInitialized });

  // Memoize the plan data to prevent unnecessary re-renders
  const routePlan = useMemo(() => route.params?.plan, [route.params?.plan]);
  const contextPlan = useMemo(() => onboarding.generatedPlan, [onboarding.generatedPlan]);

  // Initialize plan data only once
  useEffect(() => {
    if (hasInitialized) return; // Prevent re-initialization

    console.log('PlanPreviewScreen mounted');
    console.log('Route params:', route.params);
    console.log('Onboarding generatedPlan:', onboarding.generatedPlan);
    console.log('Route plan:', routePlan);
    console.log('Context plan:', contextPlan);
    console.log('Current plan state:', plan);
    console.log('Loading state:', loading);
    console.log('Has initialized:', hasInitialized);
    
    // Get plan from route params first, then from context
    if (routePlan && routePlan.weekPlan) {
      console.log('Using plan from route params');
      console.log('Route plan weekPlan keys:', Object.keys(routePlan.weekPlan));
      setPlan(routePlan);
      setLoading(false);
      setHasInitialized(true);
    } else if (contextPlan && contextPlan.weekPlan) {
      console.log('Using plan from onboarding context');
      console.log('Context plan weekPlan keys:', Object.keys(contextPlan.weekPlan));
      setPlan(contextPlan);
      setLoading(false);
      setHasInitialized(true);
    } else {
      console.log('No valid plan found, showing error');
      console.log('Route plan valid:', !!routePlan);
      console.log('Context plan valid:', !!contextPlan);
      console.log('Route plan weekPlan:', !!routePlan?.weekPlan);
      console.log('Context plan weekPlan:', !!contextPlan?.weekPlan);
      setLoading(false);
      setHasInitialized(true);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [routePlan, contextPlan, hasInitialized]); // Fixed dependencies

  const handleComplete = useCallback(async () => {
    try {
      console.log('PlanPreviewScreen: Starting onboarding completion...');
      
      // Complete onboarding in both contexts
      await completeOnboarding();
      console.log('PlanPreviewScreen: Onboarding context completed');
      
      await completeAuthOnboarding();
      console.log('PlanPreviewScreen: Auth context completed');
      
      console.log('PlanPreviewScreen: Onboarding completed successfully');
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
    console.log(`renderDayCard called for index ${index}:`, day);
    const isRestDay = day.type === 'rest';
    console.log(`Day ${index} is rest day:`, isRestDay);
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.dayCard,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          })}] }
        ]}
      >
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Day {index + 1}</Text>
          <Text style={styles.dayType}>{isRestDay ? 'Rest Day' : 'Workout Day'}</Text>
        </View>
        
        {isRestDay ? (
          <View style={styles.restDayContent}>
            <Text style={styles.restDayEmoji}>😴</Text>
            <Text style={styles.restDayText}>Rest and Recovery</Text>
            <Text style={styles.restDayNote}>{day.notes}</Text>
          </View>
        ) : (
          <View style={styles.workoutContent}>
            {day.exercises && day.exercises.map((exercise, exIndex) => {
              console.log(`Rendering exercise ${exIndex}:`, exercise);
              return (
                <View key={exIndex} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>
                    {getExerciseEmoji(exercise.type)} {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps || exercise.duration}
                  </Text>
                  {exercise.notes && (
                    <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                  )}
                </View>
              );
            })}
            {day.notes && (
              <Text style={styles.workoutNotes}>{day.notes}</Text>
            )}
          </View>
        )}
      </Animated.View>
    );
  }, [fadeAnim, getExerciseEmoji]);

  // Debug component to track state changes
  const DebugInfo = () => {
    if (__DEV__) {
      return (
        <View style={{ padding: 10, backgroundColor: '#f0f0f0', margin: 10 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Debug: Loading={loading}, HasPlan={!!plan}, HasWeekPlan={!!plan?.weekPlan}, Initialized={hasInitialized}
          </Text>
          {plan && (
            <Text style={{ fontSize: 10, color: '#666', marginTop: 5 }}>
              Plan Keys: {Object.keys(plan).join(', ')}
            </Text>
          )}
          {plan?.weekPlan && (
            <Text style={{ fontSize: 10, color: '#666', marginTop: 5 }}>
              WeekPlan Keys: {Object.keys(plan.weekPlan).join(', ')}
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <DebugInfo />
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
        <DebugInfo />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No workout plan available.</Text>
          <Text style={styles.errorSubText}>Please go back and try generating your plan again.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
          
          {/* Test button to show hardcoded plan */}
          <TouchableOpacity 
            style={[styles.retryButton, { marginTop: 10, backgroundColor: '#28a745' }]}
            onPress={() => {
              console.log('Setting hardcoded test plan');
              const hardcodedPlan = {
                weekPlan: {
                  "Day 1": {
                    type: "workout",
                    exercises: [
                      { name: "Push-ups", sets: 3, reps: 10, type: "strength" },
                      { name: "Squats", sets: 3, reps: 12, type: "strength" },
                      { name: "Plank", sets: 3, reps: 30, type: "strength" }
                    ],
                    notes: "Focus on form and technique"
                  },
                  "Day 2": {
                    type: "rest",
                    notes: "Rest and recovery day"
                  },
                  "Day 3": {
                    type: "workout",
                    exercises: [
                      { name: "Lunges", sets: 3, reps: 10, type: "strength" },
                      { name: "Mountain Climbers", sets: 3, reps: 20, type: "cardio" },
                      { name: "Burpees", sets: 3, reps: 10, type: "cardio" }
                    ],
                    notes: "Mix of strength and cardio"
                  }
                },
                metadata: {
                  goal: "strength",
                  experience: "beginner",
                  location: "home",
                  daysPerWeek: 3,
                  equipment: ["bodyweight"]
                }
              };
              setPlan(hardcodedPlan);
            }}
          >
            <Text style={styles.retryButtonText}>Show Test Plan</Text>
          </TouchableOpacity>
          
          {/* Debug info for troubleshooting */}
          {__DEV__ && (
            <View style={{ marginTop: 20, padding: 10, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Debug Info:</Text>
              <Text style={{ fontSize: 10, color: '#666' }}>Plan: {JSON.stringify(plan, null, 2)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Ensure we have valid weekPlan data
  const weekPlanEntries = Object.entries(plan.weekPlan || {});
  console.log('WeekPlanEntries:', weekPlanEntries);
  console.log('WeekPlanEntries length:', weekPlanEntries.length);
  console.log('Plan.weekPlan:', plan.weekPlan);
  console.log('Plan.weekPlan keys:', plan.weekPlan ? Object.keys(plan.weekPlan) : 'No weekPlan');
  
  if (weekPlanEntries.length === 0) {
    return (
      <View style={styles.container}>
        <DebugInfo />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid workout plan format.</Text>
          <Text style={styles.errorSubText}>The plan data is not in the expected format.</Text>
          <Text style={styles.errorSubText}>WeekPlan entries: {weekPlanEntries.length}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
          
          {/* Debug info for troubleshooting */}
          {__DEV__ && (
            <View style={{ marginTop: 20, padding: 10, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Debug Info:</Text>
              <Text style={{ fontSize: 10, color: '#666' }}>Plan: {JSON.stringify(plan, null, 2)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DebugInfo />
      <ScrollView style={styles.scrollView}>
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
          {weekPlanEntries.map(([dayKey, day], index) => {
            console.log(`Rendering day ${index}:`, dayKey, day);
            return renderDayCard(day, index);
          })}
          
          {/* Test rendering if no cards are shown */}
          {weekPlanEntries.length === 0 && (
            <View style={styles.planContainer}>
              <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
                No workout cards found. Rendering test cards...
              </Text>
              {renderDayCard({
                type: "workout",
                exercises: [
                  { name: "Test Push-ups", sets: 3, reps: 10, type: "strength" },
                  { name: "Test Squats", sets: 3, reps: 12, type: "strength" }
                ],
                notes: "Test workout day"
              }, 0)}
              {renderDayCard({
                type: "rest",
                notes: "Test rest day"
              }, 1)}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Start Your Journey</Text>
        </TouchableOpacity>
        
        {/* Test button for debugging */}
        {__DEV__ && (
          <TouchableOpacity 
            style={[styles.button, { marginTop: 10, backgroundColor: '#FF6B6B' }]}
            onPress={() => {
              console.log('Test button pressed');
              handleComplete();
            }}
          >
            <Text style={styles.buttonText}>Test Complete Onboarding</Text>
          </TouchableOpacity>
        )}
        
        {/* Direct test plan button */}
        {__DEV__ && (
          <TouchableOpacity 
            style={[styles.button, { marginTop: 10, backgroundColor: '#28a745' }]}
            onPress={() => {
              console.log('Setting direct test plan');
              const directTestPlan = {
                weekPlan: {
                  "Day 1": {
                    type: "workout",
                    exercises: [
                      { name: "Push-ups", sets: 3, reps: 10, type: "strength" },
                      { name: "Squats", sets: 3, reps: 12, type: "strength" },
                      { name: "Plank", sets: 3, reps: 30, type: "strength" }
                    ],
                    notes: "Focus on form and technique"
                  },
                  "Day 2": {
                    type: "rest",
                    notes: "Rest and recovery day"
                  },
                  "Day 3": {
                    type: "workout",
                    exercises: [
                      { name: "Lunges", sets: 3, reps: 10, type: "strength" },
                      { name: "Mountain Climbers", sets: 3, reps: 20, type: "cardio" },
                      { name: "Burpees", sets: 3, reps: 10, type: "cardio" }
                    ],
                    notes: "Mix of strength and cardio"
                  }
                },
                metadata: {
                  goal: "strength",
                  experience: "beginner",
                  location: "home",
                  daysPerWeek: 3,
                  equipment: ["bodyweight"]
                }
              };
              setPlan(directTestPlan);
              console.log('Direct test plan set:', directTestPlan);
            }}
          >
            <Text style={styles.buttonText}>Set Direct Test Plan</Text>
          </TouchableOpacity>
        )}
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
    paddingTop: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 10,
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