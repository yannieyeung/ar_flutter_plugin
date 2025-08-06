/**
 * Recommendation Pipeline for Enhanced Matching System
 * Integrates with existing database and provides ML personalization
 */

import { enhancedMatchingService, DynamicScorer } from './enhanced-matching-service';
import { JobService } from './jobs-service';
import { QueryService } from './db';
import * as tf from '@tensorflow/tfjs';

// Get helpers from database (using existing QueryService)
async function getAllHelpers() {
  try {
    return await QueryService.getUsersByType('individual_helper', 1000); // Get up to 1000 helpers
  } catch (error) {
    console.error('Error fetching helpers:', error);
    return [];
  }
}

// Get job from database
async function getJobFromFirestore(jobId) {
  try {
    return await JobService.getJobById(jobId);
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

// Main recommendation pipeline function
export async function getTopHelpers(jobId, limit = 10, employerId = null) {
  try {
    console.log(`🎯 Getting top ${limit} helpers for job ${jobId}`);
    
    // 1. Get job requirements
    const job = await getJobFromFirestore(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    console.log('📋 Job fetched successfully');

    // 2. Get all helpers from DB
    const helpers = await getAllHelpers();
    console.log(`👥 Found ${helpers.length} helpers in database`);

    if (helpers.length === 0) {
      return {
        matches: [],
        totalMatches: 0,
        hasMore: false,
        jobInfo: {
          id: job.id,
          title: job.jobTitle,
          location: job.location
        }
      };
    }

    // 3. Initialize enhanced matching service
    await enhancedMatchingService.initialize();

    // 4. Score and sort helpers
    const scorer = new DynamicScorer(job);
    const scoredHelpers = [];

    for (let i = 0; i < helpers.length; i++) {
      try {
        const helper = helpers[i];
        
        // Normalize helper data structure to match expected format
        const normalizedHelper = normalizeHelperData(helper);
        
        const scoringResult = scorer.scoreHelper(normalizedHelper);
        
        scoredHelpers.push({
          helper: normalizedHelper,
          score: Math.round(scoringResult.finalScore * 100), // Convert to percentage
          baseScore: Math.round(scoringResult.baseScore * 100),
          compensationScore: Math.round(scoringResult.compensationScore * 100),
          scoreBreakdown: scoringResult.scoreBreakdown,
          appliedRules: scoringResult.appliedRules,
          matchDetails: scoringResult.matchDetails,
          matchReasons: generateMatchReasons(scoringResult)
        });
      } catch (helperError) {
        console.error(`Error scoring helper ${i}:`, helperError);
        // Continue with other helpers
      }
    }

    console.log(`✅ Scored ${scoredHelpers.length} helpers`);

    // 5. Sort by score (highest first)
    scoredHelpers.sort((a, b) => b.score - a.score);

    // 6. Apply ML personalization if available
    let finalHelpers = scoredHelpers;
    if (job.metadata?.mlOptimized && employerId) {
      try {
        finalHelpers = await applyPersonalization(employerId, scoredHelpers);
        console.log('🤖 Applied ML personalization');
      } catch (mlError) {
        console.error('Error applying personalization:', mlError);
        // Fall back to rule-based scoring
      }
    }

    // 7. Apply pagination
    const paginatedHelpers = finalHelpers.slice(0, limit);

    return {
      matches: paginatedHelpers,
      totalMatches: finalHelpers.length,
      hasMore: finalHelpers.length > limit,
      jobInfo: {
        id: job.id,
        title: job.jobTitle,
        location: job.location,
        employerId: job.employerId
      },
      scoringInfo: {
        totalHelpers: helpers.length,
        scoredHelpers: scoredHelpers.length,
        mlPersonalized: job.metadata?.mlOptimized && employerId
      }
    };

  } catch (error) {
    console.error('❌ Error in recommendation pipeline:', error);
    throw error;
  }
}

// Normalize helper data to match expected format
function normalizeHelperData(helper) {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 25; // Default age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Extract languages from helper data
  const extractLanguages = (languageData) => {
    if (!languageData) return [];
    if (Array.isArray(languageData)) {
      return languageData.map(lang => ({
        language: typeof lang === 'string' ? lang : lang.language || '',
        proficiency: typeof lang === 'object' ? lang.proficiency || 'basic' : 'basic'
      }));
    }
    return [];
  };

  // Extract experience data
  const extractExperience = (helper) => {
    const experience = helper.experience || {};
    return {
      childCare: experience.childCare || 
                 experience.child_care || 
                 helper.hasChildCareExperience ||
                 (helper.relevantSkills && helper.relevantSkills.toLowerCase().includes('childcare')),
      cooking: experience.cooking || 
               helper.hasCookingExperience ||
               (helper.relevantSkills && helper.relevantSkills.toLowerCase().includes('cooking')),
      cleaning: experience.cleaning || 
                helper.hasCleaningExperience ||
                (helper.relevantSkills && helper.relevantSkills.toLowerCase().includes('cleaning')),
      elderlyCare: experience.elderlyCare || 
                   experience.elderly_care ||
                   helper.hasElderlyCareExperience ||
                   (helper.relevantSkills && helper.relevantSkills.toLowerCase().includes('elderly')),
      petCare: experience.petCare || 
               experience.pet_care ||
               helper.hasPetCareExperience ||
               (helper.relevantSkills && helper.relevantSkills.toLowerCase().includes('pet'))
    };
  };

  return {
    id: helper.uid || helper.id,
    fullName: helper.fullName || helper.name || `${helper.firstName || ''} ${helper.lastName || ''}`.trim(),
    age: calculateAge(helper.dateOfBirth),
    nationality: helper.nationality || helper.countryOfBirth || '',
    religion: helper.religion || '',
    languages: extractLanguages(helper.languagesSpoken || helper.languages),
    experience: extractExperience(helper),
    experienceYears: helper.experienceYears || 
                     (helper.experience?.totalYears) || 
                     (helper.hasBeenHelperBefore === 'yes' ? 2 : 0), // Default assumption
    cookingSkills: helper.cookingSkills || 
                   (helper.relevantSkills ? helper.relevantSkills.split(',').map(s => s.trim()) : []),
    isVerified: helper.isVerified || false,
    isActive: helper.isActive !== false, // Default to true unless explicitly false
    hasPhoto: !!helper.photoURL || !!helper.profilePicture,
    lastActive: helper.lastActive || helper.lastLoginAt || new Date(),
    profileCompleteness: helper.profileCompleteness || calculateProfileCompleteness(helper),
    
    // Additional helper info for display
    location: helper.location || { city: helper.cityOfBirth, country: helper.countryOfBirth },
    educationLevel: helper.educationLevel || '',
    maritalStatus: helper.maritalStatus || '',
    numberOfChildren: helper.numberOfChildren || 0,
    relevantSkills: helper.relevantSkills || ''
  };
}

// Calculate profile completeness if not provided
function calculateProfileCompleteness(helper) {
  const fields = [
    'fullName', 'dateOfBirth', 'nationality', 'relevantSkills',
    'hasBeenHelperBefore', 'educationLevel', 'maritalStatus'
  ];
  
  const completedFields = fields.filter(field => {
    const value = helper[field];
    return value !== null && value !== undefined && value !== '';
  });

  return Math.round((completedFields.length / fields.length) * 100);
}

// Generate match reasons from scoring result
function generateMatchReasons(scoringResult) {
  const reasons = [];
  
  // Add strengths as reasons
  if (scoringResult.matchDetails?.strengths) {
    reasons.push(...scoringResult.matchDetails.strengths);
  }
  
  // Add compensation reasons
  if (scoringResult.appliedRules && scoringResult.appliedRules.length > 0) {
    reasons.push(...scoringResult.appliedRules.map(rule => rule.reason));
  }
  
  // Add score-based reasons
  if (scoringResult.finalScore > 0.8) {
    reasons.push('Excellent overall match');
  } else if (scoringResult.finalScore > 0.6) {
    reasons.push('Good match with some considerations');
  }
  
  return reasons.slice(0, 3); // Limit to top 3 reasons
}

// ML Personalization using the ML system
async function applyPersonalization(employerId, scoredHelpers) {
  try {
    const { applyPersonalization: mlApplyPersonalization } = await import('./ml-personalization');
    return await mlApplyPersonalization(employerId, scoredHelpers);
  } catch (error) {
    console.error('Error in personalization:', error);
    return scoredHelpers.map(item => ({ ...item, isPersonalized: false }));
  }
}

// User Decision Tracking for ML Training
export class UserDecisionTracker {
  constructor() {
    this.decisions = [];
  }

  // Track user interactions
  async trackDecision(userId, helperId, jobId, action, helperFeatures, jobFeatures) {
    const decision = {
      userId,
      helperId,
      jobId,
      action, // 'viewed', 'clicked', 'contacted', 'hired', 'rejected'
      timestamp: new Date().toISOString(),
      helperFeatures: this.extractMLFeatures(helperFeatures),
      jobFeatures: this.extractJobMLFeatures(jobFeatures)
    };

    try {
      // Save to Firestore
      const { adminDb } = await import('./firebase-admin');
      await adminDb.collection('user_decisions').add(decision);
      
      console.log(`📊 Tracked decision: ${action} for helper ${helperId}`);
      return decision;
    } catch (error) {
      console.error('Error tracking decision:', error);
      throw error;
    }
  }

  // Extract features for ML training
  extractMLFeatures(helper) {
    return {
      age: helper.age || 25,
      nationality: this.encodeNationality(helper.nationality),
      hasChildCare: helper.experience?.childCare ? 1 : 0,
      hasCooking: helper.experience?.cooking ? 1 : 0,
      hasCleaning: helper.experience?.cleaning ? 1 : 0,
      hasElderlyCare: helper.experience?.elderlyCare ? 1 : 0,
      experienceYears: helper.experienceYears || 0,
      isVerified: helper.isVerified ? 1 : 0,
      hasEnglish: helper.languages?.some(l => 
        l.language.toLowerCase().includes('english')) ? 1 : 0,
      profileCompleteness: helper.profileCompleteness || 0
    };
  }

  extractJobMLFeatures(job) {
    return {
      requiresChildCare: job.requirements?.childCare?.required ? 1 : 0,
      requiresCooking: job.requirements?.cooking?.required ? 1 : 0,
      requiresCleaning: job.requirements?.cleaning?.required ? 1 : 0,
      requiresElderlyCare: job.requirements?.elderlyCare?.required ? 1 : 0,
      salaryAmount: job.workConditions?.salaryRange?.min || 0,
      workingDays: job.workConditions?.workingDays || 6
    };
  }

  // Simple nationality encoding for ML
  encodeNationality(nationality) {
    const nationalityMap = {
      'philippines': 1, 'filipino': 1,
      'indonesia': 2, 'indonesian': 2,
      'myanmar': 3, 'burmese': 3,
      'sri lanka': 4, 'sri lankan': 4,
      'india': 5, 'indian': 5
    };
    
    return nationalityMap[nationality?.toLowerCase()] || 0;
  }

  // Get user decisions for training
  async getUserDecisions(userId, limit = 100) {
    try {
      const { adminDb } = await import('./firebase-admin');
      const snapshot = await adminDb.collection('user_decisions')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user decisions:', error);
      return [];
    }
  }
}

export const userDecisionTracker = new UserDecisionTracker();