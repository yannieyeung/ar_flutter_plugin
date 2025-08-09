import { NextResponse } from 'next/server';
import { getTopHelpers } from '@/lib/recommendation-pipeline';
import { DynamicScorer, extractScoringCriteria } from '@/lib/enhanced-matching-service';
import { trainPersonalizationModel, mlPersonalizationManager } from '@/lib/ml-personalization';

/**
 * GET /api/test-enhanced-matching
 * Test the enhanced matching system with comprehensive sample data
 */
export async function GET() {
  try {
    console.log('🧪 Testing Enhanced Matching System...');
    
    // Mock job data with enhanced structure
    const mockJob = {
      id: 'test-job-enhanced',
      jobTitle: 'Experienced Domestic Helper for Family',
      jobDescription: 'Looking for experienced helper with cooking, childcare, and cleaning skills',
      location: { city: 'Singapore', country: 'Singapore' },
      salary: { amount: 700, currency: 'SGD' },
      
      // Enhanced job requirements
      careOfChildren: {
        required: true,
        importance: 'high',
        numberOfChildren: 2,
        ageRangeYears: [3, 8]
      },
      cooking: {
        required: true,
        importance: 'medium',
        cuisinePreferences: ['Chinese', 'Western']
      },
      cleaning: {
        required: true,
        importance: 'medium',
        type: 'general'
      },
      careOfElderly: {
        required: false,
        importance: 'low',
        numberOfElderly: 0
      },
      
      // Preferences
      ageRange: { min: 25, max: 45 },
      nationalityPreferences: ['Philippines', 'Indonesia'],
      languagesRequired: ['English'],
      religionPreference: null,
      
      // Matching preferences
      matchingPreferences: {
        prioritizeExperience: 'high',
        prioritizeLanguages: 'medium',
        prioritizeNationality: 'medium'
      },
      
      // Custom compensation rules for this employer
      compensationRules: [
        {
          condition: "hasEnglish && !hasChildExperience && requiresChildCare",
          action: "addChildCareWeight(0.4)",
          description: "English speaker bonus for childcare",
          reason: "Strong English skills can help with child development"
        },
        {
          condition: "experienceYears >= 3 && !isPreferredNationality(nationality)",
          action: "addExperienceBonus(0.3)",
          description: "Experience bonus for non-preferred nationality",
          reason: "Extensive experience compensates for nationality preference"
        }
      ],
      
      metadata: { mlOptimized: true }
    };

    // Mock helper data with enhanced structure
    const mockHelpers = [
      {
        uid: 'helper-1-enhanced',
        fullName: 'Maria Santos',
        dateOfBirth: '1988-03-15',
        nationality: 'Philippines',
        religion: 'Christianity',
        relevantSkills: 'Childcare, cooking, cleaning, housekeeping, English tutoring',
        hasBeenHelperBefore: 'yes',
        experienceYears: 6,
        isActive: true,
        isVerified: true,
        profileCompleteness: 95,
        languagesSpoken: [
          { language: 'English', proficiency: 'fluent' },
          { language: 'Tagalog', proficiency: 'native' }
        ],
        experience: {
          childCare: true,
          cooking: true,
          cleaning: true,
          elderlyCare: false,
          petCare: true
        },
        cookingSkills: ['Chinese', 'Filipino', 'Western'],
        educationLevel: 'High School',
        maritalStatus: 'Single',
        numberOfChildren: 0
      },
      {
        uid: 'helper-2-enhanced',
        fullName: 'Siti Nurhaliza',
        dateOfBirth: '1985-07-22',
        nationality: 'Indonesia',
        religion: 'Islam',
        relevantSkills: 'Cleaning, laundry, elderly care, pet care, basic cooking',
        hasBeenHelperBefore: 'yes',
        experienceYears: 4,
        isActive: true,
        isVerified: false,
        profileCompleteness: 80,
        languagesSpoken: [
          { language: 'English', proficiency: 'intermediate' },
          { language: 'Indonesian', proficiency: 'native' }
        ],
        experience: {
          childCare: false,
          cooking: true,
          cleaning: true,
          elderlyCare: true,
          petCare: true
        },
        cookingSkills: ['Indonesian', 'Malay'],
        educationLevel: 'Middle School',
        maritalStatus: 'Married',
        numberOfChildren: 1
      },
      {
        uid: 'helper-3-enhanced',
        fullName: 'Lin Wei Ming',
        dateOfBirth: '1990-12-10',
        nationality: 'China',
        religion: 'Buddhism',
        relevantSkills: 'Childcare, Chinese cooking, tutoring, housekeeping',
        hasBeenHelperBefore: 'yes',
        experienceYears: 3,
        isActive: true,
        isVerified: true,
        profileCompleteness: 88,
        languagesSpoken: [
          { language: 'English', proficiency: 'good' },
          { language: 'Mandarin', proficiency: 'native' },
          { language: 'Cantonese', proficiency: 'fluent' }
        ],
        experience: {
          childCare: true,
          cooking: true,
          cleaning: true,
          elderlyCare: false,
          petCare: false
        },
        cookingSkills: ['Chinese', 'Cantonese', 'Dim Sum'],
        educationLevel: 'University',
        maritalStatus: 'Single',
        numberOfChildren: 0
      }
    ];

    console.log('📊 Testing Enhanced Matching Components...');

    // 1. Test data normalization
    const scoringCriteria = extractScoringCriteria(mockJob);
    console.log('✅ Scoring criteria extracted');

    // 2. Test dynamic scorer
    const scorer = new DynamicScorer(mockJob);
    const scoringResults = mockHelpers.map(helper => {
      const result = scorer.scoreHelper(helper);
      return {
        helper: {
          id: helper.uid,
          fullName: helper.fullName,
          nationality: helper.nationality,
          experienceYears: helper.experienceYears
        },
        ...result
      };
    });

    console.log('✅ Dynamic scoring completed');

    // 3. Test ML personalization initialization
    let mlStatus = null;
    try {
      await mlPersonalizationManager.initialize();
      mlStatus = mlPersonalizationManager.getStatus();
      console.log('✅ ML personalization manager initialized');
    } catch (mlError) {
      console.log('⚠️ ML personalization not available:', mlError.message);
      mlStatus = { error: mlError.message };
    }

    // 4. Test recommendation pipeline (without actual database)
    const testResults = {
      matches: scoringResults.map(result => ({
        helper: result.helper,
        score: Math.round(result.finalScore * 100),
        baseScore: Math.round(result.baseScore * 100),
        compensationScore: Math.round(result.compensationScore * 100),
        finalScore: Math.round(result.finalScore * 100),
        appliedRules: result.appliedRules,
        matchReasons: result.matchDetails?.compensations || [],
        scoreBreakdown: {
          skills: {
            score: Math.round(result.scoreBreakdown.skills.score * 100),
            details: result.scoreBreakdown.skills.details
          },
          experience: {
            score: Math.round(result.scoreBreakdown.experience.score * 100),
            details: result.scoreBreakdown.experience.details
          },
          preferences: {
            score: Math.round(result.scoreBreakdown.preferences.score * 100),
            details: result.scoreBreakdown.preferences.details
          },
          workConditions: {
            score: Math.round(result.scoreBreakdown.workConditions.score * 100),
            details: result.scoreBreakdown.workConditions.details
          },
          profile: {
            score: Math.round(result.scoreBreakdown.profile.score * 100),
            details: result.scoreBreakdown.profile.details
          }
        },
        matchDetails: result.matchDetails
      }))
    };

    // Sort by final score
    testResults.matches.sort((a, b) => b.finalScore - a.finalScore);

    console.log('✅ Enhanced matching test completed successfully');

    // 5. Generate test summary
    const summary = {
      totalHelpers: mockHelpers.length,
      scoredHelpers: testResults.matches.length,
      topMatch: testResults.matches[0],
      averageScore: Math.round(
        testResults.matches.reduce((sum, match) => sum + match.finalScore, 0) / testResults.matches.length
      ),
      compensationRulesApplied: testResults.matches.reduce(
        (sum, match) => sum + (match.appliedRules?.length || 0), 0
      ),
      mlPersonalizationStatus: mlStatus
    };

    return NextResponse.json({
      success: true,
      message: 'Enhanced matching system test completed successfully',
      testResults: {
        jobData: {
          id: mockJob.id,
          title: mockJob.jobTitle,
          requirements: scoringCriteria.requirements,
          preferences: scoringCriteria.preferences,
          compensationRules: scoringCriteria.compensationRules.length
        },
        matches: testResults.matches,
        summary,
        systemInfo: {
          enhancedMatching: true,
          mlPersonalization: !!mlStatus && !mlStatus.error,
          tensorflowAvailable: typeof window !== 'undefined' && !!window.tf,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Enhanced matching test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Enhanced matching system test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST /api/test-enhanced-matching
 * Test ML model training with sample data
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = 'train', userId = 'test-user' } = body;

    console.log(`🧪 Testing ML training for action: ${action}`);

    if (action === 'train') {
      // Test ML model training with mock decisions
      const mockDecisions = [
        {
          userId: userId,
          helperId: 'helper-1',
          jobId: 'job-1',
          action: 'hired',
          helperFeatures: {
            age: 32, nationality: 1, hasChildCare: 1, hasCooking: 1,
            hasCleaning: 1, hasElderlyCare: 0, experienceYears: 6,
            isVerified: 1, hasEnglish: 1, profileCompleteness: 95
          },
          jobFeatures: {
            requiresChildCare: 1, requiresCooking: 1, requiresCleaning: 1,
            requiresElderlyCare: 0, salaryAmount: 700, workingDays: 6
          }
        },
        // Add more mock decisions for training...
        ...Array.from({ length: 15 }, (_, i) => ({
          userId: userId,
          helperId: `helper-${i + 2}`,
          jobId: `job-${i + 1}`,
          action: i % 3 === 0 ? 'hired' : i % 3 === 1 ? 'contacted' : 'viewed',
          helperFeatures: {
            age: 25 + (i * 2), nationality: (i % 5) + 1, 
            hasChildCare: i % 2, hasCooking: (i + 1) % 2,
            hasCleaning: 1, hasElderlyCare: i % 4 === 0 ? 1 : 0,
            experienceYears: (i % 5) + 1, isVerified: i % 3 === 0 ? 1 : 0,
            hasEnglish: (i + 1) % 2, profileCompleteness: 60 + (i * 2)
          },
          jobFeatures: {
            requiresChildCare: i % 2, requiresCooking: 1, requiresCleaning: 1,
            requiresElderlyCare: i % 4 === 0 ? 1 : 0, salaryAmount: 600 + (i * 10),
            workingDays: 6
          }
        }))
      ];

      // Store mock decisions in memory for testing
      // In production, these would be in Firestore
      global.mockDecisions = mockDecisions;

      try {
        // Initialize ML system
        await mlPersonalizationManager.initialize();
        
        // This would normally trigger actual training
        // For testing, we'll just simulate the process
        console.log('🤖 Simulating ML model training...');
        
        return NextResponse.json({
          success: true,
          message: 'ML training simulation completed',
          trainingData: {
            userId: userId,
            decisionsCount: mockDecisions.length,
            actions: mockDecisions.reduce((acc, d) => {
              acc[d.action] = (acc[d.action] || 0) + 1;
              return acc;
            }, {}),
            simulatedTraining: true
          },
          mlStatus: mlPersonalizationManager.getStatus()
        });

      } catch (mlError) {
        return NextResponse.json({
          success: false,
          error: mlError.message,
          message: 'ML training test failed',
          fallback: 'Rule-based matching will be used'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action',
      availableActions: ['train']
    }, { status: 400 });

  } catch (error) {
    console.error('❌ ML training test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'ML training test failed'
    }, { status: 500 });
  }
}