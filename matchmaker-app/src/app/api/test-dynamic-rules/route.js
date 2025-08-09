import { NextResponse } from 'next/server';
import { generateEmployerSpecificRules, analyzeEmployerFlexibility } from '@/lib/enhanced-matching-service';

// Mock data for testing
const mockEmployers = {
  "flexible_employer": {
    id: "emp_001",
    name: "Mr. Flexible",
    hiringHistory: [
      { 
        action: "hired", 
        helper: { age: 42, nationality: "Indonesian" }, 
        job: { preferences: { age: { max: 35 }, nationality: ["Filipino"] } }
      },
      { 
        action: "hired", 
        helper: { age: 38, nationality: "Filipino" }, 
        job: { preferences: { age: { max: 40 }, nationality: ["Filipino"] } }
      },
      { 
        action: "hired", 
        helper: { age: 45, nationality: "Myanmar" }, 
        job: { preferences: { age: { max: 40 }, nationality: ["Filipino"] } }
      }
    ]
  },
  "strict_employer": {
    id: "emp_002", 
    name: "Ms. Strict",
    hiringHistory: [
      { 
        action: "hired", 
        helper: { age: 28, nationality: "Filipino" }, 
        job: { preferences: { age: { max: 35 }, nationality: ["Filipino"] } }
      },
      { 
        action: "rejected", 
        helper: { age: 42, nationality: "Indonesian" }, 
        job: { preferences: { age: { max: 35 }, nationality: ["Filipino"] } }
      },
      { 
        action: "hired", 
        helper: { age: 32, nationality: "Filipino" }, 
        job: { preferences: { age: { max: 35 }, nationality: ["Filipino"] } }
      }
    ]
  }
};

const mockJob = {
  title: "Live-in Domestic Helper",
  requirements: {
    childCare: { required: true, importance: "high" },
    cooking: { required: true, importance: "medium" }
  },
  preferences: {
    age: { min: 25, max: 40 },
    nationality: ["Filipino"],
    languages: ["English"]
  },
  compensation: 2500
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employerType = searchParams.get('type') || 'both';

    console.log('🧪 Testing Dynamic Compensation Rules');
    
    const results = {};

    if (employerType === 'flexible' || employerType === 'both') {
      // Test flexible employer
      const flexibleEmployer = mockEmployers.flexible_employer;
      console.log(`\n👤 Testing ${flexibleEmployer.name} (Flexible)`);
      
      // Analyze flexibility
      const flexibilityProfile = analyzeEmployerFlexibility(flexibleEmployer.hiringHistory);
      console.log('📊 Flexibility Analysis:', flexibilityProfile);
      
      // Generate personalized rules
      const flexibleRules = await generateEmployerSpecificRules(mockJob, flexibleEmployer.id);
      
      results.flexible_employer = {
        name: flexibleEmployer.name,
        flexibilityProfile,
        compensationRules: flexibleRules,
        analysis: {
          ageFlexible: flexibilityProfile.ageFlexibility > 0.6,
          nationalityFlexible: flexibilityProfile.nationalityFlexibility > 0.5,
          skillCompensation: flexibilityProfile.skillCompensation > 0.3
        }
      };
    }

    if (employerType === 'strict' || employerType === 'both') {
      // Test strict employer
      const strictEmployer = mockEmployers.strict_employer;
      console.log(`\n👤 Testing ${strictEmployer.name} (Strict)`);
      
      // Analyze flexibility
      const flexibilityProfile = analyzeEmployerFlexibility(strictEmployer.hiringHistory);
      console.log('📊 Flexibility Analysis:', flexibilityProfile);
      
      // Generate personalized rules
      const strictRules = await generateEmployerSpecificRules(mockJob, strictEmployer.id);
      
      results.strict_employer = {
        name: strictEmployer.name,
        flexibilityProfile,
        compensationRules: strictRules,
        analysis: {
          ageFlexible: flexibilityProfile.ageFlexibility > 0.6,
          nationalityFlexible: flexibilityProfile.nationalityFlexibility > 0.5,
          skillCompensation: flexibilityProfile.skillCompensation > 0.3
        }
      };
    }

    return NextResponse.json({
      success: true,
      message: "Dynamic compensation rules test completed",
      mockJob,
      results,
      explanation: {
        flexible_employer: "This employer has hired helpers outside their stated preferences, showing flexibility. The system generates more lenient compensation rules.",
        strict_employer: "This employer has consistently hired only helpers matching their exact preferences. The system generates stricter rules or even penalty rules.",
        how_it_works: "The system analyzes each employer's hiring history to understand their actual flexibility patterns, then generates personalized compensation rules that reflect their true preferences."
      }
    });

  } catch (error) {
    console.error('❌ Error testing dynamic rules:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { employerId, hiringHistory, job } = body;

    if (!hiringHistory || !Array.isArray(hiringHistory)) {
      return NextResponse.json({
        success: false,
        error: "Invalid hiring history data"
      }, { status: 400 });
    }

    console.log(`🧪 Testing custom employer ${employerId}`);
    
    // Analyze the provided hiring history
    const flexibilityProfile = analyzeEmployerFlexibility(hiringHistory);
    
    // Generate rules for the provided job
    const personalizedRules = await generateEmployerSpecificRules(job || mockJob, employerId);

    return NextResponse.json({
      success: true,
      employerId,
      flexibilityProfile,
      compensationRules: personalizedRules,
      insights: {
        ageFlexibility: flexibilityProfile.ageFlexibility,
        nationalityFlexibility: flexibilityProfile.nationalityFlexibility,
        skillCompensation: flexibilityProfile.skillCompensation,
        recommendedStrategy: flexibilityProfile.ageFlexibility > 0.6 
          ? "Show helpers slightly outside age range with good experience"
          : "Stick closely to stated age preferences"
      }
    });

  } catch (error) {
    console.error('❌ Error in custom test:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}