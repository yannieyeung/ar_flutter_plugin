'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useRouter, useParams } from 'next/navigation';
import { ClientUserService } from '@/lib/db-client';
import MultiStepHelperRegistration from '@/components/MultiStepHelperRegistration';
import { HybridDataService } from '@/lib/hybrid-data-service';
import HybridPhotoUpload from '@/components/HybridPhotoUpload';

export default function RegistrationPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userType = params.userType;

  // Form state
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    description: '',
    location: '',
    
    // Employer specific
    companyName: '',
    companySize: '',
    industry: '',
    
    // Agency specific
    agencyName: '',
    agencyLicense: '',
    servicesOffered: '',
    
    // Helper specific
    skills: '',
    experience: '',
    availability: '',
    hourlyRate: '',
  });

  // Image state for hybrid approach
  const [images, setImages] = useState({
    profile: [],
    portfolio: [],
    certificates: [],
    identityDocuments: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  // Validate user type
  useEffect(() => {
    if (user && user.userType !== userType) {
      router.push(`/registration/${user.userType}`);
    }
  }, [user, userType, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('User not found. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress('Preparing registration data...');

    try {
      // Prepare update data based on user type
      const updateData = {
        fullName: formData.fullName,
        description: formData.description,
        location: formData.location,
        userType: userType,
        isRegistrationComplete: true,
      };

      // Add user type specific fields
      if (userType === 'employer') {
        updateData.companyName = formData.companyName;
        updateData.companySize = formData.companySize;
        updateData.industry = formData.industry;
      } else if (userType === 'agency') {
        updateData.agencyName = formData.agencyName;
        updateData.agencyLicense = formData.agencyLicense;
        updateData.servicesOffered = formData.servicesOffered;
      } else if (userType === 'individual_helper') {
        updateData.skills = formData.skills;
        updateData.experience = formData.experience;
        updateData.availability = formData.availability;
        updateData.hourlyRate = formData.hourlyRate;
      }

      // Prepare image files for upload
      const imageFiles = {};
      
      // Convert image states to File arrays
      Object.keys(images).forEach(category => {
        if (images[category] && images[category].length > 0) {
          // If images are already uploaded (from HybridPhotoUpload), skip
          // If they are File objects, add them for upload
          const fileObjects = images[category].filter(img => img instanceof File);
          if (fileObjects.length > 0) {
            imageFiles[category] = fileObjects;
          }
        }
      });

      console.log('Starting hybrid registration save:', {
        userId: user.uid,
        userType: userType,
        imageCategories: Object.keys(imageFiles),
        totalImages: Object.values(imageFiles).flat().length
      });

      // Use hybrid data service to save user data and images
      const savedData = await HybridDataService.saveUserWithImages(
        user.uid,
        updateData,
        imageFiles,
        (message, progress) => {
          setUploadProgress(`${message} (${Math.round(progress)}%)`);
        }
      );

      console.log('Hybrid registration completed:', savedData);

      // Refresh user data in context
      await refreshUser();

      // Show success message
      setUploadProgress('Registration completed successfully! 🎉');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Hybrid registration error:', error);
      setError('Failed to complete registration. Please try again.');
      setUploadProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelperRegistration = async (helperData) => {
    if (!user?.uid) {
      setError('User not found. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare comprehensive helper data
      const updateData = {
        // Personal Information
        fullName: helperData.name,
        dateOfBirth: helperData.dateOfBirth,
        nationality: helperData.nationality,
        countryOfBirth: helperData.countryOfBirth,
        cityOfBirth: helperData.cityOfBirth,
        religion: helperData.religion,
        height: helperData.height,
        weight: helperData.weight,
        educationLevel: helperData.educationLevel,
        numberOfSiblings: helperData.numberOfSiblings,
        maritalStatus: helperData.maritalStatus,
        numberOfChildren: helperData.numberOfChildren,
        residentialAddress: helperData.residentialAddress,
        repatriationPort: helperData.repatriationPort,
        contactNumber: helperData.contactNumber,
        
        // Experience and Skills
        hasBeenHelperBefore: helperData.hasBeenHelperBefore,
        experience: helperData.experience,
        relevantSkills: helperData.relevantSkills,
        
        // Medical Information
        hasAllergies: helperData.hasAllergies,
        allergiesDetails: helperData.allergiesDetails,
        hasPastIllness: helperData.hasPastIllness,
        illnessDetails: helperData.illnessDetails,
        foodHandlingPreferences: helperData.foodHandlingPreferences,
        requiredOffDays: helperData.requiredOffDays,
        
        // Job Preferences
        preferences: helperData.preferences,
        
        // Availability & Interview
        interview: helperData.interview,
        readiness: helperData.readiness,
        otherRemarks: helperData.otherRemarks,
        
        // Photos
        profilePicture: helperData.profilePicture,
        portfolioPhotos: helperData.portfolioPhotos,
        certificates: helperData.certificates,
        identityDocuments: helperData.identityDocuments,
        experienceProof: helperData.experienceProof,
        
        // ML Profile
        mlProfile: helperData.mlProfile,
        
        // Registration status
        isRegistrationComplete: true,
        registrationCompletedAt: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness(helperData)
      };

      // Update user profile
      await ClientUserService.updateUser(user.uid, updateData);

      // Refresh user data in context
      await refreshUser();

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Helper registration error:', error);
      setError('Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompleteness = (data) => {
    let completeness = 0;
    const totalFields = 10;
    
    // Basic info
    if (data.name) completeness += 1;
    if (data.dateOfBirth) completeness += 1;
    if (data.nationality) completeness += 1;
    if (data.educationLevel) completeness += 1;
    if (data.maritalStatus) completeness += 1;
    
    // Experience
    if (data.hasBeenHelperBefore) completeness += 1;
    
    // Preferences
    if (data.preferences && Object.keys(data.preferences).length > 0) completeness += 1;
    
    // Photos
    if (data.profilePicture && data.profilePicture.length > 0) completeness += 1;
    if (data.portfolioPhotos && data.portfolioPhotos.length > 0) completeness += 1;
    if (data.certificates && data.certificates.length > 0) completeness += 1;
    
    return Math.round((completeness / totalFields) * 100);
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'employer':
        return 'Employer Registration';
      case 'agency':
        return 'Agency Registration';
      case 'individual_helper':
        return 'Helper Registration';
      default:
        return 'Registration';
    }
  };

  const renderUserTypeFields = () => {
    switch (userType) {
      case 'employer':
        return (
          <>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                required
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                name="companySize"
                id="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                id="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="e.g., Healthcare, Technology, Manufacturing"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        );

      case 'agency':
        return (
          <>
            <div>
              <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
                Agency Name *
              </label>
              <input
                type="text"
                name="agencyName"
                id="agencyName"
                required
                value={formData.agencyName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="agencyLicense" className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                name="agencyLicense"
                id="agencyLicense"
                value={formData.agencyLicense}
                onChange={handleInputChange}
                placeholder="Professional license or registration number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700">
                Services Offered
              </label>
              <textarea
                name="servicesOffered"
                id="servicesOffered"
                rows={3}
                value={formData.servicesOffered}
                onChange={handleInputChange}
                placeholder="Describe the types of staffing services you provide"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        );

      case 'individual_helper':
        return (
          <>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills & Expertise *
              </label>
              <textarea
                name="skills"
                id="skills"
                rows={3}
                required
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="List your key skills and areas of expertise"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <select
                name="experience"
                id="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                name="availability"
                id="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select availability</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                Hourly Rate (Optional)
              </label>
              <input
                type="text"
                name="hourlyRate"
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                placeholder="e.g., $25/hour or Negotiable"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {userType === 'individual_helper' ? (
          // Multi-step form for helpers
          <div className="max-w-6xl mx-auto">
            <MultiStepHelperRegistration
              onSubmit={handleHelperRegistration}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Original form for employers and agencies
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">{getUserTypeTitle()}</h2>
              <p className="mt-2 text-sm text-gray-600">
                Complete your profile to start using MatchMaker
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Common Fields */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* User Type Specific Fields */}
                {renderUserTypeFields()}

                {/* Image Upload Sections for Hybrid Approach */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    📷 Photos & Documents
                    <span className="ml-2 text-sm text-blue-600">(Stored in Supabase - 90% cheaper!)</span>
                  </h3>
                  
                  {/* Profile Picture */}
                  <div className="mb-6">
                    <HybridPhotoUpload
                      label="Profile Picture"
                      description="Upload a professional photo of yourself"
                      category="profile"
                      maxFiles={1}
                      photos={images.profile}
                      onChange={(photos) => setImages(prev => ({ ...prev, profile: photos }))}
                    />
                  </div>

                  {/* Portfolio Photos (for helpers and agencies) */}
                  {(userType === 'individual_helper' || userType === 'agency') && (
                    <div className="mb-6">
                      <HybridPhotoUpload
                        label="Portfolio Photos"
                        description="Show examples of your work and experience"
                        category="portfolio"
                        maxFiles={5}
                        photos={images.portfolio}
                        onChange={(photos) => setImages(prev => ({ ...prev, portfolio: photos }))}
                      />
                    </div>
                  )}

                  {/* Certificates (for helpers) */}
                  {userType === 'individual_helper' && (
                    <div className="mb-6">
                      <HybridPhotoUpload
                        label="Certificates & Qualifications"
                        description="Upload certificates, licenses, or training documents"
                        category="certificates"
                        maxFiles={3}
                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
                        photos={images.certificates}
                        onChange={(photos) => setImages(prev => ({ ...prev, certificates: photos }))}
                      />
                    </div>
                  )}

                  {/* Identity Documents (optional) */}
                  <div className="mb-6">
                    <HybridPhotoUpload
                      label="Identity Verification (Optional)"
                      description="Upload ID documents for verification (stored securely)"
                      category="identity-documents"
                      maxFiles={2}
                      photos={images.identityDocuments}
                      onChange={(photos) => setImages(prev => ({ ...prev, identityDocuments: photos }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and what you're looking for..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Upload Progress */}
                {uploadProgress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <p className="text-blue-700 text-sm">{uploadProgress}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {uploadProgress ? 'Saving...' : 'Completing Registration...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Complete Registration</span>
                        <span className="ml-2 text-xs">(💾 Images → Supabase)</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}