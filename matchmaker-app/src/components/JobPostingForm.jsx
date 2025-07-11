import React, { useState } from 'react';

const JobPostingForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    // Basic Job Information
    jobTitle: '',
    jobDescription: '',
    location: {
      address: '',
      district: '',
      city: '',
      coordinates: { lat: '', lng: '' }
    },
    
    // Job Requirements
    requirements: {
      // Care Requirements
      careOfInfant: {
        required: false,
        ageRange: [], // 0-12 months
        importance: 'medium' // low, medium, high, critical
      },
      careOfChildren: {
        required: false,
        ageRange: [], // 0-12 years
        importance: 'medium'
      },
      careOfDisabled: {
        required: false,
        importance: 'medium'
      },
      careOfOldAge: {
        required: false,
        importance: 'medium'
      },
      generalHousework: {
        required: false,
        importance: 'medium'
      },
      cooking: {
        required: false,
        cuisinePreferences: [],
        importance: 'medium'
      },
      
      // Experience Requirements
      minimumExperience: '', // 0, 1, 2, 3, 4, 5+ years
      helperExperienceRequired: '', // yes, no, preferred
      
      // Personal Requirements
      educationLevel: '', // minimum education required
      ageRange: { min: 18, max: 65 },
      nationalityPreferences: [],
      
      // Language Requirements
      languagesRequired: [],
      
      // Physical Requirements
      noAllergies: false,
      noMedicalIssues: false,
      noPhysicalDisabilities: false,
      
      // Schedule Requirements
      workingDays: [],
      workingHours: { start: '', end: '' },
      liveIn: '', // required, preferred, not_required
      offDaysRequired: 0, // 0-4 days per week
      
      // Food/Dietary Requirements
      foodHandlingRequirements: [] // no_pork, no_beef, others
    },
    
    // Compensation
    salary: {
      amount: '',
      currency: 'HKD',
      period: 'monthly', // monthly, weekly, daily, hourly
      negotiable: false
    },
    
    // Job Details
    startDate: '',
    contractDuration: '', // 1_year, 2_years, permanent, temporary
    urgency: 'flexible', // immediate, within_week, within_month, flexible
    
    // Contact & Interview
    contact: {
      preferredMethod: '', // phone, email, whatsapp, app
      interviewMethod: '', // whatsapp_video_call, voice_call, face_to_face, others
      availableForInterview: '', // immediate, weekdays, weekends, specific_times
    },
    
    // Additional Information
    benefits: [],
    accommodations: [],
    specialRequirements: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  // Constants for form options
  const DISTRICTS = [
    'Central', 'Admiralty', 'Wan Chai', 'Causeway Bay', 'Tsim Sha Tsui',
    'Mong Kok', 'Yau Ma Tei', 'Jordan', 'Kowloon Tong', 'Sha Tin',
    'Tai Po', 'Fanling', 'Sheung Shui', 'Tuen Mun', 'Yuen Long'
  ];

  const CUISINES = [
    'italian', 'chinese', 'french', 'japanese', 'mexican', 'indian',
    'thai', 'malay', 'indonesian', 'vietnamese', 'western', 'local'
  ];

  const NATIONALITIES = [
    'Filipino', 'Indonesian', 'Myanmar', 'Sri Lankan', 'Indian', 
    'Bangladeshi', 'Nepalese', 'Thai', 'Vietnamese', 'Cambodian'
  ];

  const LANGUAGES = [
    'English', 'Cantonese', 'Mandarin', 'Tagalog', 'Indonesian',
    'Burmese', 'Sinhalese', 'Hindi', 'Bengali', 'Nepali', 'Thai'
  ];

  const BENEFITS = [
    'medical_insurance', 'dental_care', 'annual_leave', 'sick_leave',
    'bonus', 'overtime_pay', 'transportation_allowance', 'meal_allowance',
    'phone_allowance', 'training_provided'
  ];

  const ACCOMMODATIONS = [
    'private_room', 'shared_room', 'private_bathroom', 'shared_bathroom',
    'air_conditioning', 'wifi', 'television', 'refrigerator'
  ];

  const WORKING_DAYS = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
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

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (section, field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
          ? [...prev[section][field], value]
          : prev[section][field].filter(item => item !== value)
      }
    }));
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
    
    if (!formData.jobTitle) errors.jobTitle = 'Job title is required';
    if (!formData.jobDescription) errors.jobDescription = 'Job description is required';
    if (!formData.location.district) errors.district = 'District is required';
    if (!formData.salary.amount) errors.salary = 'Salary is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    
    return errors;
  };

  const convertToMLFormat = (data) => {
    // Convert form data to ML-optimized format for TensorFlow matching
    return {
      ...data,
      // ML-optimized fields for matching
      mlRequirements: {
        // Care requirements as binary features with importance weights
        careVector: {
          careOfInfant: data.requirements.careOfInfant.required,
          careOfChildren: data.requirements.careOfChildren.required,
          careOfDisabled: data.requirements.careOfDisabled.required,
          careOfOldAge: data.requirements.careOfOldAge.required,
          generalHousework: data.requirements.generalHousework.required,
          cooking: data.requirements.cooking.required
        },
        
        // Importance weights for weighted matching
        importanceWeights: {
          careOfInfant: mapImportanceToScore(data.requirements.careOfInfant.importance),
          careOfChildren: mapImportanceToScore(data.requirements.careOfChildren.importance),
          careOfDisabled: mapImportanceToScore(data.requirements.careOfDisabled.importance),
          careOfOldAge: mapImportanceToScore(data.requirements.careOfOldAge.importance),
          generalHousework: mapImportanceToScore(data.requirements.generalHousework.importance),
          cooking: mapImportanceToScore(data.requirements.cooking.importance)
        },
        
        // Experience requirements
        minimumExperienceYears: parseExperienceToYears(data.requirements.minimumExperience),
        helperExperienceRequired: data.requirements.helperExperienceRequired === 'yes',
        
        // Schedule requirements as vectors
        scheduleVector: convertScheduleToVector(data.requirements.workingDays),
        liveInRequired: data.requirements.liveIn === 'required',
        liveInPreferred: data.requirements.liveIn === 'preferred',
        offDaysRequired: parseInt(data.requirements.offDaysRequired) || 0,
        
        // Compensation
        salaryAmount: parseFloat(data.salary.amount) || 0,
        salaryNormalized: normalizeSalary(data.salary.amount),
        
        // Urgency and timing
        urgencyScore: mapUrgencyToScore(data.urgency),
        immediateStart: data.startDate === 'immediate',
        
        // Location preferences
        locationPreferences: {
          district: data.location.district,
          city: data.location.city,
          coordinates: data.location.coordinates
        },
        
        // Personal requirements
        ageRange: data.requirements.ageRange,
        nationalityPreferences: data.requirements.nationalityPreferences,
        languagesRequired: data.requirements.languagesRequired,
        
        // Health requirements
        healthRequirements: {
          noAllergies: data.requirements.noAllergies,
          noMedicalIssues: data.requirements.noMedicalIssues,
          noPhysicalDisabilities: data.requirements.noPhysicalDisabilities
        },
        
        // Cuisine preferences
        cuisinePreferences: data.requirements.cooking.cuisinePreferences,
        
        // Job embeddings (will be generated by ML pipeline)
        jobEmbedding: [],
        
        // Matching scores (calculated during matching process)
        matchingScores: {}
      }
    };
  };

  const mapImportanceToScore = (importance) => {
    const scores = {
      'low': 0.25,
      'medium': 0.5,
      'high': 0.75,
      'critical': 1.0
    };
    return scores[importance] || 0.5;
  };

  const parseExperienceToYears = (experience) => {
    if (!experience) return 0;
    if (experience === '5+') return 5;
    return parseInt(experience) || 0;
  };

  const convertScheduleToVector = (workingDays) => {
    const dayMap = {
      'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
      'friday': 4, 'saturday': 5, 'sunday': 6
    };
    
    const vector = [0, 0, 0, 0, 0, 0, 0];
    workingDays.forEach(day => {
      if (dayMap[day] !== undefined) {
        vector[dayMap[day]] = 1;
      }
    });
    
    return vector;
  };

  const normalizeSalary = (amount) => {
    // Normalize salary to 0-1 range for ML
    const salaryRanges = { min: 2000, max: 8000 };
    const normalizedSalary = (amount - salaryRanges.min) / (salaryRanges.max - salaryRanges.min);
    return Math.min(Math.max(normalizedSalary, 0), 1);
  };

  const mapUrgencyToScore = (urgency) => {
    const scores = {
      'immediate': 1.0,
      'within_week': 0.8,
      'within_month': 0.5,
      'flexible': 0.2
    };
    return scores[urgency] || 0.3;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Job Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Job Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange(null, 'jobTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Domestic Helper Needed"
                required
              />
              {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => handleInputChange(null, 'jobDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Describe the job responsibilities and requirements..."
                required
              />
              {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                <select
                  value={formData.location.district}
                  onChange={(e) => handleNestedInputChange('location', 'district', 'district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleNestedInputChange('location', 'city', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hong Kong"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange(null, 'urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate</option>
                  <option value="within_week">Within a Week</option>
                  <option value="within_month">Within a Month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Job Requirements */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Requirements</h3>
          
          {/* Care Requirements */}
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Care Requirements</h4>
              
              <div className="space-y-4">
                {/* Care of Infant */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="careOfInfant"
                      checked={formData.requirements.careOfInfant.required}
                      onChange={(e) => handleNestedInputChange('requirements', 'careOfInfant', 'required', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="careOfInfant" className="text-sm font-medium text-gray-700">
                      Care of Infant
                    </label>
                  </div>
                  
                  {formData.requirements.careOfInfant.required && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (months)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.careOfInfant.ageRange.includes(i)}
                                onChange={(e) => handleArrayInputChange('requirements', 'careOfInfant.ageRange', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.careOfInfant.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfInfant', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Care of Children */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="careOfChildren"
                      checked={formData.requirements.careOfChildren.required}
                      onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'required', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="careOfChildren" className="text-sm font-medium text-gray-700">
                      Care of Children
                    </label>
                  </div>
                  
                  {formData.requirements.careOfChildren.required && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (years)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.careOfChildren.ageRange.includes(i)}
                                onChange={(e) => handleArrayInputChange('requirements', 'careOfChildren.ageRange', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.careOfChildren.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other Care Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="careOfDisabled"
                        checked={formData.requirements.careOfDisabled.required}
                        onChange={(e) => handleNestedInputChange('requirements', 'careOfDisabled', 'required', e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="careOfDisabled" className="text-sm font-medium text-gray-700">
                        Care of Disabled
                      </label>
                    </div>
                    
                    {formData.requirements.careOfDisabled.required && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.careOfDisabled.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfDisabled', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="careOfOldAge"
                        checked={formData.requirements.careOfOldAge.required}
                        onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'required', e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="careOfOldAge" className="text-sm font-medium text-gray-700">
                        Care of Elderly
                      </label>
                    </div>
                    
                    {formData.requirements.careOfOldAge.required && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.careOfOldAge.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="generalHousework"
                        checked={formData.requirements.generalHousework.required}
                        onChange={(e) => handleNestedInputChange('requirements', 'generalHousework', 'required', e.target.checked)}
                        className="mr-3"
                      />
                      <label htmlFor="generalHousework" className="text-sm font-medium text-gray-700">
                        General Housework
                      </label>
                    </div>
                    
                    {formData.requirements.generalHousework.required && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.generalHousework.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'generalHousework', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cooking Requirements */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="cooking"
                      checked={formData.requirements.cooking.required}
                      onChange={(e) => handleNestedInputChange('requirements', 'cooking', 'required', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="cooking" className="text-sm font-medium text-gray-700">
                      Cooking
                    </label>
                  </div>
                  
                  {formData.requirements.cooking.required && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Preferences</label>
                        <div className="grid grid-cols-3 gap-2">
                          {CUISINES.map(cuisine => (
                            <label key={cuisine} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.cooking.cuisinePreferences.includes(cuisine)}
                                onChange={(e) => handleArrayInputChange('requirements', 'cooking.cuisinePreferences', cuisine, e.target.checked)}
                                className="mr-2"
                              />
                              {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                        <select
                          value={formData.requirements.cooking.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'cooking', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Requirements */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Experience Requirements</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience</label>
                  <select
                    value={formData.requirements.minimumExperience}
                    onChange={(e) => handleNestedInputChange('requirements', 'minimumExperience', 'value', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No minimum</option>
                    <option value="0">No experience required</option>
                    <option value="1">1+ years</option>
                    <option value="2">2+ years</option>
                    <option value="3">3+ years</option>
                    <option value="4">4+ years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Helper Experience</label>
                  <select
                    value={formData.requirements.helperExperienceRequired}
                    onChange={(e) => handleNestedInputChange('requirements', 'helperExperienceRequired', 'value', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No preference</option>
                    <option value="yes">Required</option>
                    <option value="preferred">Preferred</option>
                    <option value="no">Not required</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Requirements */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Personal Requirements</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={formData.requirements.ageRange.min}
                        onChange={(e) => handleNestedInputChange('requirements', 'ageRange', 'min', parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="18"
                        max="65"
                      />
                      <span className="py-2">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={formData.requirements.ageRange.max}
                        onChange={(e) => handleNestedInputChange('requirements', 'ageRange', 'max', parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="18"
                        max="65"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                    <select
                      value={formData.requirements.educationLevel}
                      onChange={(e) => handleNestedInputChange('requirements', 'educationLevel', 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No preference</option>
                      <option value="primary_school">Primary School</option>
                      <option value="secondary_school">Secondary School</option>
                      <option value="high_school">High School</option>
                      <option value="university">University</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality Preferences</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {NATIONALITIES.map(nationality => (
                      <label key={nationality} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.requirements.nationalityPreferences.includes(nationality)}
                          onChange={(e) => handleArrayInputChange('requirements', 'nationalityPreferences', nationality, e.target.checked)}
                          className="mr-2"
                        />
                        {nationality}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Required</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {LANGUAGES.map(language => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.requirements.languagesRequired.includes(language)}
                          onChange={(e) => handleArrayInputChange('requirements', 'languagesRequired', language, e.target.checked)}
                          className="mr-2"
                        />
                        {language}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Requirements */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Health Requirements</h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requirements.noAllergies}
                    onChange={(e) => handleNestedInputChange('requirements', 'noAllergies', 'value', e.target.checked)}
                    className="mr-2"
                  />
                  No allergies required
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requirements.noMedicalIssues}
                    onChange={(e) => handleNestedInputChange('requirements', 'noMedicalIssues', 'value', e.target.checked)}
                    className="mr-2"
                  />
                  No medical issues required
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requirements.noPhysicalDisabilities}
                    onChange={(e) => handleNestedInputChange('requirements', 'noPhysicalDisabilities', 'value', e.target.checked)}
                    className="mr-2"
                  />
                  No physical disabilities required
                </label>
              </div>
            </div>

            {/* Schedule Requirements */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Schedule Requirements</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                  <div className="grid grid-cols-4 gap-2">
                    {WORKING_DAYS.map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.requirements.workingDays.includes(day)}
                          onChange={(e) => handleArrayInputChange('requirements', 'workingDays', day, e.target.checked)}
                          className="mr-2"
                        />
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        value={formData.requirements.workingHours.start}
                        onChange={(e) => handleNestedInputChange('requirements', 'workingHours', 'start', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="py-2">-</span>
                      <input
                        type="time"
                        value={formData.requirements.workingHours.end}
                        onChange={(e) => handleNestedInputChange('requirements', 'workingHours', 'end', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live-in Requirement</label>
                    <select
                      value={formData.requirements.liveIn}
                      onChange={(e) => handleNestedInputChange('requirements', 'liveIn', 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No preference</option>
                      <option value="required">Required</option>
                      <option value="preferred">Preferred</option>
                      <option value="not_required">Not required</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Off Days Per Week</label>
                    <select
                      value={formData.requirements.offDaysRequired}
                      onChange={(e) => handleNestedInputChange('requirements', 'offDaysRequired', 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">0 days</option>
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                      <option value="4">4 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compensation */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Compensation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Amount *</label>
              <input
                type="number"
                value={formData.salary.amount}
                onChange={(e) => handleNestedInputChange('salary', 'amount', 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3500"
                required
              />
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formData.salary.currency}
                onChange={(e) => handleNestedInputChange('salary', 'currency', 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HKD">HKD</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={formData.salary.period}
                onChange={(e) => handleNestedInputChange('salary', 'period', 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.salary.negotiable}
                onChange={(e) => handleNestedInputChange('salary', 'negotiable', 'value', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="negotiable" className="text-sm text-gray-700">
                Negotiable
              </label>
            </div>
          </div>
        </section>

        {/* Job Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange(null, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Duration</label>
              <select
                value={formData.contractDuration}
                onChange={(e) => handleInputChange(null, 'contractDuration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Duration</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>
        </section>

        {/* Benefits and Accommodations */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits & Accommodations</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {BENEFITS.map(benefit => (
                  <label key={benefit} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.benefits.includes(benefit)}
                      onChange={(e) => handleArrayInputChange('', 'benefits', benefit, e.target.checked)}
                      className="mr-2"
                    />
                    {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodations (if live-in)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ACCOMMODATIONS.map(accommodation => (
                  <label key={accommodation} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.accommodations.includes(accommodation)}
                      onChange={(e) => handleArrayInputChange('', 'accommodations', accommodation, e.target.checked)}
                      className="mr-2"
                    />
                    {accommodation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange(null, 'specialRequirements', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any special requirements or preferences..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange(null, 'additionalNotes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any additional information for potential helpers..."
              />
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
            {isLoading ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;