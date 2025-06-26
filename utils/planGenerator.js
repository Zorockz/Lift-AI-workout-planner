import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, getAuthInstance } from '../config/firebase';
import exerciseDatabase from './exerciseDatabase';

/**
 * Gets workout notes based on goal and experience
 */
const getWorkoutNotes = (goal, experience) => {
  const notes = {
    strength: {
      beginner: 'Focus on form and technique. Take full rest between sets.',
      intermediate: 'Push yourself while maintaining good form. Consider supersets.',
      advanced: 'Challenge yourself with complex movements and shorter rest periods.',
    },
    cardio: {
      beginner: 'Start slow and build endurance. Stay hydrated.',
      intermediate: 'Mix high and low intensity. Monitor heart rate.',
      advanced: 'Push your limits with interval training. Focus on recovery.',
    },
    maintain: {
      beginner: 'Focus on consistency and proper form. Take your time with each exercise.',
      intermediate: 'Maintain current fitness level with balanced workouts. Stay consistent.',
      advanced: 'Keep challenging yourself while maintaining good form and technique.',
    },
  };
  
  return notes[goal][experience];
};

/**
 * Gets rest day notes based on goal and experience
 */
const getRestDayNotes = (goal, experience) => {
  const notes = {
    strength: {
      beginner: 'Focus on light stretching and mobility work.',
      intermediate: 'Active recovery - light cardio or mobility work.',
      advanced: 'Active recovery - mobility work and foam rolling.',
    },
    cardio: {
      beginner: 'Complete rest day. Focus on hydration.',
      intermediate: 'Light stretching and mobility work.',
      advanced: 'Active recovery - light cardio or mobility work.',
    },
    maintain: {
      beginner: 'Light stretching and mobility work.',
      intermediate: 'Active recovery - light cardio or mobility work.',
      advanced: 'Active recovery - mobility work and foam rolling.',
    },
  };
  
  return notes[goal][experience];
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Filters exercises based on available equipment
 */
const filterExercisesByEquipment = (exercises, equipment) => {
  if (!equipment || !Array.isArray(equipment) || equipment.length === 0) return exercises;
  
  return exercises.filter(exercise => {
    // If exercise has no equipment requirement, include it
    if (!exercise.equipment) return true;
    
    // Check if user has the required equipment
    return equipment.some(userEquipment => {
      switch (userEquipment) {
        case 'full_gym':
          return true; // Full gym has all equipment
        case 'home_gym':
          return ['bodyweight', 'dumbbells', 'home_gym'].includes(exercise.equipment);
        case 'dumbbells':
          return ['bodyweight', 'dumbbells'].includes(exercise.equipment);
        case 'bodyweight':
          return exercise.equipment === 'bodyweight';
        default:
          return false;
      }
    });
  });
};

// Helper to split high-rep exercises
function splitHighRepExercise(ex) {
  // Only split if not a duration/timed exercise or running
  if (ex.duration || /run|running/i.test(ex.name)) {
    return { ...ex, sets: 1 };
  }
  if (ex.reps > 15) {
    // Target 8-15 reps per set, max 5 sets
    const totalReps = (ex.reps || 0) * (ex.sets || 1);
    const sets = Math.min(5, Math.ceil(totalReps / 12)); // Aim for ~12 reps per set
    let reps = Math.ceil(totalReps / sets);
    reps = Math.max(8, Math.min(15, reps));
    return { ...ex, sets, reps };
  }
  return ex;
}

/**
 * Generates exercises for a specific day
 */
const generateExercisesForDay = ({ experience, goal, equipment, location, dayOfWeek }) => {
  let locationKey = location === 'gym' ? 'gym' : 'home';
  
  // Check if we have exercises for the current location
  if (!exerciseDatabase[goal] || !exerciseDatabase[goal][locationKey] || !exerciseDatabase[goal][locationKey][experience]) {
    throw new Error(`Invalid goal (${goal}), location (${location}), or experience level (${experience})`);
  }

  let exercisePool = exerciseDatabase[goal][locationKey][experience];
  let filteredExercises = filterExercisesByEquipment(exercisePool, equipment);
  
  // If no exercises found for current location, try the other location
  if (filteredExercises.length === 0) {
    const alternativeLocationKey = locationKey === 'gym' ? 'home' : 'gym';
    
    if (exerciseDatabase[goal] && exerciseDatabase[goal][alternativeLocationKey] && exerciseDatabase[goal][alternativeLocationKey][experience]) {
      exercisePool = exerciseDatabase[goal][alternativeLocationKey][experience];
      filteredExercises = filterExercisesByEquipment(exercisePool, equipment);
      locationKey = alternativeLocationKey;
    }
  }
  
  if (filteredExercises.length === 0) {
    throw new Error('No exercises available for the selected equipment');
  }

  // For strength/maintain, filter out any exercises that do not have valid sets and reps
  if (goal === 'strength' || goal === 'maintain') {
    filteredExercises = filteredExercises.filter(
      ex => Number.isFinite(Number(ex.sets)) && Number(ex.sets) > 0 && Number.isFinite(Number(ex.reps)) && Number(ex.reps) > 0
    );
  }

  // Implement muscle group rotation for strength/maintain goals
  if (goal === 'strength' || goal === 'maintain') {
    const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
    const targetMuscleGroup = muscleGroups[dayOfWeek % muscleGroups.length];
    
    // Filter exercises by target muscle group (if exercise has muscle group property)
    // For now, we'll use a simple rotation based on exercise names
    const muscleGroupExercises = {
      chest: ['press', 'push', 'bench', 'chest'],
      back: ['row', 'pull', 'lat', 'back', 'deadlift'],
      legs: ['squat', 'leg', 'lunge', 'deadlift'],
      shoulders: ['press', 'shoulder', 'overhead'],
      arms: ['curl', 'tricep', 'bicep', 'diamond'],
      core: ['plank', 'crunch', 'sit-up', 'core', 'hollow'],
    };
    
    const targetKeywords = muscleGroupExercises[targetMuscleGroup] || [];
    const muscleGroupFiltered = filteredExercises.filter(ex => 
      targetKeywords.some(keyword => 
        ex.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // If we have enough exercises for the target muscle group, use them
    if (muscleGroupFiltered.length >= 3) {
      filteredExercises = muscleGroupFiltered;
    }
    // Otherwise, use all exercises but prioritize variety
  }

  // For cardio, rotate between different types of cardio exercises
  if (goal === 'cardio') {
    const cardioTypes = ['running', 'walking', 'cycling', 'rowing', 'elliptical', 'jumping', 'climbing'];
    const targetCardioType = cardioTypes[dayOfWeek % cardioTypes.length];
    
    const cardioTypeFiltered = filteredExercises.filter(ex => 
      ex.name.toLowerCase().includes(targetCardioType.toLowerCase())
    );
    
    if (cardioTypeFiltered.length >= 2) {
      filteredExercises = cardioTypeFiltered;
    }
  }

  const numExercises = Math.min(6, Math.max(4, filteredExercises.length));
  
  // Use dayOfWeek to create different exercise selections each day
  const shuffledExercises = shuffleArray(filteredExercises);
  const startIndex = (dayOfWeek * 2) % shuffledExercises.length; // Different starting point each day
  const selectedExercises = shuffledExercises.slice(startIndex, startIndex + numExercises);
  
  // If we don't have enough exercises from the start index, wrap around
  if (selectedExercises.length < numExercises) {
    const remainingExercises = shuffledExercises.filter(ex => !selectedExercises.includes(ex));
    selectedExercises.push(...remainingExercises.slice(0, numExercises - selectedExercises.length));
  }

  // Ensure all exercises have sets/reps for strength/maintain, and duration for cardio
  return selectedExercises.map(ex => {
    const processed = splitHighRepExercise(ex);

    // Ensure only duration/timed or running exercises have sets: 1
    if ((processed.duration || /run|running/i.test(processed.name)) && processed.sets !== 1) {
      processed.sets = 1;
    }

    // Existing logic for defaults
    if ((goal === 'strength' || goal === 'maintain') && (!Number.isFinite(Number(processed.sets)) || processed.sets <= 0 || !Number.isFinite(Number(processed.reps)) || processed.reps <= 0)) {
      processed.sets = (Number.isFinite(Number(processed.sets)) && Number(processed.sets) > 0) ? processed.sets : 3;
      processed.reps = (Number.isFinite(Number(processed.reps)) && Number(processed.reps) > 0) ? processed.reps : 10;
    }
    if (goal === 'cardio' && (!Number.isFinite(Number(processed.duration)) || processed.duration <= 0)) {
      processed.duration = 20;
      processed.sets = 1;
    }
    if (Number.isFinite(Number(processed.duration)) && Number(processed.duration) > 0 && (!Number.isFinite(Number(processed.sets)) || processed.sets <= 0)) {
      processed.sets = 1;
    }
    return processed;
  });
};

/**
 * Generates a workout plan based on user profile
 */
export const generatePlan = async (profile) => {
  // Map onboarding goal to supported database goal
  const goalMap = {
    build_muscle: 'strength',
    lose_weight: 'cardio',
    improve_fitness: 'cardio',
    maintain: 'maintain',
  };
  
  const { 
    daysPerWeek = 3, 
    experience = 'beginner', 
    goal = 'strength', 
    equipment = [],
    location = 'home',
  } = profile;
  
  const mappedGoal = goalMap[goal] || goal;

  // Generate dates for exactly 7 days starting from today
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Simple workout day distribution - spread workouts evenly
  const workoutDays = Math.min(daysPerWeek, 7);
  const workoutDayIndexes = [];
  
  if (workoutDays === 7) {
    // All days are workout days
    workoutDayIndexes.push(...Array.from({ length: 7 }, (_, i) => i));
  } else if (workoutDays === 1) {
    // One workout day in the middle
    workoutDayIndexes.push(3);
  } else {
    // Distribute workouts evenly
    const step = 6 / (workoutDays - 1);
    for (let i = 0; i < workoutDays; i++) {
      workoutDayIndexes.push(Math.round(i * step));
    }
  }

  const workoutDaySet = new Set(workoutDayIndexes);

  // Generate the plan for exactly 7 days
  const weekPlan = {};
  
  for (let i = 0; i < 7; i++) {
    const dayKey = `Day ${i + 1}`;
    const date = dates[i];
    const isWorkoutDay = workoutDaySet.has(i);

    if (!isWorkoutDay) {
      weekPlan[dayKey] = {
        date,
        type: 'rest',
        notes: getRestDayNotes(mappedGoal, experience),
      };
    } else {
      try {
        const exercises = generateExercisesForDay({
          experience,
          goal: mappedGoal,
          equipment,
          location,
          dayOfWeek: i,
        });
        
        weekPlan[dayKey] = {
          date,
          type: 'workout',
          exercises,
          notes: getWorkoutNotes(mappedGoal, experience),
        };
      } catch (error) {
        // Fallback to rest day if exercise generation fails
        weekPlan[dayKey] = {
          date,
          type: 'rest',
          notes: 'Rest day due to exercise generation error',
        };
      }
    }
  }

  // Enforce exercise variety: no exercise (by name) more than twice per week for all goals
  const exerciseCount = {};
  const allDays = Object.keys(weekPlan);
  for (const dayKey of allDays) {
    const day = weekPlan[dayKey];
    if (day.type === 'workout' && Array.isArray(day.exercises)) {
      day.exercises = day.exercises.filter(ex => {
        const nameKey = ex.name.toLowerCase();
        if (!exerciseCount[nameKey]) exerciseCount[nameKey] = 0;
        if (exerciseCount[nameKey] < 2) {
          exerciseCount[nameKey]++;
          return true;
        }
        return false;
      });
      // For all goals, try to fill with unique exercises if any removed
      if (day.exercises.length < 4) {
        // Collect all possible unique exercises not used more than once
        const usedNames = new Set(Object.keys(exerciseCount).filter(k => exerciseCount[k] > 0));
        const allPossible = [];
        for (const loc of ['gym', 'home']) {
          for (const lvl of ['beginner', 'intermediate', 'advanced']) {
            if (exerciseDatabase[mappedGoal] && exerciseDatabase[mappedGoal][loc] && exerciseDatabase[mappedGoal][loc][lvl]) {
              allPossible.push(...exerciseDatabase[mappedGoal][loc][lvl]);
            }
          }
        }
        const uniqueExtras = allPossible.filter(ex => !usedNames.has(ex.name.toLowerCase()));
        let i = 0;
        while (day.exercises.length < 4 && i < uniqueExtras.length) {
          day.exercises.push(uniqueExtras[i]);
          exerciseCount[uniqueExtras[i].name.toLowerCase()] = 1;
          i++;
        }
      }
    }
  }

  const plan = {
    weekPlan,
    metadata: {
      experience,
      goal: mappedGoal,
      daysPerWeek: workoutDays,
      equipment,
      location,
      generatedAt: new Date().toISOString(),
    },
  };

  return plan;
};

/**
 * Saves a workout plan to Firestore
 */
const savePlan = async (plan) => {
  try {
    // Only initialize Firebase Auth when actually saving
    const auth = getAuthInstance();
    const planId = Date.now().toString();
    const plansRef = collection(db, 'plans');
    const planDoc = doc(plansRef, planId);
    
    const planData = {
      plan,
      createdAt: serverTimestamp(),
      status: 'active',
      userId: auth.currentUser?.uid || 'anonymous',
      isPublic: true,
    };

    await setDoc(planDoc, planData);
    return planId;
  } catch (error) {
    if (error.code === 'permission-denied') {
      try {
        const publicPlansRef = collection(db, 'publicPlans');
        const publicPlanDoc = doc(publicPlansRef, planId);
        await setDoc(publicPlanDoc, {
          plan,
          createdAt: serverTimestamp(),
          status: 'active',
          isPublic: true,
        });
        return planId;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
};

/**
 * Main function to generate and save a workout plan
 */
export const generateAndSavePlan = async (preferences = {}) => {
  try {
    // Validate and set defaults for preferences
    const validatedPreferences = {
      daysPerWeek: preferences.daysPerWeek || 3,
      experience: preferences.experience || 'beginner',
      goal: preferences.goal || 'strength',
      equipment: preferences.equipment || [],
      location: preferences.location || 'home',
    };

    // Generate the plan
    const plan = await generatePlan(validatedPreferences);
    
    if (!plan) {
      throw new Error('Failed to generate workout plan');
    }

    // Save the plan (Firebase Auth will be initialized here if needed)
    const planId = await savePlan(plan);
    return planId;
  } catch (error) {
    throw error;
  }
}; 