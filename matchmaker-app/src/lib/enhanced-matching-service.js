/**
 * Enhanced AI-powered matching service with TensorFlow.js integration
 * Implements dynamic scoring with flexible compensation rules
 */

import * as tf from '@tensorflow/tfjs';

// Importance level to weight mapping
const IMPORTANCE_WEIGHTS = {
  "high": 1.0,
  "medium": 0.7,
  "low": 0.4,
  "none": 0.0
};

// Compensation rule evaluation engine
class CompensationRuleEngine {
  constructor(rules = []) {
    this.rules = rules;
  }

  // Parse and evaluate compensation rules
  evaluateRules(helper, job, currentScore, scoreBreakdown) {
    let compensationScore = 0;
    const appliedRules = [];

    for (const rule of this.rules) {
      try {
        const ruleResult = this.evaluateRule(rule, helper, job, currentScore, scoreBreakdown);
        if (ruleResult.applies) {
          compensationScore += ruleResult.adjustment;
          appliedRules.push({
            rule: rule.description || rule.condition,
            adjustment: ruleResult.adjustment,
            reason: ruleResult.reason
          });
        }
      } catch (error) {
        console.error('Error evaluating compensation rule:', error);
      }
    }

    return {
      compensationScore,
      appliedRules,
      finalScore: Math.min(Math.max(currentScore + compensationScore, 0), 1)
    };
  }

  evaluateRule(rule, helper, job, currentScore, scoreBreakdown) {
    try {
      const context = this.buildEvaluationContext(helper, job, currentScore, scoreBreakdown);
    
    // Use Function constructor to safely evaluate the condition
    try {
      const conditionFunc = new Function('context', `
        with (context) {
          return ${rule.condition};
        }
      `);
      
      const applies = conditionFunc(context);
      
      if (applies) {
        const adjustment = this.calculateAdjustment(rule.action, context);
        return {
          applies: true,
          adjustment,
          reason: rule.reason || `Rule applied: ${rule.condition}`
        };
      }
      } catch (error) {
        console.error('Error evaluating rule condition:', rule.condition, error);
      }

      return { applies: false, adjustment: 0 };
    } catch (error) {
      console.error('Error evaluating compensation rule:', error);
      return { applies: false, adjustment: 0 };
    }
  }

  buildEvaluationContext(helper, job, currentScore, scoreBreakdown) {
    // Debug: Log nationality data structure
    if (job.preferences?.nationality !== undefined) {
      console.log('🔍 Debug nationality data:', {
        type: typeof job.preferences.nationality,
        value: job.preferences.nationality,
        isArray: Array.isArray(job.preferences.nationality)
      });
    }
    
    return {
      // Helper attributes
      hasEnglish: helper.languages?.some(l => l.language.toLowerCase().includes('english')) || false,
      hasChildExperience: helper.experience?.childCare || false,
      hasCookingExperience: helper.experience?.cooking || false,
      hasElderlyExperience: helper.experience?.elderlyCare || false,
      nationality: helper.nationality?.toLowerCase(),
      age: helper.age,
      experienceYears: helper.experienceYears || 0,
      isVerified: helper.isVerified,
      
      // Job requirements
      requiresChildCare: job.requirements?.childCare?.required || false,
      requiresCooking: job.requirements?.cooking?.required || false,
      requiresElderlyCare: job.requirements?.elderlyCare?.required || false,
      preferredNationalities: Array.isArray(job.preferences?.nationality) 
        ? job.preferences.nationality.map(n => String(n || '').toLowerCase()).filter(Boolean)
        : job.preferences?.nationality 
          ? [String(job.preferences.nationality || '').toLowerCase()].filter(Boolean)
          : [],
      ageRange: job.preferences?.age || {},
      
      // Current matching scores
      currentScore,
      skillsScore: scoreBreakdown?.skills?.score || 0,
      experienceScore: scoreBreakdown?.experience?.score || 0,
      nationalityScore: scoreBreakdown?.nationality?.score || 0,
      ageScore: scoreBreakdown?.age?.score || 0,
      
              // Helper functions for rules
        isPreferredNationality: function(nat) {
          const prefs = Array.isArray(job.preferences?.nationality) 
            ? job.preferences.nationality.map(n => String(n || '').toLowerCase()).filter(Boolean)
            : job.preferences?.nationality 
              ? [String(job.preferences.nationality || '').toLowerCase()].filter(Boolean)
              : [];
          return prefs.some(pref => 
            pref === String(nat || '').toLowerCase()
          );
        },
      
      meetsAgeRequirement: function(age) {
        const ageRange = job.preferences?.age;
        if (!ageRange) return true;
        return age >= (ageRange.min || 0) && age <= (ageRange.max || 100);
      },
      
      hasAllRequiredSkills: function() {
        return scoreBreakdown?.skills?.score >= 0.8;
      }
    };
  }

