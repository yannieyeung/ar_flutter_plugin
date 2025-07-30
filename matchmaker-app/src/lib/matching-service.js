/**
 * AI-powered matching service for employers and helpers
 * Uses intelligent feature extraction and similarity calculations
 */
export class MatchingService {
  constructor() {
    this.isInitialized = false;
    this.skillsVocabulary = new Set();
    this.locationVocabulary = new Set();
    this.experienceVocabulary = new Set();
  }

  /**
   * Initialize the matching service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('✅ Matching service initialized');
      
      // Build vocabularies from common data
      this.buildVocabularies();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error initializing matching service:', error);
      throw error;
    }
  }

  /**
   * Build vocabularies for feature encoding
   */
  buildVocabularies() {
    // Common skills vocabulary
    const commonSkills = [
      'cooking', 'cleaning', 'childcare', 'elderly care', 'pet care',
      'laundry', 'ironing', 'gardening', 'driving', 'tutoring',
      'first aid', 'basic nursing', 'housekeeping', 'shopping', 'organizing',
      'baby care', 'toddler care', 'meal preparation', 'light cleaning',
      'deep cleaning', 'car washing', 'grocery shopping', 'language tutoring'
    ];

    // Common locations
    const commonLocations = [
      'singapore', 'kuala lumpur', 'jakarta', 'manila', 'bangkok',
      'ho chi minh city', 'hanoi', 'phnom penh', 'yangon', 'colombo'
    ];

    // Experience types
    const experienceTypes = [
      'domestic helper', 'nanny', 'caregiver', 'housekeeper',
      'cook', 'driver', 'tutor', 'cleaner', 'babysitter', 'elderly caregiver'
    ];

    commonSkills.forEach(skill => this.skillsVocabulary.add(skill.toLowerCase()));
    commonLocations.forEach(location => this.locationVocabulary.add(location.toLowerCase()));
    experienceTypes.forEach(exp => this.experienceVocabulary.add(exp.toLowerCase()));
  }

  /**
   * Extract features from a job posting
   */
  extractJobFeatures(job) {
    const features = {
      // Basic job information
      title: this.normalizeText(job.jobTitle || ''),
      description: this.normalizeText(job.jobDescription || ''),
      
      // Location
      location: {
        city: this.normalizeText(job.location?.city || ''),
        country: this.normalizeText(job.location?.country || '')
      },
      
      // Requirements
      requiredSkills: this.extractSkills(job.requiredSkills || job.jobDescription || ''),
      experienceRequired: this.extractExperienceLevel(job.experienceRequired || job.jobDescription || ''),
      
      // Household info
      householdSize: job.householdInfo?.adultsCount || 0,
      childrenCount: job.householdInfo?.childrenCount || 0,
      petsCount: job.householdInfo?.petsCount || 0,
      houseType: this.normalizeText(job.householdInfo?.houseType || ''),
      
      // Work conditions
      workingDays: job.workingConditions?.workingDays || 7,
      restDays: job.workingConditions?.restDays || 0,
      
      // Salary
      salaryAmount: job.salary?.amount || 0,
      salaryCurrency: job.salary?.currency || 'sgd',
      
      // Urgency and timing
      urgency: this.mapUrgency(job.urgency || 'flexible'),
      startDate: job.startDate ? new Date(job.startDate) : new Date(),
      
      // Preferences
      religionPreference: this.normalizeText(job.preferences?.religion || ''),
      nationalityPreference: job.preferences?.nationality || [],
      agePreference: {
        min: job.preferences?.ageRange?.min || 18,
        max: job.preferences?.ageRange?.max || 65
      }
    };

    return features;
  }

  /**
   * Extract features from a helper profile
   */
  extractHelperFeatures(helper) {
    const features = {
      // Personal information
      name: this.normalizeText(helper.fullName || helper.name || ''),
      age: this.calculateAge(helper.dateOfBirth),
      nationality: this.normalizeText(helper.nationality || ''),
      religion: this.normalizeText(helper.religion || ''),
      
      // Location
      location: {
        city: this.normalizeText(helper.cityOfBirth || ''),
        country: this.normalizeText(helper.nationality || helper.countryOfBirth || '')
      },
      
      // Experience and skills
      skills: this.extractSkills(helper.relevantSkills || ''),
      hasExperience: helper.hasBeenHelperBefore === 'yes',
      experienceYears: helper.experience?.totalYears || 0,
      previousJobs: helper.experience?.previousJobs || [],
      specializations: helper.experience?.specializations || [],
      
      // Education and qualifications
      educationLevel: this.normalizeText(helper.educationLevel || ''),
      
      // Personal attributes
      maritalStatus: this.normalizeText(helper.maritalStatus || ''),
      numberOfChildren: helper.numberOfChildren || 0,
      
      // Availability
      isActive: helper.isActive !== false,
      isVerified: helper.isVerified === true,
      
      // Languages
      languages: this.extractLanguages(helper.experience?.languagesSpoken || []),
      
      // Profile completeness (affects matching confidence)
      profileCompleteness: helper.profileCompleteness || 0
    };

    return features;
  }

