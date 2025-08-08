/**
 * Feature Computation Service
 * Automatically computes and stores ML features for helpers
 * Triggered on registration completion and profile updates
 */

import { extractHelperFeatures } from './helper-feature-extraction';
import { getStructuredExperienceForML } from './experience-utils';

class FeatureComputationService {
  constructor() {
    this.isProcessing = new Set(); // Track helpers currently being processed
    this.cache = new Map(); // Cache computed features temporarily
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Main function to compute and store helper features
   * @param {Object} helperData - Complete helper data from registration
   * @param {string} helperId - Helper's unique ID
   * @param {boolean} forceRecompute - Force recomputation even if cached
   * @returns {Object} Computed features
   */
  async computeAndStoreFeatures(helperData, helperId, forceRecompute = false) {
    try {
      // Prevent duplicate processing
      if (this.isProcessing.has(helperId)) {
        console.log(`⏳ Features already being computed for helper ${helperId}`);
        return await this.waitForProcessing(helperId);
      }

      // Check cache first (unless forced recompute)
      if (!forceRecompute) {
        const cached = this.getCachedFeatures(helperId);
        if (cached) {
          console.log(`💾 Using cached features for helper ${helperId}`);
          return cached;
        }
      }

      this.isProcessing.add(helperId);
      console.log(`🧮 Computing ML features for helper ${helperId}...`);

      // Ensure experience data is properly structured
      const enhancedHelperData = await this.prepareHelperData(helperData);

      // Extract all ML features
      const features = extractHelperFeatures(enhancedHelperData);

      // Add computed timestamps and metadata
      features.meta.computedAt = new Date().toISOString();
      features.meta.helperId = helperId;
      features.meta.dataVersion = this.generateDataVersion(enhancedHelperData);

      // Store features in database
      await this.storeFeatures(helperId, features);

      // Cache for immediate use
      this.cacheFeatures(helperId, features);

      // Create feature vector for TensorFlow
      const featureVector = this.createFeatureVector(features);
      await this.storeFeatureVector(helperId, featureVector);

      console.log(`✅ Features computed and stored for helper ${helperId}`);
      console.log(`📊 Feature completeness: ${features.meta.completeness}%`);

      this.isProcessing.delete(helperId);
      return features;

    } catch (error) {
      console.error(`❌ Error computing features for helper ${helperId}:`, error);
      this.isProcessing.delete(helperId);
      throw error;
    }
  }

  /**
   * Batch compute features for multiple helpers
   * @param {Array} helpers - Array of helper data objects
   * @param {Object} options - Batch processing options
   */
  async batchComputeFeatures(helpers, options = {}) {
    const { 
      batchSize = 10, 
      delay = 100, 
      forceRecompute = false,
      onProgress = null 
    } = options;

    console.log(`🔄 Starting batch feature computation for ${helpers.length} helpers`);
    
    const results = [];
    const errors = [];

    for (let i = 0; i < helpers.length; i += batchSize) {
      const batch = helpers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (helper) => {
        try {
          const helperId = helper.uid || helper.id;
          const features = await this.computeAndStoreFeatures(helper, helperId, forceRecompute);
          
          if (onProgress) {
            onProgress({
              completed: results.length + 1,
              total: helpers.length,
              current: helper.fullName || helperId
            });
          }
          
          return { helperId, success: true, features };
        } catch (error) {
          errors.push({ helperId: helper.uid || helper.id, error: error.message });
          return { helperId: helper.uid || helper.id, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to prevent overwhelming the system
      if (i + batchSize < helpers.length && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`✅ Batch computation completed. Success: ${results.filter(r => r.success).length}, Errors: ${errors.length}`);
    
    return {
      results,
      errors,
      summary: {
        total: helpers.length,
        successful: results.filter(r => r.success).length,
        failed: errors.length
      }
    };
  }

  /**
   * Update features when helper profile changes
   * @param {string} helperId - Helper's unique ID
   * @param {Object} updatedFields - Only the fields that changed
   * @param {Object} fullHelperData - Complete helper data
   */
  async updateFeatures(helperId, updatedFields, fullHelperData) {
    try {
      console.log(`🔄 Updating features for helper ${helperId} due to profile changes`);

      // Check if changes affect ML features
      const affectsMLFeatures = this.doesUpdateAffectMLFeatures(updatedFields);
      
      if (!affectsMLFeatures) {
        console.log(`⏭️ Skipping feature update - changes don't affect ML features`);
        return;
      }

      // Force recompute since data changed
      return await this.computeAndStoreFeatures(fullHelperData, helperId, true);

    } catch (error) {
      console.error(`❌ Error updating features for helper ${helperId}:`, error);
      throw error;
    }
  }

  /**
   * Get pre-computed features for matching
   * @param {string} helperId - Helper's unique ID
   * @returns {Object|null} Cached or stored features
   */
  async getComputedFeatures(helperId) {
    try {
      // Try cache first
      const cached = this.getCachedFeatures(helperId);
      if (cached) return cached;

      // Load from database
      const { adminDb } = await import('./firebase-admin');
      const doc = await adminDb.collection('helper_features').doc(helperId).get();
      
      if (doc.exists) {
        const features = doc.data();
        this.cacheFeatures(helperId, features);
        return features;
      }

      return null;
    } catch (error) {
      console.error(`❌ Error getting features for helper ${helperId}:`, error);
      return null;
    }
  }

  /**
   * Get feature vector for TensorFlow operations
   * @param {string} helperId - Helper's unique ID
   * @returns {Array|null} Feature vector array
   */
  async getFeatureVector(helperId) {
    try {
      const { adminDb } = await import('./firebase-admin');
      const doc = await adminDb.collection('helper_feature_vectors').doc(helperId).get();
      
      if (doc.exists) {
        return doc.data().vector;
      }

      // Fallback: compute from features if vector doesn't exist
      const features = await this.getComputedFeatures(helperId);
      if (features) {
        const vector = this.createFeatureVector(features);
        await this.storeFeatureVector(helperId, vector);
        return vector;
      }

      return null;
    } catch (error) {
      console.error(`❌ Error getting feature vector for helper ${helperId}:`, error);
      return null;
    }
  }

  // Private helper methods

  async prepareHelperData(helperData) {
    // Ensure experienceForML is available
    if (!helperData.experienceForML && helperData.experience) {
      helperData.experienceForML = getStructuredExperienceForML(helperData.experience);
    }

    // Add any missing computed fields
    helperData.profileCompleteness = helperData.profileCompleteness || this.calculateProfileCompleteness(helperData);
    helperData.hasPhoto = !!(helperData.photoURL || helperData.profilePicture);

    return helperData;
  }

  async storeFeatures(helperId, features) {
    try {
      const { adminDb } = await import('./firebase-admin');
      
      await adminDb.collection('helper_features').doc(helperId).set({
        ...features,
        helperId,
        storedAt: new Date().toISOString()
      });

      console.log(`💾 Features stored for helper ${helperId}`);
    } catch (error) {
      console.error(`❌ Error storing features for helper ${helperId}:`, error);
      throw error;
    }
  }

  async storeFeatureVector(helperId, vector) {
    try {
      const { adminDb } = await import('./firebase-admin');
      
      await adminDb.collection('helper_feature_vectors').doc(helperId).set({
        helperId,
        vector,
        createdAt: new Date().toISOString(),
        version: '1.0'
      });

      console.log(`🔢 Feature vector stored for helper ${helperId} (${vector.length} dimensions)`);
    } catch (error) {
      console.error(`❌ Error storing feature vector for helper ${helperId}:`, error);
      throw error;
    }
  }

  createFeatureVector(features) {
    // Create a standardized feature vector for TensorFlow
    // This is a flattened array of all numeric features
    const vector = [];

    // Demographics (10 features)
    vector.push(
      features.demographics.age || 0,
      features.demographics.ageScore || 0,
      features.demographics.hasChildren || 0,
      features.demographics.numberOfChildren || 0,
      features.demographics.familyResponsibilities || 0,
      features.demographics.educationScore || 0,
      features.demographics.isAseanNationality || 0,
      features.demographics.isCommonReligion || 0,
      0, // Reserved for future demographic feature
      0  // Reserved for future demographic feature
    );

    // Experience (20 features)
    vector.push(
      features.experience.totalYears || 0,
      features.experience.hasAnyExperience || 0,
      features.experience.careOfInfantYears || 0,
      features.experience.careOfChildrenYears || 0,
      features.experience.careOfDisabledYears || 0,
      features.experience.careOfOldAgeYears || 0,
      features.experience.generalHouseworkYears || 0,
      features.experience.cookingYears || 0,
      features.experience.careOfInfantCompetency || 0,
      features.experience.careOfChildrenCompetency || 0,
      features.experience.careOfDisabledCompetency || 0,
      features.experience.careOfOldAgeCompetency || 0,
      features.experience.generalHouseworkCompetency || 0,
      features.experience.cookingCompetency || 0,
      features.experience.skillDiversity || 0,
      features.experience.averageCompetency || 0,
      features.experience.hasSpecialization || 0,
      features.experience.currentJobsCount || 0,
      features.experience.hasCurrentExperience || 0,
      0 // Reserved for future experience feature
    );

    // Languages (15 features)
    vector.push(
      features.languages.languageCount || 0,
      features.languages.englishProficiency || 0,
      features.languages.mandarinProficiency || 0,
      features.languages.cantoneseProficiency || 0,
      features.languages.malayProficiency || 0,
      features.languages.tamilProficiency || 0,
      features.languages.hindiProficiency || 0,
      features.languages.hasWesternLanguage || 0,
      features.languages.hasChineseLanguage || 0,
      features.languages.hasIndianLanguage || 0,
      features.languages.hasAseanLanguage || 0,
      features.languages.canTeachEnglish || 0,
      features.languages.canTeachChinese || 0,
      features.languages.communicationScore || 0,
      0 // Reserved for future language feature
    );

    // Work Preferences (10 features)
    vector.push(
      features.workPreferences.willingToRelocate || 0,
      features.workPreferences.hasOwnTransport || 0,
      features.workPreferences.flexibleSchedule || 0,
      features.workPreferences.prefersLiveIn || 0,
      features.workPreferences.comfortableWithPets || 0,
      features.workPreferences.canStartImmediately || 0,
      features.workPreferences.noticePeriod || 0,
      features.workPreferences.overtimeWillingness || 0,
      features.workPreferences.weekendWork || 0,
      0 // Reserved for future work preference feature
    );

    // Personal & Reliability (15 features)
    vector.push(
      features.personal.isVerified || 0,
      features.personal.hasReferences || 0,
      features.personal.profileCompleteness || 0,
      features.personal.hasProfilePhoto || 0,
      features.personal.hasHealthClearance || 0,
      features.personal.culturalAdaptability || 0,
      features.reliability.profileActivenessscore || 0,
      features.reliability.responseRate || 0,
      features.reliability.averageResponseTime || 0,
      features.reliability.jobStabilityScore || 0,
      features.reliability.hasLongTermExperience || 0,
      features.reliability.reviewScore || 0,
      features.reliability.reviewCount || 0,
      features.reliability.hasPositiveReviews || 0,
      features.reliability.profileFreshness || 0
    );

    // Specializations (10 features)
    vector.push(
      features.specializations.infantCareSpecialist || 0,
      features.specializations.childCareSpecialist || 0,
      features.specializations.elderlyCareSpecialist || 0,
      features.specializations.disabilityCareSpecialist || 0,
      features.specializations.cookingSpecialist || 0,
      features.specializations.housekeepingSpecialist || 0,
      features.specializations.generalistScore || 0,
      features.specializations.specialNeedsExpertise || 0,
      0, // Reserved
      0  // Reserved
    );

    // Composite Scores (10 features)
    vector.push(
      features.composite.overallQualityScore || 0,
      features.composite.infantCareJobFit || 0,
      features.composite.childCareJobFit || 0,
      features.composite.elderlyCareJobFit || 0,
      features.composite.housekeepingJobFit || 0,
      features.composite.cookingJobFit || 0,
      features.composite.premiumFamilyFit || 0,
      features.composite.urgencyResponseScore || 0,
      features.composite.westernFamilyFit || 0,
      features.composite.asianFamilyFit || 0
    );

    // Total: 90 features (can be expanded up to 100)
    return vector;
  }

  cacheFeatures(helperId, features) {
    this.cache.set(helperId, {
      features,
      timestamp: Date.now()
    });

    // Clean old cache entries
    this.cleanCache();
  }

  getCachedFeatures(helperId) {
    const cached = this.cache.get(helperId);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.features;
    }
    return null;
  }

  cleanCache() {
    const now = Date.now();
    for (const [helperId, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.cacheExpiry) {
        this.cache.delete(helperId);
      }
    }
  }

  doesUpdateAffectMLFeatures(updatedFields) {
    const mlRelevantFields = [
      'experience', 'experienceForML', 'dateOfBirth', 'nationality', 'educationLevel',
      'maritalStatus', 'numberOfChildren', 'languagesSpoken', 'isVerified',
      'profileCompleteness', 'hasReferences', 'workPreferences', 'carePreferences'
    ];

    return Object.keys(updatedFields).some(field => 
      mlRelevantFields.includes(field) || field.includes('experience')
    );
  }

  generateDataVersion(helperData) {
    // Simple hash of critical data for version tracking
    const criticalData = JSON.stringify({
      experience: helperData.experienceForML,
      languages: helperData.experience?.languagesSpoken,
      demographics: {
        age: helperData.dateOfBirth,
        nationality: helperData.nationality,
        education: helperData.educationLevel
      }
    });
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < criticalData.length; i++) {
      const char = criticalData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  calculateProfileCompleteness(helper) {
    const requiredFields = [
      'fullName', 'dateOfBirth', 'nationality', 'experience',
      'hasBeenHelperBefore', 'educationLevel', 'maritalStatus',
      'contactNumber', 'residentialAddress'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = helper[field];
      return value !== null && value !== undefined && value !== '';
    });
    
    return (completedFields.length / requiredFields.length) * 100;
  }

  async waitForProcessing(helperId) {
    // Wait for ongoing processing to complete
    while (this.isProcessing.has(helperId)) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Return cached result
    return this.getCachedFeatures(helperId);
  }
}

// Create singleton instance
export const featureComputationService = new FeatureComputationService();

// Export for testing and direct use
export { FeatureComputationService };