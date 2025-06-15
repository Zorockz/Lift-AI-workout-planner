import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan, getExerciseDetails } from '../services/openaiService';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize context
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Load workout plan
        const savedPlan = await AsyncStorage.getItem('workoutPlan');
        if (savedPlan) {
          setWorkoutPlan(JSON.parse(savedPlan));
        }

        // Load completed exercises
        const savedExercises = await AsyncStorage.getItem('completedExercises');
        if (savedExercises) {
          setCompletedExercises(JSON.parse(savedExercises));
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing WorkoutContext:', error);
        setError('Failed to load workout data');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Save workout plan to AsyncStorage
  useEffect(() => {
    const saveWorkoutPlan = async () => {
      if (!workoutPlan) return;
      try {
        await AsyncStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
      } catch (error) {
        console.error('Error saving workout plan:', error);
      }
    };

    saveWorkoutPlan();
  }, [workoutPlan]);

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
      const structuredPlan = parseWorkoutPlan(plan);
      setWorkoutPlan(structuredPlan);
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

  const parseWorkoutPlan = (plan) => {
    try {
      const parsedPlan = JSON.parse(plan);
      return {
        weekPlan: parsedPlan,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing workout plan:', error);
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

  if (!isInitialized) {
    return null;
  }

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