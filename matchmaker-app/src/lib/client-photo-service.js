import { db } from './firebase.js';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Collection name for photo metadata in Firebase
const PHOTO_METADATA_COLLECTION = 'user_photos';

/**
 * Client-side photo service that uses API routes for uploads
 */
export class ClientPhotoService {
  
  /**
   * Upload a photo using the server-side API
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

      // Create FormData for API request
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('photoType', photoType);
      formData.append('metadata', JSON.stringify(metadata));

      // Simulate progress for UI consistency
      if (onProgress) {
        onProgress(0);
        setTimeout(() => onProgress(30), 100);
      }

      console.log('🔄 Uploading photo via API...');
      
      // Upload via API endpoint
      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });

      if (onProgress) {
        onProgress(80);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (onProgress) {
        onProgress(100);
      }

      console.log('✅ Photo uploaded successfully:', result.data);
      return result.data;
      
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
      // Create base query without orderBy to avoid composite index requirement
      let q = query(
        collection(db, PHOTO_METADATA_COLLECTION),
        where('userId', '==', userId)
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
          bucket: data.bucket,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          ...data
        });
      });
      
      // Sort by uploadedAt in JavaScript to avoid Firebase composite index
      photos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      return photos;
    } catch (error) {
      console.error('❌ Error getting user photos:', error);
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
      // For now, just delete the metadata from Firebase
      // TODO: Create API endpoint for deletion that handles Supabase cleanup
      console.log('🔄 Deleting photo metadata from Firebase...');
      await deleteDoc(doc(db, PHOTO_METADATA_COLLECTION, photoId));
      
      console.log('✅ Photo metadata deleted successfully');
      console.log('⚠️  Note: File still exists in Supabase storage (cleanup needed)');
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
export const uploadPhoto = ClientPhotoService.uploadPhoto;
export const getUserPhotos = ClientPhotoService.getUserPhotos;
export const deletePhoto = ClientPhotoService.deletePhoto;
export const updatePhotoMetadata = ClientPhotoService.updatePhotoMetadata;
export const validateFile = ClientPhotoService.validateFile;