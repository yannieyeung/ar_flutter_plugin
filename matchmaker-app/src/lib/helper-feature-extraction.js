/**
 * Helper Feature Extraction System
 * Pre-computes all ML features from helper registration data for optimal performance
 * Features are designed to match against job requirements efficiently
 */

import { getStructuredExperienceForML, calculateExperienceYears } from './experience-utils';

// Main feature extraction function
export function extractHelperFeatures(helperData) {
  try {
    const features = {
      // Core Demographics (normalized 0-1)
      demographics: extractDemographicFeatures(helperData),
      
      // Experience & Skills (detailed vectors)
      experience: extractExperienceFeatures(helperData),
      
      // Language Capabilities (multi-dimensional)
      languages: extractLanguageFeatures(helperData),
      
      // Work Preferences & Availability
      workPreferences: extractWorkPreferenceFeatures(helperData),
      
      // Personal & Cultural Factors
      personal: extractPersonalFeatures(helperData),
      
      // Reliability & Trust Indicators
      reliability: extractReliabilityFeatures(helperData),
      
      // Specialization Scores (0-1 for each major category)
      specializations: extractSpecializationScores(helperData),
      
      // Composite Scores (derived features)
      composite: extractCompositeFeatures(helperData),
      
      // Meta Information
      meta: {
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        completeness: calculateFeatureCompleteness(helperData)
      }
    };

    return features;
  } catch (error) {
    console.error('Error extracting helper features:', error);
    return getDefaultFeatures();
  }
}

// Extract demographic features
function extractDemographicFeatures(helper) {
  const currentYear = new Date().getFullYear();
  const age = calculateAge(helper.dateOfBirth);
  
  return {
    // Age (normalized)
    age: age / 100, // Normalize to 0-1 (assuming max age 100)
    ageCategory: categorizeAge(age),
    ageScore: calculateAgeScore(age), // Peak performance age gets higher score
    
    // Nationality (encoded)
    nationality: helper.nationality || '',
    nationalityRegion: getNationalityRegion(helper.nationality),
    isAseanNationality: isAseanCountry(helper.nationality),
    
    // Family Status
    hasChildren: (helper.numberOfChildren || 0) > 0 ? 1 : 0,
    numberOfChildren: Math.min((helper.numberOfChildren || 0) / 5, 1), // Normalize to 0-1
    familyResponsibilities: calculateFamilyResponsibilities(helper),
    
    // Education Level (ordinal encoding)
    educationLevel: helper.educationLevel || '',
    educationScore: getEducationScore(helper.educationLevel),
    
    // Religious Compatibility
    religion: helper.religion || '',
    isCommonReligion: isCommonReligion(helper.religion)
  };
}

// Extract experience features
function extractExperienceFeatures(helper) {
  const experienceML = helper.experienceForML || getStructuredExperienceForML(helper.experience);
  
  const features = {
    // Total Experience
    totalYears: Math.min(experienceML.totalExperienceYears / 20, 1), // Normalize to 0-1
    hasAnyExperience: experienceML.totalExperienceYears > 0 ? 1 : 0,
    experienceLevel: categorizeExperienceLevel(experienceML.totalExperienceYears),
    
    // Skill-specific Experience (years normalized)
    careOfInfantYears: Math.min((experienceML.skillsExperience.careOfInfant?.yearsOfExperience || 0) / 10, 1),
    careOfChildrenYears: Math.min((experienceML.skillsExperience.careOfChildren?.yearsOfExperience || 0) / 10, 1),
    careOfDisabledYears: Math.min((experienceML.skillsExperience.careOfDisabled?.yearsOfExperience || 0) / 10, 1),
    careOfOldAgeYears: Math.min((experienceML.skillsExperience.careOfOldAge?.yearsOfExperience || 0) / 10, 1),
    generalHouseworkYears: Math.min((experienceML.skillsExperience.generalHousework?.yearsOfExperience || 0) / 10, 1),
    cookingYears: Math.min((experienceML.skillsExperience.cooking?.yearsOfExperience || 0) / 10, 1),
    
    // Skill Competency Scores (0-1)
    careOfInfantCompetency: experienceML.skillsCompetency.careOfInfant || 0,
    careOfChildrenCompetency: experienceML.skillsCompetency.careOfChildren || 0,
    careOfDisabledCompetency: experienceML.skillsCompetency.careOfDisabled || 0,
    careOfOldAgeCompetency: experienceML.skillsCompetency.careOfOldAge || 0,
    generalHouseworkCompetency: experienceML.skillsCompetency.generalHousework || 0,
    cookingCompetency: experienceML.skillsCompetency.cooking || 0,
    
    // Experience Breadth & Depth
    skillDiversity: experienceML.activeSkills.length / 6, // Max 6 categories
    averageCompetency: calculateAverageCompetency(experienceML.skillsCompetency),
    hasSpecialization: hasSpecializationSkill(experienceML.skillsCompetency),
    
    // Current vs Past Experience
    currentJobsCount: experienceML.experienceTimeline.filter(t => t.endYear === null).length,
    hasCurrentExperience: experienceML.experienceTimeline.some(t => t.endYear === null) ? 1 : 0,
    
    // Task-level Granularity
    taskCompetencies: extractTaskCompetencies(helper.experience)
  };
  
  return features;
}

