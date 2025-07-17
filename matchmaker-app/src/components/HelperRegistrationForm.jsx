import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const HelperRegistrationForm = ({ onSubmit, isLoading = false }) => {
  const { signOut, user } = useAuth();
  const [formData, setFormData] = useState({
    // A. Personal Information
    name: '',
    dateOfBirth: '',
    countryOfBirth: '',
    cityOfBirth: '',
    nationality: '',
    height: '',
    weight: '',
    residentialAddress: '',
    repatriationPort: '',
    contactNumber: '',
    religion: '',
    educationLevel: '',
    numberOfSiblings: '',
    maritalStatus: '',
    numberOfChildren: '',
    hasBeenHelperBefore: '',
    
    // B. Medical History / Dietary restriction
    hasAllergies: '',
    allergiesDetails: '',
    hasPastIllness: '',
    illnessDetails: '',
    hasPhysicalDisabilities: '',
    disabilitiesDetails: '',
    foodHandlingPreferences: [],
    
    // C. Other information
    requiredOffDays: '',
    otherRemarks: '',
    
    // D. Job experience (conditional based on hasBeenHelperBefore)
    experience: {
      careOfInfant: {
        hasExperience: false,
        ages: [],
        duration: { from: '', to: '' }
      },
      careOfChildren: {
        hasExperience: false,
        ages: [],
        duration: { from: '', to: '' }
      },
      careOfDisabled: false,
      careOfOldAge: false,
      generalHousework: false,
      cooking: {
        hasExperience: false,
        cuisines: []
      },
      languagesSpoken: '',
      otherSkills: ''
    },
    
    // Ex-employer snapshots
    employers: [
      {
        name: '',
        country: '',
        duration: { from: '', to: '' }
      }
    ],
    
    // E. Job preference
    preferences: {
      careOfInfant: '',
      careOfChildren: '',
      careOfDisabled: '',
      careOfOldAge: '',
      generalHousework: '',
      cooking: ''
    },
    
    // F. Interview preference
    interview: {
      availability: '',
      availabilityDate: '',
      means: ''
    },
    
    // G. Readiness
    readiness: {
      hasValidPassport: '',
      canStartWork: '',
      startDate: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Constants for form options
  const EDUCATION_LEVELS = [
    'primary_school',
    'secondary_school', 
    'high_school',
    'university'
  ];

  const MARITAL_STATUS = [
    'single',
    'married', 
    'divorced',
    'widowed'
  ];

  const FOOD_PREFERENCES = [
    'no_pork',
    'no_beef',
    'others'
  ];

  const CUISINES = [
    'italian',
    'chinese',
    'french',
    'japanese',
    'mexican',
    'indian',
    'thai',
    'malay',
    'indonesian',
    'vietnamese'
  ];

  const INTERVIEW_MEANS = [
    'whatsapp_video_call',
    'voice_call',
    'face_to_face',
    'others'
  ];

  const COUNTRIES = [
    'Philippines', 'Indonesia', 'Myanmar', 'Sri Lanka', 'India', 'Bangladesh', 'Nepal', 'Thailand', 'Vietnam', 'Cambodia'
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleExperienceChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [type]: typeof prev.experience[type] === 'object' ? {
          ...prev.experience[type],
          [field]: value
        } : value
      }
    }));
  };

  const handleEmployerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      employers: prev.employers.map((employer, i) => 
        i === index ? { ...employer, [field]: value } : employer
      )
    }));
  };

  const addEmployer = () => {
    setFormData(prev => ({
      ...prev,
      employers: [...prev.employers, { name: '', country: '', duration: { from: '', to: '' } }]
    }));
  };

  const removeEmployer = (index) => {
    if (formData.employers.length > 1) {
      setFormData(prev => ({
        ...prev,
        employers: prev.employers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert to ML-optimized format
    const mlOptimizedData = convertToMLFormat(formData);
    onSubmit(mlOptimizedData);
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic validation - add more as needed
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.nationality) errors.nationality = 'Nationality is required';
    if (!formData.educationLevel) errors.educationLevel = 'Education level is required';
    if (!formData.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!formData.hasBeenHelperBefore) errors.hasBeenHelperBefore = 'This field is required';
    
    return errors;
  };

  const convertToMLFormat = (data) => {
    // Convert form data to ML-optimized format for TensorFlow
    const currentYear = new Date().getFullYear();
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    
    return {
      ...data,
      // ML-optimized fields
      mlProfile: {
        // Demographics (numerical features)
        age: age,
        heightCm: parseInt(data.height) || 0,
        weightKg: parseInt(data.weight) || 0,
        numberOfSiblings: parseInt(data.numberOfSiblings) || 0,
        numberOfChildren: parseInt(data.numberOfChildren) || 0,
        
        // Education level as ordinal (0-3)
        educationScore: EDUCATION_LEVELS.indexOf(data.educationLevel),
        
        // Experience features
        hasHelperExperience: data.hasBeenHelperBefore === 'yes',
        experienceYears: calculateExperienceYears(data.employers),
        
        // Skills as binary features
        skillsVector: {
          careOfInfant: data.experience.careOfInfant.hasExperience,
          careOfChildren: data.experience.careOfChildren.hasExperience,
          careOfDisabled: data.experience.careOfDisabled,
          careOfOldAge: data.experience.careOfOldAge,
          generalHousework: data.experience.generalHousework,
          cooking: data.experience.cooking.hasExperience
        },
        
        // Preferences as binary features
        preferencesVector: {
          careOfInfant: data.preferences.careOfInfant === 'yes',
          careOfChildren: data.preferences.careOfChildren === 'yes',
          careOfDisabled: data.preferences.careOfDisabled === 'yes',
          careOfOldAge: data.preferences.careOfOldAge === 'yes',
          generalHousework: data.preferences.generalHousework === 'yes',
          cooking: data.preferences.cooking === 'yes'
        },
        
        // Availability features
        requiredOffDays: parseInt(data.requiredOffDays) || 0,
        immediateAvailable: data.readiness.canStartWork === 'immediately',
        hasValidPassport: data.readiness.hasValidPassport === 'yes',
        
        // Health/dietary restrictions
        hasAllergies: data.hasAllergies === 'yes',
        hasMedicalIssues: data.hasPastIllness === 'yes',
        hasPhysicalDisabilities: data.hasPhysicalDisabilities === 'yes',
        
        // Cuisine expertise (multi-hot encoding)
        cuisineExpertise: data.experience.cooking.cuisines || [],
        
        // Embeddings (will be generated by ML pipeline)
        helperEmbedding: [],
        
        // Match compatibility scores (calculated during matching)
        compatibilityScores: {}
      }
    };
  };

  const calculateExperienceYears = (employers) => {
    return employers.reduce((total, employer) => {
      if (employer.duration.from && employer.duration.to) {
        const years = parseInt(employer.duration.to) - parseInt(employer.duration.from);
        return total + (years > 0 ? years : 0);
      }
      return total;
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Helper Registration Form</h2>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-sm text-gray-600">
              Signed in as: <span className="font-medium">{user.email || user.phoneNumber}</span>
            </div>
          )}
          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* A. Personal Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">A. Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange(null, 'dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country of Birth</label>
              <select
                value={formData.countryOfBirth}
                onChange={(e) => handleInputChange(null, 'countryOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City/Town of Birth</label>
              <input
                type="text"
                value={formData.cityOfBirth}
                onChange={(e) => handleInputChange(null, 'cityOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange(null, 'nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange(null, 'height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="120"
                max="220"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange(null, 'weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="30"
                max="200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => handleInputChange(null, 'religion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleInputChange(null, 'educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Education Level</option>
                <option value="primary_school">Primary School</option>
                <option value="secondary_school">Secondary School</option>
                <option value="high_school">High School</option>
                <option value="university">University</option>
              </select>
              {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Siblings</label>
              <select
                value={formData.numberOfSiblings}
                onChange={(e) => handleInputChange(null, 'numberOfSiblings', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Number</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange(null, 'maritalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
              {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
              <select
                value={formData.numberOfChildren}
                onChange={(e) => handleInputChange(null, 'numberOfChildren', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Number</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address in Home Country</label>
              <textarea
                value={formData.residentialAddress}
                onChange={(e) => handleInputChange(null, 'residentialAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number in Home Country</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange(null, 'contactNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+63 912 345 6789"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Have Been Helper Before? *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasBeenHelperBefore"
                    value="yes"
                    checked={formData.hasBeenHelperBefore === 'yes'}
                    onChange={(e) => handleInputChange(null, 'hasBeenHelperBefore', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasBeenHelperBefore"
                    value="no"
                    checked={formData.hasBeenHelperBefore === 'no'}
                    onChange={(e) => handleInputChange(null, 'hasBeenHelperBefore', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {errors.hasBeenHelperBefore && <p className="text-red-500 text-sm mt-1">{errors.hasBeenHelperBefore}</p>}
            </div>
          </div>
        </section>

        {/* B. Medical History / Dietary Restrictions */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">B. Medical History / Dietary Restrictions</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <div className="flex space-x-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="yes"
                    checked={formData.hasAllergies === 'yes'}
                    onChange={(e) => handleInputChange(null, 'hasAllergies', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="no"
                    checked={formData.hasAllergies === 'no'}
                    onChange={(e) => handleInputChange(null, 'hasAllergies', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {formData.hasAllergies === 'yes' && (
                <textarea
                  value={formData.allergiesDetails}
                  onChange={(e) => handleInputChange(null, 'allergiesDetails', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please elaborate on allergies..."
                  rows="2"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Past and Existing Illness</label>
              <div className="flex space-x-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPastIllness"
                    value="yes"
                    checked={formData.hasPastIllness === 'yes'}
                    onChange={(e) => handleInputChange(null, 'hasPastIllness', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPastIllness"
                    value="no"
                    checked={formData.hasPastIllness === 'no'}
                    onChange={(e) => handleInputChange(null, 'hasPastIllness', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {formData.hasPastIllness === 'yes' && (
                <textarea
                  value={formData.illnessDetails}
                  onChange={(e) => handleInputChange(null, 'illnessDetails', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please elaborate on illnesses..."
                  rows="2"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Disabilities</label>
              <div className="flex space-x-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPhysicalDisabilities"
                    value="yes"
                    checked={formData.hasPhysicalDisabilities === 'yes'}
                    onChange={(e) => handleInputChange(null, 'hasPhysicalDisabilities', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPhysicalDisabilities"
                    value="no"
                    checked={formData.hasPhysicalDisabilities === 'no'}
                    onChange={(e) => handleInputChange(null, 'hasPhysicalDisabilities', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {formData.hasPhysicalDisabilities === 'yes' && (
                <textarea
                  value={formData.disabilitiesDetails}
                  onChange={(e) => handleInputChange(null, 'disabilitiesDetails', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please elaborate on disabilities..."
                  rows="2"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Handling Preferences</label>
              <div className="space-y-2">
                {FOOD_PREFERENCES.map(pref => (
                  <label key={pref} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.foodHandlingPreferences.includes(pref)}
                      onChange={(e) => {
                        const newPrefs = e.target.checked
                          ? [...formData.foodHandlingPreferences, pref]
                          : formData.foodHandlingPreferences.filter(p => p !== pref);
                        handleInputChange(null, 'foodHandlingPreferences', newPrefs);
                      }}
                      className="mr-2"
                    />
                    {pref.replace('_', ' ').toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* C. Other Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">C. Other Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Off Days</label>
              <select
                value={formData.requiredOffDays}
                onChange={(e) => handleInputChange(null, 'requiredOffDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Number</option>
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Remarks</label>
              <textarea
                value={formData.otherRemarks}
                onChange={(e) => handleInputChange(null, 'otherRemarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any additional information..."
              />
            </div>
          </div>
        </section>

        {/* D. Job Experience (conditional) */}
        {formData.hasBeenHelperBefore === 'yes' && (
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">D. Job Experience</h3>
            
            <div className="space-y-6">
              {/* Care of Infant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care of Infant</label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfant"
                      value="yes"
                      checked={formData.experience.careOfInfant.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfInfant', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfant"
                      value="no"
                      checked={!formData.experience.careOfInfant.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfInfant', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                
                {formData.experience.careOfInfant.hasExperience && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age (months)</label>
                      <select
                        multiple
                        value={formData.experience.careOfInfant.ages}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          handleExperienceChange('careOfInfant', 'ages', selected);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(13)].map((_, i) => (
                          <option key={i} value={i}>{i} months</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
                      <input
                        type="number"
                        value={formData.experience.careOfInfant.duration.from}
                        onChange={(e) => handleExperienceChange('careOfInfant', 'duration', {
                          ...formData.experience.careOfInfant.duration,
                          from: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1990"
                        max="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Year</label>
                      <input
                        type="number"
                        value={formData.experience.careOfInfant.duration.to}
                        onChange={(e) => handleExperienceChange('careOfInfant', 'duration', {
                          ...formData.experience.careOfInfant.duration,
                          to: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1990"
                        max="2024"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Similar structure for other experience types */}
              {/* Care of Children */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care of Children</label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfChildren"
                      value="yes"
                      checked={formData.experience.careOfChildren.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfChildren', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfChildren"
                      value="no"
                      checked={!formData.experience.careOfChildren.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfChildren', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                
                {formData.experience.careOfChildren.hasExperience && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                      <select
                        multiple
                        value={formData.experience.careOfChildren.ages}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          handleExperienceChange('careOfChildren', 'ages', selected);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(13)].map((_, i) => (
                          <option key={i} value={i}>{i} years</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
                      <input
                        type="number"
                        value={formData.experience.careOfChildren.duration.from}
                        onChange={(e) => handleExperienceChange('careOfChildren', 'duration', {
                          ...formData.experience.careOfChildren.duration,
                          from: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1990"
                        max="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Year</label>
                      <input
                        type="number"
                        value={formData.experience.careOfChildren.duration.to}
                        onChange={(e) => handleExperienceChange('careOfChildren', 'duration', {
                          ...formData.experience.careOfChildren.duration,
                          to: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1990"
                        max="2024"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Other experience types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.experience.careOfDisabled}
                      onChange={(e) => handleExperienceChange('careOfDisabled', null, e.target.checked)}
                      className="mr-2"
                    />
                    Care of Disabled
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.experience.careOfOldAge}
                      onChange={(e) => handleExperienceChange('careOfOldAge', null, e.target.checked)}
                      className="mr-2"
                    />
                    Care of Old Age
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.experience.generalHousework}
                      onChange={(e) => handleExperienceChange('generalHousework', null, e.target.checked)}
                      className="mr-2"
                    />
                    General Housework
                  </label>
                </div>
              </div>

              {/* Cooking Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking</label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cooking"
                      value="yes"
                      checked={formData.experience.cooking.hasExperience}
                      onChange={(e) => handleExperienceChange('cooking', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cooking"
                      value="no"
                      checked={!formData.experience.cooking.hasExperience}
                      onChange={(e) => handleExperienceChange('cooking', 'hasExperience', e.target.value === 'yes')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                
                {formData.experience.cooking.hasExperience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisines</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {CUISINES.map(cuisine => (
                        <label key={cuisine} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.experience.cooking.cuisines.includes(cuisine)}
                            onChange={(e) => {
                              const newCuisines = e.target.checked
                                ? [...formData.experience.cooking.cuisines, cuisine]
                                : formData.experience.cooking.cuisines.filter(c => c !== cuisine);
                              handleExperienceChange('cooking', 'cuisines', newCuisines);
                            }}
                            className="mr-2"
                          />
                          {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Languages and Other Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                  <textarea
                    value={formData.experience.languagesSpoken}
                    onChange={(e) => handleExperienceChange('languagesSpoken', null, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="e.g., English, Mandarin, Cantonese"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Skills</label>
                  <textarea
                    value={formData.experience.otherSkills}
                    onChange={(e) => handleExperienceChange('otherSkills', null, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="e.g., Pet care, gardening, tutoring"
                  />
                </div>
              </div>
            </div>

            {/* Ex-employer Snapshots */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Ex-employer Snapshots</h4>
              
              {formData.employers.map((employer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                      <input
                        type="text"
                        value={employer.name}
                        onChange={(e) => handleEmployerChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        value={employer.country}
                        onChange={(e) => handleEmployerChange(index, 'country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Country</option>
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
                        <input
                          type="number"
                          value={employer.duration.from}
                          onChange={(e) => handleEmployerChange(index, 'duration', {
                            ...employer.duration,
                            from: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1990"
                          max="2024"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Year</label>
                        <input
                          type="number"
                          value={employer.duration.to}
                          onChange={(e) => handleEmployerChange(index, 'duration', {
                            ...employer.duration,
                            to: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1990"
                          max="2024"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => removeEmployer(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Employer
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEmployer}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Employer
              </button>
            </div>
          </section>
        )}

        {/* E. Job Preferences */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">E. Job Preferences</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to take care of infant?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfantPref"
                      value="yes"
                      checked={formData.preferences.careOfInfant === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'careOfInfant', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfantPref"
                      value="no"
                      checked={formData.preferences.careOfInfant === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'careOfInfant', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to take care of children?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfChildrenPref"
                      value="yes"
                      checked={formData.preferences.careOfChildren === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'careOfChildren', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfChildrenPref"
                      value="no"
                      checked={formData.preferences.careOfChildren === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'careOfChildren', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to take care of disabled?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfDisabledPref"
                      value="yes"
                      checked={formData.preferences.careOfDisabled === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'careOfDisabled', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfDisabledPref"
                      value="no"
                      checked={formData.preferences.careOfDisabled === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'careOfDisabled', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to take care of old age?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfOldAgePref"
                      value="yes"
                      checked={formData.preferences.careOfOldAge === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'careOfOldAge', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfOldAgePref"
                      value="no"
                      checked={formData.preferences.careOfOldAge === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'careOfOldAge', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to do general housework?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="generalHouseworkPref"
                      value="yes"
                      checked={formData.preferences.generalHousework === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'generalHousework', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="generalHouseworkPref"
                      value="no"
                      checked={formData.preferences.generalHousework === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'generalHousework', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Willing to cook?</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cookingPref"
                      value="yes"
                      checked={formData.preferences.cooking === 'yes'}
                      onChange={(e) => handleInputChange('preferences', 'cooking', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cookingPref"
                      value="no"
                      checked={formData.preferences.cooking === 'no'}
                      onChange={(e) => handleInputChange('preferences', 'cooking', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* F. Interview Preference */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">F. Interview Preference</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability for Interview</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interviewAvailability"
                    value="immediate"
                    checked={formData.interview.availability === 'immediate'}
                    onChange={(e) => handleInputChange('interview', 'availability', e.target.value)}
                    className="mr-2"
                  />
                  Immediate
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interviewAvailability"
                    value="after_date"
                    checked={formData.interview.availability === 'after_date'}
                    onChange={(e) => handleInputChange('interview', 'availability', e.target.value)}
                    className="mr-2"
                  />
                  After a Date
                </label>
              </div>
              
              {formData.interview.availability === 'after_date' && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                  <input
                    type="date"
                    value={formData.interview.availabilityDate}
                    onChange={(e) => handleInputChange('interview', 'availabilityDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Means of Interview</label>
              <select
                value={formData.interview.means}
                onChange={(e) => handleInputChange('interview', 'means', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Interview Method</option>
                <option value="whatsapp_video_call">WhatsApp Video Call</option>
                <option value="voice_call">Voice Call</option>
                <option value="face_to_face">Face to Face</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>
        </section>

        {/* G. Readiness */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">G. Readiness</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Have Valid Passport?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasValidPassport"
                    value="yes"
                    checked={formData.readiness.hasValidPassport === 'yes'}
                    onChange={(e) => handleInputChange('readiness', 'hasValidPassport', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasValidPassport"
                    value="no"
                    checked={formData.readiness.hasValidPassport === 'no'}
                    onChange={(e) => handleInputChange('readiness', 'hasValidPassport', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Can Start Work</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="canStartWork"
                    value="immediately"
                    checked={formData.readiness.canStartWork === 'immediately'}
                    onChange={(e) => handleInputChange('readiness', 'canStartWork', e.target.value)}
                    className="mr-2"
                  />
                  Immediately
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="canStartWork"
                    value="after_date"
                    checked={formData.readiness.canStartWork === 'after_date'}
                    onChange={(e) => handleInputChange('readiness', 'canStartWork', e.target.value)}
                    className="mr-2"
                  />
                  After a Date
                </label>
              </div>
              
              {formData.readiness.canStartWork === 'after_date' && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.readiness.startDate}
                    onChange={(e) => handleInputChange('readiness', 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register Helper'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HelperRegistrationForm;