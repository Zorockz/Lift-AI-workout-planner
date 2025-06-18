import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { generatePlan } from '../../utils/planGenerator';

const PlanGenerationScreen = () => {
  const navigation = useNavigation();
  const { onboarding, setGeneratedPlan } = useOnboarding();
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateAndSavePlan = async () => {
      try {
        setIsGenerating(true);
        console.log('Starting plan generation...');
        console.log('Onboarding data:', onboarding);
        console.log('Onboarding keys:', Object.keys(onboarding));
        
        // Check if we have the required data
        console.log('Required data check:', {
          goal: onboarding.goal,
          experienceLevel: onboarding.experienceLevel,
          exerciseLocation: onboarding.exerciseLocation,
          equipment: onboarding.equipment,
          workoutsPerWeek: onboarding.workoutsPerWeek
        });

        // For now, let's use a simple test plan to ensure the flow works
        const testPlan = {
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
            },
            "Day 4": {
              type: "rest",
              notes: "Active recovery - light stretching"
            },
            "Day 5": {
              type: "workout",
              exercises: [
                { name: "Pull-ups", sets: 3, reps: 8, type: "strength" },
                { name: "Dips", sets: 3, reps: 10, type: "strength" },
                { name: "Jump Rope", sets: 3, reps: 60, type: "cardio" }
              ],
              notes: "Upper body focus with cardio"
            },
            "Day 6": {
              type: "rest",
              notes: "Complete rest day"
            },
            "Day 7": {
              type: "workout",
              exercises: [
                { name: "Burpees", sets: 4, reps: 15, type: "cardio" },
                { name: "Mountain Climbers", sets: 4, reps: 30, type: "cardio" },
                { name: "High Knees", sets: 4, reps: 40, type: "cardio" }
              ],
              notes: "High intensity cardio day"
            }
          },
          metadata: {
            goal: onboarding.goal || "strength",
            experience: onboarding.experienceLevel || "beginner",
            location: onboarding.exerciseLocation || "home",
            daysPerWeek: onboarding.workoutsPerWeek || 3,
            equipment: onboarding.equipment || ["bodyweight"]
          }
        };

        console.log('Using test plan for now');
        console.log('Test plan structure:', {
          hasPlan: !!testPlan,
          hasWeekPlan: !!testPlan?.weekPlan,
          weekPlanKeys: testPlan?.weekPlan ? Object.keys(testPlan.weekPlan) : [],
          weekPlanLength: testPlan?.weekPlan ? Object.keys(testPlan.weekPlan).length : 0
        });
        console.log('Full test plan:', JSON.stringify(testPlan, null, 2));

        // Save the test plan in the onboarding context
        await setGeneratedPlan(testPlan);
        console.log('Test plan saved to onboarding context');

        // Navigate to plan preview with the test plan data
        console.log('Navigating to PlanPreview with test plan data');
        console.log('Plan being passed to navigation:', {
          plan: testPlan,
          planId: 'test-' + Date.now().toString()
        });
        
        navigation.navigate('PlanPreview', { 
          plan: testPlan,
          planId: 'test-' + Date.now().toString()
        });
        
        console.log('Navigation to PlanPreview completed');
        
      } catch (err) {
        console.error('Error in plan generation:', err);
        setError('Failed to generate plan: ' + err.message);
      } finally {
        setIsGenerating(false);
      }
    };

    generateAndSavePlan();
  }, [navigation, onboarding, setGeneratedPlan]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
        
        {/* Test button for debugging */}
        <TouchableOpacity 
          style={[styles.retryButton, { marginTop: 10, backgroundColor: '#FF6B6B' }]}
          onPress={() => {
            console.log('Test navigation to PlanPreview');
            navigation.navigate('PlanPreview', { 
              plan: { 
                weekPlan: { 
                  day1: { type: 'workout', exercises: [{ name: 'Test Exercise', sets: 3, reps: 10 }] } 
                },
                metadata: { goal: 'test', experience: 'beginner', location: 'home', daysPerWeek: 3, equipment: ['dumbbells'] }
              }
            });
          }}
        >
          <Text style={styles.retryButtonText}>Test PlanPreview Navigation</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2075FF" />
      <Text style={styles.message}>Creating your personalized workout plan...</Text>
      <Text style={styles.subMessage}>This may take a moment</Text>
      
      {/* Manual test button */}
      <TouchableOpacity 
        style={[styles.retryButton, { marginTop: 30, backgroundColor: '#28a745' }]}
        onPress={() => {
          console.log('Manual test button pressed');
          const testPlan = {
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
          
          setGeneratedPlan(testPlan);
          navigation.navigate('PlanPreview', { 
            plan: testPlan,
            planId: 'manual-test-' + Date.now().toString()
          });
        }}
      >
        <Text style={styles.retryButtonText}>Manual Test - Go to PlanPreview</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2075FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanGenerationScreen; 