  calculateAdjustment(action, context) {
    // Parse action strings like "addChildCareWeight(0.6)" or "addNationalityWeight(0.5)"
    const actionMatch = action.match(/(\w+)\(([\d.]+)\)/);
    if (!actionMatch) return 0;

    const [, actionType, value] = actionMatch;
    const adjustmentValue = parseFloat(value);

    switch (actionType) {
      case 'addChildCareWeight':
        return context.hasChildExperience ? adjustmentValue : 0;
      case 'addNationalityWeight':
        return context.isPreferredNationality(context.nationality) ? adjustmentValue : 0;
      case 'addExperienceBonus':
        return context.experienceYears > 3 ? adjustmentValue : 0;
      case 'addVerificationBonus':
        return context.isVerified ? adjustmentValue : 0;
      case 'addLanguageBonus':
        return context.hasEnglish ? adjustmentValue : 0;
      default:
        return adjustmentValue;
    }
  }
}

// Enhanced data normalization function
export async function extractScoringCriteria(job, employerId = null) {
  const criteria = {
    // Core requirements with weights
    requirements: {
      childCare: {
        required: job.careOfChildren?.required || false,
        weight: IMPORTANCE_WEIGHTS[job.careOfChildren?.importance || 'medium'],
        childrenCount: job.careOfChildren?.numberOfChildren || 0,
        ages: job.careOfChildren?.ageRangeYears || [],
        details: job.careOfChildren
      },
      cooking: {
        required: job.cooking?.required || false,
        weight: IMPORTANCE_WEIGHTS[job.cooking?.importance || 'medium'],
        cuisines: job.cooking?.cuisinePreferences || [],
        details: job.cooking
      },
      cleaning: {
        required: job.cleaning?.required || false,
        weight: IMPORTANCE_WEIGHTS[job.cleaning?.importance || 'medium'],
        type: job.cleaning?.type || 'general',
        details: job.cleaning
      },
      elderlyCare: {
        required: job.careOfElderly?.required || false,
        weight: IMPORTANCE_WEIGHTS[job.careOfElderly?.importance || 'medium'],
        elderlyCount: job.careOfElderly?.numberOfElderly || 0,
        details: job.careOfElderly
      },
      petCare: {
        required: job.petCare?.required || false,
        weight: IMPORTANCE_WEIGHTS[job.petCare?.importance || 'medium'],
        petTypes: job.petCare?.petTypes || [],
        details: job.petCare
      }
    },

    // Preferences with weights
    preferences: {
      age: {
        min: job.ageRange?.min || 18,
        max: job.ageRange?.max || 65,
        weight: 0.8 // Default weight, can be adjusted
      },
      nationality: {
        preferred: job.nationalityPreferences || [],
        weight: IMPORTANCE_WEIGHTS[job.matchingPreferences?.prioritizeNationality || 'medium']
      },
      languages: {
        required: job.languagesRequired || [],
        weight: IMPORTANCE_WEIGHTS[job.matchingPreferences?.prioritizeLanguages || 'medium']
      },
      religion: {
        preferred: job.religionPreference || null,
        weight: IMPORTANCE_WEIGHTS[job.matchingPreferences?.prioritizeReligion || 'low']
      },
      experience: {
        minimumYears: job.minimumExperience || 0,
        weight: IMPORTANCE_WEIGHTS[job.matchingPreferences?.prioritizeExperience || 'high']
      }
    },

    // Dynamic compensation rules based on employer's profile
    compensationRules: employerId 
      ? await generateEmployerSpecificRules(job, employerId)
      : (job.compensationRules || getDefaultCompensationRules(job)),

    // Salary and work conditions
    workConditions: {
      salaryRange: {
        min: job.salary?.min || 0,
        max: job.salary?.max || 10000,
        currency: job.salary?.currency || 'SGD'
      },
      workingDays: job.workingConditions?.workingDays || 6,
      restDays: job.workingConditions?.restDays || 1,
      liveIn: job.workingConditions?.liveIn || false
    }
  };

  return criteria;
}

