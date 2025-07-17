import React from 'react';
import { useUserPhotos } from '../hooks/useUserPhotos';

const UserPhotoGallery = ({ userId, photoType = null, title = "Photos" }) => {
  const { photos, loading, error } = useUserPhotos(photoType);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading photos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading photos: {error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600">{`No ${title.toLowerCase()} uploaded yet`}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title} ({photos.length})</h3>
      
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
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end">
              <div className="p-3 text-white text-sm">
                <p className="font-medium truncate">{photo.originalName}</p>
                <p className="text-xs opacity-80">
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPhotoGallery;