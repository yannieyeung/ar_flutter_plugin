import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The storage path
 * @param {function} onProgress - Progress callback function
 * @returns {Promise<string>} - Download URL of the uploaded file
 */
export const uploadFile = async (file, path, onProgress = null) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const fullPath = `${path}/${fileName}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, fullPath);
    
    // Start the upload task
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress callback
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => {
          // Error callback
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          // Success callback
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload setup error:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} url - The download URL or full path of the file
 * @returns {Promise<void>}
 */
export const deleteFile = async (url) => {
  try {
    // Extract the path from the URL if it's a download URL
    let path;
    if (url.includes('firebasestorage.googleapis.com')) {
      // Extract path from download URL
      const decodedUrl = decodeURIComponent(url);
      const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        path = pathMatch[1];
      }
    } else {
      // Assume it's already a path
      path = url;
    }
    
    if (!path) {
      throw new Error('Could not extract file path from URL');
    }
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} path - The storage path
 * @param {function} onProgress - Progress callback function (receives file index and progress)
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleFiles = async (files, path, onProgress = null) => {
  const uploadPromises = files.map((file, index) => {
    return uploadFile(file, path, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    });
  });
  
  return Promise.all(uploadPromises);
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {string[]} - Array of error messages
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxFileNameLength = 100
  } = options;
  
  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check file name length
  if (file.name.length > maxFileNameLength) {
    errors.push(`File name too long. Maximum length is ${maxFileNameLength} characters.`);
  }
  
  return errors;
};

/**
 * Get file metadata from Firebase Storage
 * @param {string} url - The download URL of the file
 * @returns {Promise<Object>} - File metadata
 */
export const getFileMetadata = async (url) => {
  try {
    // Extract path from URL
    const decodedUrl = decodeURIComponent(url);
    const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
    if (!pathMatch) {
      throw new Error('Could not extract file path from URL');
    }
    
    const path = pathMatch[1];
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    
    return metadata;
  } catch (error) {
    console.error('Get metadata error:', error);
    throw error;
  }
};

/**
 * Create a storage path for user files
 * @param {string} userId - User ID
 * @param {string} category - File category (e.g., 'profile', 'portfolio')
 * @returns {string} - Storage path
 */
export const createUserStoragePath = (userId, category) => {
  return `users/${userId}/${category}`;
};

/**
 * Storage paths for different file types
 */
export const STORAGE_PATHS = {
  PROFILE_PICTURES: 'profile-pictures',
  PORTFOLIO_PHOTOS: 'portfolio-photos',
  CERTIFICATES: 'certificates',
  IDENTITY_DOCUMENTS: 'identity-documents',
  EXPERIENCE_PROOF: 'experience-proof',
  JOB_PHOTOS: 'job-photos'
};

/**
 * File validation presets
 */
export const FILE_VALIDATION_PRESETS = {
  PHOTOS: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileNameLength: 100
  },
  DOCUMENTS: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFileNameLength: 150
  }
};