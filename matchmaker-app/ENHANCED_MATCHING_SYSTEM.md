# Enhanced TensorFlow Matching System

## Overview

This enhanced matching system replaces the basic rule-based matching with a sophisticated AI-powered system that includes:

1. **Dynamic Scoring Engine** with flexible compensation rules
2. **ML Personalization** using TensorFlow.js
3. **User Behavior Tracking** for continuous learning
4. **Automated Recommendations** via Firebase Cloud Functions
5. **Real-time Click Tracking** for better insights

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Job Posting   │───▶│ Enhanced Matching │───▶│ ML Personalized │
│                 │    │ Service          │    │ Results         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Helper Database │    │ Compensation     │    │ User Decision   │
│                 │    │ Rules Engine     │    │ Tracking        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                     ┌──────────────────┐    ┌─────────────────┐
                     │ TensorFlow.js    │    │ Firebase Cloud  │
                     │ ML Models        │    │ Functions       │
                     └──────────────────┘    └─────────────────┘
```

## Key Components

### 1. Enhanced Matching Service (`enhanced-matching-service.js`)

**Features:**
- Standardized scoring schema with importance weights
- Flexible compensation rules engine
- Dynamic scoring based on job requirements
- Support for custom employer preferences

**Usage:**
```javascript
import { enhancedMatchingService, DynamicScorer } from '@/lib/enhanced-matching-service';

// Initialize the service
await enhancedMatchingService.initialize();

// Score a helper against a job
const scorer = new DynamicScorer(jobData);
const result = scorer.scoreHelper(helperData);

console.log(result.finalScore); // 0-1 score
console.log(result.appliedRules); // Compensation rules that were applied
```

### 2. Recommendation Pipeline (`recommendation-pipeline.js`)

**Features:**
- Integrates with existing database
- Applies ML personalization when available
- Normalizes helper data structures
- Handles pagination and filtering

**Usage:**
```javascript
import { getTopHelpers } from '@/lib/recommendation-pipeline';

// Get top matches for a job
const result = await getTopHelpers(jobId, limit, employerId);
console.log(result.matches); // Array of scored helpers
```

### 3. ML Personalization (`ml-personalization.js`)

**Features:**
- TensorFlow.js neural network models
- User-specific personalization
- Automatic model training and retraining
- Browser-based model storage

**Usage:**
```javascript
import { trainPersonalizationModel, applyPersonalization } from '@/lib/ml-personalization';

// Train a model for a user
await trainPersonalizationModel(userId);

// Apply personalization to recommendations
const personalizedResults = await applyPersonalization(userId, scoredHelpers);
```

## Data Structures

### Job Requirements Schema

```javascript
{
  requirements: {
    childCare: {
      required: boolean,
      weight: number, // 0-1 based on importance
      childrenCount: number,
      ages: number[],
      details: object
    },
    cooking: {
      required: boolean,
      weight: number,
      cuisines: string[],
      details: object
    },
    // ... other requirements
  },
  preferences: {
    age: { min: number, max: number, weight: number },
    nationality: { preferred: string[], weight: number },
    languages: { required: string[], weight: number },
    // ... other preferences
  },
  compensationRules: [
    {
      condition: string, // JavaScript expression
      action: string,    // Action to take
      description: string,
      reason: string
    }
  ]
}
```

### Helper Data Schema

```javascript
{
  id: string,
  fullName: string,
  age: number,
  nationality: string,
  languages: [{ language: string, proficiency: string }],
  experience: {
    childCare: boolean,
    cooking: boolean,
    cleaning: boolean,
    elderlyCare: boolean,
    petCare: boolean
  },
  experienceYears: number,
  isVerified: boolean,
  profileCompleteness: number,
  // ... other helper data
}
```

### Scoring Result Schema

```javascript
{
  baseScore: number,           // 0-100 base matching score
  compensationScore: number,   // 0-100 compensation bonus
  personalizedScore: number,   // 0-100 ML personalized score
  finalScore: number,          // 0-100 final combined score
  scoreBreakdown: {
    skills: { score: number, details: string },
    experience: { score: number, details: string },
    preferences: { score: number, details: string },
    workConditions: { score: number, details: string },
    profile: { score: number, details: string }
  },
  appliedRules: [
    {
      rule: string,
      adjustment: number,
      reason: string
    }
  ],
  matchDetails: {
    strengths: string[],
    concerns: string[],
    compensations: string[]
  }
}
```

## Compensation Rules

Compensation rules allow employers to define flexible matching criteria. For example:

```javascript
// Rule: English speakers get bonus for childcare even without direct experience
{
  condition: "hasEnglish && !hasChildExperience && requiresChildCare",
  action: "addChildCareWeight(0.3)",
  description: "English speaker bonus for childcare without direct experience",
  reason: "English proficiency can compensate for lack of childcare experience"
}

