import { db } from './firebase';
import { uploadToSupabase, deleteFromSupabase, generateFilePath, STORAGE_BUCKETS, extractFilePathFromUrl } from './supabase';
import { smartOptimize } from './image-optimization';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Hybrid Data Service
 * Manages user metadata in Firestore and images in Supabase
 */
export class HybridDataService {
  
  /**
   * Save user registration data with images
   * @param {string} userId - User ID
   * @param {Object} userData - User metadata
   * @param {Object} imageFiles - Object containing image files by category
   * @param {function} onProgress - Progress callback
   * @returns {Promise<Object>} - Saved user data with image URLs
   */
  static async saveUserWithImages(userId, userData, imageFiles = {}, onProgress = null) {
    try {
      console.log('Starting hybrid data save for user:', userId);
      
      // Step 1: Optimize and upload images to Supabase
      const imageUrls = {};
      const imageMetadata = {};
      
      const totalFiles = Object.keys(imageFiles).length;
      let completedFiles = 0;
      
      for (const [category, files] of Object.entries(imageFiles)) {
        if (!files || files.length === 0) continue;
        
        console.log(`Processing ${files.length} files for category: ${category}`);
        
        imageUrls[category] = [];
        imageMetadata[category] = [];
        
        for (const file of files) {
          try {
            // Update progress
            if (onProgress) {
              onProgress(`Optimizing ${file.name}...`, (completedFiles / totalFiles) * 50);
            }
            
            // Optimize image
            const optimizedFile = await smartOptimize(file, category);
            
            // Generate file path
            const filePath = generateFilePath(userId, category, optimizedFile.name);
            
            // Upload to Supabase
            if (onProgress) {
              onProgress(`Uploading ${file.name}...`, (completedFiles / totalFiles) * 50 + 25);
            }
            
            const bucket = this.getBucketForCategory(category);
            const publicUrl = await uploadToSupabase(optimizedFile, bucket, filePath);
            
            // Store URLs and metadata
            imageUrls[category].push(publicUrl);
            imageMetadata[category].push({
              originalName: file.name,
              optimizedName: optimizedFile.name,
              originalSize: file.size,
              optimizedSize: optimizedFile.size,
              filePath: filePath,
              bucket: bucket,
              uploadedAt: new Date().toISOString(),
              url: publicUrl
            });
            
            completedFiles++;
            
            if (onProgress) {
              onProgress(`Uploaded ${file.name}`, (completedFiles / totalFiles) * 75);
            }
            
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            // Continue with other files
          }
        }
      }
      
      // Step 2: Prepare Firestore data
      const firestoreData = {
        ...userData,
        userId,
        imageUrls,
        imageMetadata,
        storage: {
          provider: 'supabase',
          totalImages: Object.values(imageUrls).flat().length,
          lastUpdated: new Date().toISOString()
        },
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Step 3: Save to Firestore
      if (onProgress) {
        onProgress('Saving user data...', 90);
      }
      
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, firestoreData, { merge: true });
      
      console.log('User data saved successfully to Firestore');
      
      if (onProgress) {
        onProgress('Complete!', 100);
      }
      
      return firestoreData;
      
    } catch (error) {
      console.error('Hybrid data save failed:', error);
      throw error;
    }
  }
  
  /**
   * Get user data with images
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User data with image URLs
   */
  static async getUserWithImages(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      console.log('Retrieved user data with images:', userData);
      
      return userData;
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw error;
    }
  }
  
  /**
   * Update user images
   * @param {string} userId - User ID
   * @param {string} category - Image category
   * @param {File[]} newFiles - New image files
   * @param {boolean} replaceExisting - Whether to replace existing images
   * @returns {Promise<Object>} - Updated user data
   */
  static async updateUserImages(userId, category, newFiles, replaceExisting = false) {
    try {
      // Get current user data
      const userData = await this.getUserWithImages(userId);
      
      // Delete existing images if replacing
      if (replaceExisting && userData.imageMetadata?.[category]) {
        await this.deleteUserImages(userId, category);
      }
      
      // Upload new images
      const imageFiles = { [category]: newFiles };
      const updatedData = await this.saveUserWithImages(userId, userData, imageFiles);
      
      return updatedData;
    } catch (error) {
      console.error('Failed to update user images:', error);
      throw error;
    }
  }
  
  /**
   * Delete user images by category
   * @param {string} userId - User ID
   * @param {string} category - Image category to delete
   * @returns {Promise<void>}
   */
  static async deleteUserImages(userId, category) {
    try {
      const userData = await this.getUserWithImages(userId);
      const imageMetadata = userData.imageMetadata?.[category];
      
      if (!imageMetadata) {
        console.log(`No images found for category: ${category}`);
        return;
      }
      
      // Delete from Supabase
      for (const metadata of imageMetadata) {
        try {
          await deleteFromSupabase(metadata.bucket, metadata.filePath);
        } catch (error) {
          console.error(`Failed to delete ${metadata.filePath}:`, error);
        }
      }
      
      // Update Firestore
      const updateData = {
        [`imageUrls.${category}`]: [],
        [`imageMetadata.${category}`]: [],
        'storage.lastUpdated': new Date().toISOString()
      };
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updateData);
      
      console.log(`Deleted images for category: ${category}`);
    } catch (error) {
      console.error('Failed to delete user images:', error);
      throw error;
    }
  }
  
  /**
   * Search users with images
   * @param {Object} searchCriteria - Search criteria
   * @returns {Promise<Array>} - Array of users with images
   */
  static async searchUsersWithImages(searchCriteria) {
    try {
      const usersRef = collection(db, 'users');
      let q = usersRef;
      
      // Apply search criteria
      for (const [field, value] of Object.entries(searchCriteria)) {
        q = query(q, where(field, '==', value));
      }
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Found ${users.length} users matching criteria`);
      return users;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }
  
  /**
   * Get Supabase bucket for image category
   * @param {string} category - Image category
   * @returns {string} - Bucket name
   */
  static getBucketForCategory(category) {
    const categoryMapping = {
      'profile': STORAGE_BUCKETS.PROFILE_PICTURES,
      'profile-pictures': STORAGE_BUCKETS.PROFILE_PICTURES,
      'portfolio': STORAGE_BUCKETS.PORTFOLIO_PHOTOS,
      'portfolio-photos': STORAGE_BUCKETS.PORTFOLIO_PHOTOS,
      'certificates': STORAGE_BUCKETS.CERTIFICATES,
      'identity-documents': STORAGE_BUCKETS.IDENTITY_DOCUMENTS,
      'experience-proof': STORAGE_BUCKETS.EXPERIENCE_PROOF
    };
    
    return categoryMapping[category] || STORAGE_BUCKETS.PORTFOLIO_PHOTOS;
  }
  
  /**
   * Get user profile with optimized image loading
   * @param {string} userId - User ID
   * @param {Array} imageCategories - Categories of images to load
   * @returns {Promise<Object>} - User profile with selected images
   */
  static async getUserProfile(userId, imageCategories = ['profile', 'portfolio']) {
    try {
      const userData = await this.getUserWithImages(userId);
      
      // Filter images by requested categories
      const filteredImageUrls = {};
      const filteredImageMetadata = {};
      
      for (const category of imageCategories) {
        if (userData.imageUrls?.[category]) {
          filteredImageUrls[category] = userData.imageUrls[category];
          filteredImageMetadata[category] = userData.imageMetadata[category];
        }
      }
      
      return {
        ...userData,
        imageUrls: filteredImageUrls,
        imageMetadata: filteredImageMetadata
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }
}