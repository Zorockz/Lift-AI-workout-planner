import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, getAuthInstance } from '../config/firebase';
import { generateAndSavePlan as generatePlan } from '../utils/planGenerator';
import { OPENAI_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * User Service Functions
 */

const getUserPath = async () => {
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  return 'public';
};

export const saveUserProfile = async (profile) => {
  try {
    const auth = getAuthInstance();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not signed in');
    await setDoc(doc(db, 'users', uid, 'profile'), profile);
    return true;
  } catch (error) {
    throw error;
  }
};

export const saveUserPlan = async (plan) => {
  try {
    const auth = getAuthInstance();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not signed in');
    const planId = Date.now().toString();
    await setDoc(doc(db, 'users', uid, 'plans', planId), { days: plan });
    return planId;
  } catch (error) {
    throw error;
  }
};

export const saveWorkoutLog = async (workoutLog) => {
  try {
    const auth = getAuthInstance();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not signed in');
    const logId = Date.now().toString();
    await setDoc(doc(db, 'users', uid, 'logs', logId), workoutLog);
    return logId;
  } catch (error) {
    throw error;
  }
};

export const generateAndSavePlan = async (preferences = {}) => {
  try {
    const planId = await generatePlan(preferences);
    return planId;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const auth = getAuthInstance();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not signed in');
    const docRef = doc(db, 'users', uid, 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * OpenAI Service Functions
 */

export const generateWorkoutPlan = async (userPreferences) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer. Generate a 7-day workout plan based on the user\'s preferences. Return the response in JSON format with the following structure: { \'Day 1\': [array of exercises], \'Day 2\': [array of exercises], etc. }',
          },
          {
            role: 'user',
            content: `Create a workout plan with these preferences: ${JSON.stringify(userPreferences)}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate workout plan');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

export const getExerciseDetails = async (exerciseName) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer. Provide detailed instructions for exercises in a clear, concise format.',
          },
          {
            role: 'user',
            content: `Provide detailed instructions for the exercise: ${exerciseName}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get exercise details');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}; 