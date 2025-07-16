import React, { useState, useEffect } from 'react';
import { HybridDataService } from '../lib/hybrid-data-service';

const UserProfileViewer = ({ userId, imageCategories = ['profile', 'portfolio'] }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState('profile');

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Loading user profile:', userId);

      // Use hybrid data service to get user data with images
      const profile = await HybridDataService.getUserProfile(userId, imageCategories);
      
      console.log('User profile loaded:', profile);
      setUserData(profile);

    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadUserProfile}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  const availableImageCategories = Object.keys(userData.imageUrls || {}).filter(
    category => userData.imageUrls[category] && userData.imageUrls[category].length > 0
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{userData.fullName}</h2>
            <p className="text-blue-100 capitalize">{userData.userType?.replace('_', ' ')}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Storage Provider</p>
            <p className="text-white font-medium">
              📦 Firestore + ☁️ Supabase
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Full Name:</span>
                <p className="text-gray-900">{userData.fullName}</p>
              </div>
              
              {userData.location && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{userData.location}</p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-500">User Type:</span>
                <p className="text-gray-900 capitalize">{userData.userType?.replace('_', ' ')}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Registration Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  userData.isRegistrationComplete 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {userData.isRegistrationComplete ? 'Complete' : 'Incomplete'}
                </span>
              </div>

              {userData.createdAt && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Member Since:</span>
                  <p className="text-gray-900">{formatDate(userData.createdAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Type Specific Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {userData.userType === 'employer' && 'Company Information'}
              {userData.userType === 'agency' && 'Agency Information'}
              {userData.userType === 'individual_helper' && 'Helper Information'}
            </h3>
            <div className="space-y-3">
              {/* Employer fields */}
              {userData.userType === 'employer' && (
                <>
                  {userData.companyName && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company:</span>
                      <p className="text-gray-900">{userData.companyName}</p>
                    </div>
                  )}
                  {userData.companySize && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Size:</span>
                      <p className="text-gray-900">{userData.companySize}</p>
                    </div>
                  )}
                  {userData.industry && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Industry:</span>
                      <p className="text-gray-900">{userData.industry}</p>
                    </div>
                  )}
                </>
              )}

              {/* Agency fields */}
              {userData.userType === 'agency' && (
                <>
                  {userData.agencyName && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Agency Name:</span>
                      <p className="text-gray-900">{userData.agencyName}</p>
                    </div>
                  )}
                  {userData.agencyLicense && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">License:</span>
                      <p className="text-gray-900">{userData.agencyLicense}</p>
                    </div>
                  )}
                  {userData.servicesOffered && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Services:</span>
                      <p className="text-gray-900">{userData.servicesOffered}</p>
                    </div>
                  )}
                </>
              )}

              {/* Helper fields */}
              {userData.userType === 'individual_helper' && (
                <>
                  {userData.skills && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Skills:</span>
                      <p className="text-gray-900">{userData.skills}</p>
                    </div>
                  )}
                  {userData.experience && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Experience:</span>
                      <p className="text-gray-900">{userData.experience}</p>
                    </div>
                  )}
                  {userData.availability && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Availability:</span>
                      <p className="text-gray-900">{userData.availability}</p>
                    </div>
                  )}
                  {userData.hourlyRate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Hourly Rate:</span>
                      <p className="text-gray-900">${userData.hourlyRate}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {userData.description && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{userData.description}</p>
          </div>
        )}

        {/* Images Section */}
        {availableImageCategories.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Photos & Documents</h3>
              <div className="text-sm text-blue-600">
                ☁️ Stored in Supabase (90% cheaper!)
              </div>
            </div>

            {/* Image Category Tabs */}
            {availableImageCategories.length > 1 && (
              <div className="flex space-x-1 mb-4">
                {availableImageCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedImageCategory(category)}
                    className={`px-3 py-2 text-sm font-medium rounded-md capitalize ${
                      selectedImageCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {category.replace('-', ' ')}
                    <span className="ml-1 text-xs">
                      ({userData.imageUrls[category]?.length || 0})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Category Images */}
            {userData.imageUrls[selectedImageCategory] && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userData.imageUrls[selectedImageCategory].map((imageUrl, index) => {
                  const metadata = userData.imageMetadata?.[selectedImageCategory]?.[index];
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={metadata?.originalName || `${selectedImageCategory} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Image Metadata Overlay */}
                      {metadata && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 text-white text-center p-2">
                            <p className="text-xs font-medium truncate">{metadata.originalName}</p>
                            <p className="text-xs">
                              📦 {formatFileSize(metadata.optimizedSize)}
                            </p>
                            {metadata.percentSaved && (
                              <p className="text-xs text-green-300">
                                💾 {metadata.percentSaved}% smaller
                              </p>
                            )}
                            <p className="text-xs text-gray-300">
                              {formatDate(metadata.uploadedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Storage Statistics */}
            {userData.storage && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Storage Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Provider:</span>
                    <p className="font-medium capitalize">{userData.storage.provider}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Images:</span>
                    <p className="font-medium">{userData.storage.totalImages || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <p className="font-medium">{formatDate(userData.storage.lastUpdated)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Cost Savings:</span>
                    <p className="font-medium text-green-600">~90%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileViewer;