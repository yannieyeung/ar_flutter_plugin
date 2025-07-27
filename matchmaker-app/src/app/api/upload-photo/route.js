import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '../../../lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Create server-side Supabase client with service role
function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Storage bucket mapping
const STORAGE_BUCKETS = {
  'profile-pictures': 'profile-images',
  'portfolio-photos': 'profile-images',
  'certificates': 'profile-images',  // Changed to profile-images for image uploads
  'experience-proof': 'profile-images',  // Changed to profile-images for image uploads
  'identity-documents': 'profile-images',  // Changed to profile-images for image uploads
  'agency-profile-photos': 'profile-images',
  'agency-business-photos': 'profile-images'
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const photoType = formData.get('photoType');
    const additionalMetadata = formData.get('metadata');
    
    if (!file || !userId || !photoType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, userId, photoType' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported. Please use JPG, PNG, or WebP.` },
        { status: 400 }
      );
    }
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Maximum size is 5MB.` },
        { status: 400 }
      );
    }

    // Create file path
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const supabasePath = `${userId}/${photoType}/${fileName}`;
    const bucket = STORAGE_BUCKETS[photoType] || 'profile-images';
    
    // Upload to Supabase
    console.log('📤 Uploading to Supabase:', { 
      bucket, 
      path: supabasePath, 
      fileType: file.type, 
      fileSize: file.size 
    });
    
    const supabase = getServerSupabaseClient();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(supabasePath, file);
      
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      console.error('Upload details:', { bucket, path: supabasePath, fileType: file.type });
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);
    
    // Parse additional metadata
    let metadata = {};
    try {
      if (additionalMetadata) {
        metadata = JSON.parse(additionalMetadata);
      }
    } catch (e) {
      console.warn('Failed to parse additional metadata:', e);
    }
    
    // Save metadata to Firebase
    const photoMetadata = {
      userId,
      photoType,
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      supabasePath: uploadData.path,
      supabaseUrl: urlData.publicUrl,
      bucket,
      uploadedAt: serverTimestamp(),
      ...metadata
    };
    
    console.log('💾 Saving metadata to Firebase...');
    const docRef = await addDoc(collection(db, 'user_photos'), photoMetadata);
    
    // Return success response
    const result = {
      id: docRef.id,
      url: urlData.publicUrl,
      supabasePath: uploadData.path,
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      photoType,
      bucket,
      uploadedAt: new Date()
    };
    
    console.log('✅ Photo uploaded successfully');
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}