// Rule: Cooking experience compensates for nationality preference
{
  condition: "hasCookingExperience && !isPreferredNationality(nationality) && requiresCooking",
  action: "addNationalityWeight(0.2)",
  description: "Cooking experience bonus for non-preferred nationality",
  reason: "Strong cooking skills can compensate for nationality preference"
}
```

### Available Variables in Rules

- `hasEnglish`: boolean
- `hasChildExperience`: boolean
- `hasCookingExperience`: boolean
- `hasElderlyExperience`: boolean
- `nationality`: string
- `age`: number
- `experienceYears`: number
- `isVerified`: boolean
- `requiresChildCare`: boolean
- `requiresCooking`: boolean
- `requiresElderlyCare`: boolean
- Helper functions: `isPreferredNationality()`, `meetsAgeRequirement()`, `hasAllRequiredSkills()`

## API Endpoints

### GET `/api/jobs/[jobId]/matches`

Get enhanced AI-powered matches for a job.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `userId`: User ID for personalization (optional)

**Headers:**
- `x-user-id`: User ID for tracking

**Response:**
```javascript
{
  success: true,
  matches: [/* array of scored helpers */],
  pagination: {
    currentPage: number,
    totalMatches: number,
    hasMore: boolean,
    totalPages: number,
    limit: number
  },
  jobInfo: { /* job information */ },
  scoringInfo: {
    totalHelpers: number,
    scoredHelpers: number,
    mlPersonalized: boolean
  },
  enhancedMatching: true,
  timestamp: string
}
```

### POST `/api/jobs/[jobId]/matches`

Track user interactions with helper matches.

**Body:**
```javascript
{
  helperId: string,
  action: string, // 'viewed', 'clicked', 'contacted', 'hired', 'rejected'
  userId: string,
  helperData: object, // optional
  jobData: object     // optional
}
```

**Response:**
```javascript
{
  success: true,
  decision: { /* tracked decision */ },
  needsRetraining: boolean,
  message: string,
  timestamp: string
}
```

## Firebase Cloud Functions

### `generateRecommendations`

Triggered when a new job is created. Creates a recommendation request.

### `processRecommendations`

HTTP callable function to generate recommendations for a job.

### `scheduledModelRetraining`

Scheduled function (every 48 hours) to identify users needing model retraining.

### `processMLRetraining`

HTTP callable function to prepare training data for ML model retraining.

### `trackUserDecision`

HTTP callable function to track user decisions for ML training.

## Firestore Collections

### `user_decisions`
Stores user interaction data for ML training.

```javascript
{
  userId: string,
  helperId: string,
  jobId: string,
  action: string,
  timestamp: timestamp,
  helperFeatures: object,
  jobFeatures: object
}
```

### `recommendations`
Stores generated recommendations for jobs.

```javascript
{
  jobId: string,
  employerId: string,
  recommendedHelpers: array,
  totalHelpers: number,
  generatedAt: timestamp,
  algorithm: string
}
```

### `ml_retraining_requests`
Tracks ML model retraining requests.

```javascript
{
  userId: string,
  status: string, // 'pending', 'data_prepared', 'completed'
  requestedAt: timestamp,
  requestType: string // 'scheduled', 'manual'
}
```

### `ml_training_data`
Prepared training datasets for ML models.

```javascript
{
  userId: string,
  decisions: array,
  trainingDataCount: number,
  status: string,
  preparedAt: timestamp
}
```

## Setup Instructions

### 1. Install Dependencies

TensorFlow.js is already installed in your `package.json`.

### 2. Deploy Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### 3. Update Firestore Rules

Deploy the updated `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### 4. Initialize the System

The enhanced matching system will automatically initialize when first used. You can also manually initialize:

```javascript
import { enhancedMatchingService } from '@/lib/enhanced-matching-service';
await enhancedMatchingService.initialize();
```

### 5. Test the System

Use the existing "Find a Match" buttons in your app. The system will automatically use the enhanced matching when available.

## ML Training Process

1. **Data Collection**: User interactions are automatically tracked when they click helper cards
2. **Feature Extraction**: Helper and job data is converted to ML-ready feature vectors
3. **Model Training**: TensorFlow.js trains a neural network on user preferences
4. **Model Storage**: Models are saved in browser IndexedDB
5. **Personalization**: Future recommendations are personalized using the trained model

## Performance Considerations

- **Client-side ML**: Models run in the browser for privacy and speed
- **Caching**: Recommendations can be cached in Firestore
- **Pagination**: Results are paginated to improve performance
- **Background Processing**: ML training happens asynchronously

## Monitoring and Analytics

- User decision tracking provides insights into matching effectiveness
- Model performance metrics are stored with each trained model
- Cloud Functions logs provide system health monitoring
- Firestore analytics collection can store aggregated insights

## Future Enhancements

1. **Advanced ML Models**: Implement more sophisticated neural architectures
2. **A/B Testing**: Test different matching algorithms
3. **Real-time Updates**: Use Firestore listeners for live recommendation updates
4. **Cross-user Learning**: Aggregate learning across similar user types
5. **Advanced Compensation Rules**: GUI for creating custom rules
6. **Performance Optimization**: Server-side model inference for faster results

## Troubleshooting

### Common Issues

1. **TensorFlow.js Loading**: Ensure TensorFlow.js loads properly in browser
2. **Insufficient Training Data**: Users need at least 10 interactions for ML training
3. **Model Storage**: Check browser IndexedDB storage limits
4. **Cloud Function Timeouts**: Large helper datasets may cause timeouts

### Debug Endpoints

- `/api/test-matching`: Test the matching service with mock data
- Browser console logs provide detailed matching information
- Cloud Functions logs show server-side processing details

## Security

- All user data is encrypted in transit and at rest
- ML models are stored locally in user's browser
- Firestore rules ensure users can only access their own data
- Cloud Functions verify user authentication before processing

This enhanced matching system provides a significant upgrade to your matchmaking capabilities while maintaining privacy and performance.