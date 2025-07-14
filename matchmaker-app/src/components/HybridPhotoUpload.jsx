import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadToSupabase, generateFilePath, STORAGE_BUCKETS } from '../lib/supabase';
import { smartOptimize } from '../lib/image-optimization';

const HybridPhotoUpload = ({
  label,
  description,
  category = 'portfolio', // 'profile', 'portfolio', 'certificates', etc.
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  required = false,
  photos = [],
  onChange,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Get the appropriate Supabase bucket for this category
  const getBucket = () => {
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
  };

  const validateFile = (file) => {
    const errors = [];
    
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported. Please use JPG, PNG, or WebP.`);
    }
    
    if (file.size > maxFileSize) {
      errors.push(`File size too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
    }
    
    return errors;
  };

  const uploadToSupabaseStorage = async (file, index) => {
    try {
      // Check authentication
      if (!user || !user.uid) {
        throw new Error('You must be logged in to upload photos');
      }

      console.log('Starting hybrid upload:', {
        fileName: file.name,
        fileSize: file.size,
        category: category,
        userId: user.uid
      });

      // Step 1: Optimize image
      setUploadStatus(`Optimizing ${file.name}...`);
      setUploadProgress(prev => ({ ...prev, [index]: 10 }));
      
      const optimizedFile = await smartOptimize(file, category);
      const sizeSaved = file.size - optimizedFile.size;
      const percentSaved = Math.round((sizeSaved / file.size) * 100);

      console.log('Image optimization completed:', {
        originalSize: file.size,
        optimizedSize: optimizedFile.size,
        percentSaved: percentSaved
      });

      // Step 2: Generate file path
      const filePath = generateFilePath(user.uid, category, optimizedFile.name);
      const bucket = getBucket();

      // Step 3: Upload to Supabase
      setUploadStatus(`Uploading ${file.name}...`);
      setUploadProgress(prev => ({ ...prev, [index]: 30 }));

      const publicUrl = await uploadToSupabase(optimizedFile, bucket, filePath);

      setUploadProgress(prev => ({ ...prev, [index]: 100 }));
      setUploadStatus('');

      console.log('Upload completed successfully:', publicUrl);

      // Return comprehensive metadata
      return {
        id: Date.now() + index,
        originalName: file.name,
        optimizedName: optimizedFile.name,
        originalSize: file.size,
        optimizedSize: optimizedFile.size,
        filePath: filePath,
        bucket: bucket,
        category: category,
        uploadedAt: new Date().toISOString(),
        url: publicUrl,
        sizeSaved: sizeSaved,
        percentSaved: percentSaved
      };

    } catch (error) {
      console.error('Hybrid upload error:', {
        error: error.message,
        fileName: file.name,
        category: category,
        userId: user?.uid
      });

      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
      setUploadStatus('');
      
      // Show user-friendly error message
      alert(`Failed to upload ${file.name}: ${error.message}`);
      throw error;
    }
  };

  const handleFileUpload = async (files) => {
    const fileList = Array.from(files);
    
    // Validate files
    const validFiles = [];
    const errors = [];
    
    fileList.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });
    
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
      return;
    }
    
    // Check file count limit
    if (photos.length + validFiles.length > maxFiles) {
      alert(`Cannot upload more than ${maxFiles} file(s). Please remove some existing photos first.`);
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadPromises = validFiles.map((file, index) => 
        uploadToSupabaseStorage(file, index)
      );
      
      const uploadedPhotos = await Promise.all(uploadPromises);
      const newPhotos = [...photos, ...uploadedPhotos];
      
      // Call parent component's onChange
      if (onChange) {
        onChange(newPhotos);
      }
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear progress
      setUploadProgress({});
      
      // Show success message
      const totalSaved = uploadedPhotos.reduce((acc, photo) => acc + photo.sizeSaved, 0);
      const avgPercentSaved = Math.round(
        uploadedPhotos.reduce((acc, photo) => acc + photo.percentSaved, 0) / uploadedPhotos.length
      );
      
      alert(
        `✅ Successfully uploaded ${validFiles.length} file(s)!\n` +
        `💾 Space saved: ${Math.round(totalSaved / 1024)}KB (${avgPercentSaved}% smaller)\n` +
        `☁️ Stored in Supabase Storage`
      );
      
    } catch (error) {
      console.error('Batch upload failed:', error);
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const removePhoto = (photoId) => {
    const newPhotos = photos.filter(photo => photo.id !== photoId);
    if (onChange) {
      onChange(newPhotos);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        <p className="mt-1 text-xs text-blue-600">
          📦 Images stored in Supabase • 🔄 Auto-optimized for cost savings
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-2">
          <div className="text-gray-600">
            {uploading ? (
              <div className="space-y-2">
                <div className="text-blue-600">📤 Uploading to Supabase...</div>
                {uploadStatus && (
                  <div className="text-sm text-gray-500">{uploadStatus}</div>
                )}
              </div>
            ) : (
              <>
                <div className="text-lg">📸 Click or drag photos here</div>
                <div className="text-sm">
                  Up to {maxFiles} files • Max {Math.round(maxFileSize / 1024 / 1024)}MB each
                </div>
                <div className="text-xs text-green-600">
                  ✨ Images will be automatically optimized to save storage costs
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <div key={index} className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Photos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.originalName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Photo Info Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
              
              {/* Photo Metadata */}
              <div className="mt-1 text-xs text-gray-500">
                <div className="truncate">{photo.originalName}</div>
                {photo.percentSaved && (
                  <div className="text-green-600">
                    💾 {photo.percentSaved}% smaller
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photos Count */}
      <div className="text-sm text-gray-500 text-center">
        {photos.length} / {maxFiles} photos uploaded
        {photos.length > 0 && (
          <span className="ml-2 text-blue-600">
            (Stored in Supabase - 90% cheaper than Firebase! 💰)
          </span>
        )}
      </div>
    </div>
  );
};

export default HybridPhotoUpload;