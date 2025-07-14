import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILE_PICTURES: 'profile-pictures',
  PORTFOLIO_PHOTOS: 'portfolio-photos', 
  CERTIFICATES: 'certificates',
  IDENTITY_DOCUMENTS: 'identity-documents',
  EXPERIENCE_PROOF: 'experience-proof'
};

/**
 * Upload file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - File path in storage
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadToSupabase = async (file, bucket, filePath, onProgress = null) => {
  try {
    console.log(`Uploading to Supabase: ${bucket}/${filePath}`);
    
    // Create bucket if it doesn't exist
    await createBucketIfNotExists(bucket);
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Replace if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload to Supabase failed:', error);
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - File path in storage
 * @returns {Promise<void>}
 */
export const deleteFromSupabase = async (bucket, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    console.log(`File deleted: ${bucket}/${filePath}`);
  } catch (error) {
    console.error('Delete from Supabase failed:', error);
    throw error;
  }
};

/**
 * Create storage bucket if it doesn't exist
 * @param {string} bucketName - Name of the bucket
 */
const createBucketIfNotExists = async (bucketName) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (error && !error.message.includes('already exists')) {
        console.error('Bucket creation error:', error);
      } else {
        console.log(`Bucket created successfully: ${bucketName}`);
      }
    }
  } catch (error) {
    console.warn('Bucket check/creation warning:', error);
    // Don't throw - bucket might already exist
  }
};

/**
 * Generate user-specific file path
 * @param {string} userId - User ID
 * @param {string} category - File category
 * @param {string} fileName - Original file name
 * @returns {string} - Formatted file path
 */
export const generateFilePath = (userId, category, fileName) => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${category}/${timestamp}_${sanitizedFileName}`;
};

/**
 * Extract file path from Supabase URL for deletion
 * @param {string} url - Supabase public URL
 * @returns {string} - File path
 */
export const extractFilePathFromUrl = (url) => {
  try {
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length > 1) {
      const pathParts = urlParts[1].split('/');
      // Remove bucket name, keep the path
      return pathParts.slice(1).join('/');
    }
    return null;
  } catch (error) {
    console.error('Error extracting file path:', error);
    return null;
  }
};

/**
 * Test Supabase connection
 * @returns {Promise<boolean>} - Connection status
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful. Buckets:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};