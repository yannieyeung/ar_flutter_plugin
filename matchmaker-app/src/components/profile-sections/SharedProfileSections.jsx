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
      <label key="profile" className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e.target.files, getProfilePhotoType())}
          className="hidden"
        />
        Profile Photo
      </label>
    );

    // Helper-specific buttons
    if (user?.userType === 'individual_helper') {
      buttons.push(
        <label key="portfolio" className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files, 'portfolio-photos')}
            className="hidden"
          />
          Portfolio
        </label>,
        <label key="certificates" className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'certificates')}
            className="hidden"
          />
          Certificate
        </label>,
        <label key="experience" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'experience-proof')}
            className="hidden"
          />
          Experience Proof
        </label>,
        <label key="identity" className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-700 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handlePhotoUpload(e.target.files, 'identity-documents')}
            className="hidden"
          />
          ID Documents
        </label>
      );
    }

    // Agency-specific buttons
    if (user?.userType === 'agency') {
      buttons.push(
        <label key="business" className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files, 'agency-business-photos')}
            className="hidden"
          />
          Business Photos
        </label>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Photos & Documents</h3>
          {isEditing && (
            <div className="flex flex-wrap gap-2">
              {getUploadButtons()}
            </div>
          )}
        </div>
        
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