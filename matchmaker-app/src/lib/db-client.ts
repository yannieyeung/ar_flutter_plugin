import { db } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '@/types/user';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYERS: 'employers',
  AGENCIES: 'agencies',
  HELPERS: 'helpers',
} as const;

// Client-side user operations
export class ClientUserService {
  static async getUser(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return null;
      
      const userData = userSnap.data() as User;
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

  static async updateUser(uid: string, updateData: Partial<User>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  }
}