// Add after the existing extractScoringCriteria function
export async function generateEmployerSpecificRules(job, employerId) {
  try {
    // Get employer's hiring history and preferences
    const employerProfile = await getEmployerProfile(employerId);
    const hiringHistory = await getEmployerHiringHistory(employerId);
    
    // Analyze employer's flexibility patterns
    const flexibilityProfile = analyzeEmployerFlexibility(hiringHistory);
    
    // Generate personalized compensation rules
    const personalizedRules = [];
    
    // Age Flexibility Rules
    if (flexibilityProfile.ageFlexibility > 0.6) {
      personalizedRules.push({
        condition: "age > preferredMaxAge && experienceYears >= 2",
        action: `addAgeWeight(${flexibilityProfile.ageFlexibility})`,
        reason: `Employer accepts older experienced helpers (flexibility: ${Math.round(flexibilityProfile.ageFlexibility * 100)}%)`
      });
    } else if (flexibilityProfile.ageFlexibility < 0.3) {
      personalizedRules.push({
        condition: "age > preferredMaxAge",
        action: "subtractScore(0.3)",
        reason: "Employer strictly prefers younger helpers"
      });
    }
    
    // Nationality Flexibility Rules  
    if (flexibilityProfile.nationalityFlexibility > 0.7) {
      personalizedRules.push({
        condition: "!isPreferredNationality(nationality) && (hasChildExperience || hasCookingExperience)",
        action: `addNationalityWeight(${flexibilityProfile.nationalityFlexibility * 0.6})`,
        reason: `Employer open to other nationalities with skills (flexibility: ${Math.round(flexibilityProfile.nationalityFlexibility * 100)}%)`
      });
    }
    
    // Experience Compensation Rules
    if (flexibilityProfile.skillCompensation > 0.5) {
      personalizedRules.push({
        condition: "!hasChildExperience && hasEnglish && experienceYears >= 3",
        action: `addWeight(${flexibilityProfile.skillCompensation * 0.4})`,
        reason: "Employer accepts English speakers to compensate for specific skill gaps"
      });
    }
    
    // Language Preference Rules
    if (employerProfile.strongLanguagePreference) {
      personalizedRules.push({
        condition: "hasEnglish && (!preferredAge || age <= preferredMaxAge + 3)",
        action: "addLanguageWeight(0.3)",
        reason: "Strong English preference allows minor age flexibility"
      });
    }
    
    // Budget-based flexibility (if employer offers higher compensation)
    if (job.compensation > employerProfile.averageOfferedCompensation * 1.2) {
      personalizedRules.push({
        condition: "(!isPreferredNationality(nationality) || age > preferredMaxAge) && experienceYears >= 2",
        action: "addCompensationWeight(0.5)",
        reason: "Higher budget allows flexibility on nationality/age for experienced helpers"
      });
    }
    
    return personalizedRules;
    
  } catch (error) {
    console.error('Error generating employer-specific rules:', error);
    // Fallback to default rules
    return getDefaultCompensationRules(job);
  }
}