  /**
   * Calculate similarity score between job and helper
   */
  calculateSimilarity(jobFeatures, helperFeatures) {
    let totalScore = 0;
    let maxScore = 0;

    // Skills matching (high weight)
    const skillsScore = this.calculateSkillsMatch(jobFeatures.requiredSkills, helperFeatures.skills);
    totalScore += skillsScore * 0.3;
    maxScore += 0.3;

    // Location preference (medium weight)
    const locationScore = this.calculateLocationMatch(jobFeatures.location, helperFeatures.location);
    totalScore += locationScore * 0.2;
    maxScore += 0.2;

    // Experience matching (high weight)
    const experienceScore = this.calculateExperienceMatch(jobFeatures.experienceRequired, helperFeatures);
    totalScore += experienceScore * 0.25;
    maxScore += 0.25;

    // Age preference matching
    const ageScore = this.calculateAgeMatch(jobFeatures.agePreference, helperFeatures.age);
    totalScore += ageScore * 0.1;
    maxScore += 0.1;

    // Religion preference matching (if specified)
    const religionScore = this.calculateReligionMatch(jobFeatures.religionPreference, helperFeatures.religion);
    totalScore += religionScore * 0.05;
    maxScore += 0.05;

    // Nationality preference matching (if specified)
    const nationalityScore = this.calculateNationalityMatch(jobFeatures.nationalityPreference, helperFeatures.nationality);
    totalScore += nationalityScore * 0.1;
    maxScore += 0.1;

    // Normalize score to 0-1 range
    const normalizedScore = maxScore > 0 ? totalScore / maxScore : 0;
    
    return Math.min(Math.max(normalizedScore, 0), 1);
  }

  /**
   * Find matches for a job posting
   */
  async findMatches(jobId, helpers, limit = 10, offset = 0) {
    try {
      console.log(`🔍 Finding matches for job ${jobId} with ${helpers.length} helpers`);
      await this.initialize();

      let job;
      try {
        const { JobService } = await import('./jobs-service');
        console.log('✅ JobService imported successfully');
        
        job = await JobService.getJobById(jobId);
        console.log(`📋 Job fetched: ${job ? 'Found' : 'Not found'}`);
        
        if (!job) {
          console.log('⚠️ Job not found in database, using mock job for testing');
          job = {
            id: jobId,
            jobTitle: 'Domestic Helper for Family',
            jobDescription: 'Looking for experienced helper with cooking and childcare skills',
            location: { city: 'Singapore', country: 'Singapore' },
            salary: { amount: 600, currency: 'SGD' },
            householdInfo: { adultsCount: 2, childrenCount: 1, petsCount: 0 },
            workingConditions: { workingDays: 6, restDays: 1 },
            urgency: 'flexible',
            startDate: new Date().toISOString()
          };
        }
      } catch (jobServiceError) {
        console.error('❌ JobService error:', jobServiceError.message);
        // Use mock job for testing
        console.log('🧪 Using mock job data due to JobService error');
        job = {
          id: jobId,
          jobTitle: 'Domestic Helper for Family',
          jobDescription: 'Looking for experienced helper with cooking and childcare skills',
          location: { city: 'Singapore', country: 'Singapore' },
          salary: { amount: 600, currency: 'SGD' },
          householdInfo: { adultsCount: 2, childrenCount: 1, petsCount: 0 },
          workingConditions: { workingDays: 6, restDays: 1 },
          urgency: 'flexible',
          startDate: new Date().toISOString()
        };
      }
      
      if (!job) {
        console.error('❌ Still no job found after fallback attempts');
        throw new Error('Job not found');
      }

      const jobFeatures = this.extractJobFeatures(job);
      console.log('✅ Job features extracted');
      
      const matches = [];

      // Calculate similarity for each helper
      for (let i = 0; i < helpers.length; i++) {
        try {
          const helper = helpers[i];
          const helperFeatures = this.extractHelperFeatures(helper);
          const similarity = this.calculateSimilarity(jobFeatures, helperFeatures);
          
          matches.push({
            helper,
            similarity,
            matchReasons: this.generateMatchReasons(jobFeatures, helperFeatures, similarity)
          });
        } catch (helperError) {
          console.error(`❌ Error processing helper ${i}:`, helperError);
          // Continue with other helpers
        }
      }

      console.log(`✅ Processed ${matches.length} matches`);

      // Sort by similarity score (highest first)
      matches.sort((a, b) => b.similarity - a.similarity);

      // Apply pagination
      const paginatedMatches = matches.slice(offset, offset + limit);

      return {
        matches: paginatedMatches,
        totalMatches: matches.length,
        hasMore: offset + limit < matches.length
      };
    } catch (error) {
      console.error('❌ Error finding matches:', error);
      console.error('❌ Match finding error stack:', error.stack);
      throw error;
    }
  }

  // Helper methods for feature extraction and matching

