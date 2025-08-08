/**
 * Validation script to check seeded helpers have all necessary data for feature computation
 * Run this after seeding to ensure data quality
 * Usage: node scripts/validateSeeding.js
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🔍 Helper Seeding Validation Script');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    process.exit(1);
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

// Define required fields for feature computation
const REQUIRED_FIELDS = {
  basic: [
    'userType', 'fullName', 'dateOfBirth', 'nationality', 'educationLevel',
    'maritalStatus', 'hasBeenHelperBefore', 'isRegistrationComplete'
  ],
  experience: [
    'experience', 'experienceForML', 'relevantSkills'
  ],
  medical: [
    'hasAllergies', 'hasPastIllness', 'hasPhysicalDisabilities'
  ],
  profile: [
    'profileCompleteness', 'isVerified', 'hasReferences', 'hasPhoto'
  ],
  activity: [
    'lastActive', 'responseRate', 'averageResponseTime'
  ],
  preferences: [
    'workPreferences', 'availability'
  ]
};

const EXPERIENCE_CATEGORIES = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];

async function validateSeededHelpers() {
  try {
    console.log('\n📋 Fetching seeded helpers...');
    
    const snapshot = await db.collection('users')
      .where('userType', '==', 'individual_helper')
      .where('isRegistrationComplete', '==', true)
      .get();
    
    if (snapshot.empty) {
      console.log('⚠️ No seeded helpers found in database');
      console.log('💡 Run "npm run seed:helpers" first');
      return;
    }
    
    const helpers = [];
    snapshot.forEach(doc => {
      helpers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`👥 Found ${helpers.length} helpers to validate`);
    
    // Validation results
    const results = {
      total: helpers.length,
      valid: 0,
      warnings: 0,
      errors: 0,
      details: []
    };
    
    // Validate each helper
    for (const helper of helpers) {
      const validation = validateHelper(helper);
      results.details.push(validation);
      
      if (validation.status === 'valid') {
        results.valid++;
      } else if (validation.status === 'warning') {
        results.warnings++;
      } else {
        results.errors++;
      }
    }
    
    // Display results
    displayValidationResults(results);
    
    // Check feature computation status
    await checkFeatureComputationStatus(helpers);
    
  } catch (error) {
    console.error('❌ Error validating seeded helpers:', error);
    throw error;
  }
}

function validateHelper(helper) {
  const validation = {
    id: helper.id,
    name: helper.fullName || 'Unknown',
    status: 'valid',
    issues: [],
    scores: {
      basic: 0,
      experience: 0,
      medical: 0,
      profile: 0,
      activity: 0,
      preferences: 0
    }
  };
  
  // Check basic fields
  REQUIRED_FIELDS.basic.forEach(field => {
    if (!helper[field] || helper[field] === '') {
      validation.issues.push(`Missing basic field: ${field}`);
      validation.status = 'error';
    } else {
      validation.scores.basic++;
    }
  });
  
  // Check experience fields
  REQUIRED_FIELDS.experience.forEach(field => {
    if (!helper[field]) {
      validation.issues.push(`Missing experience field: ${field}`);
      validation.status = validation.status === 'error' ? 'error' : 'warning';
    } else {
      validation.scores.experience++;
    }
  });
  
  // Validate experience structure
  if (helper.hasBeenHelperBefore === 'yes') {
    if (!helper.experience || typeof helper.experience !== 'object') {
      validation.issues.push('Experience object missing for experienced helper');
      validation.status = 'error';
    } else {
      // Check if at least one experience category exists
      const hasExperienceCategories = EXPERIENCE_CATEGORIES.some(cat => 
        helper.experience[cat]?.hasExperience
      );
      
      if (!hasExperienceCategories) {
        validation.issues.push('No experience categories found for experienced helper');
        validation.status = 'warning';
      }
    }
    
    // Check experienceForML structure
    if (!helper.experienceForML) {
      validation.issues.push('Missing experienceForML data');
      validation.status = 'warning';
    } else {
      const mlData = helper.experienceForML;
      if (!mlData.skillsExperience || !mlData.skillsCompetency || !mlData.activeSkills) {
        validation.issues.push('Incomplete experienceForML structure');
        validation.status = 'warning';
      }
    }
  }
  
  // Check other field categories
  ['medical', 'profile', 'activity', 'preferences'].forEach(category => {
    REQUIRED_FIELDS[category].forEach(field => {
      if (helper[field] === undefined || helper[field] === null) {
        validation.issues.push(`Missing ${category} field: ${field}`);
        validation.status = validation.status === 'error' ? 'error' : 'warning';
      } else {
        validation.scores[category]++;
      }
    });
  });
  
  // Check data types
  if (helper.dateOfBirth && !isValidDate(helper.dateOfBirth)) {
    validation.issues.push('Invalid dateOfBirth format');
    validation.status = 'warning';
  }
  
  if (helper.profileCompleteness && (helper.profileCompleteness < 0 || helper.profileCompleteness > 100)) {
    validation.issues.push('Invalid profileCompleteness value (should be 0-100)');
    validation.status = 'warning';
  }
  
  return validation;
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function displayValidationResults(results) {
  console.log('\n📊 Validation Results Summary:');
  console.log(`  ✅ Valid: ${results.valid}`);
  console.log(`  ⚠️ Warnings: ${results.warnings}`);
  console.log(`  ❌ Errors: ${results.errors}`);
  console.log(`  📈 Success Rate: ${Math.round((results.valid / results.total) * 100)}%`);
  
  // Show detailed issues
  const problemHelpers = results.details.filter(h => h.status !== 'valid');
  
  if (problemHelpers.length > 0) {
    console.log('\n🔍 Detailed Issues:');
    problemHelpers.forEach(helper => {
      console.log(`\n${helper.status === 'error' ? '❌' : '⚠️'} ${helper.name} (${helper.id})`);
      helper.issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
      
      // Show scores
      const totalPossible = Object.values(REQUIRED_FIELDS).reduce((sum, fields) => sum + fields.length, 0);
      const totalScore = Object.values(helper.scores).reduce((sum, score) => sum + score, 0);
      console.log(`  📊 Completeness: ${Math.round((totalScore / totalPossible) * 100)}%`);
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (results.errors > 0) {
    console.log('  🔧 Fix error-level issues before running feature computation');
  }
  if (results.warnings > 0) {
    console.log('  ⚠️ Address warnings for optimal ML feature quality');
  }
  if (results.valid === results.total) {
    console.log('  🎉 All helpers are properly seeded and ready for feature computation!');
  }
}

async function checkFeatureComputationStatus(helpers) {
  console.log('\n🧮 Checking Feature Computation Status...');
  
  try {
    const featuresSnapshot = await db.collection('helper_features').get();
    const vectorsSnapshot = await db.collection('helper_feature_vectors').get();
    
    const helpersWithFeatures = featuresSnapshot.size;
    const helpersWithVectors = vectorsSnapshot.size;
    
    console.log(`  💾 Helpers with computed features: ${helpersWithFeatures}/${helpers.length}`);
    console.log(`  🔢 Helpers with feature vectors: ${helpersWithVectors}/${helpers.length}`);
    
    const featurePercentage = Math.round((helpersWithFeatures / helpers.length) * 100);
    const vectorPercentage = Math.round((helpersWithVectors / helpers.length) * 100);
    
    console.log(`  📊 Feature computation rate: ${featurePercentage}%`);
    console.log(`  📊 Vector generation rate: ${vectorPercentage}%`);
    
    if (helpersWithFeatures === 0) {
      console.log('\n🚀 Next Steps:');
      console.log('  1. Run: npm run compute:features');
      console.log('  2. Or use API: POST /api/admin/compute-features with batchMode=true');
    } else if (helpersWithFeatures < helpers.length) {
      console.log('\n🔄 Partial Completion:');
      console.log('  • Some helpers have computed features');
      console.log('  • Run feature computation again to complete remaining helpers');
    } else {
      console.log('\n✅ All helpers have computed features!');
      console.log('  • Matching system is optimized for performance');
      console.log('  • TensorFlow models can use structured feature vectors');
    }
    
  } catch (error) {
    console.warn('⚠️ Could not check feature computation status:', error.message);
  }
}

// Main execution
async function main() {
  try {
    console.log('🔥 Starting helper seeding validation...\n');
    
    await validateSeededHelpers();
    
    console.log('\n🎯 Validation completed successfully!');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});