/**
 * Application Constants
 * Centralized location for all app constants and configuration
 */

// App Configuration
export const APP_CONFIG = {
  NAME: 'Lifts AI',
  VERSION: '1.0.0',
  MAX_WORKOUT_HISTORY: 100,
  MAX_OFFLINE_DAYS: 7,
  AUTO_BACKUP: true,
};

// Navigation Constants
export const NAVIGATION = {
  SCREENS: {
    WELCOME: 'Welcome',
    SIGN_IN: 'SignIn',
    CREATE_ACCOUNT: 'CreateAccount',
    ACCOUNT_CREATION: 'AccountCreation',
    ONBOARDING_SUMMARY: 'OnboardingSummary',
    PLAN_PREVIEW: 'PlanPreview',
    HOME: 'Home',
    PROFILE: 'Profile',
    WORKOUT_SESSION: 'WorkoutSession',
    FULL_PLAN: 'FullPlan',
    CARDIO: 'CardioScreen',
    FLEXIBILITY: 'FlexibilityScreen',
  },
  STACKS: {
    AUTH: 'AuthStack',
    ONBOARDING: 'OnboardingStack',
    MAIN: 'MainStack',
  },
};

// Onboarding Constants
export const ONBOARDING = {
  TOTAL_STEPS: 13,
  STEPS: {
    WELCOME: 1,
    GENDER: 2,
    GOAL: 3,
    HEIGHT: 4,
    WEIGHT: 5,
    GOAL_WEIGHT: 6,
    EXPERIENCE: 7,
    STRENGTH_HISTORY: 8,
    EQUIPMENT: 9,
    SCHEDULE: 10,
    LOCATION: 11,
    TARGET_MUSCLES: 12,
    ACCOUNT_CREATION: 13,
  },
};

// Workout Types
export const WORKOUT_TYPES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  REST: 'rest',
  HIIT: 'hiit',
  ENDURANCE: 'endurance',
  RECOVERY: 'recovery',
  YOGA: 'yoga',
  PILATES: 'pilates',
  SWIMMING: 'swimming',
  CYCLING: 'cycling',
  BOXING: 'boxing',
  DANCE: 'dance',
};

// Fitness Goals
export const FITNESS_GOALS = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  MAINTAIN: 'maintain',
  HIIT: 'hiit',
  ENDURANCE: 'endurance',
  FLEXIBILITY: 'flexibility',
  WEIGHT_LOSS: 'weight_loss',
  MUSCLE_GAIN: 'muscle_gain',
};

// Experience Levels
export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Exercise Locations
export const EXERCISE_LOCATIONS = {
  GYM: 'gym',
  HOME: 'home',
  OUTDOOR: 'outdoor',
  STUDIO: 'studio',
  POOL: 'pool',
  TRACK: 'track',
};

// Storage Keys
export const STORAGE_KEYS = {
  ONBOARDING_DATA: 'onboardingData',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  ONBOARDING_IN_PROGRESS: 'onboardingInProgress',
  USER_PROFILE: 'userProfile',
  WORKOUT_PLAN: 'workoutPlan',
  LOCAL_WORKOUT_LOGS: 'localWorkoutLogs',
  IS_GUEST: 'isGuest',
  USER: 'user',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  BASE_URL: 'https://api.liftsai.com', // Updated to match new branding
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  WORKOUT_GENERATION_ERROR: 'Failed to generate workout. Please try again.',
  ONBOARDING_ERROR: 'Failed to save onboarding data. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully!',
  SIGN_IN_SUCCESS: 'Signed in successfully!',
  WORKOUT_SAVED: 'Workout saved successfully!',
  ONBOARDING_COMPLETE: 'Onboarding completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Dimensions
export const DIMENSIONS = {
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    XLARGE: 16,
  },
  PADDING: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    XLARGE: 32,
  },
  MARGIN: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    XLARGE: 32,
  },
}; 