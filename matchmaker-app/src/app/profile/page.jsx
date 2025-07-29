'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useState, useEffect } from 'react';
import { ClientUserService } from '@/lib/db-client';
import { ClientPhotoService } from '@/lib/client-photo-service';
import Link from 'next/link';

// Import user-type-specific profile sections
import { HelperPersonalInfo, HelperMedicalInfo } from '@/components/profile-sections/HelperProfileSections';
import { AgencyBusinessInfo, AgencyLicenseInfo, AgencyServicesInfo, AgencyFeesInfo } from '@/components/profile-sections/AgencyProfileSections';
import { EmployerPersonalInfo, EmployerCompanyInfo } from '@/components/profile-sections/EmployerProfileSections';
import { ProfilePhotosSection } from '@/components/profile-sections/SharedProfileSections';
import { convertYearsInBusiness } from '@/utils/dataTransformations';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { photos: allPhotos, loading: photosLoading, refetch: refetchPhotos } = useUserPhotos();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [deletingPhoto, setDeletingPhoto] = useState(null);

  const resetEditData = () => {
    if (!user) return {};
    
    const baseData = {
      fullName: user.fullName || '',
      contactNumber: user.contactNumber || '',
      residentialAddress: user.residentialAddress || '',
      description: user.description || '',
      location: user.location || ''
    };

    // Add user-type-specific fields
    if (user.userType === 'individual_helper') {
      return {
        ...baseData,
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
        countryOfBirth: user.countryOfBirth || '',
        cityOfBirth: user.cityOfBirth || '',
        height: user.height || '',
        weight: user.weight || '',
        numberOfSiblings: user.numberOfSiblings || '',
        numberOfChildren: user.numberOfChildren || '',
        repatriationPort: user.repatriationPort || '',
        hasBeenHelperBefore: user.hasBeenHelperBefore || '',
        hasAllergies: user.hasAllergies || '',
        allergiesDetails: user.allergiesDetails || '',
        hasPastIllness: user.hasPastIllness || '',
        pastIllnessDetails: user.pastIllnessDetails || '',
        hasPhysicalDisabilities: user.hasPhysicalDisabilities || '',
        physicalDisabilitiesDetails: user.physicalDisabilitiesDetails || '',
        hasDietaryRestrictions: user.hasDietaryRestrictions || '',
        dietaryRestrictionsDetails: user.dietaryRestrictionsDetails || '',
        preferences: user.preferences || {},
        interview: user.interview || {},
        readiness: user.readiness || {}
      };
    } else if (user.userType === 'agency') {
      return {
        ...baseData,
        businessName: user.businessName || '',
        uenNumber: user.uenNumber || '',
        email: user.email || '',
        website: user.website || '',
        businessDescription: user.businessDescription || '',
        yearsInBusiness: convertYearsInBusiness(user.yearsInBusiness) || user.yearsInBusiness || '',
        businessAddress: user.businessAddress || '',
        eaLicenseNumber: user.eaLicenseNumber || '',
        licenseExpiryDate: user.licenseExpiryDate || '',
        keyPersonnel: user.keyPersonnel || '',
        additionalCertifications: user.additionalCertifications || [],
        otherLicenses: user.otherLicenses || '',
        servicesProvided: user.servicesProvided || [],
        countriesOfHelpers: user.countriesOfHelpers || [],
        specializations: user.specializations || [],
        serviceDescription: user.serviceDescription || '',
        agencyFee: user.agencyFee || {},
        providesReplacement: user.providesReplacement || '',
        replacementCount: user.replacementCount || '',
        paymentTerms: user.paymentTerms || [],
        additionalPolicies: user.additionalPolicies || ''
      };
    } else if (user.userType === 'employer') {
      return {
        ...baseData,
        companyName: user.companyName || '',
        companySize: user.companySize || '',
        industry: user.industry || ''
      };
    } else {
      return baseData;
    }
  };

  // Initialize edit data when user data changes
  useEffect(() => {
    if (user) {
      setEditData(resetEditData());
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
    setEditData(resetEditData());
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
                        {allPhotos.filter(photo => photo.photoType === 'profile-pictures').length > 0 ? (
                          <img 
                            className="h-20 w-20 rounded-full object-cover" 
                            src={allPhotos.filter(photo => photo.photoType === 'profile-pictures')[0].url} 
                            alt={user.fullName} 
                          />
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

              {/* User-type-specific profile sections */}
              {user.userType === 'individual_helper' && (
                <>
                  <HelperPersonalInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                    handleLanguageChange={handleLanguageChange}
                    addLanguage={addLanguage}
                    removeLanguage={removeLanguage}
                    formatDate={formatDate}
                    calculateAge={calculateAge}
                  />
                  <HelperMedicalInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                </>
              )}

              {user.userType === 'agency' && (
                <>
                  <AgencyBusinessInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                  <AgencyLicenseInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                  <AgencyServicesInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                  <AgencyFeesInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                </>
              )}

              {user.userType === 'employer' && (
                <>
                  <EmployerPersonalInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                  <EmployerCompanyInfo 
                    user={user}
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={setEditData}
                  />
                </>
              )}

              {/* Photos Section - shared by all user types */}
              <ProfilePhotosSection 
                user={user}
                isEditing={isEditing}
                allPhotos={allPhotos}
                photosLoading={photosLoading}
                uploadProgress={uploadProgress}
                deletingPhoto={deletingPhoto}
                handlePhotoUpload={handlePhotoUpload}
                handlePhotoDelete={handlePhotoDelete}
              />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}