// Extract language features
function extractLanguageFeatures(helper) {
  const languages = helper.experience?.languagesSpoken || [];
  
  const features = {
    // Language Count
    languageCount: Math.min(languages.length / 5, 1), // Normalize (max 5 languages)
    
    // Specific Language Proficiencies (0-1)
    englishProficiency: getLanguageProficiency(languages, 'English'),
    mandarinProficiency: getLanguageProficiency(languages, 'Mandarin'),
    cantoneseProficiency: getLanguageProficiency(languages, 'Cantonese'),
    malayProficiency: getLanguageProficiency(languages, 'Malay'),
    tamilProficiency: getLanguageProficiency(languages, 'Tamil'),
    hindiProficiency: getLanguageProficiency(languages, 'Hindi'),
    
    // Language Categories
    hasWesternLanguage: hasLanguageCategory(languages, ['English', 'French', 'German', 'Spanish']),
    hasChineseLanguage: hasLanguageCategory(languages, ['Mandarin', 'Cantonese']),
    hasIndianLanguage: hasLanguageCategory(languages, ['Tamil', 'Hindi']),
    hasAseanLanguage: hasLanguageCategory(languages, ['Malay', 'Thai', 'Vietnamese', 'Indonesian']),
    
    // Teaching Capability
    canTeachLanguages: languages.filter(l => l.canTeach).length,
    canTeachEnglish: languages.some(l => l.language === 'English' && l.canTeach) ? 1 : 0,
    canTeachChinese: languages.some(l => ['Mandarin', 'Cantonese'].includes(l.language) && l.canTeach) ? 1 : 0,
    
    // Communication Score
    communicationScore: calculateCommunicationScore(languages)
  };
  
  return features;
}

// Extract work preference features
function extractWorkPreferenceFeatures(helper) {
  return {
    // Flexibility Indicators
    willingToRelocate: helper.willingToRelocate ? 1 : 0,
    hasOwnTransport: helper.hasOwnTransport ? 1 : 0,
    flexibleSchedule: helper.flexibleSchedule ? 1 : 0,
    
    // Work Environment Preferences
    prefersLiveIn: helper.workPreferences?.liveIn ? 1 : 0,
    prefersLiveOut: helper.workPreferences?.liveOut ? 1 : 0,
    comfortableWithPets: helper.workPreferences?.comfortableWithPets ? 1 : 0,
    comfortableWithCameras: helper.workPreferences?.comfortableWithCameras ? 1 : 0,
    
    // Care Type Willingness (from helper preferences)
    willingCareInfant: getWillingnessScore(helper.carePreferences?.careOfInfant),
    willingCareChildren: getWillingnessScore(helper.carePreferences?.careOfChildren),
    willingCareDisabled: getWillingnessScore(helper.carePreferences?.careOfDisabled),
    willingCareElderly: getWillingnessScore(helper.carePreferences?.careOfOldAge),
    
    // Availability
    canStartImmediately: helper.availability?.immediate ? 1 : 0,
    noticePeriod: Math.min((helper.availability?.noticePeriod || 0) / 30, 1), // Normalize days to 0-1
    
    // Work Intensity Tolerance
    overtimeWillingness: helper.workPreferences?.overtime ? 1 : 0,
    weekendWork: helper.workPreferences?.weekends ? 1 : 0
  };
}

