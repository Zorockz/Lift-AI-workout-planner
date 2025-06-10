import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [currentDay, setCurrentDay] = useState(1);

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

  return (
    <WorkoutContext.Provider value={{
      workoutPlan,
      setWorkoutPlan,
      currentDay,
      setCurrentDay,
      getTodaysWorkout,
      toggleExerciseCompletion,
      isExerciseCompleted
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}; 