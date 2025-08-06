import { NextResponse } from 'next/server';
import { QueryService } from '@/lib/db';

/**
 * GET /api/debug-helpers
 * Debug helper data in the database
 */
export async function GET(request) {
  try {
    console.log('🔍 Debug: Checking helper data...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Get helpers using the same method as the enhanced matching
    const helpers = await QueryService.getUsersByType('individual_helper', limit);
    
    console.log(`📊 Found ${helpers.length} individual helpers`);
    
    // Get sample of all users to see user types
    let allUsersSample = [];
    try {
      // Get a small sample of all users to see what user types exist
      const { adminDb } = await import('@/lib/firebase-admin');
      const snapshot = await adminDb.collection('users').limit(10).get();
      allUsersSample = snapshot.docs.map(doc => ({
        id: doc.id,
        userType: doc.data().userType,
        isActive: doc.data().isActive,
        isRegistrationComplete: doc.data().isRegistrationComplete,
        fullName: doc.data().fullName || `${doc.data().firstName || ''} ${doc.data().lastName || ''}`.trim()
      }));
    } catch (error) {
      console.error('Error getting user sample:', error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Helper debug data retrieved',
      data: {
        individualHelpers: {
          count: helpers.length,
          helpers: helpers.map(helper => ({
            id: helper.uid || helper.id,
            fullName: helper.fullName || `${helper.firstName || ''} ${helper.lastName || ''}`.trim(),
            userType: helper.userType,
            isActive: helper.isActive,
            isRegistrationComplete: helper.isRegistrationComplete,
            nationality: helper.nationality,
            experienceYears: helper.experienceYears,
            hasBeenHelperBefore: helper.hasBeenHelperBefore,
            relevantSkills: helper.relevantSkills?.substring(0, 50) + '...' || 'None'
          }))
        },
        allUsersSample: {
          count: allUsersSample.length,
          users: allUsersSample
        },
        queryInfo: {
          userType: 'individual_helper',
          limit: limit,
          method: 'QueryService.getUsersByType'
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug helpers error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Helper debug failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}