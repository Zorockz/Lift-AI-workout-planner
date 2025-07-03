import { getAuthInstance } from '../config/firebase';
import { getAuth, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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

  static async deleteCurrentUser() {
    try {
      const auth = this.getFirebaseAuth();
      const user = auth ? auth.currentUser : null;
      if (!user) throw new Error('No user is currently signed in.');
      // Delete user Firestore document if exists
      if (user.uid) {
        try {
          await deleteDoc(doc(db, 'users', user.uid));
        } catch (e) {
          // Ignore if doc doesn't exist or can't be deleted
        }
      }
      await deleteUser(user);
    } catch (error) {
      throw error;
    }
  }
} 