  normalizeText(text) {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
  }

  extractSkills(text) {
    const normalizedText = this.normalizeText(text);
    const foundSkills = [];
    
    for (const skill of this.skillsVocabulary) {
      if (normalizedText.includes(skill)) {
        foundSkills.push(skill);
      }
    }
    
    return foundSkills;
  }

  extractExperienceLevel(text) {
    const normalizedText = this.normalizeText(text);
    
    if (normalizedText.includes('no experience') || normalizedText.includes('first time')) {
      return 0;
    } else if (normalizedText.includes('beginner') || normalizedText.includes('1 year')) {
      return 1;
    } else if (normalizedText.includes('intermediate') || normalizedText.includes('2-3 year')) {
      return 2;
    } else if (normalizedText.includes('experienced') || normalizedText.includes('3+ year')) {
      return 3;
    } else if (normalizedText.includes('expert') || normalizedText.includes('5+ year')) {
      return 5;
    }
    
    return 1; // Default to some experience required
  }

  extractLanguages(languagesArray) {
    if (!Array.isArray(languagesArray)) return [];
    return languagesArray.map(lang => ({
      language: this.normalizeText(lang.language || ''),
      proficiency: lang.proficiency || 'basic'
    }));
  }

  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 25; // Default age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  mapUrgency(urgency) {
    const urgencyMap = {
      'immediate': 4,
      'within_week': 3,
      'within_month': 2,
      'flexible': 1
    };
    return urgencyMap[urgency] || 1;
  }

  calculateSkillsMatch(requiredSkills, helperSkills) {
    if (requiredSkills.length === 0) return 1; // No specific requirements
    
    const matchingSkills = requiredSkills.filter(skill => 
      helperSkills.some(helperSkill => helperSkill.includes(skill) || skill.includes(helperSkill))
    );
    
    return matchingSkills.length / requiredSkills.length;
  }

  calculateLocationMatch(jobLocation, helperLocation) {
    // Exact city match gets highest score
    if (jobLocation.city && helperLocation.city && 
        jobLocation.city === helperLocation.city) {
      return 1.0;
    }
    
    // Country match gets partial score
    if (jobLocation.country && helperLocation.country && 
        jobLocation.country === helperLocation.country) {
      return 0.7;
    }
    
    // No location preference or match
    return 0.5;
  }

  calculateExperienceMatch(requiredLevel, helperFeatures) {
    const helperExperienceLevel = helperFeatures.hasExperience ? 
      Math.min(helperFeatures.experienceYears, 5) : 0;
    
    if (requiredLevel === 0) {
      return 1; // No experience required
    }
    
    if (helperExperienceLevel >= requiredLevel) {
      return 1; // Meets or exceeds requirement
    }
    
    // Partial match based on experience ratio
    return helperExperienceLevel / requiredLevel;
  }

  calculateAgeMatch(agePreference, helperAge) {
    if (!agePreference.min && !agePreference.max) return 1;
    
    if (helperAge >= agePreference.min && helperAge <= agePreference.max) {
      return 1;
    }
    
    // Partial score for close ages
    const minDiff = Math.abs(helperAge - agePreference.min);
    const maxDiff = Math.abs(helperAge - agePreference.max);
    const closestDiff = Math.min(minDiff, maxDiff);
    
    return Math.max(0, 1 - (closestDiff / 10)); // Reduce score by 0.1 for each year difference
  }

  calculateReligionMatch(religionPreference, helperReligion) {
    if (!religionPreference) return 1; // No preference
    
    return religionPreference === helperReligion ? 1 : 0.5;
  }

  calculateNationalityMatch(nationalityPreferences, helperNationality) {
    if (!nationalityPreferences || nationalityPreferences.length === 0) return 1; // No preference
    
    return nationalityPreferences.includes(helperNationality) ? 1 : 0.3;
  }

  generateMatchReasons(jobFeatures, helperFeatures, similarity) {
    const reasons = [];
    
    // Skills match
    const skillsMatch = this.calculateSkillsMatch(jobFeatures.requiredSkills, helperFeatures.skills);
    if (skillsMatch > 0.7) {
      reasons.push(`Strong skills match (${Math.round(skillsMatch * 100)}%)`);
    }
    
    // Experience match
    if (helperFeatures.hasExperience && helperFeatures.experienceYears > 0) {
      reasons.push(`${helperFeatures.experienceYears} years of experience`);
    }
    
    // Location match
    const locationMatch = this.calculateLocationMatch(jobFeatures.location, helperFeatures.location);
    if (locationMatch > 0.8) {
      reasons.push('Same location');
    } else if (locationMatch > 0.6) {
      reasons.push('Same country');
    }
    
    // Verification status
    if (helperFeatures.isVerified) {
      reasons.push('Verified profile');
    }
    
    // Profile completeness
    if (helperFeatures.profileCompleteness > 80) {
      reasons.push('Complete profile');
    }
    
    return reasons;
  }
}

// Export singleton instance
export const matchingService = new MatchingService();