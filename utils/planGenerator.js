import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, getAuthInstance } from '../config/firebase';

/**
 * Exercise database with variations based on experience level and location
 */
const exerciseDatabase = {
  strength: {
    gym: {
      beginner: [
        { name: 'Machine Chest Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Focus on form and controlled movement' },
        { name: 'Leg Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep back flat against pad' },
        { name: 'Lat Pulldown', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Pull bar to upper chest' },
        { name: 'Machine Shoulder Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep core tight' },
        { name: 'Machine Leg Extension', sets: 3, reps: 15, restTime: 45, equipment: 'full_gym', notes: 'Full range of motion' }
      ],
      intermediate: [
        { name: 'Barbell Bench Press', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Focus on chest contraction' },
        { name: 'Barbell Squats', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Keep chest up' },
        { name: 'Bent Over Rows', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Squeeze shoulder blades' },
        { name: 'Overhead Press', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full lockout at top' },
        { name: 'Romanian Deadlifts', sets: 4, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Keep back straight' }
      ],
      advanced: [
        { name: 'Deadlifts', sets: 5, reps: 5, restTime: 120, equipment: 'full_gym', notes: 'Focus on hip hinge' },
        { name: 'Front Squats', sets: 4, reps: 6, restTime: 120, equipment: 'full_gym', notes: 'Keep elbows high' },
        { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full range of motion' },
        { name: 'Incline Bench Press', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Focus on upper chest' },
        { name: 'Barbell Rows', sets: 4, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Squeeze at top' }
      ]
    },
    home: {
      beginner: [
        { name: 'Push-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Focus on form' },
        { name: 'Bodyweight Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Keep back straight' },
        { name: 'Plank', sets: 3, reps: 30, restTime: 45, equipment: 'bodyweight', notes: 'Hold position' },
        { name: 'Lunges', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Alternate legs' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 45, equipment: 'bodyweight', notes: 'Keep core tight' }
      ],
      intermediate: [
        { name: 'Diamond Push-ups', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Focus on triceps' },
        { name: 'Jump Squats', sets: 4, reps: 15, restTime: 60, equipment: 'bodyweight', notes: 'Land softly' },
        { name: 'Side Plank', sets: 3, reps: 45, restTime: 45, equipment: 'bodyweight', notes: 'Alternate sides' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Keep front knee stable' },
        { name: 'Burpees', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Full range of motion' }
      ],
      advanced: [
        { name: 'Pike Push-ups', sets: 4, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Focus on shoulders' },
        { name: 'Pistol Squats', sets: 3, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Progress gradually' },
        { name: 'Hollow Hold', sets: 3, reps: 45, restTime: 60, equipment: 'bodyweight', notes: 'Keep lower back pressed' },
        { name: 'Box Jumps', sets: 4, reps: 10, restTime: 90, equipment: 'bodyweight', notes: 'Land quietly' },
        { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Full range of motion' }
      ]
    }
  },
  cardio: {
    gym: {
      beginner: [
        { name: 'Treadmill Walking', duration: 20, intensity: 'low', equipment: 'full_gym', notes: 'Maintain steady pace' },
        { name: 'Stationary Bike', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Adjust resistance' },
        { name: 'Elliptical', duration: 15, intensity: 'medium', equipment: 'full_gym', notes: 'Full range of motion' }
      ],
      intermediate: [
        { name: 'Treadmill Running', duration: 25, intensity: 'medium', equipment: 'full_gym', notes: 'Maintain conversation pace' },
        { name: 'Rowing Machine', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Stair Master', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Keep good posture' }
      ],
      advanced: [
        { name: 'HIIT Treadmill', duration: 20, intensity: 'high', equipment: 'full_gym', notes: '30s sprint, 30s rest' },
        { name: 'Rowing Intervals', duration: 25, intensity: 'high', equipment: 'full_gym', notes: 'Alternate intensity' },
        { name: 'Stair Master HIIT', duration: 20, intensity: 'high', equipment: 'full_gym', notes: 'Vary speed and resistance' }
      ]
    },
    home: {
      beginner: [
        { name: 'Brisk Walking', duration: 20, intensity: 'low', equipment: 'bodyweight', notes: 'Maintain steady pace' },
        { name: 'Light Jogging', duration: 15, intensity: 'medium', equipment: 'bodyweight', notes: 'Alternate with walking' },
        { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30, equipment: 'bodyweight', notes: 'Land softly' }
      ],
      intermediate: [
        { name: 'Running', duration: 25, intensity: 'medium', equipment: 'bodyweight', notes: 'Maintain conversation pace' },
        { name: 'High Knees', sets: 4, reps: 40, restTime: 30, equipment: 'bodyweight', notes: 'Keep core engaged' },
        { name: 'Mountain Climbers', sets: 4, reps: 30, restTime: 30, equipment: 'bodyweight', notes: 'Alternate quickly' }
      ],
      advanced: [
        { name: 'HIIT Sprints', duration: 20, intensity: 'high', equipment: 'bodyweight', notes: '30s sprint, 30s rest' },
        { name: 'Burpees', sets: 5, reps: 15, restTime: 45, equipment: 'bodyweight', notes: 'Full range of motion' },
        { name: 'Jump Rope', duration: 15, intensity: 'high', equipment: 'bodyweight', notes: 'Alternate techniques' }
      ]
    }
  },
  maintain: {
    gym: {
      beginner: [
        { name: 'Machine Chest Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Leg Press', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Keep back flat' },
        { name: 'Treadmill Walking', duration: 20, intensity: 'low', equipment: 'full_gym', notes: 'Comfortable pace' }
      ],
      intermediate: [
        { name: 'Barbell Squats', sets: 3, reps: 10, restTime: 90, equipment: 'full_gym', notes: 'Keep form' },
        { name: 'Lat Pulldown', sets: 3, reps: 12, restTime: 60, equipment: 'full_gym', notes: 'Full range' },
        { name: 'Elliptical', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Steady pace' }
      ],
      advanced: [
        { name: 'Deadlifts', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Focus on form' },
        { name: 'Pull-ups', sets: 3, reps: 8, restTime: 90, equipment: 'full_gym', notes: 'Full range' },
        { name: 'Rowing Machine', duration: 20, intensity: 'medium', equipment: 'full_gym', notes: 'Maintain pace' }
      ]
    },
    home: {
      beginner: [
        { name: 'Push-ups', sets: 3, reps: 10, restTime: 60, equipment: 'bodyweight', notes: 'Focus on form' },
        { name: 'Bodyweight Squats', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Keep back straight' },
        { name: 'Brisk Walking', duration: 20, intensity: 'low', equipment: 'bodyweight', notes: 'Comfortable pace' }
      ],
      intermediate: [
        { name: 'Diamond Push-ups', sets: 3, reps: 12, restTime: 60, equipment: 'bodyweight', notes: 'Focus on form' },
        { name: 'Jump Squats', sets: 3, reps: 15, restTime: 60, equipment: 'bodyweight', notes: 'Land softly' },
        { name: 'Light Jogging', duration: 20, intensity: 'medium', equipment: 'bodyweight', notes: 'Steady pace' }
      ],
      advanced: [
        { name: 'Pull-ups', sets: 3, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Full range' },
        { name: 'Pistol Squats', sets: 3, reps: 8, restTime: 90, equipment: 'bodyweight', notes: 'Keep balance' },
        { name: 'Running', duration: 25, intensity: 'medium', equipment: 'bodyweight', notes: 'Maintain pace' }
      ]
    }
  }
};

/**
 * Gets workout notes based on goal and experience
 */
const getWorkoutNotes = (goal, experience) => {
  const notes = {
    strength: {
      beginner: 'Focus on form and technique. Take full rest between sets.',
      intermediate: 'Push yourself while maintaining good form. Consider supersets.',
      advanced: 'Challenge yourself with complex movements and shorter rest periods.'
    },
    cardio: {
      beginner: 'Start slow and build endurance. Stay hydrated.',
      intermediate: 'Mix high and low intensity. Monitor heart rate.',
      advanced: 'Push your limits with interval training. Focus on recovery.'
    },
    maintain: {
      beginner: 'Focus on consistency and proper form. Take your time with each exercise.',
      intermediate: 'Maintain current fitness level with balanced workouts. Stay consistent.',
      advanced: 'Keep challenging yourself while maintaining good form and technique.'
    }
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
      advanced: 'Active recovery - mobility work and foam rolling.'
    },
    cardio: {
      beginner: 'Complete rest day. Focus on hydration.',
      intermediate: 'Light stretching and mobility work.',
      advanced: 'Active recovery - light cardio or mobility work.'
    },
    maintain: {
      beginner: 'Light stretching and mobility work.',
      intermediate: 'Active recovery - light cardio or mobility work.',
      advanced: 'Active recovery - mobility work and foam rolling.'
    }
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
    console.log(`No exercises found for ${locationKey} location, trying alternative location`);
    const alternativeLocationKey = locationKey === 'gym' ? 'home' : 'gym';
    
    if (exerciseDatabase[goal] && exerciseDatabase[goal][alternativeLocationKey] && exerciseDatabase[goal][alternativeLocationKey][experience]) {
      exercisePool = exerciseDatabase[goal][alternativeLocationKey][experience];
      filteredExercises = filterExercisesByEquipment(exercisePool, equipment);
      locationKey = alternativeLocationKey;
      console.log(`Found ${filteredExercises.length} exercises for ${alternativeLocationKey} location`);
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

  const numExercises = Math.min(6, Math.max(4, filteredExercises.length));
  const selectedExercises = shuffleArray(filteredExercises).slice(0, numExercises);

  // Ensure all exercises have sets/reps for strength/maintain, and duration for cardio
  return selectedExercises.map(ex => {
    if ((goal === 'strength' || goal === 'maintain') && (!Number.isFinite(Number(ex.sets)) || Number(ex.sets) <= 0 || !Number.isFinite(Number(ex.reps)) || Number(ex.reps) <= 0)) {
      return { ...ex, sets: (Number.isFinite(Number(ex.sets)) && Number(ex.sets) > 0) ? ex.sets : 3, reps: (Number.isFinite(Number(ex.reps)) && Number(ex.reps) > 0) ? ex.reps : 10 };
    }
    if (goal === 'cardio' && (!Number.isFinite(Number(ex.duration)) || Number(ex.duration) <= 0)) {
      return { ...ex, duration: 20 };
    }
    return ex;
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
    maintain: 'maintain'
  };
  
  const { 
    daysPerWeek = 3, 
    experience = 'beginner', 
    goal = 'strength', 
    equipment = [],
    location = 'home'
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
        notes: getRestDayNotes(mappedGoal, experience)
      };
    } else {
      try {
        const exercises = generateExercisesForDay({
          experience,
          goal: mappedGoal,
          equipment,
          location,
          dayOfWeek: i
        });
        
        weekPlan[dayKey] = {
          date,
          type: 'workout',
          exercises,
          notes: getWorkoutNotes(mappedGoal, experience)
        };
      } catch (error) {
        console.error(`Error generating exercises for day ${i + 1}:`, error);
        // Fallback to rest day if exercise generation fails
        weekPlan[dayKey] = {
          date,
          type: 'rest',
          notes: 'Rest day due to exercise generation error'
        };
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
      generatedAt: new Date().toISOString()
    }
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
      isPublic: true
    };

    await setDoc(planDoc, planData);
    return planId;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    if (error.code === 'permission-denied') {
      try {
        const publicPlansRef = collection(db, 'publicPlans');
        const publicPlanDoc = doc(publicPlansRef, planId);
        await setDoc(publicPlanDoc, {
          plan,
          createdAt: serverTimestamp(),
          status: 'active',
          isPublic: true
        });
        return planId;
      } catch (fallbackError) {
        console.error('Error saving to public plans:', fallbackError);
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
    console.error('Error in generateAndSavePlan:', error);
    throw error;
  }
}; 