import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
  COMPANY_LOGOS: 'company-logos'
};

// Helper functions for storage
export const uploadFile = async (bucket, file, path, onProgress = null) => {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path ? `${path}/${fileName}` : fileName;
  
  // Note: Supabase doesn't provide progress callback like Firebase
  // So we'll simulate progress for UI consistency
  if (onProgress) {
    onProgress(0);
    setTimeout(() => onProgress(50), 100);
  }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);
    
  if (error) {
    console.error('Upload error:', error);
    throw error;
  }
  
  if (onProgress) {
    onProgress(100);
  }
  
  return data;
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return data.publicUrl;
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  if (error) {
    console.error('Delete error:', error);
    throw error;
  }
  
  return true;
};