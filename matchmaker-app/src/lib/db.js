import { adminDb } from './firebase-admin';
import { db } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYERS: 'employers',
  AGENCIES: 'agencies',
  HELPERS: 'helpers',
};

// Helper function to remove undefined values recursively
const removeUndefinedValues = (obj) => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively clean nested objects
        const cleanedNested = removeUndefinedValues(obj[key]);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  return cleaned;
};

// Server-side user operations using Admin SDK
export class UserService {
  static async createUser(uid, userData) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    
    // Remove undefined values to prevent Firestore errors
    const cleanedData = removeUndefinedValues({
      ...userData,
      uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('💾 Saving user data:', cleanedData);
    await userRef.set(cleanedData);
  }

  static async getUserByUid(uid) {
    try {
      const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(uid).get();
      if (!userDoc.exists) return null;
      
      const userData = userDoc.data();
      // Convert Firestore timestamps to Date objects
      userData.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
      userData.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
      if (userData.lastLoginAt) {
        userData.lastLoginAt = new Date(userData.lastLoginAt);
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async updateUser(uid, updateData) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    
    // Remove undefined values to prevent Firestore errors
    const cleanedData = removeUndefinedValues({
      ...updateData,
      updatedAt: new Date(),
    });

    await userRef.update(cleanedData);
  }

  static async updateLastLogin(uid) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    await userRef.update({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async markRegistrationComplete(uid) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    await userRef.update({
      isRegistrationComplete: true,
      updatedAt: new Date(),
    });
  }

  // Client-side user operations
  static async getClientUser(uid) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return null;
      
      const userData = userSnap.data();
      // Convert Firestore timestamps to Date objects
      userData.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
      userData.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
      if (userData.lastLoginAt) {
        userData.lastLoginAt = new Date(userData.lastLoginAt);
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user on client:', error);
      return null;
    }
  }

  static async updateClientUser(uid, updateData) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    
    // Remove undefined values to prevent Firestore errors
    const cleanedData = removeUndefinedValues({
      ...updateData,
      updatedAt: serverTimestamp(),
    });

    await updateDoc(userRef, cleanedData);
  }
}

// Utility functions for querying users by type
export class QueryService {
  static async getUsersByType(userType, limit = 50) {
    try {
      const usersRef = adminDb.collection(COLLECTIONS.USERS);
      const snapshot = await usersRef
        .where('userType', '==', userType)
        .where('isRegistrationComplete', '==', true)
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => {
        const userData = doc.data();
        userData.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
        userData.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
        if (userData.lastLoginAt) {
          userData.lastLoginAt = new Date(userData.lastLoginAt);
        }
        return userData;
      });
    } catch (error) {
      console.error('Error querying users by type:', error);
      return [];
    }
  }

  static async getIncompleteRegistrations() {
    try {
      const usersRef = adminDb.collection(COLLECTIONS.USERS);
      const snapshot = await usersRef
        .where('isRegistrationComplete', '==', false)
        .get();
      
      return snapshot.docs.map(doc => {
        const userData = doc.data();
        userData.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
        userData.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
        if (userData.lastLoginAt) {
          userData.lastLoginAt = new Date(userData.lastLoginAt);
        }
        return userData;
      });
    } catch (error) {
      console.error('Error querying incomplete registrations:', error);
      return [];
    }
  }
}