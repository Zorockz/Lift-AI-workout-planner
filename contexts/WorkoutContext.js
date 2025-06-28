import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExerciseDetails } from '../services/appService';
import { generatePlan } from '../utils/planGenerator';

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
      }
    };

    saveCompletedExercises();
  }, [completedExercises]);

  const createWorkoutPlan = async (userPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generatePlan(userPreferences);
      setWorkoutPlan(plan);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseInstructions = async (exerciseName) => {
    try {
      const instructions = await getExerciseDetails(exerciseName);
      return instructions;
    } catch (error) {
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
      isRestDay: !Array.isArray(workout),
    };
  };

  // Add a custom exercise to a specific day (dayIndex: 0-based, exercise: {id, name, sets, reps})
  const addExercise = (dayIndex, exercise) => {
    setWorkoutPlan(prevPlan => {
      if (!prevPlan || !prevPlan.weekPlan) return prevPlan;
      const dayKey = `Day ${dayIndex + 1}`;
      const updatedPlan = { ...prevPlan };
      // Always initialize as a workout day with an empty exercises array if needed
      if (!updatedPlan.weekPlan[dayKey] || !Array.isArray(updatedPlan.weekPlan[dayKey].exercises)) {
        updatedPlan.weekPlan[dayKey] = {
          ...(updatedPlan.weekPlan[dayKey] || {}),
          type: 'workout',
          exercises: [],
        };
      }
      updatedPlan.weekPlan[dayKey] = {
        ...updatedPlan.weekPlan[dayKey],
        exercises: [
          ...(updatedPlan.weekPlan[dayKey].exercises || []),
          exercise,
        ],
      };
      return { ...updatedPlan };
    });
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
      error,
      addExercise,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}; 