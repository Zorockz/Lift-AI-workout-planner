import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
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
    const userId = await getUserPath();
    
    const userProfileRef = doc(db, 'users', userId, 'profile', 'data');
    await setDoc(userProfileRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
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
      isPublic: true // All plans are public by default
    };

    await setDoc(planDoc, planData);
    return planId;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    // If there's a permission error, try saving to a different collection
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
    console.error('Error in generateAndSavePlan:', error);
    throw error;
  }
}; 