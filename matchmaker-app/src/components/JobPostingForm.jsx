import React, { useState } from 'react';

const JobPostingForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    // Basic Job Information
    jobTitle: '',
    jobDescription: '',
    location: {
      address: '',
      city: '',
      country: '',
      coordinates: { lat: '', lng: '' }
    },
    
    // Employer Demographics (for better matching)
    employer: {
      householdSize: '',
      houseType: '',
      hasInfants: false,
      hasChildren: false,
      hasElderly: false,
      hasDisabled: false,
      hasPets: false,
      petTypes: [],
      householdLanguages: [],
      culturalBackground: '',
      workingParents: false,
      cookingStyle: []
    },
    
    // Job Requirements - Enhanced structure
    requirements: {
      // Care Requirements with detailed specifications
      careOfInfant: {
        required: false,
        ageRangeMonths: [], // 0-12 months
        numberOfInfants: 0,
        importance: 'medium',
        specificNeeds: ''
      },
      careOfChildren: {
        required: false,
        ageRangeYears: [], // 0-12 years
        numberOfChildren: 0,
        importance: 'medium',
        specificNeeds: '',
        schoolSupport: false
      },
      careOfDisabled: {
        required: false,
        disabilityType: '',
        importance: 'medium',
        specificNeeds: ''
      },
      careOfOldAge: {
        required: false,
        numberOfElderly: 0,
        mobilityAssistance: false,
        medicationManagement: false,
        importance: 'medium',
        specificNeeds: ''
      },
      generalHousework: {
        required: false,
        householdSize: '',
        cleaningFrequency: '',
        importance: 'medium',
        specificTasks: []
      },
      cooking: {
        required: false,
        cuisinePreferences: [],
        dietaryRestrictions: [],
        mealPreparation: [],
        importance: 'medium',
        specificNeeds: ''
      },
      
      // Experience Requirements - Enhanced
      minimumExperience: '',
      helperExperienceRequired: '',
      specificExperienceNeeded: [],
      
      // Personal Requirements - Enhanced
      educationLevel: '',
      ageRange: { min: 21, max: 50 },
      nationalityPreferences: [],
      religionPreference: '',
      
      // Language Requirements - Enhanced
      languagesRequired: [],
      communicationSkills: 'basic', // basic, intermediate, advanced
      
      // Physical Requirements - Enhanced
      physicalRequirements: {
        noAllergies: false,
        noMedicalIssues: false,
        noPhysicalDisabilities: false,
        specificHealthRequirements: ''
      },
      
      // Schedule Requirements - Enhanced
      workingDays: [],
      workingHours: { 
        start: '08:00', 
        end: '18:00',
        flexible: false,
        overtimeExpected: false
      },
      liveIn: '',
      offDaysRequired: 1,
      
      // Food/Dietary Requirements - Enhanced
      foodHandlingRequirements: [],
      dietaryAccommodations: []
    },
    
    // Compensation - Enhanced
    salary: {
      amount: '',
      currency: 'USD',
      period: 'monthly',
      negotiable: false,
      performanceBonus: false,
      salaryRange: { min: '', max: '' }
    },
    
    // Job Details - Enhanced
    startDate: '',
    contractDuration: '',
    urgency: 'flexible',
    probationPeriod: '',
    
    // Matching Preferences - New section for ML
    matchingPreferences: {
      prioritizeExperience: 'medium',
      prioritizeLanguages: 'medium',
      prioritizeNationality: 'low',
      prioritizeAge: 'low',
      prioritizeEducation: 'low',
      flexibilityImportance: 'medium',
      personalityMatch: 'medium',
      culturalFit: 'medium'
    },
    
    // Contact & Interview - Enhanced
    contact: {
      preferredMethod: '',
      interviewMethod: '',
      availableForInterview: '',
      timeZone: '',
      contactLanguage: 'English'
    },
    
    // Additional Information - Enhanced
    benefits: [],
    accommodations: [],
    specialRequirements: '',
    additionalNotes: '',
    trialPeriod: false,
    trainingProvided: false
  });

  const [errors, setErrors] = useState({});

  // Enhanced constants for form options
  const HOUSE_TYPES = [
    'Studio Apartment',
    'One Bedroom Apartment',
    'Two Bedroom Apartment',
    'Three Bedroom Apartment',
    'Four Bedroom Apartment',
    'Five Bedroom Apartment',
    '2-Storey House',
    '3-Storey House',
    '4-Storey House',
    'Others'
  ];

  const CUISINES = [
    'chinese', 'malay', 'indian', 'western', 'japanese', 'korean',
    'thai', 'vietnamese', 'indonesian', 'filipino', 'italian', 'mediterranean'
  ];

  const NATIONALITIES = [
    'Filipino', 'Indonesian', 'Myanmar', 'Sri Lankan', 'Indian', 
    'Bangladeshi', 'Nepalese', 'Thai', 'Vietnamese', 'Cambodian'
  ];

  const LANGUAGES = [
    'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
    'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
    'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean',
    'Portuguese', 'Russian', 'Dutch', 'Italian', 'Other'
  ];

  const BENEFITS = [
    'medical_insurance', 'dental_care', 'annual_leave', 'sick_leave',
    'public_holiday_pay', 'overtime_pay', 'performance_bonus',
    'transportation_allowance', 'phone_allowance', 'training_provided',
    'annual_ticket_home', 'loyalty_bonus'
  ];

  const ACCOMMODATIONS = [
    'private_room', 'shared_room', 'private_bathroom', 'shared_bathroom',
    'air_conditioning', 'wifi', 'television', 'personal_refrigerator',
    'storage_space', 'laundry_facilities', 'cooking_facilities'
  ];

  const WORKING_DAYS = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const HOUSEHOLD_TASKS = [
    'general_cleaning', 'deep_cleaning', 'laundry', 'ironing',
    'grocery_shopping', 'meal_planning', 'dishwashing', 'organizing',
    'pet_care', 'plant_care', 'car_washing'
  ];

  const MEAL_TYPES = [
    'breakfast', 'lunch', 'dinner', 'snacks', 'packed_lunches',
    'special_diet_meals', 'baby_food', 'elderly_soft_food'
  ];

  const PET_TYPES = [
    'dogs', 'cats', 'birds', 'fish', 'rabbits', 'hamsters', 'reptiles'
  ];

  // Enhanced input handlers with better array management
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
    setFormData(prev => {
      const sectionData = section ? prev[section] : prev;
      const fieldPath = field.split('.');
      
      if (fieldPath.length === 1) {
        const currentArray = sectionData[field] || [];
        const newArray = checked
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value);
        
        return section ? {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: newArray
          }
        } : {
          ...prev,
          [field]: newArray
        };
      } else {
        // Handle nested field paths like 'cooking.cuisinePreferences'
        const [parentField, childField] = fieldPath;
        const currentArray = sectionData[parentField][childField] || [];
        const newArray = checked
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value);
        
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [parentField]: {
              ...prev[section][parentField],
              [childField]: newArray
            }
          }
        };
      }
    });
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
    if (!formData.location.city) errors.city = 'City is required';
    if (!formData.location.country) errors.country = 'Country is required';
    if (!formData.salary.amount) errors.salary = 'Salary is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.employer.householdSize) errors.householdSize = 'Household size is required';
    
    return errors;
  };

  const convertToMLFormat = (data) => {
    // Enhanced ML-optimized format for TensorFlow matching
    return {
      ...data,
      // Enhanced ML requirements for better matching
      mlRequirements: {
        // Core care requirements as feature vectors
        careVector: {
          careOfInfant: data.requirements.careOfInfant.required,
          careOfChildren: data.requirements.careOfChildren.required,
          careOfDisabled: data.requirements.careOfDisabled.required,
          careOfOldAge: data.requirements.careOfOldAge.required,
          generalHousework: data.requirements.generalHousework.required,
          cooking: data.requirements.cooking.required
        },
        
        // Importance weights for weighted matching (0-1 scale)
        importanceWeights: {
          careOfInfant: mapImportanceToScore(data.requirements.careOfInfant.importance),
          careOfChildren: mapImportanceToScore(data.requirements.careOfChildren.importance),
          careOfDisabled: mapImportanceToScore(data.requirements.careOfDisabled.importance),
          careOfOldAge: mapImportanceToScore(data.requirements.careOfOldAge.importance),
          generalHousework: mapImportanceToScore(data.requirements.generalHousework.importance),
          cooking: mapImportanceToScore(data.requirements.cooking.importance)
        },
        
        // Household demographics for context matching
        householdProfile: {
          size: parseInt(data.employer.householdSize) || 0,
          houseType: data.employer.houseType || '',
          hasInfants: data.employer.hasInfants,
          hasChildren: data.employer.hasChildren,
          hasElderly: data.employer.hasElderly,
          hasDisabled: data.employer.hasDisabled,
          hasPets: data.employer.hasPets,
          workingParents: data.employer.workingParents,
          infantCount: data.requirements.careOfInfant.numberOfInfants || 0,
          childrenCount: data.requirements.careOfChildren.numberOfChildren || 0,
          elderlyCount: data.requirements.careOfOldAge.numberOfElderly || 0
        },
        
        // Experience requirements as numerical features
        experienceRequirements: {
          minimumYears: parseExperienceToYears(data.requirements.minimumExperience),
          helperExperienceRequired: data.requirements.helperExperienceRequired === 'yes',
          helperExperiencePreferred: data.requirements.helperExperienceRequired === 'preferred',
          specificExperienceNeeded: data.requirements.specificExperienceNeeded || []
        },
        
        // Schedule requirements as feature vectors
        scheduleRequirements: {
          workingDaysVector: convertScheduleToVector(data.requirements.workingDays),
          workingHoursStart: convertTimeToMinutes(data.requirements.workingHours.start),
          workingHoursEnd: convertTimeToMinutes(data.requirements.workingHours.end),
          workingHoursFlexible: data.requirements.workingHours.flexible,
          liveInRequired: data.requirements.liveIn === 'required',
          liveInPreferred: data.requirements.liveIn === 'preferred',
          offDaysRequired: parseInt(data.requirements.offDaysRequired) || 1,
          overtimeExpected: data.requirements.workingHours.overtimeExpected
        },
        
        // Compensation features
        compensationProfile: {
          salaryAmount: parseFloat(data.salary.amount) || 0,
          salaryNormalized: normalizeSalary(data.salary.amount),
          salaryNegotiable: data.salary.negotiable,
          hasPerformanceBonus: data.salary.performanceBonus,
          salaryRange: {
            min: parseFloat(data.salary.salaryRange.min) || 0,
            max: parseFloat(data.salary.salaryRange.max) || 0
          }
        },
        
        // Personal preferences for matching
        personalRequirements: {
          ageRange: data.requirements.ageRange,
          nationalityPreferences: data.requirements.nationalityPreferences || [],
          religionPreference: data.requirements.religionPreference || '',
          educationLevel: data.requirements.educationLevel || '',
          languagesRequired: data.requirements.languagesRequired || [],
          communicationLevel: mapCommunicationToScore(data.requirements.communicationSkills)
        },
        
        // Health and physical requirements
        healthRequirements: {
          noAllergies: data.requirements.physicalRequirements.noAllergies,
          noMedicalIssues: data.requirements.physicalRequirements.noMedicalIssues,
          noPhysicalDisabilities: data.requirements.physicalRequirements.noPhysicalDisabilities,
          hasSpecificHealthRequirements: !!data.requirements.physicalRequirements.specificHealthRequirements
        },
        
        // Matching preferences for ML algorithm tuning
        matchingPreferences: {
          prioritizeExperience: mapPreferenceToScore(data.matchingPreferences.prioritizeExperience),
          prioritizeLanguages: mapPreferenceToScore(data.matchingPreferences.prioritizeLanguages),
          prioritizeNationality: mapPreferenceToScore(data.matchingPreferences.prioritizeNationality),
          prioritizeAge: mapPreferenceToScore(data.matchingPreferences.prioritizeAge),
          prioritizeEducation: mapPreferenceToScore(data.matchingPreferences.prioritizeEducation),
          flexibilityImportance: mapPreferenceToScore(data.matchingPreferences.flexibilityImportance),
          personalityMatch: mapPreferenceToScore(data.matchingPreferences.personalityMatch),
          culturalFit: mapPreferenceToScore(data.matchingPreferences.culturalFit)
        },
        
        // Urgency and timing features
        urgencyProfile: {
          urgencyScore: mapUrgencyToScore(data.urgency),
          immediateStart: data.startDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          contractDuration: data.contractDuration || '',
          hasProbationPeriod: !!data.probationPeriod,
          trainingProvided: data.trainingProvided
        },
        
        // Cultural and lifestyle preferences
        culturalPreferences: {
          cuisinePreferences: data.requirements.cooking.cuisinePreferences || [],
          dietaryRestrictions: data.requirements.cooking.dietaryRestrictions || [],
          foodHandlingRequirements: data.requirements.foodHandlingRequirements || [],
          culturalBackground: data.employer.culturalBackground || '',
          householdLanguages: data.employer.householdLanguages || []
        },
        
        // Benefits and accommodations vector
        benefitsVector: convertBenefitsToVector(data.benefits),
        accommodationsVector: convertAccommodationsToVector(data.accommodations),
        
        // Location preferences
        locationPreferences: {
          city: data.location.city,
          country: data.location.country,
          coordinates: data.location.coordinates
        },
        
        // Job complexity score (calculated from multiple factors)
        jobComplexityScore: calculateJobComplexity(data),
        
        // Matching embeddings (to be generated by ML pipeline)
        jobEmbedding: [],
        householdEmbedding: [],
        requirementsEmbedding: [],
        
        // Matching scores (calculated during matching process)
        matchingScores: {},
        
        // Metadata for ML pipeline
        mlMetadata: {
          formVersion: '2.0',
          generatedAt: new Date().toISOString(),
          featureCount: calculateFeatureCount(data),
          requirementComplexity: calculateRequirementComplexity(data)
        }
      }
    };
  };

  // Enhanced helper functions for ML conversion
  const mapImportanceToScore = (importance) => {
    const scores = {
      'low': 0.25,
      'medium': 0.5,
      'high': 0.75,
      'critical': 1.0
    };
    return scores[importance] || 0.5;
  };

  const mapPreferenceToScore = (preference) => {
    const scores = {
      'low': 0.2,
      'medium': 0.5,
      'high': 0.8,
      'critical': 1.0
    };
    return scores[preference] || 0.5;
  };

  const mapCommunicationToScore = (level) => {
    const scores = {
      'basic': 0.3,
      'intermediate': 0.6,
      'advanced': 1.0
    };
    return scores[level] || 0.3;
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

  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const normalizeSalary = (amount) => {
    // Normalize salary to 0-1 range for ML (generic range: 200-5000)
    const salaryRanges = { min: 200, max: 5000 };
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

  const convertBenefitsToVector = (benefits) => {
    const benefitMap = {};
    BENEFITS.forEach((benefit, index) => {
      benefitMap[benefit] = benefits.includes(benefit) ? 1 : 0;
    });
    return benefitMap;
  };

  const convertAccommodationsToVector = (accommodations) => {
    const accommodationMap = {};
    ACCOMMODATIONS.forEach((accommodation, index) => {
      accommodationMap[accommodation] = accommodations.includes(accommodation) ? 1 : 0;
    });
    return accommodationMap;
  };

  const calculateJobComplexity = (data) => {
    let complexity = 0;
    
    // Add complexity based on care requirements
    if (data.requirements.careOfInfant.required) complexity += 0.3;
    if (data.requirements.careOfChildren.required) complexity += 0.2;
    if (data.requirements.careOfDisabled.required) complexity += 0.4;
    if (data.requirements.careOfOldAge.required) complexity += 0.3;
    if (data.requirements.generalHousework.required) complexity += 0.1;
    if (data.requirements.cooking.required) complexity += 0.1;
    
    // Add complexity based on household size
    const householdSize = parseInt(data.employer.householdSize) || 0;
    complexity += householdSize * 0.05;
    
    // Add complexity based on specific requirements
    if (data.requirements.specificExperienceNeeded.length > 0) complexity += 0.1;
    if (data.requirements.languagesRequired.length > 1) complexity += 0.1;
    if (data.requirements.workingHours.overtimeExpected) complexity += 0.1;
    
    return Math.min(complexity, 1.0);
  };

  const calculateFeatureCount = (data) => {
    // Count the number of active features for ML metadata
    let count = 0;
    count += Object.values(data.requirements).filter(req => req.required).length;
    count += data.requirements.nationalityPreferences.length;
    count += data.requirements.languagesRequired.length;
    count += data.benefits.length;
    count += data.accommodations.length;
    return count;
  };

  const calculateRequirementComplexity = (data) => {
    // Calculate complexity based on the number and type of requirements
    let complexity = 0;
    
    // Care requirements complexity
    Object.values(data.requirements).forEach(req => {
      if (req.required && req.importance) {
        complexity += mapImportanceToScore(req.importance);
      }
    });
    
    // Normalize to 0-1 range
    return Math.min(complexity / 6, 1.0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Job - Enhanced for ML Matching</h2>
      
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
                placeholder="e.g., Domestic Helper for Family with Young Children"
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
                placeholder="Describe the job responsibilities, family environment, and what you're looking for in a helper..."
                required
              />
              {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city name"
                  required
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleInputChange('location', 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter country name"
                  required
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange(null, 'urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate (within 1 week)</option>
                  <option value="within_week">Within 2 weeks</option>
                  <option value="within_month">Within a month</option>
                  <option value="flexible">Flexible timing</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Employer Demographics - New Section */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Household Information</h3>
          <p className="text-gray-600 mb-4">This information helps us find the best match for your family</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Household Size *</label>
                <select
                  value={formData.employer.householdSize}
                  onChange={(e) => handleInputChange('employer', 'householdSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6+">6+ people</option>
                </select>
                {errors.householdSize && <p className="text-red-500 text-sm mt-1">{errors.householdSize}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
                <select
                  value={formData.employer.houseType}
                  onChange={(e) => handleInputChange('employer', 'houseType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select House Type</option>
                  {HOUSE_TYPES.map(houseType => (
                    <option key={houseType} value={houseType}>{houseType}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Background</label>
                <input
                  type="text"
                  value={formData.employer.culturalBackground}
                  onChange={(e) => handleInputChange('employer', 'culturalBackground', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chinese, Indian, Malay, Western"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Household Languages</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LANGUAGES.map(language => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.employer.householdLanguages.includes(language)}
                      onChange={(e) => handleArrayInputChange('employer', 'householdLanguages', language, e.target.checked)}
                      className="mr-2"
                    />
                    {language}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Household Composition</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.hasInfants}
                    onChange={(e) => handleInputChange('employer', 'hasInfants', e.target.checked)}
                    className="mr-2"
                  />
                  Has Infants (0-12 months)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.hasChildren}
                    onChange={(e) => handleInputChange('employer', 'hasChildren', e.target.checked)}
                    className="mr-2"
                  />
                  Has Children (1-12 years)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.hasElderly}
                    onChange={(e) => handleInputChange('employer', 'hasElderly', e.target.checked)}
                    className="mr-2"
                  />
                  Has Elderly Members
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.hasDisabled}
                    onChange={(e) => handleInputChange('employer', 'hasDisabled', e.target.checked)}
                    className="mr-2"
                  />
                  Has Disabled Members
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.hasPets}
                    onChange={(e) => handleInputChange('employer', 'hasPets', e.target.checked)}
                    className="mr-2"
                  />
                  Has Pets
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.employer.workingParents}
                    onChange={(e) => handleInputChange('employer', 'workingParents', e.target.checked)}
                    className="mr-2"
                  />
                  Working Parents
                </label>
              </div>
            </div>
            
            {formData.employer.hasPets && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Types</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PET_TYPES.map(petType => (
                    <label key={petType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.employer.petTypes.includes(petType)}
                        onChange={(e) => handleArrayInputChange('employer', 'petTypes', petType, e.target.checked)}
                        className="mr-2"
                      />
                      {petType.charAt(0).toUpperCase() + petType.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Job Requirements */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Requirements</h3>
          
          {/* Care Requirements */}
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Care Requirements</h4>
              
              <div className="space-y-4">
                {/* Care of Infant - Enhanced */}
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
                      Care of Infant (0-12 months)
                    </label>
                  </div>
                  
                  {formData.requirements.careOfInfant.required && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Infants</label>
                          <select
                            value={formData.requirements.careOfInfant.numberOfInfants}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfInfant', 'numberOfInfants', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>Select number</option>
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                          <select
                            value={formData.requirements.careOfInfant.importance}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfInfant', 'importance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Requirement</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (months)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.careOfInfant.ageRangeMonths.includes(i)}
                                onChange={(e) => handleArrayInputChange('requirements', 'careOfInfant.ageRangeMonths', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i} months
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                        <textarea
                          value={formData.requirements.careOfInfant.specificNeeds}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfInfant', 'specificNeeds', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="e.g., feeding schedule, sleep training, special dietary needs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Care of Children - Enhanced */}
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
                      Care of Children (1-12 years)
                    </label>
                  </div>
                  
                  {formData.requirements.careOfChildren.required && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                          <select
                            value={formData.requirements.careOfChildren.numberOfChildren}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'numberOfChildren', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>Select number</option>
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                          <select
                            value={formData.requirements.careOfChildren.importance}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'importance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Requirement</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (years)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.careOfChildren.ageRangeYears.includes(i)}
                                onChange={(e) => handleArrayInputChange('requirements', 'careOfChildren.ageRangeYears', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i} years
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={formData.requirements.careOfChildren.schoolSupport}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'schoolSupport', e.target.checked)}
                            className="mr-2"
                          />
                          School pickup/drop-off and homework support needed
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                        <textarea
                          value={formData.requirements.careOfChildren.specificNeeds}
                          onChange={(e) => handleNestedInputChange('requirements', 'careOfChildren', 'specificNeeds', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="e.g., after-school activities, special dietary needs, behavioral considerations"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Other care requirements with similar enhancements */}
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
                        Care of Disabled Persons
                      </label>
                    </div>
                    
                    {formData.requirements.careOfDisabled.required && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type of Disability</label>
                          <input
                            type="text"
                            value={formData.requirements.careOfDisabled.disabilityType}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfDisabled', 'disabilityType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., mobility, cognitive, sensory"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                          <select
                            value={formData.requirements.careOfDisabled.importance}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfDisabled', 'importance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Requirement</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.requirements.careOfDisabled.specificNeeds}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfDisabled', 'specificNeeds', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            placeholder="Specific care requirements and abilities needed"
                          />
                        </div>
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
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Elderly</label>
                          <select
                            value={formData.requirements.careOfOldAge.numberOfElderly}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'numberOfElderly', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>Select number</option>
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.requirements.careOfOldAge.mobilityAssistance}
                              onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'mobilityAssistance', e.target.checked)}
                              className="mr-2"
                            />
                            Mobility assistance required
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.requirements.careOfOldAge.medicationManagement}
                              onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'medicationManagement', e.target.checked)}
                              className="mr-2"
                            />
                            Medication management required
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                          <select
                            value={formData.requirements.careOfOldAge.importance}
                            onChange={(e) => handleNestedInputChange('requirements', 'careOfOldAge', 'importance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Requirement</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* General Housework - Enhanced */}
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
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">House/Apartment Size</label>
                          <select
                            value={formData.requirements.generalHousework.householdSize}
                            onChange={(e) => handleNestedInputChange('requirements', 'generalHousework', 'householdSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select size</option>
                            <option value="small">Small (1-2 rooms)</option>
                            <option value="medium">Medium (3-4 rooms)</option>
                            <option value="large">Large (5+ rooms)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Frequency</label>
                          <select
                            value={formData.requirements.generalHousework.cleaningFrequency}
                            onChange={(e) => handleNestedInputChange('requirements', 'generalHousework', 'cleaningFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily cleaning</option>
                            <option value="weekly">Weekly deep clean</option>
                            <option value="flexible">Flexible schedule</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {HOUSEHOLD_TASKS.map(task => (
                            <label key={task} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.generalHousework.specificTasks.includes(task)}
                                onChange={(e) => handleArrayInputChange('requirements', 'generalHousework.specificTasks', task, e.target.checked)}
                                className="mr-2"
                              />
                              {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                        <select
                          value={formData.requirements.generalHousework.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'generalHousework', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="critical">Critical Requirement</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cooking Requirements - Enhanced */}
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
                      Cooking & Meal Preparation
                    </label>
                  </div>
                  
                  {formData.requirements.cooking.required && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Preferences</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preparation</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {MEAL_TYPES.map(mealType => (
                            <label key={mealType} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.requirements.cooking.mealPreparation.includes(mealType)}
                                onChange={(e) => handleArrayInputChange('requirements', 'cooking.mealPreparation', mealType, e.target.checked)}
                                className="mr-2"
                              />
                              {mealType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                        <input
                          type="text"
                          value={formData.requirements.cooking.dietaryRestrictions.join(', ')}
                          onChange={(e) => handleNestedInputChange('requirements', 'cooking', 'dietaryRestrictions', e.target.value.split(', ').filter(item => item))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., vegetarian, halal, gluten-free (separate with commas)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                        <select
                          value={formData.requirements.cooking.importance}
                          onChange={(e) => handleNestedInputChange('requirements', 'cooking', 'importance', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="critical">Critical Requirement</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Requirements - Enhanced */}
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
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Experience Needed</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'infant_care', 'toddler_care', 'school_age_care', 'elderly_care',
                    'disabled_care', 'pet_care', 'cooking', 'cleaning', 'tutoring'
                  ].map(experience => (
                    <label key={experience} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.requirements.specificExperienceNeeded.includes(experience)}
                        onChange={(e) => handleArrayInputChange('requirements', 'specificExperienceNeeded', experience, e.target.checked)}
                        className="mr-2"
                      />
                      {experience.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Requirements - Enhanced */}
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
                        min="21"
                        max="65"
                      />
                      <span className="py-2">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={formData.requirements.ageRange.max}
                        onChange={(e) => handleNestedInputChange('requirements', 'ageRange', 'max', parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="21"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion Preference</label>
                  <input
                    type="text"
                    value={formData.requirements.religionPreference}
                    onChange={(e) => handleInputChange('requirements', 'religionPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Christian, Buddhist, Muslim, Hindu (optional)"
                  />
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Communication Skills Required</label>
                  <select
                    value={formData.requirements.communicationSkills}
                    onChange={(e) => handleInputChange('requirements', 'communicationSkills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic communication</option>
                    <option value="intermediate">Intermediate communication</option>
                    <option value="advanced">Advanced communication</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Requirements - Enhanced */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Health Requirements</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requirements.physicalRequirements.noAllergies}
                      onChange={(e) => handleNestedInputChange('requirements', 'physicalRequirements', 'noAllergies', e.target.checked)}
                      className="mr-2"
                    />
                    No allergies required
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requirements.physicalRequirements.noMedicalIssues}
                      onChange={(e) => handleNestedInputChange('requirements', 'physicalRequirements', 'noMedicalIssues', e.target.checked)}
                      className="mr-2"
                    />
                    No medical issues required
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requirements.physicalRequirements.noPhysicalDisabilities}
                      onChange={(e) => handleNestedInputChange('requirements', 'physicalRequirements', 'noPhysicalDisabilities', e.target.checked)}
                      className="mr-2"
                    />
                    No physical disabilities required
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specific Health Requirements</label>
                  <textarea
                    value={formData.requirements.physicalRequirements.specificHealthRequirements}
                    onChange={(e) => handleNestedInputChange('requirements', 'physicalRequirements', 'specificHealthRequirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Any specific health requirements or considerations..."
                  />
                </div>
              </div>
            </div>

            {/* Schedule Requirements - Enhanced */}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requirements.workingHours.flexible}
                      onChange={(e) => handleNestedInputChange('requirements', 'workingHours', 'flexible', e.target.checked)}
                      className="mr-2"
                    />
                    Flexible working hours
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requirements.workingHours.overtimeExpected}
                      onChange={(e) => handleNestedInputChange('requirements', 'workingHours', 'overtimeExpected', e.target.checked)}
                      className="mr-2"
                    />
                    Occasional overtime expected
                  </label>
                </div>
              </div>
            </div>

            {/* Food Handling Requirements - Enhanced */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Food Handling Requirements</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Handling Restrictions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['no_pork', 'no_beef', 'no_alcohol', 'halal_only', 'vegetarian_only', 'others'].map(restriction => (
                      <label key={restriction} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.requirements.foodHandlingRequirements.includes(restriction)}
                          onChange={(e) => handleArrayInputChange('requirements', 'foodHandlingRequirements', restriction, e.target.checked)}
                          className="mr-2"
                        />
                        {restriction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Accommodations</label>
                  <input
                    type="text"
                    value={formData.requirements.dietaryAccommodations.join(', ')}
                    onChange={(e) => handleInputChange('requirements', 'dietaryAccommodations', e.target.value.split(', ').filter(item => item))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., kosher, gluten-free, dairy-free (separate with commas)"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Matching Preferences - New Section */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Matching Preferences</h3>
          <p className="text-gray-600 mb-4">Help us prioritize what's most important to you in finding the right match</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Priority</label>
              <select
                value={formData.matchingPreferences.prioritizeExperience}
                onChange={(e) => handleInputChange('matchingPreferences', 'prioritizeExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language Skills Priority</label>
              <select
                value={formData.matchingPreferences.prioritizeLanguages}
                onChange={(e) => handleInputChange('matchingPreferences', 'prioritizeLanguages', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality Priority</label>
              <select
                value={formData.matchingPreferences.prioritizeNationality}
                onChange={(e) => handleInputChange('matchingPreferences', 'prioritizeNationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Priority</label>
              <select
                value={formData.matchingPreferences.prioritizeAge}
                onChange={(e) => handleInputChange('matchingPreferences', 'prioritizeAge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Priority</label>
              <select
                value={formData.matchingPreferences.prioritizeEducation}
                onChange={(e) => handleInputChange('matchingPreferences', 'prioritizeEducation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flexibility Importance</label>
              <select
                value={formData.matchingPreferences.flexibilityImportance}
                onChange={(e) => handleInputChange('matchingPreferences', 'flexibilityImportance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality Match</label>
              <select
                value={formData.matchingPreferences.personalityMatch}
                onChange={(e) => handleInputChange('matchingPreferences', 'personalityMatch', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Fit</label>
              <select
                value={formData.matchingPreferences.culturalFit}
                onChange={(e) => handleInputChange('matchingPreferences', 'culturalFit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </section>

        {/* Enhanced Compensation */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Compensation & Benefits</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Amount *</label>
                                 <input
                   type="number"
                   value={formData.salary.amount}
                   onChange={(e) => handleNestedInputChange('salary', 'amount', 'value', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="e.g., 1000"
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
                   <option value="USD">USD - US Dollar</option>
                   <option value="EUR">EUR - Euro</option>
                   <option value="GBP">GBP - British Pound</option>
                   <option value="SGD">SGD - Singapore Dollar</option>
                   <option value="HKD">HKD - Hong Kong Dollar</option>
                   <option value="AUD">AUD - Australian Dollar</option>
                   <option value="CAD">CAD - Canadian Dollar</option>
                   <option value="MYR">MYR - Malaysian Ringgit</option>
                   <option value="THB">THB - Thai Baht</option>
                   <option value="PHP">PHP - Philippine Peso</option>
                   <option value="IDR">IDR - Indonesian Rupiah</option>
                   <option value="INR">INR - Indian Rupee</option>
                   <option value="AED">AED - UAE Dirham</option>
                   <option value="SAR">SAR - Saudi Riyal</option>
                   <option value="JPY">JPY - Japanese Yen</option>
                   <option value="KRW">KRW - South Korean Won</option>
                   <option value="CNY">CNY - Chinese Yuan</option>
                   <option value="OTHER">Other</option>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (if negotiable)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.salary.salaryRange.min}
                    onChange={(e) => handleNestedInputChange('salary', 'salaryRange', 'min', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="py-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.salary.salaryRange.max}
                    onChange={(e) => handleNestedInputChange('salary', 'salaryRange', 'max', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.salary.performanceBonus}
                    onChange={(e) => handleNestedInputChange('salary', 'performanceBonus', 'value', e.target.checked)}
                    className="mr-2"
                  />
                  Performance bonus available
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Job Details */}
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
                <option value="6_months">6 Months</option>
                <option value="1_year">1 Year</option>
                <option value="2_years">2 Years</option>
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period</label>
              <select
                value={formData.probationPeriod}
                onChange={(e) => handleInputChange(null, 'probationPeriod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No probation</option>
                <option value="1_month">1 Month</option>
                <option value="2_months">2 Months</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trialPeriod}
                  onChange={(e) => handleInputChange(null, 'trialPeriod', e.target.checked)}
                  className="mr-2"
                />
                Trial period available
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.trainingProvided}
                  onChange={(e) => handleInputChange(null, 'trainingProvided', e.target.checked)}
                  className="mr-2"
                />
                Training provided
              </label>
            </div>
          </div>
        </section>

        {/* Enhanced Benefits and Accommodations */}
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

        {/* Enhanced Contact & Interview */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Interview Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
              <select
                value={formData.contact.preferredMethod}
                onChange={(e) => handleInputChange('contact', 'preferredMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Method</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="app">Through App</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Method</label>
              <select
                value={formData.contact.interviewMethod}
                onChange={(e) => handleInputChange('contact', 'interviewMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Method</option>
                <option value="whatsapp_video_call">WhatsApp Video Call</option>
                <option value="voice_call">Voice Call</option>
                <option value="face_to_face">Face to Face</option>
                <option value="video_conference">Video Conference</option>
                <option value="others">Others</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Availability</label>
              <select
                value={formData.contact.availableForInterview}
                onChange={(e) => handleInputChange('contact', 'availableForInterview', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Availability</option>
                <option value="immediate">Immediate</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="specific_times">Specific Times</option>
              </select>
            </div>
            
                         <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Communication Language</label>
               <select
                 value={formData.contact.contactLanguage}
                 onChange={(e) => handleInputChange('contact', 'contactLanguage', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="English">English</option>
                 <option value="Mandarin">Mandarin</option>
                 <option value="Spanish">Spanish</option>
                 <option value="French">French</option>
                 <option value="German">German</option>
                 <option value="Arabic">Arabic</option>
                 <option value="Japanese">Japanese</option>
                 <option value="Korean">Korean</option>
                 <option value="Hindi">Hindi</option>
                 <option value="Portuguese">Portuguese</option>
                 <option value="Russian">Russian</option>
                 <option value="Italian">Italian</option>
                 <option value="Dutch">Dutch</option>
                 <option value="Malay">Malay</option>
                 <option value="Tamil">Tamil</option>
                 <option value="Thai">Thai</option>
                 <option value="Vietnamese">Vietnamese</option>
                 <option value="Other">Other</option>
               </select>
             </div>
          </div>
        </section>

        {/* Enhanced Additional Information */}
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
                placeholder="Any special requirements, certifications needed, or unique aspects of the job..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange(null, 'additionalNotes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Tell potential helpers about your family, home environment, expectations, and what makes this a great opportunity..."
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
            {isLoading ? 'Posting Job...' : 'Post Job & Find Matches'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;