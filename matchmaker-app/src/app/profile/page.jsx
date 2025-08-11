'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useState, useEffect } from 'react';
import { ClientUserService } from '@/lib/db-client';
import { ClientPhotoService } from '@/lib/client-photo-service';
import Link from 'next/link';

// Import user-type-specific profile sections
import { 
  HelperPersonalInfo, 
  HelperMedicalInfo, 
  HelperExperienceInfo, 
  HelperPreferencesInfo, 
  HelperAvailabilityInfo 
} from '@/components/profile-sections/HelperProfileSections';
import { AgencyBusinessInfo, AgencyLicenseInfo, AgencyServicesInfo, AgencyFeesInfo } from '@/components/profile-sections/AgencyProfileSections';
import { EmployerPersonalInfo, EmployerHouseholdInfo, EmployerPreferences } from '@/components/profile-sections/EmployerProfileSections';
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
      location: user.location || ''
    };

    // Add user-type-specific fields
    if (user.userType === 'individual_helper') {
      return {
        ...baseData,
        // Personal Information
        contactNumber: user.contactNumber || '',
        educationLevel: user.educationLevel || '',
        maritalStatus: user.maritalStatus || '',
        nationality: user.nationality || '',
        religion: user.religion || '',
        dateOfBirth: user.dateOfBirth || '',
        countryOfBirth: user.countryOfBirth || '',
        cityOfBirth: user.cityOfBirth || '',
        height: user.height || '',
        weight: user.weight || '',
        numberOfSiblings: user.numberOfSiblings || '',
        numberOfChildren: user.numberOfChildren || '',
        residentialAddress: user.residentialAddress || '',
        emergencyContact: user.emergencyContact || '',
        repatriationPort: user.repatriationPort || '',
        hasBeenHelperBefore: user.hasBeenHelperBefore || '',
        
        // Medical Information
        hasAllergies: user.hasAllergies || '',
        allergiesDetails: user.allergiesDetails || '',
        hasPastIllness: user.hasPastIllness || '',
        illnessDetails: user.illnessDetails || user.pastIllnessDetails || '',
        hasPhysicalDisabilities: user.hasPhysicalDisabilities || '',
        disabilitiesDetails: user.disabilitiesDetails || user.physicalDisabilitiesDetails || '',
        
        // Experience & Skills
        experience: user.experience || {},
        relevantSkills: user.relevantSkills || '',
        previousWork: user.previousWork || '',
        
        // Preferences
        preferences: user.preferences || {},
        
        // Availability & Readiness  
        expectations: {
          salary: {
            minimumAmount: user.expectations?.salary?.minimumAmount || 
                          (user.salaryProfile?.minimumSalary ? String(user.salaryProfile.minimumSalary) : '') ||
                          (user.mlProfile?.salaryProfile?.minimumSalary ? String(user.mlProfile.salaryProfile.minimumSalary) : ''),
            preferredAmount: user.expectations?.salary?.preferredAmount || 
                            (user.salaryProfile?.preferredSalary ? String(user.salaryProfile.preferredSalary) : '') ||
                            (user.mlProfile?.salaryProfile?.preferredSalary ? String(user.mlProfile.salaryProfile.preferredSalary) : ''),
            currency: user.expectations?.salary?.currency || 
                     user.salaryProfile?.currency || 
                     user.mlProfile?.salaryProfile?.currency || 'SGD',
            negotiable: user.expectations?.salary?.negotiable ?? user.salaryProfile?.salaryNegotiable ?? user.mlProfile?.salaryProfile?.salaryNegotiable ?? false,
            performanceBonusExpected: user.expectations?.salary?.performanceBonusExpected ?? user.salaryProfile?.wantsBonus ?? user.mlProfile?.salaryProfile?.wantsBonus ?? false
          }
        },
                readiness: {
          hasValidPassport: user.readiness?.hasValidPassport || 
                           (user.availabilityProfile?.hasValidPassport ? 'yes' : '') ||
                           (user.mlProfile?.availabilityProfile?.hasValidPassport ? 'yes' : '') || '',
          passportExpiry: user.readiness?.passportExpiry || '',
          canStartWork: user.readiness?.canStartWork || 
                       (user.availabilityProfile?.immediatelyAvailable ? 'immediately' :
                        user.availabilityProfile?.withinMonth ? 'within_month' : '') ||
                       (user.mlProfile?.availabilityProfile?.immediatelyAvailable ? 'immediately' :
                        user.mlProfile?.availabilityProfile?.withinMonth ? 'within_month' : '') || '',
          startDate: user.readiness?.startDate || '',
          visaStatus: user.readiness?.visaStatus || user.availabilityProfile?.visaStatus || user.mlProfile?.availabilityProfile?.visaStatus || ''
        },
        interview: {
          availability: user.interview?.availability || '',
          availabilityDate: user.interview?.availabilityDate || '',
          means: user.interview?.means || ''
        },
        otherRemarks: user.otherRemarks || '',
        
        // Legacy fields for backward compatibility
        availability: user.availability || '',
        hasDietaryRestrictions: user.hasDietaryRestrictions || '',
        dietaryRestrictionsDetails: user.dietaryRestrictionsDetails || ''
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
        email: user.email || '',
        householdSize: user.householdSize || '',
        hasKids: user.hasKids || false,
        numberOfKids: user.numberOfKids || '',
        kidsAges: user.kidsAges || '',
        hasPets: user.hasPets || false,
        petDetails: user.petDetails || '',
        selfIntroduction: user.selfIntroduction || '',
        preferredLanguages: user.preferredLanguages || [],
        specificRequirements: user.specificRequirements || ''
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
      
      // Prepare data for saving
      const dataToSave = {
        ...editData
      };

      // Also update salaryProfile for backward compatibility
      if (editData.expectations?.salary) {
        dataToSave.salaryProfile = {
          ...dataToSave.salaryProfile,
          minimumSalary: editData.expectations.salary.minimumAmount,
          preferredSalary: editData.expectations.salary.preferredAmount,
          currency: editData.expectations.salary.currency,
          salaryNegotiable: editData.expectations.salary.negotiable,
          wantsBonus: editData.expectations.salary.performanceBonusExpected
        };
      }

      // Also update availabilityProfile for backward compatibility
      if (editData.readiness) {
        dataToSave.availabilityProfile = {
          ...dataToSave.availabilityProfile,
          immediatelyAvailable: editData.readiness.canStartWork === 'immediately',
          withinMonth: editData.readiness.canStartWork === 'within_month',
          hasValidPassport: editData.readiness.hasValidPassport === 'yes',
          visaStatus: editData.readiness.visaStatus,
          workReady: editData.readiness.hasValidPassport === 'yes' && 
                    (editData.readiness.canStartWork === 'immediately' || editData.readiness.canStartWork === 'within_month')
        };
      }
      
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
      // For profile photos, delete existing ones first to maintain single profile photo
      const isProfilePhoto = photoType === 'employer-profiles' || photoType === 'profile-pictures' || photoType === 'agency-profile-photos';
      if (isProfilePhoto) {
        const existingProfilePhotos = allPhotos.filter(photo => 
          photo.photoType === 'employer-profiles' || photo.photoType === 'profile-pictures' || photo.photoType === 'agency-profile-photos'
        );
        
        console.log('🗑️ Existing profile photos to delete:', existingProfilePhotos.length);
        
        // Delete existing profile photos
        for (const photo of existingProfilePhotos) {
          try {
            console.log('🗑️ Deleting photo:', photo.id, photo.photoType);
            await ClientPhotoService.deletePhoto(photo.id, photo.supabasePath, photo.bucket);
          } catch (error) {
            console.warn('Failed to delete old profile photo:', error);
            // Continue with upload even if deletion fails
          }
        }
        
        // Force refresh after cleanup and wait for it to complete
        if (existingProfilePhotos.length > 0) {
          console.log('🔄 Refreshing photos after cleanup...');
          await refetchPhotos();
          // Add a small delay to ensure the UI state is updated
          await new Promise(resolve => setTimeout(resolve, 200));
          console.log('✅ Photos refreshed after cleanup');
        }
      }

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

      const uploadedPhotos = await Promise.all(uploadPromises);
      console.log('📸 Uploaded photos:', uploadedPhotos.length);
      
      // Force multiple refreshes to ensure the new photo is loaded
      console.log('🔄 First refresh after upload...');
      await refetchPhotos();
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('🔄 Second refresh after upload...');
      await refetchPhotos(); // Second refresh to be extra sure
      console.log('✅ Photo upload and refresh complete');
      
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

  const handleLanguageChange = (index, field, value) => {
    setEditData(prev => {
      const currentLanguages = prev.experience?.languagesSpoken || [];
      const newLanguages = [...currentLanguages];
      
      // Ensure the language object exists
      if (!newLanguages[index]) {
        newLanguages[index] = { language: '', proficiency: 'basic', canTeach: false };
      }
      
      // Update the specific field
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: value
      };
      
      return {
        ...prev,
        experience: {
          ...prev.experience,
          languagesSpoken: newLanguages
        }
      };
    });
  };

  const addLanguage = () => {
    setEditData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        languagesSpoken: [
          ...(prev.experience?.languagesSpoken || []),
          { language: '', proficiency: 'basic', canTeach: false }
        ]
      }
    }));
  };

  const removeLanguage = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        languagesSpoken: (prev.experience?.languagesSpoken || []).filter((_, i) => i !== index)
      }
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

  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-slate-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Modern Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back to Dashboard</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
              <div className="relative px-8 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
                  {/* Profile Picture */}
                  <div className="relative">
                                                                                        {(() => {
                          // Get the correct profile photo type based on user type
                          let profilePhotoType;
                          if (user?.userType === 'employer') {
                            profilePhotoType = 'employer-profiles';
                          } else if (user?.userType === 'agency') {
                            profilePhotoType = 'agency-profile-photos';
                          } else {
                            profilePhotoType = 'profile-pictures';
                          }
                          
                          const profilePhoto = allPhotos.find(photo => photo.photoType === profilePhotoType);
                          console.log('🖼️ Current profile photo:', profilePhoto?.id, profilePhoto?.url?.substring(0, 50));
                          return profilePhoto ? (
                        <img 
                          key={profilePhoto.id} // Force re-render when photo changes
                          className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg" 
                          src={profilePhoto.url} 
                          alt={user.fullName} 
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center">
                          <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1 mt-6 sm:mt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                          {user.fullName || 'Welcome'}
                        </h1>
                        <div className="flex items-center space-x-4 text-slate-600">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium capitalize">
                              {user.userType?.replace('_', ' ')}
                            </span>
                          </div>
                          {user.location && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{user.email || user.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
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
                    <HelperExperienceInfo 
                      user={user}
                      isEditing={isEditing}
                      editData={editData}
                      setEditData={setEditData}
                    />
                    <HelperPreferencesInfo 
                      user={user}
                      isEditing={isEditing}
                      editData={editData}
                      setEditData={setEditData}
                    />
                    <HelperAvailabilityInfo 
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
                    <EmployerHouseholdInfo 
                      user={user}
                      isEditing={isEditing}
                      editData={editData}
                      setEditData={setEditData}
                    />
                    <EmployerPreferences 
                      user={user}
                      isEditing={isEditing}
                      editData={editData}
                      setEditData={setEditData}
                    />
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Photos Section */}
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

                {/* Account Security Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Account Security
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900">Password</h4>
                        <p className="text-sm text-slate-500">Update your password to keep your account secure</p>
                      </div>
                      <Link 
                        href="/auth/change-password"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Change
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900">Email Address</h4>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900">Phone Number</h4>
                          <p className="text-sm text-slate-500">{user.phoneNumber}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}