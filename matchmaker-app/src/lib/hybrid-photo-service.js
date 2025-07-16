import { STORAGE_BUCKETS } from './supabase.js';
import { createClient } from '@supabase/supabase-js';
import { db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

// Collection name for photo metadata in Firebase
const PHOTO_METADATA_COLLECTION = 'user_photos';

// Function to get service role Supabase client with proper validation
function getSupabaseServiceRole() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  
  if (supabaseUrl === 'your_supabase_project_url_here') {
    throw new Error('Please update NEXT_PUBLIC_SUPABASE_URL in your .env.local file with your actual Supabase project URL');
  }
  
  if (supabaseServiceKey === 'your_supabase_service_role_key_here') {
    throw new Error('Please update SUPABASE_SERVICE_ROLE_KEY in your .env.local file with your actual Supabase service role key');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Hybrid photo service that uploads photos to Supabase but stores metadata in Firebase
 */
export class HybridPhotoService {
  
  /**
   * Upload a photo to Supabase and store metadata in Firebase
   * @param {File} file - The photo file to upload
   * @param {string} userId - User ID
   * @param {string} photoType - Type of photo (profile, portfolio, etc.)
   * @param {Object} metadata - Additional metadata
   * @param {function} onProgress - Progress callback
   * @returns {Promise<Object>} - Photo metadata with Supabase URL
   */
  static async uploadPhoto(file, userId, photoType = 'profile', metadata = {}, onProgress = null) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (validation.errors.length > 0) {
        throw new Error(validation.errors.join(', '));
      }

      // Create file path for Supabase
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const supabasePath = `${userId}/${photoType}/${fileName}`;
      
      // Determine which bucket to use based on photo type
      const bucket = photoType === 'profile' ? STORAGE_BUCKETS.PROFILE_IMAGES : STORAGE_BUCKETS.PROFILE_IMAGES;
      
      // Upload to Supabase using service role (bypasses RLS)
      console.log('🔄 Uploading photo to Supabase...');
      const supabaseData = await this.uploadToSupabaseWithServiceRole(bucket, file, supabasePath, onProgress);
      
      // Get public URL from Supabase
      const supabase = getSupabaseServiceRole();
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(supabaseData.path);
      const publicUrl = urlData.publicUrl;
      
      // Prepare metadata for Firebase
      const photoMetadata = {
        userId,
        photoType,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        supabasePath: supabaseData.path,
        supabaseUrl: publicUrl,
        bucket,
        uploadedAt: serverTimestamp(),
        ...metadata
      };
      
      // Save metadata to Firebase Firestore
      console.log('🔄 Saving photo metadata to Firebase...');
      const docRef = await addDoc(collection(db, PHOTO_METADATA_COLLECTION), photoMetadata);
      
      // Return complete photo data
      const result = {
        id: docRef.id,
        url: publicUrl,
        supabasePath: supabaseData.path,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        photoType,
        uploadedAt: new Date(),
        ...metadata
      };
      
      console.log('✅ Photo uploaded successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error uploading photo:', error);
      throw error;
    }
  }

  /**
   * Get all photos for a user
   * @param {string} userId - User ID
   * @param {string} photoType - Optional photo type filter
   * @returns {Promise<Array>} - Array of photo metadata
   */
  static async getUserPhotos(userId, photoType = null) {
    try {
      let q = query(
        collection(db, PHOTO_METADATA_COLLECTION),
        where('userId', '==', userId),
        orderBy('uploadedAt', 'desc')
      );
      
      if (photoType) {
        q = query(q, where('photoType', '==', photoType));
      }
      
      const querySnapshot = await getDocs(q);
      const photos = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        photos.push({
          id: doc.id,
          url: data.supabaseUrl,
          supabasePath: data.supabasePath,
          fileName: data.fileName,
          originalName: data.originalName,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          photoType: data.photoType,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          ...data
        });
      });
      
      return photos;
    } catch (error) {
      console.error('❌ Error getting user photos:', error);
      throw error;
    }
  }

  /**
   * Upload file to Supabase using service role (bypasses RLS)
   * @param {string} bucket - Supabase bucket name
   * @param {File} file - File to upload
   * @param {string} path - Path in bucket
   * @param {function} onProgress - Progress callback
   * @returns {Promise<Object>} - Upload result
   */
  static async uploadToSupabaseWithServiceRole(bucket, file, path, onProgress = null) {
    try {
      // Simulate progress for UI consistency
      if (onProgress) {
        onProgress(0);
        setTimeout(() => onProgress(50), 100);
      }
      
      const supabase = getSupabaseServiceRole();
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
        
      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }
      
      if (onProgress) {
        onProgress(100);
      }
      
      return data;
    } catch (error) {
      console.error('Service role upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a photo from both Supabase and Firebase
   * @param {string} photoId - Photo metadata ID in Firebase
   * @param {string} supabasePath - Path to file in Supabase
   * @param {string} bucket - Supabase bucket name
   * @returns {Promise<boolean>} - Success status
   */
  static async deletePhoto(photoId, supabasePath, bucket) {
    try {
      // Delete from Supabase using service role
      console.log('🔄 Deleting photo from Supabase...');
      const supabase = getSupabaseServiceRole();
      const { error } = await supabase.storage
        .from(bucket)
        .remove([supabasePath]);
        
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Delete metadata from Firebase
      console.log('🔄 Deleting photo metadata from Firebase...');
      await deleteDoc(doc(db, PHOTO_METADATA_COLLECTION, photoId));
      
      console.log('✅ Photo deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting photo:', error);
      throw error;
    }
  }

  /**
   * Update photo metadata in Firebase
   * @param {string} photoId - Photo metadata ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} - Success status
   */
  static async updatePhotoMetadata(photoId, updates) {
    try {
      await updateDoc(doc(db, PHOTO_METADATA_COLLECTION, photoId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating photo metadata:', error);
      throw error;
    }
  }

  /**
   * Validate a file for photo upload
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  static validateFile(file) {
    const errors = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported. Please use JPG, PNG, or WebP.`);
    }
    
    if (file.size > maxSize) {
      errors.push(`File size too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export for backward compatibility
export const uploadPhoto = HybridPhotoService.uploadPhoto;
export const getUserPhotos = HybridPhotoService.getUserPhotos;
export const deletePhoto = HybridPhotoService.deletePhoto;
export const updatePhotoMetadata = HybridPhotoService.updatePhotoMetadata;
export const validateFile = HybridPhotoService.validateFile;