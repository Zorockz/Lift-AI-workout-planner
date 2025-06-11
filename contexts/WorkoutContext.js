import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan, getExerciseDetails } from '../services/openaiService';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load completed exercises from AsyncStorage
  useEffect(() => {
    const loadCompletedExercises = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('completedExercises');
        if (savedExercises) {
          setCompletedExercises(JSON.parse(savedExercises));
        }
      } catch (error) {
        console.error('Error loading completed exercises:', error);
      }
    };

    loadCompletedExercises();
  }, []);

  // Save completed exercises to AsyncStorage
  useEffect(() => {
    const saveCompletedExercises = async () => {
      try {
        await AsyncStorage.setItem('completedExercises', JSON.stringify(completedExercises));
      } catch (error) {
        console.error('Error saving completed exercises:', error);
      }
    };

    saveCompletedExercises();
  }, [completedExercises]);

  const createWorkoutPlan = async (userPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateWorkoutPlan(userPreferences);
      // Parse the plan and structure it
      const structuredPlan = parseWorkoutPlan(plan);
      setWorkoutPlan(structuredPlan);
      await AsyncStorage.setItem('workoutPlan', JSON.stringify(structuredPlan));
    } catch (error) {
      setError(error.message);
      console.error('Error creating workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseInstructions = async (exerciseName) => {
    try {
      const instructions = await getExerciseDetails(exerciseName);
      return instructions;
    } catch (error) {
      console.error('Error getting exercise instructions:', error);
      throw error;
    }
  };

  const toggleExerciseCompletion = (day, exerciseIndex) => {
    setCompletedExercises(prev => {
      const dayKey = `day${day}`;
      const newCompleted = { ...prev };
      if (!newCompleted[dayKey]) {
        newCompleted[dayKey] = [];
      }
      
      const index = newCompleted[dayKey].indexOf(exerciseIndex);
      if (index === -1) {
        newCompleted[dayKey] = [...newCompleted[dayKey], exerciseIndex];
      } else {
        newCompleted[dayKey] = newCompleted[dayKey].filter(i => i !== exerciseIndex);
      }
      
      return newCompleted;
    });
  };

  const isExerciseCompleted = (day, exerciseIndex) => {
    const dayKey = `day${day}`;
    return completedExercises[dayKey]?.includes(exerciseIndex) || false;
  };

  const getTodaysWorkout = () => {
    if (!workoutPlan?.weekPlan) return null;
    
    const dayKey = `Day ${currentDay}`;
    const workout = workoutPlan.weekPlan[dayKey];
    
    if (!workout) return null;
    
    return {
      day: dayKey,
      title: Array.isArray(workout) ? 'Workout' : 'Rest Day',
      exercises: Array.isArray(workout) ? workout.map(ex => ex.name) : [],
      isRestDay: !Array.isArray(workout)
    };
  };

  // Helper function to parse the workout plan from OpenAI response
  const parseWorkoutPlan = (plan) => {
    try {
      // Assuming the plan is returned as a JSON string
      const parsedPlan = JSON.parse(plan);
      return {
        weekPlan: parsedPlan,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing workout plan:', error);
      // Return a default plan if parsing fails
      return {
        weekPlan: {
          'Day 1': [],
          'Day 2': [],
          'Day 3': [],
          'Day 4': [],
          'Day 5': [],
          'Day 6': [],
          'Day 7': []
        },
        createdAt: new Date().toISOString()
      };
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workoutPlan,
      setWorkoutPlan,
      currentDay,
      setCurrentDay,
      getTodaysWorkout,
      toggleExerciseCompletion,
      isExerciseCompleted,
      createWorkoutPlan,
      getExerciseInstructions,
      loading,
      error
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}; 