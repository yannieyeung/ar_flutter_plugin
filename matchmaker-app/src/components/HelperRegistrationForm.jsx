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
    
    // D. Enhanced Job experience with detailed tracking
    experience: {
      careOfInfant: {
        hasExperience: false,
        ages: [],
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        specificTasks: [],
        certifications: [],
        importance: 'medium'
      },
      careOfChildren: {
        hasExperience: false,
        ages: [],
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        specificTasks: [],
        certifications: [],
        importance: 'medium',
        schoolSupport: false
      },
      careOfDisabled: {
        hasExperience: false,
        disabilityTypes: [],
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        specificTasks: [],
        certifications: [],
        importance: 'medium'
      },
      careOfOldAge: {
        hasExperience: false,
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        specificTasks: [],
        certifications: [],
        importance: 'medium',
        mobilityAssistance: false,
        medicationManagement: false
      },
      generalHousework: {
        hasExperience: false,
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        houseSizes: [],
        specificTasks: [],
        cleaningFrequency: '',
        importance: 'medium'
      },
      cooking: {
        hasExperience: false,
        cuisines: [],
        duration: { from: '', to: '' },
        experienceLevel: 'beginner',
        mealTypes: [],
        dietarySpecializations: [],
        importance: 'medium'
      },
      
      // Enhanced language skills
      languagesSpoken: [
        {
          language: '',
          proficiency: 'basic',
          canTeach: false
        }
      ],
      
      // Additional skills
      otherSkills: {
        petCare: { hasExperience: false, petTypes: [], duration: { from: '', to: '' } },
        tutoring: { hasExperience: false, subjects: [], ageGroups: [], duration: { from: '', to: '' } },
        driving: { hasExperience: false, licenseType: '', yearsExperience: 0 },
        firstAid: { hasCertification: false, certificationLevel: '', expiryDate: '' },
        other: ''
      }
    },
    
    // Enhanced Ex-employer snapshots with detailed information
    employers: [
      {
        name: '',
        country: '',
        city: '',
        duration: { from: '', to: '' },
        householdSize: '',
        houseType: '',
        tasksPerformed: [],
        reasonForLeaving: '',
        wouldRecommend: '',
        salary: { amount: '', currency: 'USD', period: 'monthly' },
        benefits: [],
        challenges: '',
        achievements: ''
      }
    ],
    
    // E. Enhanced Job preferences with detailed specifications
    preferences: {
      careOfInfant: {
        willing: '',
        preferredAges: [],
        maxNumber: 0,
        importance: 'medium'
      },
      careOfChildren: {
        willing: '',
        preferredAges: [],
        maxNumber: 0,
        schoolSupport: false,
        importance: 'medium'
      },
      careOfDisabled: {
        willing: '',
        preferredTypes: [],
        importance: 'medium'
      },
      careOfOldAge: {
        willing: '',
        mobilityAssistance: false,
        medicationManagement: false,
        importance: 'medium'
      },
      generalHousework: {
        willing: '',
        preferredHouseSizes: [],
        preferredTasks: [],
        importance: 'medium'
      },
      cooking: {
        willing: '',
        preferredCuisines: [],
        preferredMealTypes: [],
        importance: 'medium'
      },
      
      // NEW: House type preferences
      houseTypePreferences: {
        preferredTypes: [],
        avoidTypes: [],
        flexibilityLevel: 'medium'
      },
      
      // NEW: Country and location preferences
      locationPreferences: {
        preferredCountries: [],
        avoidCountries: [],
        preferredCities: [],
        willingToRelocate: false,
        preferredRegions: [],
        climatePreferences: [],
        culturePreferences: [],
        languageRequirement: 'flexible'
      },
      
      // Work environment preferences
      workEnvironmentPreferences: {
        liveInPreference: '',
        workingDaysPreference: [],
        workingHoursPreference: { preferred: 'standard', flexibility: 'medium' },
        familySizePreference: { min: 1, max: 10, ideal: 4 },
        petFriendly: '',
        smokingEnvironment: '',
        religiousAccommodation: false
      }
    },
    
    // F. Interview preference
    interview: {
      availability: '',
      availabilityDate: '',
      means: ''
    },
    
    // G. Enhanced Readiness
    readiness: {
      hasValidPassport: '',
      passportExpiry: '',
      canStartWork: '',
      startDate: '',
      visaStatus: '',
      medicalCheckup: '',
      backgroundCheck: '',
      contractPreferences: {
        minimumDuration: '',
        maximumDuration: '',
        renewalWillingness: false,
        probationAcceptance: true
      }
    },
    
    // NEW: Personality and Cultural Fit Assessment
    personalityProfile: {
      personalityTraits: {
        patience: 5,
        empathy: 5,
        reliability: 5,
        adaptability: 5,
        independence: 5,
        communication: 5,
        problemSolving: 5,
        culturalSensitivity: 5
      },
      workStyle: {
        preferredSupervision: 'moderate',
        initiativeTaking: 'medium',
        teamwork: 'good',
        stressHandling: 'medium',
        learning: 'quick'
      },
      culturalAdaptability: {
        foodFlexibility: 'high',
        languageLearning: 'willing',
        customsRespect: 'high',
        religiousTolerance: 'high',
        socialInteraction: 'comfortable'
      }
    },
    
    // NEW: Salary and Benefits Expectations
    expectations: {
      salary: {
        minimumAmount: '',
        preferredAmount: '',
        currency: 'USD',
        period: 'monthly',
        negotiable: true,
        performanceBonusExpected: false
      },
      benefits: {
        requiredBenefits: [],
        preferredBenefits: [],
        accommodationRequirements: []
      },
      workConditions: {
        maxWorkingHours: 8,
        overtimeWillingness: false,
        holidayWorkWillingness: false,
        emergencyAvailability: false
      }
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
    'Philippines', 'Indonesia', 'Myanmar', 'Sri Lanka', 'India', 'Bangladesh', 
    'Nepal', 'Thailand', 'Vietnam', 'Cambodia', 'Singapore', 'Malaysia', 
    'Hong Kong', 'UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Taiwan', 
    'South Korea', 'Japan', 'Australia', 'New Zealand', 'Canada', 'USA', 
    'UK', 'Germany', 'France', 'Switzerland', 'Netherlands', 'Others'
  ];

  // House types from job posting form for helper preferences
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
    'Condominium',
    'Landed Property',
    'HDB Flat',
    'Others'
  ];

  // Enhanced task lists for detailed experience tracking
  const INFANT_CARE_TASKS = [
    'feeding', 'diaper_changing', 'bathing', 'sleep_training', 'playtime',
    'development_activities', 'medical_care', 'safety_monitoring'
  ];

  const CHILDREN_CARE_TASKS = [
    'homework_help', 'school_pickup_dropoff', 'meal_preparation', 'playtime',
    'extracurricular_activities', 'bedtime_routine', 'discipline', 'tutoring'
  ];

  const ELDERLY_CARE_TASKS = [
    'mobility_assistance', 'medication_management', 'personal_hygiene', 
    'companionship', 'meal_assistance', 'medical_appointments', 'exercise_support'
  ];

  const DISABLED_CARE_TASKS = [
    'mobility_assistance', 'personal_care', 'communication_support', 
    'therapy_assistance', 'medication_management', 'special_equipment_use'
  ];

  const HOUSEWORK_TASKS = [
    'general_cleaning', 'deep_cleaning', 'laundry', 'ironing',
    'grocery_shopping', 'meal_planning', 'dishwashing', 'organizing',
    'pet_care', 'plant_care', 'car_washing', 'home_maintenance'
  ];

  const MEAL_TYPES = [
    'breakfast', 'lunch', 'dinner', 'snacks', 'packed_lunches',
    'special_diet_meals', 'baby_food', 'elderly_soft_food'
  ];

  const PET_TYPES = [
    'dogs', 'cats', 'birds', 'fish', 'rabbits', 'hamsters', 'reptiles'
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

  const EXPERIENCE_LEVELS = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ];

  const IMPORTANCE_LEVELS = [
    'low', 'medium', 'high', 'critical'
  ];

  const PROFICIENCY_LEVELS = [
    'basic', 'intermediate', 'advanced', 'native'
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
    console.log('handleExperienceChange called:', { type, field, value });
    console.log('Current experience state:', formData.experience[type]);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        experience: {
          ...prev.experience,
          [type]: typeof prev.experience[type] === 'object' ? {
            ...prev.experience[type],
            [field]: value
          } : value
        }
      };
      
      console.log('New experience state will be:', newData.experience[type]);
      return newData;
    });
  };

  const handleNestedExperienceChange = (type, subfield, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [type]: {
          ...prev.experience[type],
          [subfield]: {
            ...prev.experience[type][subfield],
            [field]: value
          }
        }
      }
    }));
  };

  const handleEmployerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      employers: prev.employers.map((employer, i) => 
        i === index ? field.includes('.') ? 
          { 
            ...employer, 
            [field.split('.')[0]]: {
              ...employer[field.split('.')[0]],
              [field.split('.')[1]]: value
            }
          } :
          { ...employer, [field]: value } : employer
      )
    }));
  };

  const handleArrayFieldChange = (section, field, value, checked) => {
    if (section) {
      setFormData(prev => {
        const sectionData = prev[section];
        const fieldPath = field.split('.');
        
        if (fieldPath.length === 1) {
          const currentArray = sectionData[field] || [];
          const newArray = checked
            ? [...currentArray, value]
            : currentArray.filter(item => item !== value);
          
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: newArray
            }
          };
        } else {
          // Handle nested field paths
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
    }
  };

  const handleLanguageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        languagesSpoken: prev.experience.languagesSpoken.map((lang, i) => 
          i === index ? { ...lang, [field]: value } : lang
        )
      }
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        languagesSpoken: [...prev.experience.languagesSpoken, { language: '', proficiency: 'basic', canTeach: false }]
      }
    }));
  };

  const removeLanguage = (index) => {
    if (formData.experience.languagesSpoken.length > 1) {
      setFormData(prev => ({
        ...prev,
        experience: {
          ...prev.experience,
          languagesSpoken: prev.experience.languagesSpoken.filter((_, i) => i !== index)
        }
      }));
    }
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
      // Enhanced ML-optimized fields for TensorFlow matching
      mlProfile: {
        // Demographics (numerical features)
        age: age,
        heightCm: parseInt(data.height) || 0,
        weightKg: parseInt(data.weight) || 0,
        numberOfSiblings: parseInt(data.numberOfSiblings) || 0,
        numberOfChildren: parseInt(data.numberOfChildren) || 0,
        
        // Education level as ordinal (0-5)
        educationScore: EDUCATION_LEVELS.indexOf(data.educationLevel),
        
        // Experience features with detailed scoring
        experienceProfile: {
          hasHelperExperience: data.hasBeenHelperBefore === 'yes',
          totalExperienceYears: calculateExperienceYears(data.employers),
          
          // Detailed skill experience with levels
          careOfInfantExperience: {
            hasExperience: data.experience.careOfInfant.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.careOfInfant.experienceLevel),
            ageRangesCovered: data.experience.careOfInfant.ages.length,
            tasksDiversity: data.experience.careOfInfant.specificTasks.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.careOfInfant.importance)
          },
          
          careOfChildrenExperience: {
            hasExperience: data.experience.careOfChildren.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.careOfChildren.experienceLevel),
            ageRangesCovered: data.experience.careOfChildren.ages.length,
            tasksDiversity: data.experience.careOfChildren.specificTasks.length,
            schoolSupport: data.experience.careOfChildren.schoolSupport,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.careOfChildren.importance)
          },
          
          careOfDisabledExperience: {
            hasExperience: data.experience.careOfDisabled.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.careOfDisabled.experienceLevel),
            typesHandled: data.experience.careOfDisabled.disabilityTypes.length,
            tasksDiversity: data.experience.careOfDisabled.specificTasks.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.careOfDisabled.importance)
          },
          
          careOfOldAgeExperience: {
            hasExperience: data.experience.careOfOldAge.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.careOfOldAge.experienceLevel),
            mobilityAssistance: data.experience.careOfOldAge.mobilityAssistance,
            medicationManagement: data.experience.careOfOldAge.medicationManagement,
            tasksDiversity: data.experience.careOfOldAge.specificTasks.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.careOfOldAge.importance)
          },
          
          generalHouseworkExperience: {
            hasExperience: data.experience.generalHousework.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.generalHousework.experienceLevel),
            houseSizesHandled: data.experience.generalHousework.houseSizes.length,
            tasksDiversity: data.experience.generalHousework.specificTasks.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.generalHousework.importance)
          },
          
          cookingExperience: {
            hasExperience: data.experience.cooking.hasExperience,
            level: EXPERIENCE_LEVELS.indexOf(data.experience.cooking.experienceLevel),
            cuisineDiversity: data.experience.cooking.cuisines.length,
            mealTypesDiversity: data.experience.cooking.mealTypes.length,
            dietarySpecializations: data.experience.cooking.dietarySpecializations.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.experience.cooking.importance)
          }
        },
        
        // Enhanced preferences vector with importance scoring
        preferencesProfile: {
          careOfInfantPreference: {
            willing: data.preferences.careOfInfant.willing === 'yes',
            ageFlexibility: data.preferences.careOfInfant.preferredAges.length,
            maxCapacity: data.preferences.careOfInfant.maxNumber,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.careOfInfant.importance)
          },
          
          careOfChildrenPreference: {
            willing: data.preferences.careOfChildren.willing === 'yes',
            ageFlexibility: data.preferences.careOfChildren.preferredAges.length,
            maxCapacity: data.preferences.careOfChildren.maxNumber,
            schoolSupport: data.preferences.careOfChildren.schoolSupport,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.careOfChildren.importance)
          },
          
          careOfDisabledPreference: {
            willing: data.preferences.careOfDisabled.willing === 'yes',
            typeFlexibility: data.preferences.careOfDisabled.preferredTypes.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.careOfDisabled.importance)
          },
          
          careOfOldAgePreference: {
            willing: data.preferences.careOfOldAge.willing === 'yes',
            mobilityAssistance: data.preferences.careOfOldAge.mobilityAssistance,
            medicationManagement: data.preferences.careOfOldAge.medicationManagement,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.careOfOldAge.importance)
          },
          
          generalHouseworkPreference: {
            willing: data.preferences.generalHousework.willing === 'yes',
            houseSizeFlexibility: data.preferences.generalHousework.preferredHouseSizes.length,
            taskFlexibility: data.preferences.generalHousework.preferredTasks.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.generalHousework.importance)
          },
          
          cookingPreference: {
            willing: data.preferences.cooking.willing === 'yes',
            cuisineFlexibility: data.preferences.cooking.preferredCuisines.length,
            mealTypeFlexibility: data.preferences.cooking.preferredMealTypes.length,
            importance: IMPORTANCE_LEVELS.indexOf(data.preferences.cooking.importance)
          }
        },
        
        // NEW: House type preference matching
        houseTypeCompatibility: {
          preferredTypes: data.preferences.houseTypePreferences.preferredTypes || [],
          avoidTypes: data.preferences.houseTypePreferences.avoidTypes || [],
          flexibilityScore: ['low', 'medium', 'high'].indexOf(data.preferences.houseTypePreferences.flexibilityLevel)
        },
        
        // NEW: Location and cultural preference matching
        locationCompatibility: {
          preferredCountries: data.preferences.locationPreferences.preferredCountries || [],
          avoidCountries: data.preferences.locationPreferences.avoidCountries || [],
          preferredCities: data.preferences.locationPreferences.preferredCities || [],
          willingToRelocate: data.preferences.locationPreferences.willingToRelocate,
          preferredRegions: data.preferences.locationPreferences.preferredRegions || [],
          climatePreferences: data.preferences.locationPreferences.climatePreferences || [],
          culturePreferences: data.preferences.locationPreferences.culturePreferences || [],
          languageFlexibility: ['strict', 'preferred', 'flexible'].indexOf(data.preferences.locationPreferences.languageRequirement)
        },
        
        // Work environment compatibility
        workEnvironmentCompatibility: {
          liveInPreference: data.preferences.workEnvironmentPreferences.liveInPreference,
          workingDaysFlexibility: data.preferences.workEnvironmentPreferences.workingDaysPreference.length,
          workingHoursFlexibility: ['low', 'medium', 'high'].indexOf(data.preferences.workEnvironmentPreferences.workingHoursPreference.flexibility),
          familySizePreference: data.preferences.workEnvironmentPreferences.familySizePreference,
          petFriendly: data.preferences.workEnvironmentPreferences.petFriendly === 'yes',
          smokingTolerance: data.preferences.workEnvironmentPreferences.smokingEnvironment !== 'no_smoking',
          religiousAccommodation: data.preferences.workEnvironmentPreferences.religiousAccommodation
        },
        
        // Language proficiency scoring
        languageProfile: {
          languageCount: data.experience.languagesSpoken.length,
          languageScores: data.experience.languagesSpoken.map(lang => ({
            language: lang.language,
            proficiencyScore: PROFICIENCY_LEVELS.indexOf(lang.proficiency),
            canTeach: lang.canTeach
          })),
          averageProficiency: calculateAverageProficiency(data.experience.languagesSpoken)
        },
        
        // Personality and cultural fit scoring
        personalityProfile: {
          personalityScores: data.personalityProfile.personalityTraits,
          workStyleCompatibility: {
            supervisionNeed: ['minimal', 'moderate', 'close'].indexOf(data.personalityProfile.workStyle.preferredSupervision),
            initiativeLevel: ['low', 'medium', 'high'].indexOf(data.personalityProfile.workStyle.initiativeTaking),
            teamworkScore: ['poor', 'fair', 'good', 'excellent'].indexOf(data.personalityProfile.workStyle.teamwork),
            stressHandlingLevel: ['low', 'medium', 'high'].indexOf(data.personalityProfile.workStyle.stressHandling),
            learningSpeed: ['slow', 'moderate', 'quick', 'very_quick'].indexOf(data.personalityProfile.workStyle.learning)
          },
          culturalAdaptabilityScores: {
            foodFlexibility: ['low', 'medium', 'high'].indexOf(data.personalityProfile.culturalAdaptability.foodFlexibility),
            languageLearningWillingness: ['reluctant', 'neutral', 'willing', 'eager'].indexOf(data.personalityProfile.culturalAdaptability.languageLearning),
            customsRespect: ['low', 'medium', 'high'].indexOf(data.personalityProfile.culturalAdaptability.customsRespect),
            religiousTolerance: ['low', 'medium', 'high'].indexOf(data.personalityProfile.culturalAdaptability.religiousTolerance),
            socialInteractionComfort: ['uncomfortable', 'neutral', 'comfortable', 'very_comfortable'].indexOf(data.personalityProfile.culturalAdaptability.socialInteraction)
          }
        },
        
        // Salary and benefits expectations
        expectationsProfile: {
          salaryExpectation: {
            minimumSalary: parseFloat(data.expectations.salary.minimumAmount) || 0,
            preferredSalary: parseFloat(data.expectations.salary.preferredAmount) || 0,
            salaryNegotiable: data.expectations.salary.negotiable,
            performanceBonusExpected: data.expectations.salary.performanceBonusExpected,
            currency: data.expectations.salary.currency,
            period: data.expectations.salary.period
          },
          
          benefitsExpectations: {
            requiredBenefits: data.expectations.benefits.requiredBenefits || [],
            preferredBenefits: data.expectations.benefits.preferredBenefits || [],
            accommodationRequirements: data.expectations.benefits.accommodationRequirements || []
          },
          
          workConditionsExpectations: {
            maxWorkingHours: data.expectations.workConditions.maxWorkingHours,
            overtimeWillingness: data.expectations.workConditions.overtimeWillingness,
            holidayWorkWillingness: data.expectations.workConditions.holidayWorkWillingness,
            emergencyAvailability: data.expectations.workConditions.emergencyAvailability
          }
        },
        
        // Availability and readiness features
        availabilityProfile: {
          requiredOffDays: parseInt(data.requiredOffDays) || 0,
          immediateAvailable: data.readiness.canStartWork === 'immediately',
          hasValidPassport: data.readiness.hasValidPassport === 'yes',
          passportExpiry: data.readiness.passportExpiry,
          visaStatus: data.readiness.visaStatus,
          medicalCheckupStatus: data.readiness.medicalCheckup,
          backgroundCheckStatus: data.readiness.backgroundCheck,
          contractFlexibility: {
            minimumDuration: data.readiness.contractPreferences.minimumDuration,
            maximumDuration: data.readiness.contractPreferences.maximumDuration,
            renewalWillingness: data.readiness.contractPreferences.renewalWillingness,
            probationAcceptance: data.readiness.contractPreferences.probationAcceptance
          }
        },
        
        // Health and dietary restrictions
        healthProfile: {
          hasAllergies: data.hasAllergies === 'yes',
          hasMedicalIssues: data.hasPastIllness === 'yes',
          hasPhysicalDisabilities: data.hasPhysicalDisabilities === 'yes',
          foodHandlingRestrictions: data.foodHandlingPreferences || [],
          dietaryCompatibility: calculateDietaryCompatibility(data.foodHandlingPreferences)
        },
        
        // Employment history analysis
        employmentHistory: {
          employerCount: data.employers.length,
          averageEmploymentDuration: calculateAverageEmploymentDuration(data.employers),
          countryDiversity: [...new Set(data.employers.map(emp => emp.country))].length,
          householdSizesHandled: [...new Set(data.employers.map(emp => emp.householdSize))],
          houseTypesHandled: [...new Set(data.employers.map(emp => emp.houseType))],
          tasksPerformedDiversity: calculateTaskDiversity(data.employers),
          averageSalary: calculateAverageSalary(data.employers),
          recommendationScore: calculateRecommendationScore(data.employers)
        },
        
        // Additional skills scoring
        additionalSkillsProfile: {
          petCareExperience: data.experience.otherSkills.petCare.hasExperience,
          petTypesDiversity: data.experience.otherSkills.petCare.petTypes.length,
          tutoringExperience: data.experience.otherSkills.tutoring.hasExperience,
          tutoringSubjectsDiversity: data.experience.otherSkills.tutoring.subjects.length,
          drivingExperience: data.experience.otherSkills.driving.hasExperience,
          drivingYears: data.experience.otherSkills.driving.yearsExperience,
          firstAidCertified: data.experience.otherSkills.firstAid.hasCertification,
          otherSkillsDescription: data.experience.otherSkills.other
        },
        
        // Compatibility scoring (calculated fields for ML)
        compatibilityScores: {
          overallExperienceScore: calculateOverallExperienceScore(data),
          preferenceAlignmentScore: calculatePreferenceAlignmentScore(data),
          personalityFitScore: calculatePersonalityFitScore(data),
          locationFlexibilityScore: calculateLocationFlexibilityScore(data),
          salaryCompetitivenessScore: calculateSalaryCompetitivenessScore(data),
          availabilityScore: calculateAvailabilityScore(data)
        },
        
        // Embeddings (to be generated by ML pipeline)
        helperEmbedding: [],
        skillsEmbedding: [],
        personalityEmbedding: [],
        preferencesEmbedding: [],
        
        // Metadata for ML pipeline
        mlMetadata: {
          formVersion: '2.0',
          generatedAt: new Date().toISOString(),
          featureCount: calculateHelperFeatureCount(data),
          completenessScore: calculateFormCompletenessScore(data),
          dataQualityScore: calculateDataQualityScore(data)
        }
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

  // Helper functions for ML calculations
  const calculateAverageProficiency = (languages) => {
    if (languages.length === 0) return 0;
    const total = languages.reduce((sum, lang) => {
      return sum + PROFICIENCY_LEVELS.indexOf(lang.proficiency);
    }, 0);
    return total / languages.length;
  };

  const calculateDietaryCompatibility = (foodPreferences) => {
    // Score based on dietary restrictions (higher = more flexible)
    const restrictionCount = foodPreferences.length;
    return Math.max(0, 1 - (restrictionCount * 0.2)); // Max 5 restrictions
  };

  const calculateAverageEmploymentDuration = (employers) => {
    if (employers.length === 0) return 0;
    const totalYears = employers.reduce((sum, emp) => {
      if (emp.duration.from && emp.duration.to) {
        return sum + (parseInt(emp.duration.to) - parseInt(emp.duration.from));
      }
      return sum;
    }, 0);
    return totalYears / employers.length;
  };

  const calculateTaskDiversity = (employers) => {
    const allTasks = employers.reduce((tasks, emp) => {
      return [...tasks, ...(emp.tasksPerformed || [])];
    }, []);
    return [...new Set(allTasks)].length;
  };

  const calculateAverageSalary = (employers) => {
    const salariesWithValues = employers.filter(emp => emp.salary && emp.salary.amount);
    if (salariesWithValues.length === 0) return 0;
    
    const total = salariesWithValues.reduce((sum, emp) => {
      return sum + parseFloat(emp.salary.amount);
    }, 0);
    return total / salariesWithValues.length;
  };

  const calculateRecommendationScore = (employers) => {
    const recommendedCount = employers.filter(emp => emp.wouldRecommend === 'yes').length;
    return employers.length > 0 ? recommendedCount / employers.length : 0;
  };

  const calculateOverallExperienceScore = (data) => {
    const experienceTypes = [
      data.experience.careOfInfant.hasExperience,
      data.experience.careOfChildren.hasExperience,
      data.experience.careOfDisabled.hasExperience,
      data.experience.careOfOldAge.hasExperience,
      data.experience.generalHousework.hasExperience,
      data.experience.cooking.hasExperience
    ];
    
    const experienceCount = experienceTypes.filter(Boolean).length;
    const totalYears = calculateExperienceYears(data.employers);
    
    return (experienceCount / 6) * 0.6 + Math.min(totalYears / 10, 1) * 0.4;
  };

  const calculatePreferenceAlignmentScore = (data) => {
    const preferences = [
      data.preferences.careOfInfant.willing === 'yes',
      data.preferences.careOfChildren.willing === 'yes',
      data.preferences.careOfDisabled.willing === 'yes',
      data.preferences.careOfOldAge.willing === 'yes',
      data.preferences.generalHousework.willing === 'yes',
      data.preferences.cooking.willing === 'yes'
    ];
    
    const positivePreferences = preferences.filter(Boolean).length;
    return positivePreferences / 6;
  };

  const calculatePersonalityFitScore = (data) => {
    const traits = data.personalityProfile.personalityTraits;
    const avgTraitScore = Object.values(traits).reduce((sum, score) => sum + score, 0) / Object.keys(traits).length;
    return avgTraitScore / 10; // Normalize to 0-1
  };

  const calculateLocationFlexibilityScore = (data) => {
    const prefs = data.preferences.locationPreferences;
    let flexibilityScore = 0;
    
    // More preferred countries = less flexible
    flexibilityScore += prefs.preferredCountries.length > 0 ? -0.2 : 0.2;
    // Willing to relocate = more flexible
    flexibilityScore += prefs.willingToRelocate ? 0.3 : -0.1;
    // More climate preferences = less flexible
    flexibilityScore += prefs.climatePreferences.length > 2 ? -0.1 : 0.1;
    // Language flexibility
    flexibilityScore += prefs.languageRequirement === 'flexible' ? 0.3 : 
                       prefs.languageRequirement === 'preferred' ? 0.1 : -0.2;
    
    return Math.max(0, Math.min(1, flexibilityScore + 0.5)); // Normalize to 0-1
  };

  const calculateSalaryCompetitivenessScore = (data) => {
    const minSalary = parseFloat(data.expectations.salary.minimumAmount) || 0;
    const prefSalary = parseFloat(data.expectations.salary.preferredAmount) || minSalary;
    
    // Lower salary expectations = higher competitiveness
    // Assuming market range of 800-3000 for scoring
    const marketMin = 800;
    const marketMax = 3000;
    
    if (prefSalary === 0) return 0.5; // Neutral if no expectation
    
    const normalizedSalary = (prefSalary - marketMin) / (marketMax - marketMin);
    return Math.max(0, Math.min(1, 1 - normalizedSalary));
  };

  const calculateAvailabilityScore = (data) => {
    let score = 0;
    
    // Immediate availability
    score += data.readiness.canStartWork === 'immediately' ? 0.3 : 0.1;
    // Valid passport
    score += data.readiness.hasValidPassport === 'yes' ? 0.2 : 0;
    // Flexible off days (fewer required = higher score)
    const offDays = parseInt(data.requiredOffDays) || 0;
    score += Math.max(0, (4 - offDays) / 4) * 0.2;
    // Work conditions willingness
    score += data.expectations.workConditions.overtimeWillingness ? 0.1 : 0;
    score += data.expectations.workConditions.holidayWorkWillingness ? 0.1 : 0;
    score += data.expectations.workConditions.emergencyAvailability ? 0.1 : 0;
    
    return Math.min(1, score);
  };

  const calculateHelperFeatureCount = (data) => {
    let count = 0;
    
    // Basic info
    count += data.name ? 1 : 0;
    count += data.dateOfBirth ? 1 : 0;
    count += data.nationality ? 1 : 0;
    count += data.educationLevel ? 1 : 0;
    
    // Experience features
    count += data.experience.careOfInfant.hasExperience ? 1 : 0;
    count += data.experience.careOfChildren.hasExperience ? 1 : 0;
    count += data.experience.careOfDisabled.hasExperience ? 1 : 0;
    count += data.experience.careOfOldAge.hasExperience ? 1 : 0;
    count += data.experience.generalHousework.hasExperience ? 1 : 0;
    count += data.experience.cooking.hasExperience ? 1 : 0;
    
    // Languages
    count += data.experience.languagesSpoken.filter(lang => lang.language).length;
    
    // Preferences
    count += data.preferences.careOfInfant.willing ? 1 : 0;
    count += data.preferences.careOfChildren.willing ? 1 : 0;
    count += data.preferences.careOfDisabled.willing ? 1 : 0;
    count += data.preferences.careOfOldAge.willing ? 1 : 0;
    count += data.preferences.generalHousework.willing ? 1 : 0;
    count += data.preferences.cooking.willing ? 1 : 0;
    
    // Location preferences
    count += data.preferences.locationPreferences.preferredCountries.length;
    count += data.preferences.houseTypePreferences.preferredTypes.length;
    
    return count;
  };

  const calculateFormCompletenessScore = (data) => {
    const totalFields = 50; // Approximate total important fields
    const completedFields = calculateHelperFeatureCount(data);
    return Math.min(1, completedFields / totalFields);
  };

  const calculateDataQualityScore = (data) => {
    let qualityScore = 1.0;
    
    // Deduct for missing critical information
    if (!data.name) qualityScore -= 0.1;
    if (!data.dateOfBirth) qualityScore -= 0.1;
    if (!data.nationality) qualityScore -= 0.1;
    if (!data.educationLevel) qualityScore -= 0.05;
    if (!data.hasBeenHelperBefore) qualityScore -= 0.1;
    
    // Deduct for inconsistencies
    if (data.hasBeenHelperBefore === 'yes' && data.employers.length === 0) {
      qualityScore -= 0.2;
    }
    
    // Deduct for unrealistic data
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    if (age < 18 || age > 65) qualityScore -= 0.15;
    
    if (data.height && (parseInt(data.height) < 120 || parseInt(data.height) > 220)) {
      qualityScore -= 0.05;
    }
    
    return Math.max(0, qualityScore);
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
              {/* Care of Infant - Debug Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care of Infant 
                  <span className="text-xs text-gray-500 ml-2">
                    (Current: {formData.experience.careOfInfant.hasExperience ? 'Yes' : 'No'})
                  </span>
                </label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfant"
                      value="yes"
                      checked={formData.experience.careOfInfant.hasExperience === true}
                      onChange={(e) => {
                        console.log('Clicking YES for care of infant');
                        handleExperienceChange('careOfInfant', 'hasExperience', true);
                      }}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfInfant"
                      value="no"
                      checked={formData.experience.careOfInfant.hasExperience === false}
                      onChange={(e) => {
                        console.log('Clicking NO for care of infant');
                        handleExperienceChange('careOfInfant', 'hasExperience', false);
                      }}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                
                {/* Always show this section for testing */}
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm">
                    DEBUG: hasExperience = {JSON.stringify(formData.experience.careOfInfant.hasExperience)}
                  </p>
                  <p className="text-sm">
                    Should show details: {formData.experience.careOfInfant.hasExperience ? 'YES' : 'NO'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Manual toggle clicked');
                      handleExperienceChange('careOfInfant', 'hasExperience', !formData.experience.careOfInfant.hasExperience);
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    Manual Toggle (Current: {formData.experience.careOfInfant.hasExperience ? 'Yes' : 'No'})
                  </button>
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
                      checked={formData.experience.careOfChildren.hasExperience === true}
                      onChange={(e) => handleExperienceChange('careOfChildren', 'hasExperience', true)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="careOfChildren"
                      value="no"
                      checked={formData.experience.careOfChildren.hasExperience === false}
                      onChange={(e) => handleExperienceChange('careOfChildren', 'hasExperience', false)}
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

              {/* Other experience types - Enhanced */}
              <div className="space-y-4">
                {/* Care of Disabled - Enhanced */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="careOfDisabledExp"
                      checked={formData.experience.careOfDisabled.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfDisabled', 'hasExperience', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="careOfDisabledExp" className="text-sm font-medium text-gray-700">
                      Care of Disabled Persons
                    </label>
                  </div>
                  
                  {formData.experience.careOfDisabled.hasExperience && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disability Types Handled</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['mobility', 'cognitive', 'sensory', 'developmental', 'mental_health', 'other'].map(type => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.careOfDisabled.disabilityTypes.includes(type)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...formData.experience.careOfDisabled.disabilityTypes, type]
                                    : formData.experience.careOfDisabled.disabilityTypes.filter(t => t !== type);
                                  handleExperienceChange('careOfDisabled', 'disabilityTypes', newTypes);
                                }}
                                className="mr-2"
                              />
                              {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {DISABLED_CARE_TASKS.map(task => (
                            <label key={task} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.careOfDisabled.specificTasks.includes(task)}
                                onChange={(e) => {
                                  const newTasks = e.target.checked
                                    ? [...formData.experience.careOfDisabled.specificTasks, task]
                                    : formData.experience.careOfDisabled.specificTasks.filter(t => t !== task);
                                  handleExperienceChange('careOfDisabled', 'specificTasks', newTasks);
                                }}
                                className="mr-2"
                              />
                              {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Care of Old Age - Enhanced */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="careOfOldAgeExp"
                      checked={formData.experience.careOfOldAge.hasExperience}
                      onChange={(e) => handleExperienceChange('careOfOldAge', 'hasExperience', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="careOfOldAgeExp" className="text-sm font-medium text-gray-700">
                      Care of Elderly
                    </label>
                  </div>
                  
                  {formData.experience.careOfOldAge.hasExperience && (
                    <div className="ml-6 space-y-3">
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.experience.careOfOldAge.mobilityAssistance}
                            onChange={(e) => handleExperienceChange('careOfOldAge', 'mobilityAssistance', e.target.checked)}
                            className="mr-2"
                          />
                          Mobility assistance experience
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.experience.careOfOldAge.medicationManagement}
                            onChange={(e) => handleExperienceChange('careOfOldAge', 'medicationManagement', e.target.checked)}
                            className="mr-2"
                          />
                          Medication management experience
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {ELDERLY_CARE_TASKS.map(task => (
                            <label key={task} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.careOfOldAge.specificTasks.includes(task)}
                                onChange={(e) => {
                                  const newTasks = e.target.checked
                                    ? [...formData.experience.careOfOldAge.specificTasks, task]
                                    : formData.experience.careOfOldAge.specificTasks.filter(t => t !== task);
                                  handleExperienceChange('careOfOldAge', 'specificTasks', newTasks);
                                }}
                                className="mr-2"
                              />
                              {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* General Housework - Enhanced */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="generalHouseworkExp"
                      checked={formData.experience.generalHousework.hasExperience}
                      onChange={(e) => handleExperienceChange('generalHousework', 'hasExperience', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="generalHouseworkExp" className="text-sm font-medium text-gray-700">
                      General Housework
                    </label>
                  </div>
                  
                  {formData.experience.generalHousework.hasExperience && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">House Sizes Handled</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['small', 'medium', 'large'].map(size => (
                            <label key={size} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.generalHousework.houseSizes.includes(size)}
                                onChange={(e) => {
                                  const newSizes = e.target.checked
                                    ? [...formData.experience.generalHousework.houseSizes, size]
                                    : formData.experience.generalHousework.houseSizes.filter(s => s !== size);
                                  handleExperienceChange('generalHousework', 'houseSizes', newSizes);
                                }}
                                className="mr-2"
                              />
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {HOUSEWORK_TASKS.map(task => (
                            <label key={task} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.generalHousework.specificTasks.includes(task)}
                                onChange={(e) => {
                                  const newTasks = e.target.checked
                                    ? [...formData.experience.generalHousework.specificTasks, task]
                                    : formData.experience.generalHousework.specificTasks.filter(t => t !== task);
                                  handleExperienceChange('generalHousework', 'specificTasks', newTasks);
                                }}
                                className="mr-2"
                              />
                              {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
                      checked={formData.experience.cooking.hasExperience === true}
                      onChange={(e) => handleExperienceChange('cooking', 'hasExperience', true)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="cooking"
                      value="no"
                      checked={formData.experience.cooking.hasExperience === false}
                      onChange={(e) => handleExperienceChange('cooking', 'hasExperience', false)}
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

              {/* Enhanced Languages Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Languages Spoken</h4>
                
                {formData.experience.languagesSpoken.map((language, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={language.language}
                          onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Language</option>
                          {LANGUAGES.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                        <select
                          value={language.proficiency}
                          onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            checked={language.canTeach}
                            onChange={(e) => handleLanguageChange(index, 'canTeach', e.target.checked)}
                            className="mr-2"
                          />
                          Can teach this language
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Language
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addLanguage}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Another Language
                </button>
              </div>

              {/* Enhanced Other Skills Section */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Additional Skills</h4>
                
                <div className="space-y-4">
                  {/* Pet Care */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.experience.otherSkills.petCare.hasExperience}
                          onChange={(e) => handleNestedExperienceChange('otherSkills', 'petCare', 'hasExperience', e.target.checked)}
                          className="mr-2"
                        />
                        Pet Care Experience
                      </label>
                    </div>
                    
                    {formData.experience.otherSkills.petCare.hasExperience && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pet Types</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {PET_TYPES.map(petType => (
                            <label key={petType} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.experience.otherSkills.petCare.petTypes.includes(petType)}
                                onChange={(e) => {
                                  const newPetTypes = e.target.checked
                                    ? [...formData.experience.otherSkills.petCare.petTypes, petType]
                                    : formData.experience.otherSkills.petCare.petTypes.filter(p => p !== petType);
                                  handleNestedExperienceChange('otherSkills', 'petCare', 'petTypes', newPetTypes);
                                }}
                                className="mr-2"
                              />
                              {petType.charAt(0).toUpperCase() + petType.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Driving */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.experience.otherSkills.driving.hasExperience}
                          onChange={(e) => handleNestedExperienceChange('otherSkills', 'driving', 'hasExperience', e.target.checked)}
                          className="mr-2"
                        />
                        Driving Experience
                      </label>
                    </div>
                    
                    {formData.experience.otherSkills.driving.hasExperience && (
                      <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                          <input
                            type="text"
                            value={formData.experience.otherSkills.driving.licenseType}
                            onChange={(e) => handleNestedExperienceChange('otherSkills', 'driving', 'licenseType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Class 3, Class 4"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                          <input
                            type="number"
                            value={formData.experience.otherSkills.driving.yearsExperience}
                            onChange={(e) => handleNestedExperienceChange('otherSkills', 'driving', 'yearsExperience', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max="50"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* First Aid */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.experience.otherSkills.firstAid.hasCertification}
                          onChange={(e) => handleNestedExperienceChange('otherSkills', 'firstAid', 'hasCertification', e.target.checked)}
                          className="mr-2"
                        />
                        First Aid Certification
                      </label>
                    </div>
                    
                    {formData.experience.otherSkills.firstAid.hasCertification && (
                      <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Certification Level</label>
                          <input
                            type="text"
                            value={formData.experience.otherSkills.firstAid.certificationLevel}
                            onChange={(e) => handleNestedExperienceChange('otherSkills', 'firstAid', 'certificationLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Basic, Advanced, CPR"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="date"
                            value={formData.experience.otherSkills.firstAid.expiryDate}
                            onChange={(e) => handleNestedExperienceChange('otherSkills', 'firstAid', 'expiryDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Other Skills Text Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Skills (free text)</label>
                    <textarea
                      value={formData.experience.otherSkills.other}
                      onChange={(e) => handleExperienceChange('otherSkills', 'other', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="e.g., Gardening, tutoring, musical instruments, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Ex-employer Snapshots */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Enhanced Ex-employer Details</h4>
              
              {formData.employers.map((employer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  {/* Basic employer info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={employer.city}
                        onChange={(e) => handleEmployerChange(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Singapore, Dubai"
                      />
                    </div>
                  </div>

                  {/* Duration and house details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
                        <input
                          type="number"
                          value={employer.duration.from}
                          onChange={(e) => handleEmployerChange(index, 'duration.from', e.target.value)}
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
                          onChange={(e) => handleEmployerChange(index, 'duration.to', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1990"
                          max="2024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
                      <select
                        value={employer.householdSize}
                        onChange={(e) => handleEmployerChange(index, 'householdSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Size</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6+">6+ people</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">House Type</label>
                      <select
                        value={employer.houseType}
                        onChange={(e) => handleEmployerChange(index, 'houseType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select House Type</option>
                        {HOUSE_TYPES.map(houseType => (
                          <option key={houseType} value={houseType}>{houseType}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tasks performed */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tasks Performed</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {HOUSEWORK_TASKS.map(task => (
                        <label key={task} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={employer.tasksPerformed?.includes(task) || false}
                            onChange={(e) => {
                              const newTasks = e.target.checked
                                ? [...(employer.tasksPerformed || []), task]
                                : (employer.tasksPerformed || []).filter(t => t !== task);
                              handleEmployerChange(index, 'tasksPerformed', newTasks);
                            }}
                            className="mr-2"
                          />
                          {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Salary information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount</label>
                      <input
                        type="number"
                        value={employer.salary?.amount || ''}
                        onChange={(e) => handleEmployerChange(index, 'salary.amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={employer.salary?.currency || 'USD'}
                        onChange={(e) => handleEmployerChange(index, 'salary.currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="SGD">SGD</option>
                        <option value="HKD">HKD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                        <option value="MYR">MYR</option>
                        <option value="AED">AED</option>
                        <option value="SAR">SAR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                      <select
                        value={employer.salary?.period || 'monthly'}
                        onChange={(e) => handleEmployerChange(index, 'salary.period', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                      <input
                        type="text"
                        value={employer.reasonForLeaving}
                        onChange={(e) => handleEmployerChange(index, 'reasonForLeaving', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Contract ended, Family moved"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Would They Recommend You?</label>
                      <select
                        value={employer.wouldRecommend}
                        onChange={(e) => handleEmployerChange(index, 'wouldRecommend', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select answer</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="unsure">Unsure</option>
                      </select>
                    </div>
                  </div>

                  {/* Challenges and achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Challenges</label>
                      <textarea
                        value={employer.challenges}
                        onChange={(e) => handleEmployerChange(index, 'challenges', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="What were the main challenges in this role?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
                      <textarea
                        value={employer.achievements}
                        onChange={(e) => handleEmployerChange(index, 'achievements', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="What were your main accomplishments?"
                      />
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

        {/* E. Enhanced Job Preferences */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">E. Job Preferences</h3>
          
          <div className="space-y-6">
            {/* Care preferences with detailed options */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Care Preferences</h4>
              
              <div className="space-y-4">
                {/* Infant Care Preference */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">Willing to take care of infant?</label>
                  </div>
                  <div className="flex space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="careOfInfantPref"
                        value="yes"
                        checked={formData.preferences.careOfInfant.willing === 'yes'}
                        onChange={(e) => handleInputChange('preferences', 'careOfInfant', {
                          ...formData.preferences.careOfInfant,
                          willing: e.target.value
                        })}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="careOfInfantPref"
                        value="no"
                        checked={formData.preferences.careOfInfant.willing === 'no'}
                        onChange={(e) => handleInputChange('preferences', 'careOfInfant', {
                          ...formData.preferences.careOfInfant,
                          willing: e.target.value
                        })}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                  
                  {formData.preferences.careOfInfant.willing === 'yes' && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Age Range (months)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.preferences.careOfInfant.preferredAges.includes(i)}
                                onChange={(e) => handleArrayFieldChange('preferences', 'careOfInfant.preferredAges', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i} months
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Number</label>
                          <select
                            value={formData.preferences.careOfInfant.maxNumber}
                            onChange={(e) => handleInputChange('preferences', 'careOfInfant', {
                              ...formData.preferences.careOfInfant,
                              maxNumber: parseInt(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>No limit</option>
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                          <select
                            value={formData.preferences.careOfInfant.importance}
                            onChange={(e) => handleInputChange('preferences', 'careOfInfant', {
                              ...formData.preferences.careOfInfant,
                              importance: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {IMPORTANCE_LEVELS.map(level => (
                              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Similar structure for other care preferences - Children */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">Willing to take care of children?</label>
                  </div>
                  <div className="flex space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="careOfChildrenPref"
                        value="yes"
                        checked={formData.preferences.careOfChildren.willing === 'yes'}
                        onChange={(e) => handleInputChange('preferences', 'careOfChildren', {
                          ...formData.preferences.careOfChildren,
                          willing: e.target.value
                        })}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="careOfChildrenPref"
                        value="no"
                        checked={formData.preferences.careOfChildren.willing === 'no'}
                        onChange={(e) => handleInputChange('preferences', 'careOfChildren', {
                          ...formData.preferences.careOfChildren,
                          willing: e.target.value
                        })}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                  
                  {formData.preferences.careOfChildren.willing === 'yes' && (
                    <div className="ml-6 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Age Range (years)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(13)].map((_, i) => (
                            <label key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.preferences.careOfChildren.preferredAges.includes(i)}
                                onChange={(e) => handleArrayFieldChange('preferences', 'careOfChildren.preferredAges', i, e.target.checked)}
                                className="mr-2"
                              />
                              {i} years
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Number</label>
                          <select
                            value={formData.preferences.careOfChildren.maxNumber}
                            onChange={(e) => handleInputChange('preferences', 'careOfChildren', {
                              ...formData.preferences.careOfChildren,
                              maxNumber: parseInt(e.target.value)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={0}>No limit</option>
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                          <select
                            value={formData.preferences.careOfChildren.importance}
                            onChange={(e) => handleInputChange('preferences', 'careOfChildren', {
                              ...formData.preferences.careOfChildren,
                              importance: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {IMPORTANCE_LEVELS.map(level => (
                              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.preferences.careOfChildren.schoolSupport}
                            onChange={(e) => handleInputChange('preferences', 'careOfChildren', {
                              ...formData.preferences.careOfChildren,
                              schoolSupport: e.target.checked
                            })}
                            className="mr-2"
                          />
                          Willing to provide school support (pickup/drop-off, homework help)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                             </div>
             </div>
             
             {/* NEW: House Type Preferences */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">House Type Preferences</h4>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Preferred House Types</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {HOUSE_TYPES.map(houseType => (
                       <label key={houseType} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.preferences.houseTypePreferences.preferredTypes.includes(houseType)}
                           onChange={(e) => handleArrayFieldChange('preferences', 'houseTypePreferences.preferredTypes', houseType, e.target.checked)}
                           className="mr-2"
                         />
                         {houseType}
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">House Types to Avoid</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {HOUSE_TYPES.map(houseType => (
                       <label key={houseType} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.preferences.houseTypePreferences.avoidTypes.includes(houseType)}
                           onChange={(e) => handleArrayFieldChange('preferences', 'houseTypePreferences.avoidTypes', houseType, e.target.checked)}
                           className="mr-2"
                         />
                         {houseType}
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Flexibility Level</label>
                   <select
                     value={formData.preferences.houseTypePreferences.flexibilityLevel}
                     onChange={(e) => handleInputChange('preferences', 'houseTypePreferences', {
                       ...formData.preferences.houseTypePreferences,
                       flexibilityLevel: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="low">Low - Strict preferences</option>
                     <option value="medium">Medium - Some flexibility</option>
                     <option value="high">High - Very flexible</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* NEW: Location and Country Preferences */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Location and Country Preferences</h4>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Countries</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {COUNTRIES.map(country => (
                       <label key={country} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.preferences.locationPreferences.preferredCountries.includes(country)}
                           onChange={(e) => handleArrayFieldChange('preferences', 'locationPreferences.preferredCountries', country, e.target.checked)}
                           className="mr-2"
                         />
                         {country}
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Countries to Avoid</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {COUNTRIES.map(country => (
                       <label key={country} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.preferences.locationPreferences.avoidCountries.includes(country)}
                           onChange={(e) => handleArrayFieldChange('preferences', 'locationPreferences.avoidCountries', country, e.target.checked)}
                           className="mr-2"
                         />
                         {country}
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Cities (separate with commas)</label>
                     <input
                       type="text"
                       value={formData.preferences.locationPreferences.preferredCities.join(', ')}
                       onChange={(e) => handleInputChange('preferences', 'locationPreferences', {
                         ...formData.preferences.locationPreferences,
                         preferredCities: e.target.value.split(', ').filter(city => city.trim())
                       })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="e.g., Singapore, Kuala Lumpur, Dubai"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Language Requirement</label>
                     <select
                       value={formData.preferences.locationPreferences.languageRequirement}
                       onChange={(e) => handleInputChange('preferences', 'locationPreferences', {
                         ...formData.preferences.locationPreferences,
                         languageRequirement: e.target.value
                       })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="flexible">Flexible - Any language environment</option>
                       <option value="preferred">Preferred - Some language match preferred</option>
                       <option value="strict">Strict - Must match my languages</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Regions</label>
                     <div className="space-y-2">
                       {['urban', 'suburban', 'rural'].map(region => (
                         <label key={region} className="flex items-center">
                           <input
                             type="checkbox"
                             checked={formData.preferences.locationPreferences.preferredRegions.includes(region)}
                             onChange={(e) => handleArrayFieldChange('preferences', 'locationPreferences.preferredRegions', region, e.target.checked)}
                             className="mr-2"
                           />
                           {region.charAt(0).toUpperCase() + region.slice(1)}
                         </label>
                       ))}
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Climate Preferences</label>
                     <div className="space-y-2">
                       {['tropical', 'temperate', 'cold', 'dry', 'humid'].map(climate => (
                         <label key={climate} className="flex items-center">
                           <input
                             type="checkbox"
                             checked={formData.preferences.locationPreferences.climatePreferences.includes(climate)}
                             onChange={(e) => handleArrayFieldChange('preferences', 'locationPreferences.climatePreferences', climate, e.target.checked)}
                             className="mr-2"
                           />
                           {climate.charAt(0).toUpperCase() + climate.slice(1)}
                         </label>
                       ))}
                     </div>
                   </div>
                 </div>
                 
                 <div>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.preferences.locationPreferences.willingToRelocate}
                       onChange={(e) => handleInputChange('preferences', 'locationPreferences', {
                         ...formData.preferences.locationPreferences,
                         willingToRelocate: e.target.checked
                       })}
                       className="mr-2"
                     />
                     Willing to relocate to new countries for work
                   </label>
                 </div>
               </div>
             </div>
           </div>
                   </section>

         {/* NEW: Personality and Cultural Fit Assessment */}
         <section className="bg-blue-50 p-6 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Personality and Cultural Fit Assessment</h3>
           <p className="text-gray-600 mb-4">Help us understand your personality and adaptability for better matching</p>
           
           <div className="space-y-6">
             {/* Personality Traits */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Rate Your Personality Traits (1-10 scale)</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.entries(formData.personalityProfile.personalityTraits).map(([trait, value]) => (
                   <div key={trait}>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       {trait.charAt(0).toUpperCase() + trait.slice(1).replace(/([A-Z])/g, ' $1')}
                     </label>
                     <div className="flex items-center space-x-2">
                       <span className="text-sm">1</span>
                       <input
                         type="range"
                         min="1"
                         max="10"
                         value={value}
                         onChange={(e) => handleInputChange('personalityProfile', 'personalityTraits', {
                           ...formData.personalityProfile.personalityTraits,
                           [trait]: parseInt(e.target.value)
                         })}
                         className="flex-1"
                       />
                       <span className="text-sm">10</span>
                       <span className="text-sm font-medium w-8">{value}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Work Style */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Work Style Preferences</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Supervision Level</label>
                   <select
                     value={formData.personalityProfile.workStyle.preferredSupervision}
                     onChange={(e) => handleInputChange('personalityProfile', 'workStyle', {
                       ...formData.personalityProfile.workStyle,
                       preferredSupervision: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="minimal">Minimal - I work independently</option>
                     <option value="moderate">Moderate - Some guidance is helpful</option>
                     <option value="close">Close - I prefer clear instructions</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Initiative Taking</label>
                   <select
                     value={formData.personalityProfile.workStyle.initiativeTaking}
                     onChange={(e) => handleInputChange('personalityProfile', 'workStyle', {
                       ...formData.personalityProfile.workStyle,
                       initiativeTaking: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="low">Low - I prefer to follow instructions</option>
                     <option value="medium">Medium - I take initiative when needed</option>
                     <option value="high">High - I often suggest improvements</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Teamwork Style</label>
                   <select
                     value={formData.personalityProfile.workStyle.teamwork}
                     onChange={(e) => handleInputChange('personalityProfile', 'workStyle', {
                       ...formData.personalityProfile.workStyle,
                       teamwork: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="poor">Poor - I prefer working alone</option>
                     <option value="fair">Fair - I can work with others when needed</option>
                     <option value="good">Good - I work well with others</option>
                     <option value="excellent">Excellent - I thrive in team environments</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Learning Speed</label>
                   <select
                     value={formData.personalityProfile.workStyle.learning}
                     onChange={(e) => handleInputChange('personalityProfile', 'workStyle', {
                       ...formData.personalityProfile.workStyle,
                       learning: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="slow">Slow - I need time to learn new things</option>
                     <option value="moderate">Moderate - I learn at average pace</option>
                     <option value="quick">Quick - I pick up new skills easily</option>
                     <option value="very_quick">Very Quick - I learn very fast</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* Cultural Adaptability */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Cultural Adaptability</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Food Flexibility</label>
                   <select
                     value={formData.personalityProfile.culturalAdaptability.foodFlexibility}
                     onChange={(e) => handleInputChange('personalityProfile', 'culturalAdaptability', {
                       ...formData.personalityProfile.culturalAdaptability,
                       foodFlexibility: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="low">Low - I stick to familiar foods</option>
                     <option value="medium">Medium - I'm open to some new foods</option>
                     <option value="high">High - I'm very open to different cuisines</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Language Learning Willingness</label>
                   <select
                     value={formData.personalityProfile.culturalAdaptability.languageLearning}
                     onChange={(e) => handleInputChange('personalityProfile', 'culturalAdaptability', {
                       ...formData.personalityProfile.culturalAdaptability,
                       languageLearning: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="reluctant">Reluctant - I prefer using my current languages</option>
                     <option value="neutral">Neutral - I might learn if necessary</option>
                     <option value="willing">Willing - I'm open to learning new languages</option>
                     <option value="eager">Eager - I love learning new languages</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Social Interaction Comfort</label>
                   <select
                     value={formData.personalityProfile.culturalAdaptability.socialInteraction}
                     onChange={(e) => handleInputChange('personalityProfile', 'culturalAdaptability', {
                       ...formData.personalityProfile.culturalAdaptability,
                       socialInteraction: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="uncomfortable">Uncomfortable - I prefer minimal social interaction</option>
                     <option value="neutral">Neutral - I'm okay with normal interaction</option>
                     <option value="comfortable">Comfortable - I enjoy social interaction</option>
                     <option value="very_comfortable">Very Comfortable - I thrive in social environments</option>
                   </select>
                 </div>
               </div>
             </div>
           </div>
         </section>

         {/* NEW: Salary and Benefits Expectations */}
         <section className="bg-green-50 p-6 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary and Benefits Expectations</h3>
           
           <div className="space-y-6">
             {/* Salary Expectations */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Salary Expectations</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Acceptable Salary</label>
                   <input
                     type="number"
                     value={formData.expectations.salary.minimumAmount}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       minimumAmount: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., 800"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Salary</label>
                   <input
                     type="number"
                     value={formData.expectations.salary.preferredAmount}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       preferredAmount: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., 1200"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                   <select
                     value={formData.expectations.salary.currency}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       currency: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="USD">USD</option>
                     <option value="SGD">SGD</option>
                     <option value="HKD">HKD</option>
                     <option value="EUR">EUR</option>
                     <option value="GBP">GBP</option>
                     <option value="AUD">AUD</option>
                     <option value="CAD">CAD</option>
                     <option value="MYR">MYR</option>
                     <option value="AED">AED</option>
                     <option value="SAR">SAR</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period</label>
                   <select
                     value={formData.expectations.salary.period}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       period: e.target.value
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="monthly">Monthly</option>
                     <option value="weekly">Weekly</option>
                     <option value="daily">Daily</option>
                     <option value="hourly">Hourly</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <label className="flex items-center">
                   <input
                     type="checkbox"
                     checked={formData.expectations.salary.negotiable}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       negotiable: e.target.checked
                     })}
                     className="mr-2"
                   />
                   Salary is negotiable
                 </label>

                 <label className="flex items-center">
                   <input
                     type="checkbox"
                     checked={formData.expectations.salary.performanceBonusExpected}
                     onChange={(e) => handleInputChange('expectations', 'salary', {
                       ...formData.expectations.salary,
                       performanceBonusExpected: e.target.checked
                     })}
                     className="mr-2"
                   />
                   Expect performance bonuses
                 </label>
               </div>
             </div>

             {/* Benefits Expectations */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Benefits Expectations</h4>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Required Benefits</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {BENEFITS.map(benefit => (
                       <label key={benefit} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.expectations.benefits.requiredBenefits.includes(benefit)}
                           onChange={(e) => handleArrayFieldChange('expectations', 'benefits.requiredBenefits', benefit, e.target.checked)}
                           className="mr-2"
                         />
                         {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                       </label>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Benefits (nice to have)</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {BENEFITS.map(benefit => (
                       <label key={benefit} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.expectations.benefits.preferredBenefits.includes(benefit)}
                           onChange={(e) => handleArrayFieldChange('expectations', 'benefits.preferredBenefits', benefit, e.target.checked)}
                           className="mr-2"
                         />
                         {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                       </label>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Requirements (if live-in)</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {ACCOMMODATIONS.map(accommodation => (
                       <label key={accommodation} className="flex items-center">
                         <input
                           type="checkbox"
                           checked={formData.expectations.benefits.accommodationRequirements.includes(accommodation)}
                           onChange={(e) => handleArrayFieldChange('expectations', 'benefits.accommodationRequirements', accommodation, e.target.checked)}
                           className="mr-2"
                         />
                         {accommodation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                       </label>
                     ))}
                   </div>
                 </div>
               </div>
             </div>

             {/* Work Conditions */}
             <div>
               <h4 className="text-md font-semibold text-gray-700 mb-3">Work Conditions Preferences</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Working Hours per Day</label>
                   <select
                     value={formData.expectations.workConditions.maxWorkingHours}
                     onChange={(e) => handleInputChange('expectations', 'workConditions', {
                       ...formData.expectations.workConditions,
                       maxWorkingHours: parseInt(e.target.value)
                     })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     {[6, 7, 8, 9, 10, 11, 12].map(hours => (
                       <option key={hours} value={hours}>{hours} hours</option>
                     ))}
                   </select>
                 </div>

                 <div className="space-y-2">
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.expectations.workConditions.overtimeWillingness}
                       onChange={(e) => handleInputChange('expectations', 'workConditions', {
                         ...formData.expectations.workConditions,
                         overtimeWillingness: e.target.checked
                       })}
                       className="mr-2"
                     />
                     Willing to work overtime when needed
                   </label>

                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.expectations.workConditions.holidayWorkWillingness}
                       onChange={(e) => handleInputChange('expectations', 'workConditions', {
                         ...formData.expectations.workConditions,
                         holidayWorkWillingness: e.target.checked
                       })}
                       className="mr-2"
                     />
                     Willing to work on holidays
                   </label>

                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.expectations.workConditions.emergencyAvailability}
                       onChange={(e) => handleInputChange('expectations', 'workConditions', {
                         ...formData.expectations.workConditions,
                         emergencyAvailability: e.target.checked
                       })}
                       className="mr-2"
                     />
                     Available for emergencies
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