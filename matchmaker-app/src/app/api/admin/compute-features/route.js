/**
 * Admin API endpoint to compute ML features for helpers
 * POST /api/admin/compute-features
 * Supports single helper or batch processing
 */

import { NextResponse } from 'next/server';
import { featureComputationService } from '@/lib/feature-computation-service';
import { QueryService } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      helperId, 
      forceRecompute = false, 
      batchMode = false, 
      batchSize = 10,
      adminKey 
    } = body;

    // Simple admin authentication (you might want to enhance this)
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    if (batchMode) {
      // Batch compute features for all helpers
      console.log('🔄 Starting batch feature computation via API...');
      
      // Get all helpers
      const helpers = await QueryService.getUsersByType('individual_helper', 1000);
      
      if (helpers.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No helpers found',
          processed: 0
        });
      }

      // Process in batches
      const result = await featureComputationService.batchComputeFeatures(helpers, {
        batchSize,
        delay: 100,
        forceRecompute,
        onProgress: (progress) => {
          console.log(`📊 Batch progress: ${progress.completed}/${progress.total}`);
        }
      });

      return NextResponse.json({
        success: true,
        message: `Batch computation completed`,
        summary: result.summary,
        errors: result.errors.slice(0, 10), // Limit error details
        processed: result.summary.total
      });

    } else if (helperId) {
      // Compute features for single helper
      console.log(`🧮 Computing features for helper ${helperId}...`);
      
      // Get helper data
      const helper = await QueryService.getUserById(helperId);
      if (!helper) {
        return NextResponse.json(
          { error: 'Helper not found' }, 
          { status: 404 }
        );
      }

      // Compute features
      const features = await featureComputationService.computeAndStoreFeatures(
        helper, 
        helperId, 
        forceRecompute
      );

      return NextResponse.json({
        success: true,
        message: `Features computed for helper ${helperId}`,
        helperId,
        completeness: features.meta.completeness,
        featureSummary: {
          overallQuality: features.composite.overallQualityScore,
          totalExperience: features.experience.totalYears,
          activeSkills: features.experience.skillDiversity,
          languageCount: features.languages.languageCount
        }
      });

    } else {
      return NextResponse.json(
        { error: 'Either helperId or batchMode must be specified' }, 
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Error in compute-features API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message,
        success: false 
      }, 
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const action = searchParams.get('action');

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    if (action === 'status') {
      // Get feature computation status
      const { adminDb } = await import('@/lib/firebase-admin');
      
      // Count helpers with and without features
      const [helpersSnapshot, featuresSnapshot] = await Promise.all([
        adminDb.collection('users')
          .where('userType', '==', 'individual_helper')
          .where('isRegistrationComplete', '==', true)
          .get(),
        adminDb.collection('helper_features').get()
      ]);

      const totalHelpers = helpersSnapshot.size;
      const helpersWithFeatures = featuresSnapshot.size;
      const percentage = totalHelpers > 0 ? Math.round((helpersWithFeatures / totalHelpers) * 100) : 0;

      // Sample feature data
      let sampleFeatures = null;
      if (!featuresSnapshot.empty) {
        const sampleDoc = featuresSnapshot.docs[0];
        const features = sampleDoc.data();
        
        sampleFeatures = {
          completeness: features.meta?.completeness,
          overallQuality: features.composite?.overallQualityScore,
          lastComputed: features.meta?.computedAt
        };
      }

      return NextResponse.json({
        success: true,
        status: {
          totalHelpers,
          helpersWithFeatures,
          percentage,
          sampleFeatures
        },
        recommendations: {
          needsComputation: totalHelpers - helpersWithFeatures,
          estimatedTime: `~${Math.ceil((totalHelpers - helpersWithFeatures) * 0.5)} seconds`,
          nextSteps: helpersWithFeatures === 0 
            ? 'Run batch computation to initialize all features'
            : 'Features are mostly up to date'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Feature computation API',
      availableActions: [
        'POST with helperId for single helper',
        'POST with batchMode=true for all helpers',
        'GET with action=status for status check'
      ],
      usage: {
        single: 'POST { "helperId": "helper123", "adminKey": "key", "forceRecompute": false }',
        batch: 'POST { "batchMode": true, "adminKey": "key", "batchSize": 10, "forceRecompute": false }',
        status: 'GET ?action=status&adminKey=key'
      }
    });

  } catch (error) {
    console.error('❌ Error in compute-features GET:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}