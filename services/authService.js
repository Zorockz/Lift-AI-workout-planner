import { getAuthInstance } from '../config/firebase';

/**
 * Basic Authentication Service
 * Simplified version without Google/Apple authentication
 */
export class BasicAuthService {
  static getFirebaseAuth() {
    try {
      const auth = getAuthInstance();
      if (!auth) {
        return null;
      }
      return auth;
    } catch (error) {
      return null;
    }
  }

  static getCurrentUser() {
    try {
      const auth = this.getFirebaseAuth();
      return auth ? auth.currentUser : null;
    } catch (error) {
      return null;
    }
  }

  static isSignedIn() {
    try {
      const auth = this.getFirebaseAuth();
      return auth ? !!auth.currentUser : false;
    } catch (error) {
      return false;
    }
  }

  static async signOut() {
    try {
      const auth = this.getFirebaseAuth();
      if (auth) {
        await auth.signOut();
      }
    } catch (error) {
      throw error;
    }
  }
} 