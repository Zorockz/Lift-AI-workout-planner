import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, getAuthInstance } from '../config/firebase';
import { generateAndSavePlan as generatePlan } from '../utils/planGenerator';

/**
 * Gets the current user ID or returns a default path for non-authenticated users
 * @returns {Promise<string>} The user ID or default path
 */
const getUserPath = async () => {
  // Only initialize Firebase Auth when actually needed
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  // Return a default path for non-authenticated users
  return 'public';
};

/**
 * Saves the user's profile to Firestore
 * @param {Object} profile - The user's profile data
 * @returns {Promise} - Resolves when the write completes
 */
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

/**
 * Saves a workout plan to Firestore
 * @param {Array} plan - The generated workout plan
 * @returns {Promise<string>} - Resolves with the plan ID
 */
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

/**
 * Saves a workout log to Firestore
 * @param {Object} workoutLog - The workout log data
 * @returns {Promise<string>} - Resolves with the log ID
 */
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

/**
 * Generates and saves a workout plan
 * @param {Object} preferences - User preferences for plan generation
 * @returns {Promise<string>} - Resolves with the plan ID
 */
export const generateAndSavePlan = async (preferences = {}) => {
  try {
    // Use the consolidated plan generator
    const planId = await generatePlan(preferences);
    return planId;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the user's profile from Firestore
 * @returns {Promise<Object|null>} - Resolves with the profile object or null if not found
 */
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