import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';
import { generatePlan } from '../utils/planGenerator';

/**
 * Saves the user's profile to Firestore
 * @param {Object} profile - The user's profile data
 * @returns {Promise} - Resolves when the write completes
 */
export const saveUserProfile = async (profile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const userProfileRef = doc(db, 'users', user.uid, 'profile', 'data');
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
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const planId = Date.now().toString();
    const userPlanRef = doc(db, 'users', user.uid, 'plans', planId);
    
    await setDoc(userPlanRef, {
      plan,
      createdAt: new Date().toISOString(),
      status: 'active'
    });

    return planId;
  } catch (error) {
    console.error('Error saving workout plan:', error);
    throw error;
  }
};

/**
 * Generates and saves a workout plan based on user profile
 * @param {Object} profile - The user's profile data
 * @returns {Promise<string>} - Resolves with the plan ID
 */
export const generateAndSavePlan = async (profile) => {
  try {
    // First save the profile
    await saveUserProfile(profile);
    
    // Generate the plan
    const plan = await generatePlan(profile);
    
    // Save the generated plan
    const planId = await saveUserPlan(plan);
    
    return planId;
  } catch (error) {
    console.error('Error in generateAndSavePlan:', error);
    throw error;
  }
}; 