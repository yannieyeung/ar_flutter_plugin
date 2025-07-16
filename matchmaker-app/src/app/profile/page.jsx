'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useState, useEffect } from 'react';
import { ClientUserService } from '@/lib/db-client';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { photos: allPhotos, loading: photosLoading } = useUserPhotos();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialize edit data when user data changes
  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName || '',
        contactNumber: user.contactNumber || '',
        residentialAddress: user.residentialAddress || '',
        educationLevel: user.educationLevel || '',
        maritalStatus: user.maritalStatus || '',
        nationality: user.nationality || '',
        religion: user.religion || '',
        relevantSkills: user.relevantSkills || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await ClientUserService.updateUser(user.uid, editData);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      fullName: user.fullName || '',
      contactNumber: user.contactNumber || '',
      residentialAddress: user.residentialAddress || '',
      educationLevel: user.educationLevel || '',
      maritalStatus: user.maritalStatus || '',
      nationality: user.nationality || '',
      religion: user.religion || '',
      relevantSkills: user.relevantSkills || ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Not provided';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Filter photos by type
  const profilePhotos = allPhotos.filter(photo => photo.photoType === 'profile-pictures');
  const portfolioPhotos = allPhotos.filter(photo => photo.photoType === 'portfolio-photos');
  const certificates = allPhotos.filter(photo => photo.photoType === 'certificates');
  const experienceProof = allPhotos.filter(photo => photo.photoType === 'experience-proof');
  const identityDocs = allPhotos.filter(photo => photo.photoType === 'identity-documents');

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">View and manage your profile information</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Dashboard
                </Link>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Summary Card */}
            <div className="md:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    {/* Profile Picture */}
                    <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                      {profilePhotos.length > 0 ? (
                        <img
                          src={profilePhotos[0].url}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900">
                      {user?.fullName || 'Name not provided'}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {user?.userType || 'User type not set'}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.isRegistrationComplete 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.isRegistrationComplete ? 'Profile Complete' : 'Profile Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.fullName}
                          onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.fullName || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.contactNumber}
                          onChange={(e) => setEditData({...editData, contactNumber: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.contactNumber || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Email/Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email/Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{user?.email || user?.phoneNumber || 'Not provided'}</p>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(user?.dateOfBirth)} 
                        {user?.dateOfBirth && (
                          <span className="text-gray-500 ml-2">({calculateAge(user.dateOfBirth)} years old)</span>
                        )}
                      </p>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationality</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.nationality}
                          onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.nationality || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Education Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education Level</label>
                      {isEditing ? (
                        <select
                          value={editData.educationLevel}
                          onChange={(e) => setEditData({...editData, educationLevel: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select education level</option>
                          <option value="primary_school">Primary School</option>
                          <option value="secondary_school">Secondary School</option>
                          <option value="high_school">High School</option>
                          <option value="university">University</option>
                          <option value="postgraduate">Postgraduate</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {user?.educationLevel?.replace('_', ' ') || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                      {isEditing ? (
                        <select
                          value={editData.maritalStatus}
                          onChange={(e) => setEditData({...editData, maritalStatus: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select marital status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {user?.maritalStatus || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Religion */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Religion</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.religion}
                          onChange={(e) => setEditData({...editData, religion: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.religion || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                    {isEditing ? (
                      <textarea
                        value={editData.residentialAddress}
                        onChange={(e) => setEditData({...editData, residentialAddress: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user?.residentialAddress || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience & Skills */}
              {user?.userType === 'helper' && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Experience & Skills
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Previous Experience */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Previous Helper Experience</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {user?.hasBeenHelperBefore === 'yes' ? 'Yes, I have experience' : 'No, I\'m new to this'}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Skills & Experience</label>
                        {isEditing ? (
                          <textarea
                            value={editData.relevantSkills}
                            onChange={(e) => setEditData({...editData, relevantSkills: e.target.value})}
                            rows={4}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Describe your relevant skills and experience..."
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user?.relevantSkills || 'Not provided'}</p>
                        )}
                      </div>

                      {/* Experience Details */}
                      {user?.experience && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Specialized Experience</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {Object.entries(user.experience).map(([key, value]) => {
                              if (value === true) {
                                return (
                                  <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Photos Section */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Photos & Documents
                  </h3>
                  
                  {photosLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading photos...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Portfolio Photos */}
                      {portfolioPhotos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio Photos ({portfolioPhotos.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {portfolioPhotos.map((photo) => (
                              <div key={photo.id} className="relative group">
                                <img
                                  src={photo.url}
                                  alt={photo.originalName}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                  <p className="text-white text-xs text-center p-2">{photo.originalName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {certificates.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Certificates ({certificates.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {certificates.map((photo) => (
                              <div key={photo.id} className="relative group">
                                <img
                                  src={photo.url}
                                  alt={photo.originalName}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                  <p className="text-white text-xs text-center p-2">{photo.originalName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Photos Message */}
                      {allPhotos.length === 0 && (
                        <div className="text-center py-6">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500">No photos uploaded yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}