// Analyze employer's historical hiring patterns
export function analyzeEmployerFlexibility(hiringHistory) {
  if (!hiringHistory || hiringHistory.length < 3) {
    // Default moderate flexibility for new employers
    return {
      ageFlexibility: 0.5,
      nationalityFlexibility: 0.5, 
      skillCompensation: 0.5,
      experienceFlexibility: 0.5
    };
  }
  
  const hired = hiringHistory.filter(h => h.action === 'hired');
  const total = hired.length;
  
  if (total === 0) return { ageFlexibility: 0.5, nationalityFlexibility: 0.5, skillCompensation: 0.5, experienceFlexibility: 0.5 };
  
  // Calculate age flexibility
  const ageFlexibleHires = hired.filter(h => 
    h.helper.age > (h.job.preferences?.age?.max || 50)
  ).length;
  const ageFlexibility = ageFlexibleHires / total;
  
  // Calculate nationality flexibility
  const nationalityFlexibleHires = hired.filter(h => {
    const preferredNats = h.job.preferences?.nationality || [];
    return !preferredNats.includes(h.helper.nationality);
  }).length;
  const nationalityFlexibility = nationalityFlexibleHires / total;
  
  // Calculate skill compensation patterns
  const skillCompensationHires = hired.filter(h => {
    // Hired someone lacking specific skills but having others
    const lacksChildCare = h.job.requirements?.childCare?.required && !h.helper.experience?.childCare;
    const hasOtherSkills = h.helper.experience?.cooking || h.helper.languages?.includes('English');
    return lacksChildCare && hasOtherSkills;
  }).length;
  const skillCompensation = skillCompensationHires / total;
  
  // Calculate experience flexibility
  const minExpRequired = hired.map(h => h.job.requirements?.minimumExperience || 0);
  const actualExp = hired.map(h => h.helper.experienceYears || 0);
  const experienceFlexibility = actualExp.filter((exp, i) => exp >= minExpRequired[i]).length / total;
  
  return {
    ageFlexibility: Math.min(ageFlexibility, 1.0),
    nationalityFlexibility: Math.min(nationalityFlexibility, 1.0),
    skillCompensation: Math.min(skillCompensation, 1.0),
    experienceFlexibility: Math.min(experienceFlexibility, 1.0)
  };
}

// Get employer profile with preferences
async function getEmployerProfile(employerId) {
  try {
    const { adminDb } = await import('./firebase-admin');
    const doc = await adminDb.collection('users').doc(employerId).get();
    const userData = doc.data();
    
    // Calculate average compensation offered
    const jobsSnapshot = await adminDb.collection('job_postings')
      .where('employerId', '==', employerId)
      .get();
    
    const compensations = jobsSnapshot.docs
      .map(doc => doc.data().compensation)
      .filter(comp => comp && comp > 0);
    
    const avgCompensation = compensations.length > 0 
      ? compensations.reduce((sum, comp) => sum + comp, 0) / compensations.length
      : 2000; // Default
    
    return {
      preferences: userData?.preferences || {},
      averageOfferedCompensation: avgCompensation,
      strongLanguagePreference: userData?.preferences?.prioritizeLanguages === 'high',
      hiringCount: jobsSnapshot.docs.length
    };
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    return {
      preferences: {},
      averageOfferedCompensation: 2000,
      strongLanguagePreference: false,
      hiringCount: 0
    };
  }
}

