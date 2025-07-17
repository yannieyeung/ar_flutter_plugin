'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useState, useEffect } from 'react';
import { ClientUserService } from '@/lib/db-client';
import { ClientPhotoService } from '@/lib/client-photo-service';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { photos: allPhotos, loading: photosLoading, refetch: refetchPhotos } = useUserPhotos();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [deletingPhoto, setDeletingPhoto] = useState(null);

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
        relevantSkills: user.relevantSkills || '',
        dateOfBirth: user.dateOfBirth || '',
        experience: user.experience || {},
        emergencyContact: user.emergencyContact || '',
        previousWork: user.previousWork || '',
        languages: Array.isArray(user.languages) ? user.languages : 
                   (typeof user.languages === 'string' && user.languages) ? 
                   user.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
        availability: user.availability || '',
        expectedSalary: user.expectedSalary || '',
        // Additional registration fields
        countryOfBirth: user.countryOfBirth || '',
        cityOfBirth: user.cityOfBirth || '',
        height: user.height || '',
        weight: user.weight || '',
        numberOfSiblings: user.numberOfSiblings || '',
        numberOfChildren: user.numberOfChildren || '',
        repatriationPort: user.repatriationPort || '',
        hasBeenHelperBefore: user.hasBeenHelperBefore || '',
        // Medical info
        hasAllergies: user.hasAllergies || '',
        allergiesDetails: user.allergiesDetails || '',
        hasPastIllness: user.hasPastIllness || '',
        pastIllnessDetails: user.pastIllnessDetails || '',
        hasPhysicalDisabilities: user.hasPhysicalDisabilities || '',
        physicalDisabilitiesDetails: user.physicalDisabilitiesDetails || '',
        hasDietaryRestrictions: user.hasDietaryRestrictions || '',
        dietaryRestrictionsDetails: user.dietaryRestrictionsDetails || '',
        // Job preferences
        preferences: user.preferences || {},
        // Interview and availability
        interview: user.interview || {},
        readiness: user.readiness || {}
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare data for saving - convert languages array back to comma-separated string if needed
      const dataToSave = {
        ...editData,
        languages: Array.isArray(editData.languages) ? 
                   editData.languages.filter(lang => lang.trim()).join(', ') : 
                   editData.languages
      };
      
      await ClientUserService.updateUser(user.uid, dataToSave);
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
      relevantSkills: user.relevantSkills || '',
      dateOfBirth: user.dateOfBirth || '',
      experience: user.experience || {},
      emergencyContact: user.emergencyContact || '',
      previousWork: user.previousWork || '',
      languages: Array.isArray(user.languages) ? user.languages : 
                 (typeof user.languages === 'string' && user.languages) ? 
                 user.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
      availability: user.availability || '',
      expectedSalary: user.expectedSalary || '',
      // Additional registration fields
      countryOfBirth: user.countryOfBirth || '',
      cityOfBirth: user.cityOfBirth || '',
      height: user.height || '',
      weight: user.weight || '',
      numberOfSiblings: user.numberOfSiblings || '',
      numberOfChildren: user.numberOfChildren || '',
      repatriationPort: user.repatriationPort || '',
      hasBeenHelperBefore: user.hasBeenHelperBefore || '',
      // Medical info
      hasAllergies: user.hasAllergies || '',
      allergiesDetails: user.allergiesDetails || '',
      hasPastIllness: user.hasPastIllness || '',
      pastIllnessDetails: user.pastIllnessDetails || '',
      hasPhysicalDisabilities: user.hasPhysicalDisabilities || '',
      physicalDisabilitiesDetails: user.physicalDisabilitiesDetails || '',
      hasDietaryRestrictions: user.hasDietaryRestrictions || '',
      dietaryRestrictionsDetails: user.dietaryRestrictionsDetails || '',
      // Job preferences
      preferences: user.preferences || {},
      // Interview and availability
      interview: user.interview || {},
      readiness: user.readiness || {}
    });
  };

  const handlePhotoUpload = async (files, photoType) => {
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const progressKey = `${photoType}-${index}`;
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

        const result = await ClientPhotoService.uploadPhoto(
          file,
          user.uid,
          photoType,
          {},
          (progress) => {
            setUploadProgress(prev => ({ ...prev, [progressKey]: progress }));
          }
        );

        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[progressKey];
          return newProgress;
        });

        return result;
      });

      await Promise.all(uploadPromises);
      await refetchPhotos();
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handlePhotoDelete = async (photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    setDeletingPhoto(photo.id);
    try {
      await ClientPhotoService.deletePhoto(photo.id, photo.supabasePath, photo.bucket);
      await refetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    } finally {
      setDeletingPhoto(null);
    }
  };

  const handleExperienceChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: value
      }
    }));
  };

  const handleLanguageChange = (index, value) => {
    const newLanguages = [...editData.languages];
    newLanguages[index] = value;
    setEditData(prev => ({ ...prev, languages: newLanguages }));
  };

  const addLanguage = () => {
    setEditData(prev => ({ 
      ...prev, 
      languages: [...prev.languages, ''] 
    }));
  };

  const removeLanguage = (index) => {
    setEditData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Filter photos by type
  const profilePhotos = allPhotos.filter(photo => photo.photoType === 'profile-pictures');
  const portfolioPhotos = allPhotos.filter(photo => photo.photoType === 'portfolio-photos');
  const certificates = allPhotos.filter(photo => photo.photoType === 'certificates');
  const experienceProof = allPhotos.filter(photo => photo.photoType === 'experience-proof');
  const identityDocs = allPhotos.filter(photo => photo.photoType === 'identity-documents');

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getCompletionPercentage = () => {
    if (!user) return 0;
    
    const fields = [
      user.fullName, user.contactNumber, user.residentialAddress,
      user.educationLevel, user.maritalStatus, user.nationality,
      user.religion, user.relevantSkills, user.dateOfBirth
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const photoBonus = allPhotos.length > 0 ? 1 : 0;
    
    return Math.round(((filledFields + photoBonus) / (fields.length + 1)) * 100);
  };

  if (!user) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
                  ← Back to Dashboard
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-6">
              
              {/* Profile Summary Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-5">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {profilePhotos.length > 0 ? (
                          <img className="h-20 w-20 rounded-full object-cover" src={profilePhotos[0].url} alt={user.fullName} />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                            <svg className="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900">{user.fullName || 'No Name'}</h1>
                      <p className="text-sm font-medium text-gray-500 capitalize">
                        {user.userType?.replace('_', ' ')} • {user.email || user.phoneNumber}
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getCompletionPercentage()}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Profile {getCompletionPercentage()}% complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.dateOfBirth}
                          onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(user?.dateOfBirth)} 
                          {user?.dateOfBirth && (
                            <span className="text-gray-500 ml-2">({calculateAge(user.dateOfBirth)} years old)</span>
                          )}
                        </p>
                      )}
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

                    {/* Residential Address */}
                    <div className="sm:col-span-2">
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

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.emergencyContact}
                          onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Name and phone number"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.emergencyContact || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Expected Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.expectedSalary}
                          onChange={(e) => setEditData({...editData, expectedSalary: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g., $2000/month"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.expectedSalary || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Languages</label>
                      {isEditing ? (
                        <div className="mt-1 space-y-2">
                          {editData.languages.map((language, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={language}
                                onChange={(e) => handleLanguageChange(index, e.target.value)}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Language"
                              />
                              <button
                                type="button"
                                onClick={() => removeLanguage(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addLanguage}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            + Add Language
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(() => {
                            const languages = Array.isArray(user?.languages) ? user.languages : 
                                             (typeof user?.languages === 'string' && user.languages) ? 
                                             user.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [];
                            
                            return languages.length > 0 ? languages.map((language, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {language}
                              </span>
                            )) : <p className="text-sm text-gray-900">Not provided</p>;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Country of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country of Birth</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.countryOfBirth}
                          onChange={(e) => setEditData({...editData, countryOfBirth: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.countryOfBirth || 'Not provided'}</p>
                      )}
                    </div>

                    {/* City of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City of Birth</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.cityOfBirth}
                          onChange={(e) => setEditData({...editData, cityOfBirth: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.cityOfBirth || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.height}
                          onChange={(e) => setEditData({...editData, height: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="120"
                          max="220"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.height ? `${user.height} cm` : 'Not provided'}</p>
                      )}
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.weight}
                          onChange={(e) => setEditData({...editData, weight: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="30"
                          max="200"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.weight ? `${user.weight} kg` : 'Not provided'}</p>
                      )}
                    </div>

                    {/* Number of Siblings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Siblings</label>
                      {isEditing ? (
                        <select
                          value={editData.numberOfSiblings}
                          onChange={(e) => setEditData({...editData, numberOfSiblings: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select number</option>
                          {[...Array(11)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.numberOfSiblings || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Number of Children */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                      {isEditing ? (
                        <select
                          value={editData.numberOfChildren}
                          onChange={(e) => setEditData({...editData, numberOfChildren: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select number</option>
                          {[...Array(11)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.numberOfChildren || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Repatriation Port */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Repatriation Port/Airport</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.repatriationPort}
                          onChange={(e) => setEditData({...editData, repatriationPort: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.repatriationPort || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Helper Experience */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Previous Helper Experience</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="flex space-x-6">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="hasBeenHelperBefore"
                                value="yes"
                                checked={editData.hasBeenHelperBefore === 'yes'}
                                onChange={(e) => setEditData({...editData, hasBeenHelperBefore: e.target.value})}
                                className="mr-2"
                              />
                              Yes, I have experience
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="hasBeenHelperBefore"
                                value="no"
                                checked={editData.hasBeenHelperBefore === 'no'}
                                onChange={(e) => setEditData({...editData, hasBeenHelperBefore: e.target.value})}
                                className="mr-2"
                              />
                              No, I'm new to this
                            </label>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-900">
                            {user?.hasBeenHelperBefore === 'yes' ? 'Yes, I have experience' : 
                             user?.hasBeenHelperBefore === 'no' ? 'No, I\'m new to this' : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      {isEditing ? (
                        <textarea
                          value={editData.availability}
                          onChange={(e) => setEditData({...editData, availability: e.target.value})}
                          rows={2}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Days and hours available"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.availability || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Skills & Experience */}
                    <div className="sm:col-span-2">
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

                    {/* Previous Work */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Previous Work Experience</label>
                      {isEditing ? (
                        <textarea
                          value={editData.previousWork}
                          onChange={(e) => setEditData({...editData, previousWork: e.target.value})}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Describe your previous work experience..."
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user?.previousWork || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Details (Helper-specific) */}
              {user.userType === 'individual_helper' && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Specialized Experience</h3>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                          { key: 'elderCare', label: 'Elder Care' },
                          { key: 'childCare', label: 'Child Care' },
                          { key: 'petCare', label: 'Pet Care' },
                          { key: 'housekeeping', label: 'Housekeeping' },
                          { key: 'cooking', label: 'Cooking' },
                          { key: 'gardening', label: 'Gardening' },
                          { key: 'tutoring', label: 'Tutoring' },
                          { key: 'companionship', label: 'Companionship' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center">
                            <input
                              type="checkbox"
                              id={item.key}
                              checked={editData.experience?.[item.key] || false}
                              onChange={(e) => handleExperienceChange(item.key, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={item.key} className="ml-2 block text-sm text-gray-900">
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {user?.experience && Object.entries(user.experience).map(([key, value]) => {
                          if (value === true) {
                            return (
                              <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            );
                          }
                          return null;
                        })}
                        {(!user?.experience || Object.values(user.experience).every(v => !v)) && (
                          <p className="text-sm text-gray-900">No specialized experience selected</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medical Information */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Medical Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    
                    {/* Allergies */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Do you have any allergies?</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasAllergies"
                                  value="yes"
                                  checked={editData.hasAllergies === 'yes'}
                                  onChange={(e) => setEditData({...editData, hasAllergies: e.target.value})}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasAllergies"
                                  value="no"
                                  checked={editData.hasAllergies === 'no'}
                                  onChange={(e) => setEditData({...editData, hasAllergies: e.target.value})}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {editData.hasAllergies === 'yes' && (
                              <textarea
                                value={editData.allergiesDetails}
                                onChange={(e) => setEditData({...editData, allergiesDetails: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Please describe your allergies..."
                                rows="2"
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-900">
                              {user?.hasAllergies === 'yes' ? 'Yes' : user?.hasAllergies === 'no' ? 'No' : 'Not provided'}
                            </p>
                            {user?.hasAllergies === 'yes' && user?.allergiesDetails && (
                              <p className="text-sm text-gray-600 mt-1">{user.allergiesDetails}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Past Illness */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Any past serious illness or surgery?</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasPastIllness"
                                  value="yes"
                                  checked={editData.hasPastIllness === 'yes'}
                                  onChange={(e) => setEditData({...editData, hasPastIllness: e.target.value})}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasPastIllness"
                                  value="no"
                                  checked={editData.hasPastIllness === 'no'}
                                  onChange={(e) => setEditData({...editData, hasPastIllness: e.target.value})}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {editData.hasPastIllness === 'yes' && (
                              <textarea
                                value={editData.pastIllnessDetails}
                                onChange={(e) => setEditData({...editData, pastIllnessDetails: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Please describe..."
                                rows="2"
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-900">
                              {user?.hasPastIllness === 'yes' ? 'Yes' : user?.hasPastIllness === 'no' ? 'No' : 'Not provided'}
                            </p>
                            {user?.hasPastIllness === 'yes' && user?.pastIllnessDetails && (
                              <p className="text-sm text-gray-600 mt-1">{user.pastIllnessDetails}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Physical Disabilities */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Any physical disabilities?</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasPhysicalDisabilities"
                                  value="yes"
                                  checked={editData.hasPhysicalDisabilities === 'yes'}
                                  onChange={(e) => setEditData({...editData, hasPhysicalDisabilities: e.target.value})}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasPhysicalDisabilities"
                                  value="no"
                                  checked={editData.hasPhysicalDisabilities === 'no'}
                                  onChange={(e) => setEditData({...editData, hasPhysicalDisabilities: e.target.value})}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {editData.hasPhysicalDisabilities === 'yes' && (
                              <textarea
                                value={editData.physicalDisabilitiesDetails}
                                onChange={(e) => setEditData({...editData, physicalDisabilitiesDetails: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Please describe..."
                                rows="2"
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-900">
                              {user?.hasPhysicalDisabilities === 'yes' ? 'Yes' : user?.hasPhysicalDisabilities === 'no' ? 'No' : 'Not provided'}
                            </p>
                            {user?.hasPhysicalDisabilities === 'yes' && user?.physicalDisabilitiesDetails && (
                              <p className="text-sm text-gray-600 mt-1">{user.physicalDisabilitiesDetails}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Any dietary restrictions?</label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasDietaryRestrictions"
                                  value="yes"
                                  checked={editData.hasDietaryRestrictions === 'yes'}
                                  onChange={(e) => setEditData({...editData, hasDietaryRestrictions: e.target.value})}
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="hasDietaryRestrictions"
                                  value="no"
                                  checked={editData.hasDietaryRestrictions === 'no'}
                                  onChange={(e) => setEditData({...editData, hasDietaryRestrictions: e.target.value})}
                                  className="mr-2"
                                />
                                No
                              </label>
                            </div>
                            {editData.hasDietaryRestrictions === 'yes' && (
                              <textarea
                                value={editData.dietaryRestrictionsDetails}
                                onChange={(e) => setEditData({...editData, dietaryRestrictionsDetails: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Please describe..."
                                rows="2"
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-900">
                              {user?.hasDietaryRestrictions === 'yes' ? 'Yes' : user?.hasDietaryRestrictions === 'no' ? 'No' : 'Not provided'}
                            </p>
                            {user?.hasDietaryRestrictions === 'yes' && user?.dietaryRestrictionsDetails && (
                              <p className="text-sm text-gray-600 mt-1">{user.dietaryRestrictionsDetails}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Preferences */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Job Preferences</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {[
                      { key: 'careOfInfant', label: 'Care for Infants (0-12 months)' },
                      { key: 'careOfChildren', label: 'Care for Children (1-12 years)' },
                      { key: 'careOfDisabled', label: 'Care for Disabled Persons' },
                      { key: 'careOfOldAge', label: 'Care for Elderly' },
                      { key: 'generalHousework', label: 'General Housework & Cleaning' },
                      { key: 'cooking', label: 'Cooking & Meal Preparation' }
                    ].map(pref => (
                      <div key={pref.key} className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{pref.label}</label>
                        {isEditing ? (
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`pref_${pref.key}`}
                                value="yes"
                                checked={editData.preferences?.[pref.key] === 'yes'}
                                onChange={(e) => setEditData({
                                  ...editData,
                                  preferences: {
                                    ...editData.preferences,
                                    [pref.key]: e.target.value
                                  }
                                })}
                                className="mr-2"
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`pref_${pref.key}`}
                                value="no"
                                checked={editData.preferences?.[pref.key] === 'no'}
                                onChange={(e) => setEditData({
                                  ...editData,
                                  preferences: {
                                    ...editData.preferences,
                                    [pref.key]: e.target.value
                                  }
                                })}
                                className="mr-2"
                              />
                              No
                            </label>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-900">
                            {user?.preferences?.[pref.key] === 'yes' ? 'Yes' : 
                             user?.preferences?.[pref.key] === 'no' ? 'No' : 'Not specified'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interview & Readiness */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Interview & Work Readiness</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    
                    {/* Interview Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interview Availability</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.interview?.availability === 'immediate' ? 'Immediately available' :
                         user?.interview?.availability === 'after_date' ? 
                           `After ${user?.interview?.availabilityDate || 'specified date'}` : 'Not specified'}
                      </p>
                    </div>

                    {/* Interview Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Interview Method</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.interview?.means === 'whatsapp_video_call' ? 'WhatsApp Video Call' :
                         user?.interview?.means === 'voice_call' ? 'Voice Call' :
                         user?.interview?.means === 'face_to_face' ? 'Face to Face' :
                         user?.interview?.means === 'others' ? 'Others' :
                         user?.interview?.means || 'Not specified'}
                      </p>
                    </div>

                    {/* Passport Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valid Passport</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.readiness?.hasValidPassport === 'yes' ? 'Yes' :
                         user?.readiness?.hasValidPassport === 'no' ? 'No' : 'Not specified'}
                      </p>
                    </div>

                    {/* Work Start Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Can Start Work</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.readiness?.canStartWork === 'immediately' ? 'Immediately' :
                         user?.readiness?.canStartWork === 'after_date' ?
                           `After ${user?.readiness?.startWorkDate || 'specified date'}` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Photos & Documents</h3>
                                          {isEditing && (
                        <div className="flex flex-wrap gap-2">
                          <label className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e.target.files, 'profile-pictures')}
                              className="hidden"
                            />
                            Profile Photo
                          </label>
                          <label className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e.target.files, 'portfolio-photos')}
                              className="hidden"
                            />
                            Portfolio
                          </label>
                          <label className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={(e) => handlePhotoUpload(e.target.files, 'certificates')}
                              className="hidden"
                            />
                            Certificate
                          </label>
                          <label className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={(e) => handlePhotoUpload(e.target.files, 'experience-proof')}
                              className="hidden"
                            />
                            Experience Proof
                          </label>
                          <label className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-700 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={(e) => handlePhotoUpload(e.target.files, 'identity-documents')}
                              className="hidden"
                            />
                            ID Documents
                          </label>
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
                      {profilePhotos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Profile Photos ({profilePhotos.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {profilePhotos.map((photo) => (
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
                      )}

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
                      )}

                      {/* Experience Proof */}
                      {experienceProof.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Proof ({experienceProof.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {experienceProof.map((photo) => (
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
                      )}

                      {/* Identity Documents */}
                      {identityDocs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Identity Documents ({identityDocs.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {identityDocs.map((photo) => (
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
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}