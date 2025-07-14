import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, validateFile, createUserStoragePath, STORAGE_PATHS } from '../lib/storage';

const PhotoUpload = ({
  label,
  description,
  maxFiles = 1,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  required = false,
  photos = [],
  onChange,
  uploadPath = 'helper-photos', // Firebase Storage path
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const validateFileHelper = (file) => {
    const errors = [];
    
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported. Please use JPG, PNG, or WebP.`);
    }
    
    if (file.size > maxFileSize) {
      errors.push(`File size too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
    }
    
    return errors;
  };

  const uploadToFirebase = async (file, index) => {
    try {
      // Create user-specific storage path
      const userPath = user ? createUserStoragePath(user.uid, uploadPath) : uploadPath;
      
      // Upload file to Firebase Storage
      const downloadURL = await uploadFile(file, userPath, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [index]: Math.round(progress)
        }));
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (files) => {
    const fileList = Array.from(files);
    
    // Validate files
    const validFiles = [];
    const errors = [];
    
    fileList.forEach(file => {
      const fileErrors = validateFileHelper(file);
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
    
    // Check if we exceed max files
    if (photos.length + validFiles.length > maxFiles) {
      alert(`Cannot upload more than ${maxFiles} file(s). Please remove some existing photos first.`);
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const url = await uploadToFirebase(file, index);
        return {
          id: Date.now() + index,
          name: file.name,
          url: url,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
      });
      
      const uploadedPhotos = await Promise.all(uploadPromises);
      const newPhotos = [...photos, ...uploadedPhotos];
      onChange(newPhotos);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    onChange(newPhotos);
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
      {/* Label and Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mb-3">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400 cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
            {' or drag and drop'}
          </div>
          
          <p className="text-xs text-gray-500">
            {acceptedTypes.join(', ').toUpperCase()} up to {Math.round(maxFileSize / 1024 / 1024)}MB
            {maxFiles > 1 && ` (max ${maxFiles} files)`}
          </p>
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading file {parseInt(index) + 1}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Photos */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Photos ({photos.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
                
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {photo.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(photo.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        {maxFiles > 1 ? `You can upload up to ${maxFiles} photos.` : 'You can upload 1 photo.'}
        {' '}Supported formats: JPG, PNG, WebP. Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB.
      </div>
    </div>
  );
};

export default PhotoUpload;