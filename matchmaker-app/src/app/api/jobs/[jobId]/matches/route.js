import { NextResponse } from 'next/server';
import { getTopHelpers, userDecisionTracker } from '@/lib/recommendation-pipeline';
import { headers } from 'next/headers';

/**
 * GET /api/jobs/[jobId]/matches
 * Get enhanced AI-powered matches for a job using the new TensorFlow system
 */
export async function GET(request, { params }) {
  try {
    const { jobId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get user ID from request headers or auth context
    const headersList = await headers();
    const userId = headersList.get('x-user-id') || searchParams.get('userId');

    console.log(`🎯 Enhanced matching request for job ${jobId}, page ${page}, limit ${limit}`);

    // Get matches using the enhanced recommendation pipeline
    const result = await getTopHelpers(jobId, limit + offset, userId);
    
    // Apply pagination to the results
    const paginatedMatches = result.matches.slice(offset, offset + limit);
    
    // Track that user viewed the matches
    if (userId && paginatedMatches.length > 0) {
      try {
        // Track viewing of the match results (async, don't wait)
        paginatedMatches.forEach(async (match) => {
          try {
            await userDecisionTracker.trackDecision(
              userId,
              match.helper.id,
              jobId,
              'viewed',
              match.helper,
              result.jobInfo
            );
          } catch (trackingError) {
            console.error('Error tracking view decision:', trackingError);
            // Don't fail the request for tracking errors
          }
        });
      } catch (error) {
        console.error('Error in batch tracking:', error);
      }
    }

    // Format response
    const response = {
      success: true,
      matches: paginatedMatches.map(match => ({
        helper: {
          id: match.helper.id,
          fullName: match.helper.fullName,
          age: match.helper.age,
          nationality: match.helper.nationality,
          experienceYears: match.helper.experienceYears,
          languages: match.helper.languages,
          relevantSkills: match.helper.relevantSkills,
          isVerified: match.helper.isVerified,
          profileCompleteness: match.helper.profileCompleteness,
          location: match.helper.location
        },
        score: match.score,
        baseScore: match.baseScore || match.score,
        personalizedScore: match.personalizedScore,
        compensationScore: match.compensationScore || 0,
        finalScore: match.finalScore || match.score,
        isPersonalized: match.isPersonalized || false,
        matchReasons: match.matchReasons || [],
        appliedRules: match.appliedRules || [],
        scoreBreakdown: {
          skills: {
            score: Math.round((match.scoreBreakdown?.skills?.score || 0) * 100),
            details: match.scoreBreakdown?.skills?.details || ''
          },
          experience: {
            score: Math.round((match.scoreBreakdown?.experience?.score || 0) * 100),
            details: match.scoreBreakdown?.experience?.details || ''
          },
          preferences: {
            score: Math.round((match.scoreBreakdown?.preferences?.score || 0) * 100),
            details: match.scoreBreakdown?.preferences?.details || ''
          },
          workConditions: {
            score: Math.round((match.scoreBreakdown?.workConditions?.score || 0) * 100),
            details: match.scoreBreakdown?.workConditions?.details || ''
          },
          profile: {
            score: Math.round((match.scoreBreakdown?.profile?.score || 0) * 100),
            details: match.scoreBreakdown?.profile?.details || ''
          }
        },
        matchDetails: match.matchDetails
      })),
      pagination: {
        currentPage: page,
        totalMatches: result.totalMatches,
        hasMore: result.hasMore,
        totalPages: Math.ceil(result.totalMatches / limit),
        limit: limit
      },
      jobInfo: result.jobInfo,
      scoringInfo: result.scoringInfo,
      enhancedMatching: true, // Indicator that enhanced matching was used
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Enhanced matching completed: ${paginatedMatches.length} matches returned`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Enhanced matching API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      matches: [],
      pagination: {
        currentPage: 1,
        totalMatches: 0,
        hasMore: false,
        totalPages: 0,
        limit: 10
      },
      enhancedMatching: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST /api/jobs/[jobId]/matches
 * Track user interactions with helper matches
 */
export async function POST(request, { params }) {
  try {
    const { jobId } = await params;
    const body = await request.json();
    const { helperId, action, userId, helperData, jobData } = body;

    if (!helperId || !action || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: helperId, action, userId'
      }, { status: 400 });
    }

    console.log(`📊 Tracking user interaction: ${action} on helper ${helperId} for job ${jobId}`);

    // Track the user decision
    const decision = await userDecisionTracker.trackDecision(
      userId,
      helperId,
      jobId,
      action,
      helperData || {},
      jobData || {}
    );

    // Check if user needs model retraining
    let needsRetraining = false;
    try {
      const { mlPersonalizationManager } = await import('@/lib/ml-personalization');
      await mlPersonalizationManager.initialize();
      needsRetraining = await mlPersonalizationManager.shouldRetrain(userId);
    } catch (mlError) {
      console.error('Error checking retraining need:', mlError);
    }

    return NextResponse.json({
      success: true,
      decision,
      needsRetraining,
      message: `Successfully tracked ${action} action`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error tracking user interaction:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}