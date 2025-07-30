import { NextResponse } from 'next/server';
import { matchingService } from '@/lib/matching-service';

/**
 * GET /api/test-matching
 * Test the matching service with mock data
 */
export async function GET() {
  try {
    console.log('🧪 Testing matching service...');
    
    // Mock job data
    const mockJob = {
      id: 'test-job',
      jobTitle: 'Domestic Helper for Family',
      jobDescription: 'Looking for experienced helper with cooking and childcare skills',
      location: { city: 'Singapore', country: 'Singapore' },
      salary: { amount: 600, currency: 'SGD' },
      householdInfo: { adultsCount: 2, childrenCount: 1, petsCount: 0 },
      workingConditions: { workingDays: 6, restDays: 1 },
      urgency: 'flexible',
      startDate: new Date().toISOString()
    };

    // Mock helper data
    const mockHelpers = [
      {
        id: 'helper-1',
        fullName: 'Maria Santos',
        dateOfBirth: '1990-01-01',
        nationality: 'Philippines',
        religion: 'Christianity',
        relevantSkills: 'Cooking, childcare, cleaning, housekeeping',
        hasBeenHelperBefore: 'yes',
        experience: { totalYears: 5 },
        isActive: true,
        isVerified: true,
        profileCompleteness: 90
      },
      {
        id: 'helper-2',
        fullName: 'Siti Nurhaliza',
        dateOfBirth: '1985-05-15',
        nationality: 'Indonesia',
        religion: 'Islam',
        relevantSkills: 'Cleaning, laundry, elderly care',
        hasBeenHelperBefore: 'yes',
        experience: { totalYears: 3 },
        isActive: true,
        isVerified: false,
        profileCompleteness: 75
      }
    ];

    console.log('📊 Testing with mock data...');
    
    // Test feature extraction
    const jobFeatures = matchingService.extractJobFeatures(mockJob);
    console.log('✅ Job features extracted:', Object.keys(jobFeatures));
    
    const helperFeatures = matchingService.extractHelperFeatures(mockHelpers[0]);
    console.log('✅ Helper features extracted:', Object.keys(helperFeatures));
    
    // Test similarity calculation
    const similarity = matchingService.calculateSimilarity(jobFeatures, helperFeatures);
    console.log('✅ Similarity calculated:', similarity);
    
    // Test full matching process (without database)
    await matchingService.initialize();
    
    // Simulate the matching process without JobService
    const matches = [];
    for (const helper of mockHelpers) {
      const helperFeatures = matchingService.extractHelperFeatures(helper);
      const similarity = matchingService.calculateSimilarity(jobFeatures, helperFeatures);
      
      matches.push({
        helper: {
          id: helper.id,
          fullName: helper.fullName,
          nationality: helper.nationality,
          relevantSkills: helper.relevantSkills,
          isVerified: helper.isVerified
        },
        similarity: Math.round(similarity * 100),
        matchReasons: matchingService.generateMatchReasons(jobFeatures, helperFeatures, similarity)
      });
    }
    
    matches.sort((a, b) => b.similarity - a.similarity);
    
    console.log('✅ Test completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Matching service test successful',
      testResults: {
        jobFeatures: Object.keys(jobFeatures),
        totalHelpers: mockHelpers.length,
        matches: matches,
        topMatch: matches[0]
      }
    });

  } catch (error) {
    console.error('❌ Test matching error:', error);
    console.error('❌ Test error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}