// Extract personal features
function extractPersonalFeatures(helper) {
  return {
    // Verification Status
    isVerified: helper.isVerified ? 1 : 0,
    hasReferences: helper.hasReferences ? 1 : 0,
    backgroundCheckPassed: helper.backgroundCheckPassed ? 1 : 0,
    
    // Profile Quality
    profileCompleteness: (helper.profileCompleteness || 0) / 100,
    hasProfilePhoto: helper.hasPhoto ? 1 : 0,
    hasPortfolioPhotos: (helper.portfolioPhotos?.length || 0) > 0 ? 1 : 0,
    
    // Personal Qualities (from self-assessment or reviews)
    personalityTraits: extractPersonalityFeatures(helper),
    
    // Health & Medical
    hasHealthClearance: helper.hasHealthClearance ? 1 : 0,
    hasAllergies: helper.hasAllergies === 'yes' ? 1 : 0,
    hasPastIllness: helper.hasPastIllness === 'yes' ? 1 : 0,
    hasPhysicalLimitations: helper.hasPhysicalDisabilities === 'yes' ? 1 : 0,
    
    // Cultural Adaptability
    culturalAdaptability: calculateCulturalAdaptability(helper)
  };
}

// Extract reliability features
function extractReliabilityFeatures(helper) {
  return {
    // Platform Engagement
    profileActivenessscore: calculateProfileActivenessScore(helper),
    responseRate: helper.responseRate || 0.5, // Default to neutral
    averageResponseTime: Math.max(1 - (helper.averageResponseTime || 24) / 48, 0), // Normalize hours
    
    // Experience Continuity
    jobStabilityScore: calculateJobStabilityScore(helper),
    hasLongTermExperience: helper.experienceForML?.experienceTimeline.some(t => t.years >= 2) ? 1 : 0,
    averageJobDuration: calculateAverageJobDuration(helper),
    
    // Social Proof
    reviewScore: (helper.averageRating || 3) / 5, // Normalize to 0-1
    reviewCount: Math.min((helper.reviewCount || 0) / 20, 1), // Normalize
    hasPositiveReviews: (helper.averageRating || 0) >= 4 ? 1 : 0,
    
    // Registration Recency
    profileFreshness: calculateProfileFreshness(helper.registrationCompletedAt)
  };
}

// Extract specialization scores for major categories
function extractSpecializationScores(helper) {
  const experienceML = helper.experienceForML || getStructuredExperienceForML(helper.experience);
  
  return {
    // Primary Care Specializations
    infantCareSpecialist: calculateSpecializationScore(experienceML, 'careOfInfant'),
    childCareSpecialist: calculateSpecializationScore(experienceML, 'careOfChildren'),
    elderlyCareSpecialist: calculateSpecializationScore(experienceML, 'careOfOldAge'),
    disabilityCareSpecialist: calculateSpecializationScore(experienceML, 'careOfDisabled'),
    
    // Household Specializations  
    cookingSpecialist: calculateSpecializationScore(experienceML, 'cooking'),
    housekeepingSpecialist: calculateSpecializationScore(experienceML, 'generalHousework'),
    
    // Multi-skill Generalist Score
    generalistScore: calculateGeneralistScore(experienceML),
    
    // Special Needs Expertise
    specialNeedsExpertise: calculateSpecialNeedsExpertise(helper)
  };
}

// Extract composite features (combinations of other features)
function extractCompositeFeatures(helper) {
  const demographics = extractDemographicFeatures(helper);
  const experience = extractExperienceFeatures(helper);
  const languages = extractLanguageFeatures(helper);
  const reliability = extractReliabilityFeatures(helper);
  
  return {
    // Overall Quality Score
    overallQualityScore: calculateOverallQuality(demographics, experience, languages, reliability),
    
    // Specific Job Type Fit Scores
    infantCareJobFit: calculateJobTypeFit('infantCare', helper),
    childCareJobFit: calculateJobTypeFit('childCare', helper),
    elderlyCareJobFit: calculateJobTypeFit('elderlyCare', helper),
    housekeepingJobFit: calculateJobTypeFit('housekeeping', helper),
    cookingJobFit: calculateJobTypeFit('cooking', helper),
    
    // Premium Family Fit (high-end jobs)
    premiumFamilyFit: calculatePremiumFamilyFit(helper),
    
    // Urgency Response Score (for immediate needs)
    urgencyResponseScore: calculateUrgencyResponseScore(helper),
    
    // Cultural Fit Scores
    westernFamilyFit: calculateCulturalFit(helper, 'western'),
    asianFamilyFit: calculateCulturalFit(helper, 'asian'),
    multiCulturalFit: calculateCulturalFit(helper, 'multicultural')
  };
}

