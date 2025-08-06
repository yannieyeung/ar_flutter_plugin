const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Cloud Function: Generate Recommendations
 * Triggered when a new job is created
 */
exports.generateRecommendations = functions.firestore
  .document('job_postings/{jobId}')
  .onCreate(async (snap, context) => {
    try {
      const jobId = context.params.jobId;
      const jobData = snap.data();
      
      console.log(`🎯 Generating recommendations for job ${jobId}`);

      // Import the recommendation pipeline
      // Note: This would need to be adapted for server-side execution
      // For now, we'll create a simplified version that triggers client-side generation
      
      // Create a recommendation request document that the client can listen to
      await db.collection('recommendation_requests').doc(jobId).set({
        jobId: jobId,
        employerId: jobData.employerId,
        status: 'pending',
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        jobData: {
          title: jobData.jobTitle,
          requirements: jobData.requirements || {},
          preferences: jobData.preferences || {}
        }
      });

      console.log(`✅ Recommendation request created for job ${jobId}`);
      
      return { success: true, jobId };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Process Recommendation Request
 * HTTP function to generate recommendations
 */
exports.processRecommendations = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { jobId } = data;
    if (!jobId) {
      throw new functions.https.HttpsError('invalid-argument', 'Job ID is required');
    }

    console.log(`🔄 Processing recommendations for job ${jobId}`);

    // Get the job data
    const jobDoc = await db.collection('job_postings').doc(jobId).get();
    if (!jobDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Job not found');
    }

    const jobData = jobDoc.data();
    
    // Verify the user owns this job
    if (jobData.employerId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    // Get helpers from database
    const helpersSnapshot = await db.collection('users')
      .where('userType', '==', 'individual_helper')
      .where('isActive', '==', true)
      .where('isRegistrationComplete', '==', true)
      .limit(100) // Limit for performance
      .get();

    const helpers = [];
    helpersSnapshot.forEach(doc => {
      helpers.push({ id: doc.id, ...doc.data() });
    });

    console.log(`👥 Found ${helpers.length} helpers for matching`);

    // For now, create a simplified scoring system
    // In production, this would use the full enhanced matching service
    const scoredHelpers = helpers.map(helper => {
      const score = calculateSimpleScore(jobData, helper);
      return {
        helperId: helper.id,
        score: Math.round(score * 100),
        helper: {
          id: helper.id,
          fullName: helper.fullName || `${helper.firstName || ''} ${helper.lastName || ''}`.trim(),
          nationality: helper.nationality,
          experienceYears: helper.experienceYears || 0,
          isVerified: helper.isVerified || false,
          relevantSkills: helper.relevantSkills || ''
        },
        matchReasons: generateSimpleMatchReasons(jobData, helper, score)
      };
    }).sort((a, b) => b.score - a.score);

    // Store recommendations in Firestore
    const recommendations = {
      jobId: jobId,
      employerId: jobData.employerId,
      recommendedHelpers: scoredHelpers.slice(0, 20), // Top 20 matches
      totalHelpers: helpers.length,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      algorithm: 'cloud-function-v1'
    };

    await db.collection('recommendations').doc(jobId).set(recommendations);

    // Update the request status
    await db.collection('recommendation_requests').doc(jobId).update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Recommendations generated and stored for job ${jobId}`);

    return {
      success: true,
      jobId: jobId,
      totalMatches: scoredHelpers.length,
      topMatches: scoredHelpers.slice(0, 10)
    };

  } catch (error) {
    console.error('Error processing recommendations:', error);
    throw error;
  }
});

/**
 * Cloud Function: Scheduled ML Model Retraining
 * Runs every 2 days to retrain personalization models
 */
exports.scheduledModelRetraining = functions.pubsub
  .schedule('every 48 hours')
  .timeZone('Asia/Singapore')
  .onRun(async (context) => {
    try {
      console.log('🤖 Starting scheduled ML model retraining');

      // Get users who need retraining
      const usersNeedingRetraining = await getUsersNeedingRetraining();
      
      console.log(`Found ${usersNeedingRetraining.length} users needing retraining`);

      // Create retraining requests for each user
      const batch = db.batch();
      
      for (const userId of usersNeedingRetraining) {
        const retrainingRef = db.collection('ml_retraining_requests').doc(userId);
        batch.set(retrainingRef, {
          userId: userId,
          status: 'pending',
          requestedAt: admin.firestore.FieldValue.serverTimestamp(),
          requestType: 'scheduled'
        });
      }

      await batch.commit();

      console.log(`✅ Created ${usersNeedingRetraining.length} retraining requests`);

      return {
        success: true,
        usersScheduled: usersNeedingRetraining.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in scheduled retraining:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Process ML Retraining Request
 * HTTP function to retrain a user's personalization model
 */
exports.processMLRetraining = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    const requestingUserId = context.auth.uid;

    // Users can only retrain their own models, or admin can retrain any
    if (userId !== requestingUserId && !context.auth.token.admin) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    console.log(`🧠 Processing ML retraining for user ${userId}`);

    // Get user decisions for training
    const decisionsSnapshot = await db.collection('user_decisions')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const decisions = [];
    decisionsSnapshot.forEach(doc => {
      decisions.push(doc.data());
    });

    if (decisions.length < 10) {
      throw new functions.https.HttpsError('failed-precondition', 
        `Insufficient training data: ${decisions.length} decisions (minimum 10 required)`);
    }

    // Store training request (client will process the actual ML training)
    await db.collection('ml_training_data').doc(userId).set({
      userId: userId,
      decisions: decisions,
      trainingDataCount: decisions.length,
      status: 'ready_for_training',
      preparedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update retraining request status if it exists
    const retrainingRef = db.collection('ml_retraining_requests').doc(userId);
    await retrainingRef.update({
      status: 'data_prepared',
      trainingDataCount: decisions.length,
      preparedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(() => {
      // Create new request if it doesn't exist
      return retrainingRef.set({
        userId: userId,
        status: 'data_prepared',
        trainingDataCount: decisions.length,
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        preparedAt: admin.firestore.FieldValue.serverTimestamp(),
        requestType: 'manual'
      });
    });

    console.log(`✅ ML training data prepared for user ${userId}`);

    return {
      success: true,
      userId: userId,
      trainingDataCount: decisions.length,
      status: 'data_prepared'
    };

  } catch (error) {
    console.error('Error processing ML retraining:', error);
    throw error;
  }
});

/**
 * Cloud Function: Track User Decisions
 * HTTP function to track user interactions for ML training
 */
exports.trackUserDecision = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { helperId, jobId, action, helperFeatures, jobFeatures } = data;
    const userId = context.auth.uid;

    if (!helperId || !jobId || !action) {
      throw new functions.https.HttpsError('invalid-argument', 
        'Missing required fields: helperId, jobId, action');
    }

    // Create decision record
    const decision = {
      userId: userId,
      helperId: helperId,
      jobId: jobId,
      action: action,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      helperFeatures: helperFeatures || {},
      jobFeatures: jobFeatures || {}
    };

    // Store the decision
    await db.collection('user_decisions').add(decision);

    console.log(`📊 Tracked decision: ${action} by user ${userId} for helper ${helperId}`);

    // Check if user needs retraining (simple heuristic)
    const recentDecisionsSnapshot = await db.collection('user_decisions')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const shouldRetrain = recentDecisionsSnapshot.size >= 50;

    return {
      success: true,
      decision: {
        ...decision,
        timestamp: new Date().toISOString()
      },
      shouldRetrain: shouldRetrain
    };

  } catch (error) {
    console.error('Error tracking user decision:', error);
    throw error;
  }
});

/**
 * Helper Functions
 */

// Simple scoring algorithm for Cloud Functions
function calculateSimpleScore(job, helper) {
  let score = 0.5; // Base score
  
  // Skills matching
  if (helper.relevantSkills && job.jobDescription) {
    const helperSkills = helper.relevantSkills.toLowerCase();
    const jobDesc = job.jobDescription.toLowerCase();
    
    if (helperSkills.includes('cooking') && jobDesc.includes('cooking')) score += 0.2;
    if (helperSkills.includes('childcare') && jobDesc.includes('child')) score += 0.2;
    if (helperSkills.includes('cleaning') && jobDesc.includes('clean')) score += 0.1;
  }
  
  // Experience bonus
  if (helper.experienceYears > 0) {
    score += Math.min(helper.experienceYears * 0.05, 0.2);
  }
  
  // Verification bonus
  if (helper.isVerified) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

function generateSimpleMatchReasons(job, helper, score) {
  const reasons = [];
  
  if (score > 0.8) reasons.push('Excellent overall match');
  if (helper.isVerified) reasons.push('Verified profile');
  if (helper.experienceYears > 2) reasons.push(`${helper.experienceYears} years experience`);
  
  return reasons;
}

// Get users who need ML model retraining
async function getUsersNeedingRetraining() {
  try {
    // Get users with recent activity
    const recentDecisionsSnapshot = await db.collection('user_decisions')
      .where('timestamp', '>', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))) // Last 7 days
      .get();

    const activeUsers = new Set();
    recentDecisionsSnapshot.forEach(doc => {
      activeUsers.add(doc.data().userId);
    });

    return Array.from(activeUsers);
  } catch (error) {
    console.error('Error getting users needing retraining:', error);
    return [];
  }
}