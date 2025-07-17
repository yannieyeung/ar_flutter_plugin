import { db } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYERS: 'employers',
  AGENCIES: 'agencies',
  HELPERS: 'helpers',
  JOB_POSTINGS: 'job_postings',
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

  // Job posting operations
  static async createJobPosting(jobData) {
    try {
      console.log('🔧 ClientUserService: Creating job posting:', jobData);
      
      // Remove undefined values and add timestamps
      const cleanedJobData = removeUndefinedValues({
        ...jobData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('📋 ClientUserService: Cleaned job data:', cleanedJobData);
      
      // Add job posting to Firestore
      const jobsRef = collection(db, COLLECTIONS.JOB_POSTINGS);
      const docRef = await addDoc(jobsRef, cleanedJobData);
      
      console.log('✅ ClientUserService: Job posting created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ ClientUserService: Error creating job posting:', error);
      throw error;
    }
  }

  static async getJobPostings(filters = {}) {
    try {
      console.log('🔍 ClientUserService: Fetching job postings with filters:', filters);
      
      let q = collection(db, COLLECTIONS.JOB_POSTINGS);
      
      // Simplified query to avoid index requirements
      // Apply only one filter at a time to avoid composite index requirements
      if (filters.employerId) {
        q = query(q, where('employerId', '==', filters.employerId));
      } else if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      const querySnapshot = await getDocs(q);
      const jobPostings = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore timestamps to Date objects
        if (data.createdAt && data.createdAt.seconds) {
          data.createdAt = new Date(data.createdAt.seconds * 1000);
        } else {
          data.createdAt = new Date();
        }
        
        if (data.updatedAt && data.updatedAt.seconds) {
          data.updatedAt = new Date(data.updatedAt.seconds * 1000);
        } else {
          data.updatedAt = new Date();
        }
        
        data.postedAt = data.postedAt ? new Date(data.postedAt) : data.createdAt;
        
        jobPostings.push({
          id: doc.id,
          ...data
        });
      });
      
      // Filter in memory if both filters are provided
      let filteredJobs = jobPostings;
      if (filters.employerId && filters.status) {
        filteredJobs = jobPostings.filter(job => 
          job.employerId === filters.employerId && job.status === filters.status
        );
      }
      
      // Sort by creation date (newest first)
      filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('📋 ClientUserService: Found job postings:', filteredJobs.length);
      return filteredJobs;
    } catch (error) {
      console.error('❌ ClientUserService: Error fetching job postings:', error);
      throw error;
    }
  }

  static async getJobPosting(jobId) {
    try {
      console.log('🔍 ClientUserService: Fetching job posting with ID:', jobId);
      
      const jobRef = doc(db, COLLECTIONS.JOB_POSTINGS, jobId);
      const jobSnap = await getDoc(jobRef);
      
      if (!jobSnap.exists()) {
        console.log('❌ ClientUserService: Job posting not found for ID:', jobId);
        return null;
      }
      
      const jobData = jobSnap.data();
      // Convert Firestore timestamps to Date objects
      jobData.createdAt = jobData.createdAt ? new Date(jobData.createdAt.seconds * 1000) : new Date();
      jobData.updatedAt = jobData.updatedAt ? new Date(jobData.updatedAt.seconds * 1000) : new Date();
      jobData.postedAt = jobData.postedAt ? new Date(jobData.postedAt) : jobData.createdAt;
      
      console.log('✅ ClientUserService: Job posting found:', jobData);
      return {
        id: jobSnap.id,
        ...jobData
      };
    } catch (error) {
      console.error('❌ ClientUserService: Error fetching job posting:', error);
      throw error;
    }
  }

  static async updateJobPosting(jobId, updateData) {
    try {
      console.log('🔧 ClientUserService: Updating job posting:', jobId, updateData);
      
      const jobRef = doc(db, COLLECTIONS.JOB_POSTINGS, jobId);
      
      // Remove undefined values to prevent Firestore errors
      const cleanedData = removeUndefinedValues({
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      
      await updateDoc(jobRef, cleanedData);
      console.log('✅ ClientUserService: Job posting updated successfully');
    } catch (error) {
      console.error('❌ ClientUserService: Error updating job posting:', error);
      throw error;
    }
  }
}