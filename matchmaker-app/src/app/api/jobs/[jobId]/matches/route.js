import { NextResponse } from 'next/server';
import { matchingService } from '@/lib/matching-service';

/**
 * GET /api/jobs/[jobId]/matches
 * Find matches for a specific job posting
 */
export async function GET(request, { params }) {
  try {
    const { jobId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Validate parameters
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    if (limit > 50) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 50' },
        { status: 400 }
      );
    }

    // Get all active helpers from the database
    const helpers = await getAllActiveHelpers();
    console.log(`📊 Retrieved ${helpers.length} helpers for matching`);
    
    if (helpers.length === 0) {
      console.log('⚠️ No helpers found in database');
      return NextResponse.json({
        matches: [],
        totalMatches: 0,
        hasMore: false,
        page,
        limit,
        totalPages: 0,
        message: 'No active helpers found in the database'
      });
    }

    // Find matches using the matching service
    console.log(`🎯 Starting matching process for job ${jobId}`);
    const result = await matchingService.findMatches(jobId, helpers, limit, offset);
    console.log(`✅ Matching completed: ${result.matches.length} matches found`);
    
    // Calculate pagination info
    const totalPages = Math.ceil(result.totalMatches / limit);
    
    return NextResponse.json({
      matches: result.matches.map(match => ({
        helper: {
          id: match.helper.id,
          fullName: match.helper.fullName || match.helper.name,
          age: matchingService.calculateAge(match.helper.dateOfBirth),
          nationality: match.helper.nationality,
          religion: match.helper.religion,
          experience: match.helper.experience,
          relevantSkills: match.helper.relevantSkills,
          isVerified: match.helper.isVerified,
          profileCompleteness: match.helper.profileCompleteness,
          profilePicture: match.helper.profilePicture,
          // Add other safe fields that should be visible to employers
        },
        similarity: Math.round(match.similarity * 100), // Convert to percentage
        matchReasons: match.matchReasons,
        matchScore: match.similarity,
        scoreBreakdown: match.scoreBreakdown ? {
          skills: {
            score: Math.round(match.scoreBreakdown.skills.score * 100),
            weight: Math.round(match.scoreBreakdown.skills.weight * 100),
            details: match.scoreBreakdown.skills.details
          },
          experience: {
            score: Math.round(match.scoreBreakdown.experience.score * 100),
            weight: Math.round(match.scoreBreakdown.experience.weight * 100),
            details: match.scoreBreakdown.experience.details
          },
          location: {
            score: Math.round(match.scoreBreakdown.location.score * 100),
            weight: Math.round(match.scoreBreakdown.location.weight * 100),
            details: match.scoreBreakdown.location.details
          },
          nationality: {
            score: Math.round(match.scoreBreakdown.nationality.score * 100),
            weight: Math.round(match.scoreBreakdown.nationality.weight * 100),
            details: match.scoreBreakdown.nationality.details
          },
          age: {
            score: Math.round(match.scoreBreakdown.age.score * 100),
            weight: Math.round(match.scoreBreakdown.age.weight * 100),
            details: match.scoreBreakdown.age.details
          },
          religion: {
            score: Math.round(match.scoreBreakdown.religion.score * 100),
            weight: Math.round(match.scoreBreakdown.religion.weight * 100),
            details: match.scoreBreakdown.religion.details
          }
        } : null
      })),
      totalMatches: result.totalMatches,
      hasMore: result.hasMore,
      page,
      limit,
      totalPages
    });

  } catch (error) {
    console.error('❌ Error finding matches:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Return appropriate error response
    if (error.message === 'Job not found') {
      return NextResponse.json(
        { 
          error: 'Job not found',
          message: `No job found with ID: ${jobId}. The job may have been deleted or the ID is incorrect.`,
          suggestion: 'Please check the job ID or visit /api/debug/jobs to see available jobs.'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get all active helpers from the database
 */
async function getAllActiveHelpers() {
  try {
    console.log('🔍 Fetching active helpers...');
    
         // Try to import Firebase admin
     let db;
     try {
       const { adminDb } = await import('@/lib/firebase-admin');
       db = adminDb;
       console.log('✅ Firebase admin imported successfully');
    } catch (firebaseError) {
      console.error('❌ Firebase admin import failed:', firebaseError.message);
      // Return mock data for testing if Firebase is not configured
      console.log('🧪 Using mock helper data for testing');
      return [
        {
          id: 'mock-helper-1',
          fullName: 'Maria Santos',
          dateOfBirth: '1990-01-01',
          nationality: 'Philippines',
          religion: 'Christianity',
          relevantSkills: 'Cooking, childcare, cleaning, housekeeping',
          hasBeenHelperBefore: 'yes',
          experience: { totalYears: 5 },
          isActive: true,
          isVerified: true,
          profileCompleteness: 90,
          userType: 'individual_helper',
          isRegistrationComplete: true
        },
        {
          id: 'mock-helper-2',
          fullName: 'Siti Nurhaliza',
          dateOfBirth: '1985-05-15',
          nationality: 'Indonesia',
          religion: 'Islam',
          relevantSkills: 'Cleaning, laundry, elderly care, pet care',
          hasBeenHelperBefore: 'yes',
          experience: { totalYears: 3 },
          isActive: true,
          isVerified: false,
          profileCompleteness: 75,
          userType: 'individual_helper',
          isRegistrationComplete: true
        }
      ];
    }
    
    const snapshot = await db.collection('users')
      .where('userType', '==', 'individual_helper')
      .where('isActive', '==', true)
      .where('isRegistrationComplete', '==', true)
      .get();

    console.log(`📊 Found ${snapshot.size} helper documents`);

    const helpers = [];
    snapshot.forEach(doc => {
      helpers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Processed ${helpers.length} helpers`);
    return helpers;
  } catch (error) {
    console.error('❌ Error fetching helpers:', error);
    console.error('❌ Helper fetch error stack:', error.stack);
    throw new Error(`Failed to fetch helpers: ${error.message}`);
  }
}