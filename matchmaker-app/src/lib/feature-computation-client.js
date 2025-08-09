/**
 * Client-side safe wrapper for feature computation operations
 * All operations are delegated to API endpoints to avoid client-side Firebase Admin imports
 */

class ClientFeatureComputationService {
  constructor() {
    this.baseUrl = '/api/admin/compute-features';
    this.adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-key';
  }

  /**
   * Update features for a helper via API call
   * @param {string} helperId - Helper's unique ID
   * @param {Object} updatedFields - Fields that changed
   * @param {Object} fullHelperData - Complete helper data
   */
  async updateFeatures(helperId, updatedFields, fullHelperData) {
    try {
      // Check if changes affect ML features
      const affectsMLFeatures = this.doesUpdateAffectMLFeatures(updatedFields);
      
      if (!affectsMLFeatures) {
        console.log('⏭️ Skipping feature update - changes don\'t affect ML features');
        return;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helperId,
          forceRecompute: true,
          adminKey: this.adminKey
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Helper features updated successfully:', result.featureSummary);
        return result;
      } else {
        const error = await response.json();
        console.warn('⚠️ Feature update API call failed:', error.message);
        return null;
      }
    } catch (error) {
      console.error('❌ Error updating features via API:', error);
      return null;
    }
  }

  /**
   * Get feature computation status
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}?action=status&adminKey=${this.adminKey}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        console.warn('⚠️ Could not fetch feature status');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching feature status:', error);
      return null;
    }
  }

  /**
   * Trigger batch computation for all helpers
   * @param {Object} options - Batch options
   */
  async batchComputeFeatures(options = {}) {
    try {
      const { batchSize = 10, forceRecompute = false } = options;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchMode: true,
          batchSize,
          forceRecompute,
          adminKey: this.adminKey
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Batch computation completed:', result.summary);
        return result;
      } else {
        const error = await response.json();
        console.warn('⚠️ Batch computation failed:', error.message);
        return null;
      }
    } catch (error) {
      console.error('❌ Error in batch computation:', error);
      return null;
    }
  }

  /**
   * Check if update affects ML features (client-side check)
   * @param {Object} updatedFields - Fields that changed
   */
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

  /**
   * Check if running in browser environment
   */
  isClientSide() {
    return typeof window !== 'undefined';
  }

  /**
   * Show feature computation info in console
   */
  logFeatureInfo() {
    if (this.isClientSide()) {
      console.log('🧮 Feature Computation Service (Client-side)');
      console.log('• All operations are delegated to API endpoints');
      console.log('• No direct database access from browser');
      console.log('• Real-time updates via debounced API calls');
    }
  }
}

// Create singleton instance
export const clientFeatureComputationService = new ClientFeatureComputationService();

// Export for direct use
export { ClientFeatureComputationService };