// Helper functions for feature calculations

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 25;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function categorizeAge(age) {
  if (age < 25) return 'young';
  if (age < 35) return 'prime';
  if (age < 45) return 'experienced';
  if (age < 55) return 'senior';
  return 'mature';
}

function calculateAgeScore(age) {
  // Peak performance typically between 25-40
  if (age >= 25 && age <= 40) return 1.0;
  if (age >= 21 && age <= 50) return 0.8;
  if (age >= 18 && age <= 60) return 0.6;
  return 0.4;
}

function getNationalityRegion(nationality) {
  const regions = {
    'Philippines': 'Southeast Asia',
    'Indonesia': 'Southeast Asia', 
    'Myanmar': 'Southeast Asia',
    'Thailand': 'Southeast Asia',
    'Vietnam': 'Southeast Asia',
    'India': 'South Asia',
    'Bangladesh': 'South Asia',
    'Sri Lanka': 'South Asia',
    'Nepal': 'South Asia'
  };
  return regions[nationality] || 'Other';
}

function isAseanCountry(nationality) {
  const aseanCountries = ['Philippines', 'Indonesia', 'Myanmar', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Cambodia', 'Laos', 'Brunei'];
  return aseanCountries.includes(nationality) ? 1 : 0;
}

function getEducationScore(educationLevel) {
  const scores = {
    'Master\'s Degree': 1.0,
    'Bachelor\'s Degree': 0.9,
    'Diploma': 0.7,
    'High School': 0.5,
    'Secondary School': 0.4,
    'Primary School': 0.2
  };
  return scores[educationLevel] || 0.3;
}

function calculateFamilyResponsibilities(helper) {
  const children = helper.numberOfChildren || 0;
  const maritalStatus = helper.maritalStatus || '';
  
  let score = 0;
  if (children > 0) score += Math.min(children / 3, 0.5); // Max 0.5 for children
  if (maritalStatus === 'Married') score += 0.2;
  if (maritalStatus === 'Single') score -= 0.1; // More flexibility
  
  return Math.min(Math.max(score, 0), 1);
}

function getLanguageProficiency(languages, targetLanguage) {
  const lang = languages.find(l => l.language === targetLanguage);
  if (!lang) return 0;
  
  const scores = {
    'native': 1.0,
    'advanced': 0.8,
    'intermediate': 0.6,
    'basic': 0.3
  };
  
  return scores[lang.proficiency] || 0;
}

function hasLanguageCategory(languages, categoryLanguages) {
  return languages.some(l => categoryLanguages.includes(l.language)) ? 1 : 0;
}

function calculateCommunicationScore(languages) {
  let score = 0;
  languages.forEach(lang => {
    const profScore = getLanguageProficiency([lang], lang.language);
    if (lang.language === 'English') score += profScore * 0.4; // English weighted higher
    else score += profScore * 0.1;
  });
  return Math.min(score, 1);
}

function getWillingnessScore(preference) {
  if (preference === 'yes') return 1;
  if (preference === 'maybe') return 0.5;
  return 0;
}

function calculateSpecializationScore(experienceML, category) {
  const skillData = experienceML.skillsExperience[category];
  if (!skillData?.hasExperience) return 0;
  
  const competency = experienceML.skillsCompetency[category] || 0;
  const years = skillData.yearsOfExperience || 0;
  const level = skillData.experienceLevel || 'beginner';
  
  let score = competency;
  if (years >= 3) score += 0.2;
  if (years >= 5) score += 0.1;
  if (level === 'expert') score += 0.2;
  else if (level === 'advanced') score += 0.1;
  
  return Math.min(score, 1);
}

function calculateOverallQuality(demographics, experience, languages, reliability) {
  return (
    demographics.ageScore * 0.15 +
    demographics.educationScore * 0.1 +
    experience.averageCompetency * 0.25 +
    experience.totalYears * 0.15 +
    languages.communicationScore * 0.15 +
    reliability.reviewScore * 0.1 +
    reliability.profileActivenessscore * 0.1
  );
}

function calculateJobTypeFit(jobType, helper) {
  const experience = extractExperienceFeatures(helper);
  const languages = extractLanguageFeatures(helper);
  const personal = extractPersonalFeatures(helper);
  
  const fits = {
    infantCare: experience.careOfInfantCompetency * 0.6 + 
                languages.englishProficiency * 0.2 + 
                personal.profileCompleteness * 0.2,
    childCare: experience.careOfChildrenCompetency * 0.5 + 
               languages.englishProficiency * 0.3 +
               personal.profileCompleteness * 0.2,
    elderlyCare: experience.careOfOldAgeCompetency * 0.6 +
                 languages.communicationScore * 0.2 +
                 personal.culturalAdaptability * 0.2,
    housekeeping: experience.generalHouseworkCompetency * 0.7 +
                  experience.totalYears * 0.3,
    cooking: experience.cookingCompetency * 0.8 +
             experience.totalYears * 0.2
  };
  
  return fits[jobType] || 0;
}

// Default features structure
function getDefaultFeatures() {
  return {
    demographics: {},
    experience: {},
    languages: {},
    workPreferences: {},
    personal: {},
    reliability: {},
    specializations: {},
    composite: {},
    meta: {
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      completeness: 0
    }
  };
}

// Calculate feature completeness percentage
function calculateFeatureCompleteness(helper) {
  const requiredFields = [
    'fullName', 'dateOfBirth', 'nationality', 'experience',
    'hasBeenHelperBefore', 'educationLevel', 'maritalStatus'
  ];
  
  const completedFields = requiredFields.filter(field => {
    const value = helper[field];
    return value !== null && value !== undefined && value !== '';
  });
  
  return (completedFields.length / requiredFields.length) * 100;
}

// Additional helper functions implementation

function isCommonReligion(religion) {
  const commonReligions = ['Christianity', 'Islam', 'Buddhism', 'Hinduism', 'Catholic'];
  return commonReligions.includes(religion) ? 1 : 0;
}

function categorizeExperienceLevel(years) {
  if (years === 0) return 'none';
  if (years <= 1) return 'beginner';
  if (years <= 3) return 'intermediate';
  if (years <= 7) return 'experienced';
  return 'expert';
}

function calculateAverageCompetency(skillsCompetency) {
  const scores = Object.values(skillsCompetency).filter(score => score > 0);
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function hasSpecializationSkill(skillsCompetency) {
  return Object.values(skillsCompetency).some(score => score >= 0.8) ? 1 : 0;
}

function extractTaskCompetencies(experience) {
  const taskCompetencies = {};
  if (!experience) return taskCompetencies;
  
  Object.keys(experience).forEach(category => {
    if (experience[category]?.specificTasks) {
      experience[category].specificTasks.forEach(task => {
        taskCompetencies[task] = 1; // Binary for now, could be enhanced
      });
    }
  });
  
  return taskCompetencies;
}

function extractPersonalityFeatures(helper) {
  // This would typically come from personality assessments or reviews
  // For now, return default structure
  return {
    patience: 0.5,
    reliability: 0.5,
    friendliness: 0.5,
    adaptability: 0.5,
    initiative: 0.5
  };
}

function calculateCulturalAdaptability(helper) {
  let score = 0.5; // Base score
  
  // Language diversity indicates cultural adaptability
  const languages = helper.experience?.languagesSpoken || [];
  score += Math.min(languages.length * 0.1, 0.3);
  
  // International experience
  if (helper.hasInternationalExperience) score += 0.2;
  
  // Education level
  score += helper.educationLevel === 'Bachelor\'s Degree' ? 0.1 : 0;
  score += helper.educationLevel === 'Master\'s Degree' ? 0.2 : 0;
  
  return Math.min(score, 1);
}

function calculateProfileActivenessScore(helper) {
  let score = 0.5; // Base score
  
  // Recent login
  const lastActive = new Date(helper.lastActive || helper.lastLoginAt || 0);
  const daysSinceActive = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
  
  if (daysSinceActive <= 1) score += 0.3;
  else if (daysSinceActive <= 7) score += 0.2;
  else if (daysSinceActive <= 30) score += 0.1;
  
  // Profile completeness
  score += (helper.profileCompleteness || 0) / 500; // 0.2 max
  
  return Math.min(score, 1);
}

function calculateJobStabilityScore(helper) {
  const timeline = helper.experienceForML?.experienceTimeline || [];
  if (timeline.length === 0) return 0.5;
  
  let stabilityScore = 0;
  let longTermJobs = 0;
  
  timeline.forEach(job => {
    if (job.years >= 2) {
      longTermJobs++;
      stabilityScore += Math.min(job.years / 5, 1); // Normalize to max 5 years
    }
  });
  
  return longTermJobs > 0 ? stabilityScore / timeline.length : 0.3;
}

function calculateAverageJobDuration(helper) {
  const timeline = helper.experienceForML?.experienceTimeline || [];
  if (timeline.length === 0) return 0;
  
  const totalYears = timeline.reduce((sum, job) => sum + job.years, 0);
  return Math.min(totalYears / timeline.length / 5, 1); // Normalize
}

function calculateProfileFreshness(registrationDate) {
  if (!registrationDate) return 0.5;
  
  const regDate = new Date(registrationDate);
  const daysSinceReg = (new Date() - regDate) / (1000 * 60 * 60 * 24);
  
  // Fresh profiles get higher scores, but not too recent (might be fake)
  if (daysSinceReg >= 7 && daysSinceReg <= 90) return 1.0;
  if (daysSinceReg <= 365) return 0.8;
  if (daysSinceReg <= 730) return 0.6;
  return 0.4;
}

function calculateGeneralistScore(experienceML) {
  const activeSkills = experienceML.activeSkills || [];
  const competencies = Object.values(experienceML.skillsCompetency || {});
  
  if (activeSkills.length < 3) return 0;
  
  // High generalist score if many skills with balanced competencies
  const avgCompetency = competencies.reduce((sum, comp) => sum + comp, 0) / competencies.length;
  const skillBalance = 1 - (Math.max(...competencies) - Math.min(...competencies));
  
  return (activeSkills.length / 6) * 0.6 + avgCompetency * 0.2 + skillBalance * 0.2;
}

function calculateSpecialNeedsExpertise(helper) {
  let score = 0;
  
  // Disability care experience
  if (helper.experienceForML?.skillsExperience.careOfDisabled?.hasExperience) {
    score += 0.5;
  }
  
  // Medical training or certifications
  if (helper.hasFirstAidCertification) score += 0.2;
  if (helper.hasNursingBackground) score += 0.3;
  
  // Special needs specific tasks
  const disabilityTasks = helper.experience?.careOfDisabled?.specificTasks || [];
  if (disabilityTasks.includes('therapy_assistance')) score += 0.1;
  if (disabilityTasks.includes('medication_management')) score += 0.1;
  
  return Math.min(score, 1);
}

function calculatePremiumFamilyFit(helper) {
  const demographics = extractDemographicFeatures(helper);
  const experience = extractExperienceFeatures(helper);
  const languages = extractLanguageFeatures(helper);
  const personal = extractPersonalFeatures(helper);
  
  return (
    demographics.educationScore * 0.25 +
    experience.averageCompetency * 0.25 +
    languages.englishProficiency * 0.2 +
    personal.isVerified * 0.15 +
    personal.profileCompleteness * 0.15
  );
}

function calculateUrgencyResponseScore(helper) {
  const workPrefs = extractWorkPreferenceFeatures(helper);
  const reliability = extractReliabilityFeatures(helper);
  
  return (
    workPrefs.canStartImmediately * 0.3 +
    (1 - workPrefs.noticePeriod) * 0.2 + // Lower notice period = higher urgency score
    reliability.averageResponseTime * 0.3 +
    reliability.profileActivenessscore * 0.2
  );
}

function calculateCulturalFit(helper, culturalContext) {
  const demographics = extractDemographicFeatures(helper);
  const languages = extractLanguageFeatures(helper);
  const personal = extractPersonalFeatures(helper);
  
  const fits = {
    western: 
      languages.englishProficiency * 0.4 +
      demographics.educationScore * 0.3 +
      personal.culturalAdaptability * 0.3,
    
    asian:
      languages.hasChineseLanguage * 0.3 +
      demographics.isAseanNationality * 0.3 +
      personal.culturalAdaptability * 0.4,
    
    multicultural:
      languages.languageCount * 0.4 +
      personal.culturalAdaptability * 0.6
  };
  
  return fits[culturalContext] || 0.5;
}

// Export for use in other modules
export {
  extractDemographicFeatures,
  extractExperienceFeatures,
  extractLanguageFeatures,
  extractWorkPreferenceFeatures,
  extractPersonalFeatures,
  extractReliabilityFeatures,
  extractSpecializationScores,
  extractCompositeFeatures
};