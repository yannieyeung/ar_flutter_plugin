import { db } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYERS: 'employers',
  AGENCIES: 'agencies',
  HELPERS: 'helpers',
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
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  }
}