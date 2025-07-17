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

// Client-side user operations
export class ClientUserService {
  static async getUser(uid) {
    try {
      console.log('🔍 ClientUserService: Fetching user data for UID:', uid);
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      console.log('📋 ClientUserService: Document exists?', userSnap.exists());
      
      if (!userSnap.exists()) {
        console.log('❌ ClientUserService: User document not found for UID:', uid);
        return null;
      }
      
      const userData = userSnap.data();
      console.log('📄 ClientUserService: Raw user data from Firestore:', userData);
      
      // Convert Firestore timestamps to Date objects
      userData.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
      userData.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
      if (userData.lastLoginAt) {
        userData.lastLoginAt = new Date(userData.lastLoginAt);
      }
      
      console.log('✅ ClientUserService: Processed user data:', userData);
      return userData;
    } catch (error) {
      console.error('❌ ClientUserService: Error fetching user:', error);
      return null;
    }
  }

  static async updateUser(uid, updateData) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    
    // Remove undefined values to prevent Firestore errors
    const cleanedData = removeUndefinedValues({
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    
    await updateDoc(userRef, cleanedData);
  }
}