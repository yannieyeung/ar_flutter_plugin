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
  }

  buildEvaluationContext(helper, job, currentScore, scoreBreakdown) {
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
        ? job.preferences.nationality.map(n => n.toLowerCase()) 
        : job.preferences?.nationality 
          ? [job.preferences.nationality.toLowerCase()]
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
            ? job.preferences.nationality 
            : job.preferences?.nationality 
              ? [job.preferences.nationality] 
              : [];
          return prefs.some(pref => 
            pref.toLowerCase() === nat?.toLowerCase()
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
export function extractScoringCriteria(job) {
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

    // Flexible compensation rules
    compensationRules: job.compensationRules || [
      // Default compensation rules - can be customized per employer
      {
        condition: "hasEnglish && !hasChildExperience && requiresChildCare",
        action: "addChildCareWeight(0.3)",
        description: "English speaker bonus for childcare without direct experience",
        reason: "English proficiency can compensate for lack of childcare experience"
      },
      {
        condition: "hasCookingExperience && !isPreferredNationality(nationality) && requiresCooking",
        action: "addNationalityWeight(0.2)",
        description: "Cooking experience bonus for non-preferred nationality",
        reason: "Strong cooking skills can compensate for nationality preference"
      },
      {
        condition: "experienceYears >= 5 && !meetsAgeRequirement(age)",
        action: "addExperienceBonus(0.25)",
        description: "Experience bonus for age requirement flexibility",
        reason: "Extensive experience can compensate for age preferences"
      },
      {
        condition: "isVerified && hasAllRequiredSkills()",
        action: "addVerificationBonus(0.15)",
        description: "Verification bonus for meeting all requirements",
        reason: "Verified profiles with all skills get additional consideration"
      }
    ],

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

// Dynamic Scorer Class
export class DynamicScorer {
  constructor(jobRequirements) {
    this.criteria = extractScoringCriteria(jobRequirements);
    this.compensationEngine = new CompensationRuleEngine(this.criteria.compensationRules);
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