// Get employer's hiring history for analysis
async function getEmployerHiringHistory(employerId, limit = 20) {
  try {
    const { adminDb } = await import('./firebase-admin');
    const snapshot = await adminDb.collection('user_decisions')
      .where('userId', '==', employerId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching hiring history:', error);
    return [];
  }
}

// Fallback default rules
function getDefaultCompensationRules(job) {
  return [
    {
      condition: "hasEnglish && experienceYears >= 2",
      action: "addWeight(0.3)",
      reason: "English proficiency with experience"
    },
    {
      condition: "age <= preferredMaxAge + 2 && experienceYears >= 3",
      action: "addAgeWeight(0.2)",
      reason: "Slight age flexibility for experienced helpers"
    }
  ];
}

// Dynamic Scorer Class
export class DynamicScorer {
  constructor(jobRequirements, criteria = null) {
    // If criteria is provided (from async call), use it directly
    this.criteria = criteria || extractScoringCriteria(jobRequirements);
    this.compensationEngine = new CompensationRuleEngine(this.criteria.compensationRules);
  }

  // Async factory method for personalized scoring
  static async createPersonalized(jobRequirements, employerId) {
    const criteria = await extractScoringCriteria(jobRequirements, employerId);
    return new DynamicScorer(jobRequirements, criteria);
  }

  scoreHelper(helper) {
    let score = 0;
    const scoreBreakdown = {
      skills: { score: 0, weight: 0.3, details: '', maxScore: 0.3 },
      experience: { score: 0, weight: 0.25, details: '', maxScore: 0.25 },
      preferences: { score: 0, weight: 0.2, details: '', maxScore: 0.2 },
      workConditions: { score: 0, weight: 0.15, details: '', maxScore: 0.15 },
      profile: { score: 0, weight: 0.1, details: '', maxScore: 0.1 }
    };

    // 1. Core Requirements Scoring (30%)
    const skillsResult = this.evaluateRequirements(helper);
    scoreBreakdown.skills.score = skillsResult.score;
    scoreBreakdown.skills.details = skillsResult.details;
    score += skillsResult.score * scoreBreakdown.skills.weight;

    // 2. Experience Scoring (25%)
    const experienceResult = this.evaluateExperience(helper);
    scoreBreakdown.experience.score = experienceResult.score;
    scoreBreakdown.experience.details = experienceResult.details;
    score += experienceResult.score * scoreBreakdown.experience.weight;

    // 3. Preferences Scoring (20%)
    const preferencesResult = this.evaluatePreferences(helper);
    scoreBreakdown.preferences.score = preferencesResult.score;
    scoreBreakdown.preferences.details = preferencesResult.details;
    score += preferencesResult.score * scoreBreakdown.preferences.weight;

    // 4. Work Conditions Compatibility (15%)
    const workResult = this.evaluateWorkConditions(helper);
    scoreBreakdown.workConditions.score = workResult.score;
    scoreBreakdown.workConditions.details = workResult.details;
    score += workResult.score * scoreBreakdown.workConditions.weight;

    // 5. Profile Quality (10%)
    const profileResult = this.evaluateProfileQuality(helper);
    scoreBreakdown.profile.score = profileResult.score;
    scoreBreakdown.profile.details = profileResult.details;
    score += profileResult.score * scoreBreakdown.profile.weight;

    // 6. Apply Compensation Rules
    const compensationResult = this.compensationEngine.evaluateRules(
      helper, 
      { requirements: this.criteria.requirements, preferences: this.criteria.preferences }, 
      score, 
      scoreBreakdown
    );

    return {
      baseScore: score,
      compensationScore: compensationResult.compensationScore,
      finalScore: compensationResult.finalScore,
      scoreBreakdown,
      appliedRules: compensationResult.appliedRules,
      matchDetails: this.generateMatchDetails(helper, scoreBreakdown, compensationResult.appliedRules)
    };
  }

  evaluateRequirements(helper) {
    const requirements = this.criteria.requirements;
    let totalScore = 0;
    let totalWeight = 0;
    const details = [];

    for (const [category, config] of Object.entries(requirements)) {
      if (config.required && config.weight > 0) {
        const match = this.evaluateRequirement(helper, category, config);
        totalScore += match.score * config.weight;
        totalWeight += config.weight;
        details.push(`${category}: ${match.details}`);
      }
    }

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 1;
    return {
      score: Math.min(Math.max(normalizedScore, 0), 1),
      details: details.join(', ')
    };
  }

  evaluateRequirement(helper, category, config) {
    switch (category) {
      case 'childCare':
        return {
          score: helper.experience?.childCare ? 1 : 0,
          details: `Child care: ${helper.experience?.childCare ? 'Yes' : 'No'}`
        };
      case 'cooking':
        const cookingMatch = this.matchCuisines(helper.cookingSkills || [], config.cuisines);
        return {
          score: cookingMatch,
          details: `Cooking: ${Math.round(cookingMatch * 100)}% match`
        };
      case 'cleaning':
        return {
          score: helper.experience?.cleaning ? 1 : 0,
          details: `Cleaning: ${helper.experience?.cleaning ? 'Yes' : 'No'}`
        };
      case 'elderlyCare':
        return {
          score: helper.experience?.elderlyCare ? 1 : 0,
          details: `Elderly care: ${helper.experience?.elderlyCare ? 'Yes' : 'No'}`
        };
      case 'petCare':
        return {
          score: helper.experience?.petCare ? 1 : 0,
          details: `Pet care: ${helper.experience?.petCare ? 'Yes' : 'No'}`
        };
      default:
        return { score: 0, details: 'Unknown requirement' };
    }
  }

  evaluateExperience(helper) {
    const minYears = this.criteria.preferences.experience.minimumYears;
    const helperYears = helper.experienceYears || 0;
    
    let score = 0;
    if (minYears === 0) {
      score = 1; // No minimum required
    } else if (helperYears >= minYears) {
      score = 1; // Meets requirement
    } else {
      score = helperYears / minYears; // Partial credit
    }

    return {
      score: Math.min(score, 1),
      details: `${helperYears} years (required: ${minYears})`
    };
  }

  evaluatePreferences(helper) {
    const preferences = this.criteria.preferences;
    let totalScore = 0;
    let totalWeight = 0;
    const details = [];

    // Age preference
    const ageScore = this.calculateAgeScore(helper.age, preferences.age);
    totalScore += ageScore * preferences.age.weight;
    totalWeight += preferences.age.weight;
    details.push(`Age: ${ageScore.toFixed(2)}`);

    // Nationality preference
    if (preferences.nationality.weight > 0) {
      const nationalityScore = this.calculateNationalityScore(helper.nationality, preferences.nationality);
      totalScore += nationalityScore * preferences.nationality.weight;
      totalWeight += preferences.nationality.weight;
      details.push(`Nationality: ${nationalityScore.toFixed(2)}`);
    }

    // Language preference
    if (preferences.languages.weight > 0) {
      const languageScore = this.calculateLanguageScore(helper.languages, preferences.languages);
      totalScore += languageScore * preferences.languages.weight;
      totalWeight += preferences.languages.weight;
      details.push(`Languages: ${languageScore.toFixed(2)}`);
    }

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 1;
    return {
      score: Math.min(Math.max(normalizedScore, 0), 1),
      details: details.join(', ')
    };
  }

  evaluateWorkConditions(helper) {
    // This would evaluate salary expectations, working days, live-in preferences, etc.
    // For now, return a default score
    return {
      score: 0.8, // Default compatibility
      details: 'Work conditions compatible'
    };
  }

  evaluateProfileQuality(helper) {
    let qualityScore = 0;
    const factors = [];

    // Profile completeness
    const completeness = helper.profileCompleteness || 0;
    qualityScore += (completeness / 100) * 0.4;
    factors.push(`Completeness: ${completeness}%`);

    // Verification status
    if (helper.isVerified) {
      qualityScore += 0.3;
      factors.push('Verified');
    }

    // Photo availability
    if (helper.hasPhoto) {
      qualityScore += 0.2;
      factors.push('Has photo');
    }

    // Recent activity
    if (helper.lastActive && this.isRecentlyActive(helper.lastActive)) {
      qualityScore += 0.1;
      factors.push('Recently active');
    }

    return {
      score: Math.min(qualityScore, 1),
      details: factors.join(', ')
    };
  }

  // Helper methods
  matchCuisines(helperCuisines, requiredCuisines) {
    if (!requiredCuisines || requiredCuisines.length === 0) return 1;
    if (!helperCuisines || helperCuisines.length === 0) return 0;

    const matches = requiredCuisines.filter(cuisine =>
      helperCuisines.some(helperCuisine =>
        helperCuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
        cuisine.toLowerCase().includes(helperCuisine.toLowerCase())
      )
    );

    return matches.length / requiredCuisines.length;
  }

  calculateAgeScore(age, agePreference) {
    if (!age) return 0.5; // Default if age unknown
    
    const { min, max } = agePreference;
    if (age >= min && age <= max) return 1;

    // Partial credit for close ages
    const minDiff = Math.abs(age - min);
    const maxDiff = Math.abs(age - max);
    const closestDiff = Math.min(minDiff, maxDiff);
    
    return Math.max(0, 1 - (closestDiff / 10));
  }

  calculateNationalityScore(helperNationality, nationalityPreference) {
    if (!nationalityPreference.preferred || nationalityPreference.preferred.length === 0) return 1;
    
    return nationalityPreference.preferred.some(pref =>
      pref.toLowerCase() === helperNationality?.toLowerCase()
    ) ? 1 : 0.3;
  }

  calculateLanguageScore(helperLanguages, languagePreference) {
    if (!languagePreference.required || languagePreference.required.length === 0) return 1;
    if (!helperLanguages || helperLanguages.length === 0) return 0;

    const helperLangNames = helperLanguages.map(l => l.language?.toLowerCase() || '');
    const requiredLangNames = languagePreference.required.map(l => l.toLowerCase());

    const matches = requiredLangNames.filter(required =>
      helperLangNames.some(helper => helper.includes(required) || required.includes(helper))
    );

    return matches.length / requiredLangNames.length;
  }

  isRecentlyActive(lastActive) {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const daysDiff = (now - lastActiveDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Active within 30 days
  }

  generateMatchDetails(helper, scoreBreakdown, appliedRules) {
    const details = {
      strengths: [],
      concerns: [],
      compensations: appliedRules.map(rule => rule.reason)
    };

    // Identify strengths
    Object.entries(scoreBreakdown).forEach(([category, data]) => {
      if (data.score > 0.8) {
        details.strengths.push(`Strong ${category}: ${data.details}`);
      } else if (data.score < 0.5) {
        details.concerns.push(`Weak ${category}: ${data.details}`);
      }
    });

    return details;
  }
}

// Export the enhanced matching service
export class EnhancedMatchingService {
  constructor() {
    this.isInitialized = false;
    this.mlModel = null;
    this.userModels = new Map(); // Store personalized models per user
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🚀 Initializing Enhanced Matching Service...');
    this.isInitialized = true;
  }

  async scoreHelper(job, helper, employerId = null) {
    const scorer = new DynamicScorer(job);
    const result = scorer.scoreHelper(helper);
    
    // Apply personalization if available
    if (employerId && this.userModels.has(employerId)) {
      const personalizedScore = await this.applyPersonalization(employerId, helper, result);
      result.personalizedScore = personalizedScore;
      result.finalScore = result.finalScore * 0.7 + personalizedScore * 0.3;
    }
    
    return result;
  }

  async applyPersonalization(employerId, helper, scoringResult) {
    // This will be implemented when we add the ML personalization
    return scoringResult.finalScore;
  }
}

export const enhancedMatchingService = new EnhancedMatchingService();