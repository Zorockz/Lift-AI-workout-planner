import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Exercise database with variations based on experience level
 */
const exerciseDatabase = {
  strength: {
    beginner: [
      { name: 'Push-ups', sets: 3, reps: 10, restTime: 60, notes: 'Focus on form' },
      { name: 'Bodyweight Squats', sets: 3, reps: 12, restTime: 60, notes: 'Keep back straight' },
      { name: 'Plank', sets: 3, reps: 30, restTime: 45, notes: 'Hold position' },
      { name: 'Lunges', sets: 3, reps: 10, restTime: 60, notes: 'Alternate legs' },
      { name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 45, notes: 'Keep core tight' }
    ],
    intermediate: [
      { name: 'Diamond Push-ups', sets: 4, reps: 12, restTime: 60, notes: 'Focus on triceps' },
      { name: 'Jump Squats', sets: 4, reps: 15, restTime: 60, notes: 'Land softly' },
      { name: 'Side Plank', sets: 3, reps: 45, restTime: 45, notes: 'Alternate sides' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: 12, restTime: 60, notes: 'Keep front knee stable' },
      { name: 'Burpees', sets: 3, reps: 10, restTime: 60, notes: 'Full range of motion' }
    ],
    advanced: [
      { name: 'Pike Push-ups', sets: 4, reps: 12, restTime: 60, notes: 'Focus on shoulders' },
      { name: 'Pistol Squats', sets: 3, reps: 8, restTime: 90, notes: 'Progress gradually' },
      { name: 'Hollow Hold', sets: 3, reps: 45, restTime: 60, notes: 'Keep lower back pressed' },
      { name: 'Box Jumps', sets: 4, reps: 10, restTime: 90, notes: 'Land quietly' },
      { name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, notes: 'Full range of motion' }
    ]
  },
  cardio: {
    beginner: [
      { name: 'Brisk Walking', duration: 20, intensity: 'low', notes: 'Maintain steady pace' },
      { name: 'Light Jogging', duration: 15, intensity: 'medium', notes: 'Alternate with walking' },
      { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30, notes: 'Land softly' }
    ],
    intermediate: [
      { name: 'Running', duration: 25, intensity: 'medium', notes: 'Maintain conversation pace' },
      { name: 'High Knees', sets: 4, reps: 40, restTime: 30, notes: 'Keep core engaged' },
      { name: 'Mountain Climbers', sets: 4, reps: 30, restTime: 30, notes: 'Alternate quickly' }
    ],
    advanced: [
      { name: 'HIIT Sprints', duration: 20, intensity: 'high', notes: '30s sprint, 30s rest' },
      { name: 'Burpees', sets: 5, reps: 15, restTime: 45, notes: 'Full range of motion' },
      { name: 'Jump Rope', duration: 15, intensity: 'high', notes: 'Alternate techniques' }
    ]
  },
  maintain: {
    beginner: [
      { name: 'Bodyweight Squats', sets: 3, reps: 12, restTime: 60, notes: 'Focus on form' },
      { name: 'Push-ups', sets: 3, reps: 10, restTime: 60, notes: 'Modify if needed' },
      { name: 'Plank', sets: 3, reps: 30, restTime: 45, notes: 'Hold position' },
      { name: 'Walking Lunges', sets: 3, reps: 10, restTime: 60, notes: 'Keep good posture' },
      { name: 'Brisk Walking', duration: 20, intensity: 'low', notes: 'Maintain steady pace' }
    ],
    intermediate: [
      { name: 'Push-ups', sets: 3, reps: 12, restTime: 60, notes: 'Focus on form' },
      { name: 'Squats', sets: 3, reps: 15, restTime: 60, notes: 'Keep back straight' },
      { name: 'Plank', sets: 3, reps: 45, restTime: 45, notes: 'Hold position' },
      { name: 'Lunges', sets: 3, reps: 12, restTime: 60, notes: 'Alternate legs' },
      { name: 'Light Jogging', duration: 20, intensity: 'medium', notes: 'Comfortable pace' }
    ],
    advanced: [
      { name: 'Push-ups', sets: 4, reps: 15, restTime: 60, notes: 'Focus on form' },
      { name: 'Squats', sets: 4, reps: 15, restTime: 60, notes: 'Keep back straight' },
      { name: 'Plank', sets: 3, reps: 60, restTime: 45, notes: 'Hold position' },
      { name: 'Lunges', sets: 3, reps: 15, restTime: 60, notes: 'Alternate legs' },
      { name: 'Running', duration: 25, intensity: 'medium', notes: 'Maintain pace' }
    ]
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
 * Generates exercises for a specific day
 */
const generateExercisesForDay = ({ experience, goal, equipment, dayOfWeek }) => {
  if (!exerciseDatabase[goal] || !exerciseDatabase[goal][experience]) {
    throw new Error(`Invalid goal (${goal}) or experience level (${experience})`);
  }

  const exercisePool = exerciseDatabase[goal][experience];
  const numExercises = Math.min(6, Math.max(4, exercisePool.length));
  return shuffleArray(exercisePool).slice(0, numExercises);
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
  const { daysPerWeek = 3, experience = 'beginner', goal = 'strength', equipment = [] } = profile;
  const mappedGoal = goalMap[goal] || goal;

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // Distribute workout days evenly across the week
  // E.g., if daysPerWeek=3, pick 3 workout days spread out
  const totalDays = 7;
  const workoutDays = daysPerWeek;
  // Calculate which days should be workout days (spread as evenly as possible)
  const workoutDayIndexes = Array.from({ length: workoutDays }, (_, i) =>
    Math.round(i * (totalDays - 1) / (workoutDays - 1 || 1))
  );
  const workoutDaySet = new Set(workoutDayIndexes);

  const plan = {};
  dates.forEach((date, index) => {
    const dayKey = `Day ${index + 1}`;
    const dayOfWeek = new Date(date).getDay();
    const isWorkoutDay = workoutDaySet.has(index);

    if (!isWorkoutDay) {
      plan[dayKey] = {
        date,
        type: 'rest',
        notes: 'Recovery day - focus on stretching and mobility'
      };
    } else {
      plan[dayKey] = {
        date,
        type: 'workout',
        exercises: generateExercisesForDay({
          experience,
          goal: mappedGoal,
          equipment,
          dayOfWeek
        }),
        notes: getWorkoutNotes(mappedGoal, experience)
      };
    }
  });

  return {
    weekPlan: plan,
    metadata: {
      experience,
      goal: mappedGoal,
      daysPerWeek,
      equipment,
      generatedAt: new Date().toISOString()
    }
  };
};

/**
 * Saves a workout plan to Firestore
 */
const savePlan = async (plan) => {
  try {
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
    };

    // Generate the plan
    const plan = await generatePlan(validatedPreferences);
    
    if (!plan) {
      throw new Error('Failed to generate workout plan');
    }

    // Save the plan
    const planId = await savePlan(plan);
    return planId;
  } catch (error) {
    console.error('Error in generateAndSavePlan:', error);
    throw error;
  }
}; 