import React from 'react';

export const ProfilePhotosSection = ({ 
  user, 
  isEditing, 
  allPhotos, 
  photosLoading, 
  uploadProgress, 
  deletingPhoto, 
  handlePhotoUpload, 
  handlePhotoDelete 
}) => {
  // Filter photos by type based on user type
  const getPhotosByType = (photoType) => allPhotos.filter(photo => photo.photoType === photoType);

  // Get the correct profile photo type based on user type
  const getProfilePhotoType = () => {
    if (user?.userType === 'employer') {
      return 'employer-profiles';
    } else if (user?.userType === 'agency') {
      return 'agency-profile-photos';
    }
    return 'profile-pictures';
  };

  const profilePhotos = getPhotosByType(getProfilePhotoType());
  const portfolioPhotos = getPhotosByType('portfolio-photos');
  const certificates = getPhotosByType('certificates');
  const experienceProof = getPhotosByType('experience-proof');
  const identityDocs = getPhotosByType('identity-documents');
  const agencyProfilePhotos = getPhotosByType('agency-profile-photos');
  const agencyBusinessPhotos = getPhotosByType('agency-business-photos');

  const renderPhotoGrid = (photos, title) => (
    photos.length > 0 && (
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title} ({photos.length})</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.originalName}
                className="w-full h-24 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-xs mb-2">{photo.originalName}</p>
                  {isEditing && (
                    <button
                      onClick={() => handlePhotoDelete(photo)}
                      disabled={deletingPhoto === photo.id}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingPhoto === photo.id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const getUploadButtons = () => {
    const buttons = [];
    
    // Common buttons for all user types
    buttons.push(
      <label key="profile" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e.target.files, getProfilePhotoType())}
          className="hidden"
        />
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile Photo
      </label>
    );

    // Helper-specific buttons
    if (user?.userType === 'individual_helper') {
      buttons.push(
        <label key="portfolio" className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files, 'portfolio-photos')}
            className="hidden"
          />
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Portfolio
        </label>,
        <label key="certificates" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'certificates')}
            className="hidden"
          />
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Certificate
        </label>,
        <label key="experience" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'experience-proof')}
            className="hidden"
          />
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          Experience Proof
        </label>,
        <label key="identity" className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'identity-documents')}
            className="hidden"
          />
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          ID Documents
        </label>
      );
    }

    // Agency-specific buttons
    if (user?.userType === 'agency') {
      buttons.push(
        <label key="business" className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files, 'agency-business-photos')}
            className="hidden"
          />
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Business Photos
        </label>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-8 py-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">Photos & Documents</h3>
            <p className="text-sm text-slate-500">Manage your profile photos and documents</p>
          </div>
        </div>
        
        {isEditing && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {getUploadButtons()}
            </div>
          </div>
        )}
        
        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mb-4 space-y-2">
            {Object.entries(uploadProgress).map(([key, progress]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
            ))}
          </div>
        )}
        
        {photosLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading photos...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Photos */}
            {renderPhotoGrid(profilePhotos, 'Profile Photos')}

            {/* Helper-specific photo sections */}
            {user?.userType === 'individual_helper' && (
              <>
                {renderPhotoGrid(portfolioPhotos, 'Portfolio Photos')}
                {renderPhotoGrid(certificates, 'Certificates')}
                {renderPhotoGrid(experienceProof, 'Experience Proof')}
                {renderPhotoGrid(identityDocs, 'Identity Documents')}
              </>
            )}

            {/* Agency-specific photo sections */}
            {user?.userType === 'agency' && (
              <>
                {renderPhotoGrid(agencyProfilePhotos, 'Agency Profile Photos')}
                {renderPhotoGrid(agencyBusinessPhotos, 'Business Photos')}
              </>
            )}

            {/* No Photos Message */}
            {allPhotos.length === 0 && (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mb-2">No photos uploaded yet</p>
                {isEditing && (
                  <p className="text-xs text-gray-400">Use the upload buttons above to add photos</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};