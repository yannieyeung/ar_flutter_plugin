/**
 * Seed script to populate the database with 10 sample helpers
 * Run this script to add realistic helper data for testing and development
 */

import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Check if we have the required environment variables
  const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please ensure your .env.local file contains:');
    console.error('- FIREBASE_PROJECT_ID');
    console.error('- FIREBASE_CLIENT_EMAIL');
    console.error('- FIREBASE_PRIVATE_KEY');
    process.exit(1);
  }

  try {
    // Process the private key to handle newlines
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

// Sample data for realistic helper profiles
const COUNTRIES = [
  "Philippines",
  "Indonesia", 
  "Myanmar",
  "Sri Lanka",
  "India",
  "Bangladesh",
  "Nepal",
  "Thailand",
  "Vietnam",
  "Cambodia"
];

const CITIES = {
  "Philippines": ["Manila", "Cebu", "Davao", "Quezon City", "Makati"],
  "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang"],
  "Myanmar": ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Pathein"],
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
  "Bangladesh": ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
  "Nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar"],
  "Thailand": ["Bangkok", "Chiang Mai", "Pattaya", "Phuket", "Hua Hin"],
  "Vietnam": ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hue", "Can Tho"],
  "Cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot"]
};

const RELIGIONS = ["Christianity", "Islam", "Buddhism", "Hinduism", "Catholic", "Other"];
const EDUCATION_LEVELS = ["Primary School", "Secondary School", "High School", "Diploma", "Bachelor's Degree", "Master's Degree"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];

const SKILLS = [
  "Cooking", "Cleaning", "Childcare", "Elderly Care", "Pet Care", 
  "Laundry", "Ironing", "Gardening", "Driving", "Tutoring",
  "First Aid", "Basic Nursing", "Housekeeping", "Shopping", "Organizing"
];

const EXPERIENCE_TYPES = [
  "Domestic Helper", "Nanny", "Caregiver", "Housekeeper", 
  "Cook", "Driver", "Tutor", "Cleaner"
];

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const PROFICIENCY_LEVELS = ['basic', 'intermediate', 'advanced', 'native'];
const LANGUAGES = [
  'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
  'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
  'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean'
];
const CUISINES = ['Chinese', 'Western', 'Malay', 'Indian', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indonesian', 'Filipino', 'Italian', 'Mediterranean'];
const IMPORTANCE_LEVELS = ['low', 'medium', 'high', 'critical'];
const HOUSE_TYPES = ['Studio Apartment', '1-2 Bedroom Apartment', '3+ Bedroom Apartment', '2-Storey House', '3+ Storey House', 'Condominium', 'Landed Property', 'HDB Flat'];
const WORK_COUNTRIES = ['Singapore', 'Hong Kong', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Taiwan', 'Malaysia'];

// Task categories for detailed experience
const EXPERIENCE_TASKS = {
  careOfInfant: ['feeding', 'diaper_changing', 'bathing', 'sleep_training', 'playtime', 'development_activities', 'safety_monitoring'],
  careOfChildren: ['homework_help', 'school_pickup_dropoff', 'meal_preparation', 'playtime', 'extracurricular_activities', 'bedtime_routine', 'tutoring'],
  careOfDisabled: ['mobility_assistance', 'personal_care', 'communication_support', 'therapy_assistance', 'medication_management', 'special_equipment_use'],
  careOfOldAge: ['mobility_assistance', 'medication_management', 'personal_hygiene', 'companionship', 'meal_assistance', 'medical_appointments'],
  generalHousework: ['general_cleaning', 'deep_cleaning', 'laundry', 'ironing', 'organizing', 'grocery_shopping', 'home_maintenance'],
  cooking: ['meal_planning', 'grocery_shopping', 'food_preparation', 'special_diets', 'baking', 'food_safety']
};

const DISABILITY_TYPES = ['Physical disabilities', 'Intellectual disabilities', 'Autism', 'Multiple disabilities'];
const ELDERLY_SPECIALTIES = ['Dementia care', 'Post-surgery care', 'Mobility assistance', 'Medication management'];
const INFANT_AGES = ['0-3 months', '3-6 months', '6-12 months'];
const CHILDREN_AGES = ['1-3 years', '4-6 years', '7-9 years', '10-12 years'];

// Generate realistic helper data
function generateHelperData(index) {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const city = CITIES[country][Math.floor(Math.random() * CITIES[country].length)];
  const firstName = getRandomFirstName(country);
  const lastName = getRandomLastName(country);
  const fullName = `${firstName} ${lastName}`;
  
  // Generate birth date (age between 21-50)
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - (21 + Math.floor(Math.random() * 30));
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1;
  const dateOfBirth = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  
  // Generate experience (0-15 years)
  const yearsOfExperience = Math.floor(Math.random() * 16);
  const hasExperience = yearsOfExperience > 0;
  
  // Select random skills (3-8 skills per helper)
  const selectedSkills = SKILLS.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 6));
  
  // Generate contact number based on country
  const contactNumber = generatePhoneNumber(country);
  
  return {
    userType: 'individual_helper',
    
    // Personal Information
    fullName: fullName,
    name: fullName, // For consistency with registration
    dateOfBirth: dateOfBirth,
    nationality: country,
    countryOfBirth: country,
    cityOfBirth: city,
    religion: RELIGIONS[Math.floor(Math.random() * RELIGIONS.length)],
    height: `${150 + Math.floor(Math.random() * 30)} cm`, // 150-180 cm
    weight: `${45 + Math.floor(Math.random() * 25)} kg`, // 45-70 kg
    educationLevel: EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)],
    numberOfSiblings: Math.floor(Math.random() * 8), // 0-7 siblings
    maritalStatus: MARITAL_STATUS[Math.floor(Math.random() * MARITAL_STATUS.length)],
    numberOfChildren: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0, // 30% chance of having children
    residentialAddress: `${Math.floor(Math.random() * 999) + 1} ${getRandomStreetName()}, ${city}, ${country}`,
    repatriationPort: city,
    contactNumber: contactNumber,
    
    // Experience and Skills
    hasBeenHelperBefore: hasExperience ? 'yes' : 'no',
    experience: hasExperience ? {
      totalYears: yearsOfExperience,
      previousJobs: generateExperienceHistory(yearsOfExperience),
      specializations: selectedSkills.slice(0, 3),
      ...generateDetailedExperience(hasExperience, yearsOfExperience)
    } : {},
    relevantSkills: hasExperience ? selectedSkills : selectedSkills.join(', '),
    languagesSpoken: hasExperience ? '' : LANGUAGES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1).join(', '),
    
    // Medical Information
    hasAllergies: Math.random() > 0.8 ? 'yes' : 'no', // 20% have allergies
    allergiesDetails: Math.random() > 0.8 ? getRandomAllergy() : '',
    hasPastIllness: Math.random() > 0.9 ? 'yes' : 'no', // 10% have past illness
    illnessDetails: Math.random() > 0.9 ? 'Minor health conditions, fully recovered' : '',
    hasPhysicalDisabilities: 'no', // Assume no disabilities for seed data
    disabilityDetails: '',
    disabilitiesDetails: '', // Match form field name
    
    // Food and Dietary Preferences (match form structure - array format)
    foodHandlingPreferences: (() => {
      const prefs = [];
      if (Math.random() > 0.7) prefs.push('no_pork');
      if (Math.random() > 0.8) prefs.push('no_beef');
      if (Math.random() > 0.6) prefs.push('no_alcohol');
      if (Math.random() > 0.9) prefs.push('vegetarian_only');
      if (Math.random() > 0.8) prefs.push('halal_only');
      if (Math.random() > 0.95) prefs.push('kosher_familiar');
      return prefs;
    })(),
    
    // Work Preferences
    requiredOffDays: Math.floor(Math.random() * 2) + 1, // 1-2 days off per week
    preferences: {
      preferredWorkingHours: ['Full-time', 'Part-time', 'Live-in'][Math.floor(Math.random() * 3)],
      preferredFamilySize: ['Small (1-3 members)', 'Medium (4-6 members)', 'Large (7+ members)'][Math.floor(Math.random() * 3)],
      comfortableWithPets: Math.random() > 0.3,
      comfortableWithElderly: Math.random() > 0.4,
      comfortableWithChildren: Math.random() > 0.2,
      preferredLocation: ['Central', 'East', 'West', 'North', 'South'][Math.floor(Math.random() * 5)] + ' Singapore',
      ...generateDetailedPreferences()
    },
    
    // Salary Expectations
    expectations: generateSalaryExpectations(),
    
    // Availability & Interview
    interview: {
      availableForInterview: true,
      preferredInterviewTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
      canStartWork: getRandomStartDate(),
      ...generateEnhancedInterview()
    },
    readiness: {
      hasValidPassport: true,
      hasWorkPermit: Math.random() > 0.5,
      needsVisaSponsorship: Math.random() > 0.6,
      canRelocate: true,
      ...generateEnhancedReadiness()
    },
    otherRemarks: getRandomRemarks(),
    otherMedicalRemarks: Math.random() > 0.8 ? getRandomRemarks() : '',
    
    // ML Profile for AI matching
    mlProfile: {
      skillsVector: generateSkillsVector(selectedSkills),
      experienceLevel: categorizeExperience(yearsOfExperience),
      personalityTraits: generatePersonalityTraits(),
      workPreferences: generateWorkPreferencesVector(),
      lastUpdated: new Date().toISOString()
    },
    
    // Registration and Profile Status
    isRegistrationComplete: true,
    registrationCompletedAt: new Date().toISOString(),
    profileCompleteness: 85 + Math.floor(Math.random() * 15), // 85-100% complete
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Account Status
    isActive: true,
    isVerified: Math.random() > 0.3, // 70% are verified
    verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
    
    // Contact and Email (generated)
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    
    // Photo placeholders (would normally be uploaded)
    profilePicture: null,
    portfolioPhotos: [],
    certificates: [],
    identityDocuments: [],
    experienceProof: []
  };
}

// Helper functions for generating realistic data
function getRandomFirstName(country) {
  const names = {
    "Philippines": ["Maria", "Ana", "Rosa", "Carmen", "Luz", "Elena", "Grace", "Joy", "Faith", "Hope"],
    "Indonesia": ["Sari", "Dewi", "Indira", "Putri", "Ratna", "Wati", "Ningsih", "Fitri", "Yanti", "Lestari"],
    "Myanmar": ["Thida", "Moe", "Aye", "Khin", "Mya", "Nwe", "Phyu", "Zin", "Htay", "Myint"],
    "Sri Lanka": ["Kumari", "Priya", "Sandya", "Niluka", "Chamari", "Dilani", "Rashika", "Malini", "Nayani", "Samanthi"],
    "India": ["Priya", "Sunita", "Kavita", "Meera", "Radha", "Lakshmi", "Geeta", "Sita", "Maya", "Rekha"],
    "Bangladesh": ["Fatima", "Rashida", "Nasreen", "Sultana", "Rahima", "Salma", "Ruma", "Shireen", "Rehana", "Nazma"],
    "Nepal": ["Sita", "Gita", "Rita", "Bina", "Mina", "Lila", "Kamala", "Shanti", "Purnima", "Sarita"],
    "Thailand": ["Siriporn", "Niran", "Malee", "Suda", "Wipada", "Pensri", "Duangjai", "Orathai", "Sumalee", "Anchalee"],
    "Vietnam": ["Linh", "Hoa", "Mai", "Lan", "Huong", "Thuy", "Van", "Nga", "Hanh", "Phuong"],
    "Cambodia": ["Sophea", "Channary", "Bopha", "Sreypov", "Dara", "Kanya", "Mealea", "Pisey", "Soriya", "Vanna"]
  };
  const countryNames = names[country] || names["Philippines"];
  return countryNames[Math.floor(Math.random() * countryNames.length)];
}

function getRandomLastName(country) {
  const surnames = {
    "Philippines": ["Santos", "Reyes", "Cruz", "Bautista", "Garcia", "Gonzales", "Lopez", "Flores", "Ramos", "Mendoza"],
    "Indonesia": ["Sari", "Putri", "Wati", "Dewi", "Handayani", "Lestari", "Maharani", "Pratiwi", "Safitri", "Utami"],
    "Myanmar": ["Htun", "Aung", "Win", "Thant", "Myint", "Oo", "Kyaw", "Hlaing", "Zaw", "Moe"],
    "Sri Lanka": ["Fernando", "Silva", "Perera", "Jayawardena", "Gunasekera", "Wickramasinghe", "Rajapaksa", "Mendis", "Karunaratne", "Bandara"],
    "India": ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Jain", "Agarwal", "Bansal", "Mittal", "Chopra"],
    "Bangladesh": ["Rahman", "Ahmed", "Ali", "Khan", "Hossain", "Islam", "Begum", "Khatun", "Aktar", "Sultana"],
    "Nepal": ["Shrestha", "Pradhan", "Maharjan", "Shakya", "Tamang", "Gurung", "Rai", "Limbu", "Magar", "Thapa"],
    "Thailand": ["Saetang", "Jaidee", "Suwan", "Thong", "Kaew", "Chai", "Porn", "Wang", "Boon", "Som"],
    "Vietnam": ["Nguyen", "Tran", "Le", "Pham", "Hoang", "Huynh", "Vo", "Vu", "Dang", "Bui"],
    "Cambodia": ["Sok", "Chea", "Meas", "Heng", "Lim", "Keo", "Ros", "San", "Thy", "Vong"]
  };
  const countrySurnames = surnames[country] || surnames["Philippines"];
  return countrySurnames[Math.floor(Math.random() * countrySurnames.length)];
}

function generatePhoneNumber(country) {
  const prefixes = {
    "Philippines": "+63",
    "Indonesia": "+62", 
    "Myanmar": "+95",
    "Sri Lanka": "+94",
    "India": "+91",
    "Bangladesh": "+880",
    "Nepal": "+977",
    "Thailand": "+66",
    "Vietnam": "+84",
    "Cambodia": "+855"
  };
  const prefix = prefixes[country] || "+63";
  const number = Math.floor(Math.random() * 900000000) + 100000000; // 9-digit number
  return `${prefix}${number}`;
}

function getRandomStreetName() {
  const streets = [
    "Main Street", "Oak Avenue", "Pine Road", "Maple Drive", "Cedar Lane",
    "First Street", "Second Avenue", "Park Road", "Hill Drive", "Garden Lane",
    "Market Street", "Church Road", "School Avenue", "Station Drive", "River Lane"
  ];
  return streets[Math.floor(Math.random() * streets.length)];
}

function getRandomAllergy() {
  const allergies = [
    "Dust and pollen allergies",
    "Seafood allergies", 
    "Nut allergies",
    "Lactose intolerance",
    "Seasonal allergies",
    "Pet dander sensitivity"
  ];
  return allergies[Math.floor(Math.random() * allergies.length)];
}

function generateExperienceHistory(years) {
  const jobs = [];
  let currentYear = new Date().getFullYear();
  let remainingYears = years;
  
  while (remainingYears > 0) {
    const jobYears = Math.min(remainingYears, Math.floor(Math.random() * 4) + 1); // 1-4 years per job
    jobs.push({
      position: EXPERIENCE_TYPES[Math.floor(Math.random() * EXPERIENCE_TYPES.length)],
      duration: `${jobYears} year${jobYears > 1 ? 's' : ''}`,
      location: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      startYear: currentYear - remainingYears,
      endYear: currentYear - (remainingYears - jobYears),
      responsibilities: generateJobResponsibilities()
    });
    remainingYears -= jobYears;
  }
  
  return jobs;
}

function generateJobResponsibilities() {
  const responsibilities = [
    "General housekeeping and cleaning",
    "Meal preparation and cooking",
    "Childcare and supervision",
    "Elderly care assistance",
    "Laundry and ironing",
    "Shopping and errands",
    "Pet care",
    "Garden maintenance"
  ];
  return responsibilities.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));
}

function getRandomStartDate() {
  const today = new Date();
  const futureDate = new Date(today.getTime() + (Math.random() * 90 * 24 * 60 * 60 * 1000)); // Within 90 days
  return futureDate.toISOString().split('T')[0];
}

function getRandomRemarks() {
  const remarks = [
    "Hardworking and reliable with excellent references",
    "Patient and caring, especially good with children",
    "Experienced in caring for elderly family members", 
    "Excellent cooking skills, can prepare various cuisines",
    "Very organized and detail-oriented in housework",
    "Friendly personality and good communication skills",
    "Quick learner and adaptable to family routines",
    "Trustworthy and honest with strong work ethics"
  ];
  return remarks[Math.floor(Math.random() * remarks.length)];
}

function generateSkillsVector(skills) {
  // Create a vector representation of skills for ML matching
  const skillsMap = {};
  SKILLS.forEach(skill => {
    skillsMap[skill] = skills.includes(skill) ? 1 : 0;
  });
  return skillsMap;
}

function categorizeExperience(years) {
  if (years === 0) return 'beginner';
  if (years <= 2) return 'entry-level';
  if (years <= 5) return 'intermediate';
  if (years <= 10) return 'experienced';
  return 'expert';
}

function generatePersonalityTraits() {
  const traits = ['patient', 'energetic', 'organized', 'friendly', 'reliable', 'creative', 'calm', 'attentive'];
  return traits.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));
}

function generateWorkPreferencesVector() {
  return {
    livein: Math.random() > 0.5,
    parttime: Math.random() > 0.7,
    weekends: Math.random() > 0.6,
    overtime: Math.random() > 0.4,
    travel: Math.random() > 0.8
  };
}

// Generate detailed experience for experienced helpers
function generateDetailedExperience(hasExperience, yearsOfExperience) {
  if (!hasExperience || yearsOfExperience === 0) {
    return {};
  }

  const experienceCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
  const experience = {};
  
  // Randomly select 2-5 categories to have experience in
  const numCategories = Math.floor(Math.random() * 4) + 2; // 2-5 categories
  const selectedCategories = experienceCategories.sort(() => 0.5 - Math.random()).slice(0, numCategories);
  
  selectedCategories.forEach(category => {
    const categoryYears = Math.floor(Math.random() * yearsOfExperience) + 1;
    const yearsFrom = Math.max(0, categoryYears - 2);
    const yearsTo = categoryYears;
    
    experience[category] = {
      hasExperience: true,
      experienceLevel: EXPERIENCE_LEVELS[Math.floor(Math.random() * EXPERIENCE_LEVELS.length)],
      yearsFrom: yearsFrom.toString(),
      yearsTo: yearsTo.toString(),
      specificTasks: EXPERIENCE_TASKS[category].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2)
    };

    // Add cuisine data for cooking
    if (category === 'cooking') {
      experience[category].cuisines = CUISINES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
    }
  });

  // Generate languages spoken
  const numLanguages = Math.floor(Math.random() * 3) + 1; // 1-3 languages
  const selectedLanguages = LANGUAGES.sort(() => 0.5 - Math.random()).slice(0, numLanguages);
  
  experience.languagesSpoken = selectedLanguages.map(language => ({
    language,
    proficiency: PROFICIENCY_LEVELS[Math.floor(Math.random() * PROFICIENCY_LEVELS.length)],
    canTeach: Math.random() > 0.7 // 30% chance can teach children
  }));

  // Add other skills
  experience.otherSkills = [
    'First Aid certified', 'Pet care experience', 'Driving license', 
    'Massage therapy', 'Tutoring experience', 'Basic computer skills'
  ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1).join(', ');

  return experience;
}

// Generate detailed preferences
function generateDetailedPreferences() {
  const preferences = {};
  
  // Care preferences
  const careCategories = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge'];
  careCategories.forEach(category => {
    const willing = ['yes', 'maybe', 'no'][Math.floor(Math.random() * 3)];
    preferences[category] = {
      willing,
      importance: IMPORTANCE_LEVELS[Math.floor(Math.random() * IMPORTANCE_LEVELS.length)],
      maxNumber: willing === 'yes' ? Math.floor(Math.random() * 4) + 1 : 0
    };

    // Add specific preferences based on category
    if (category === 'careOfInfant' && willing === 'yes') {
      preferences[category].preferredAges = INFANT_AGES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    }
    if (category === 'careOfChildren' && willing === 'yes') {
      preferences[category].preferredAges = CHILDREN_AGES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    }
    if (category === 'careOfDisabled' && willing === 'yes') {
      preferences[category].preferredTypes = DISABILITY_TYPES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    }
    if (category === 'careOfOldAge' && willing === 'yes') {
      preferences[category].specialties = ELDERLY_SPECIALTIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    }
  });

  // Housework preferences
  preferences.generalHousework = {
    willing: ['yes', 'maybe', 'no'][Math.floor(Math.random() * 3)],
    importance: IMPORTANCE_LEVELS[Math.floor(Math.random() * IMPORTANCE_LEVELS.length)],
    preferredHouseSizes: HOUSE_TYPES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2)
  };

  // Cooking preferences
  preferences.cooking = {
    willing: ['yes', 'maybe', 'no'][Math.floor(Math.random() * 3)],
    importance: IMPORTANCE_LEVELS[Math.floor(Math.random() * IMPORTANCE_LEVELS.length)],
    preferredCuisines: CUISINES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2)
  };

  // Work environment preferences
  preferences.workEnvironment = {
    liveInPreference: ['live_in_only', 'live_out_only', 'either'][Math.floor(Math.random() * 3)],
    petFriendly: ['love_pets', 'comfortable', 'no_pets'][Math.floor(Math.random() * 3)]
  };

  // Location preferences
  preferences.location = {
    preferredCountries: WORK_COUNTRIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
  };

  return preferences;
}

// Generate salary expectations
function generateSalaryExpectations() {
  const minimumAmount = (Math.floor(Math.random() * 10) + 8) * 100; // 800-1700
  const preferredAmount = minimumAmount + (Math.floor(Math.random() * 5) + 1) * 100; // 100-500 more than minimum
  
  return {
    salary: {
      minimumAmount: minimumAmount.toString(),
      preferredAmount: preferredAmount.toString(),
      negotiable: Math.random() > 0.4, // 60% are negotiable
      performanceBonusExpected: Math.random() > 0.6 // 40% want bonuses
    }
  };
}

// Generate enhanced readiness data
function generateEnhancedReadiness() {
  const hasValidPassport = Math.random() > 0.2; // 80% have valid passport
  const canStartWork = ['immediately', 'within_month', 'after_date'][Math.floor(Math.random() * 3)];
  const visaStatus = ['first_time', 'valid_permit', 'expired_permit', 'transfer_ready', 'citizen_pr'][Math.floor(Math.random() * 5)];
  
  const readiness = {
    hasValidPassport: hasValidPassport ? 'yes' : 'no',
    canStartWork,
    visaStatus
  };

  if (hasValidPassport) {
    // Generate passport expiry 1-5 years from now
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 5) + 1);
    readiness.passportExpiry = expiryDate.toISOString().split('T')[0];
  }

  if (canStartWork === 'after_date') {
    // Generate start date 1-90 days from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90) + 1);
    readiness.startDate = startDate.toISOString().split('T')[0];
  }

  return readiness;
}

// Generate enhanced interview preferences
function generateEnhancedInterview() {
  const availability = ['immediate', 'weekdays_only', 'weekends_only', 'after_date'][Math.floor(Math.random() * 4)];
  const means = ['whatsapp_video_call', 'zoom_video_call', 'voice_call', 'face_to_face', 'others'][Math.floor(Math.random() * 5)];
  
  const interview = {
    availability,
    means
  };

  if (availability === 'after_date') {
    // Generate availability date 1-30 days from now
    const availabilityDate = new Date();
    availabilityDate.setDate(availabilityDate.getDate() + Math.floor(Math.random() * 30) + 1);
    interview.availabilityDate = availabilityDate.toISOString().split('T')[0];
  }

  return interview;
}

// Main seeding function
async function seedHelpers() {
  console.log('🌱 Starting to seed helpers data...');
  
  try {
    const batch = db.batch();
    const helpers = [];
    
    // Generate 10 helper profiles
    for (let i = 0; i < 10; i++) {
      const helperData = generateHelperData(i);
      const helperId = uuidv4(); // Generate unique ID
      
      // Add to users collection
      const userRef = db.collection('users').doc(helperId);
      batch.set(userRef, helperData);
      
      helpers.push({
        id: helperId,
        name: helperData.fullName,
        country: helperData.nationality,
        experience: helperData.experience?.totalYears || 0
      });
      
      console.log(`✅ Generated helper ${i + 1}: ${helperData.fullName} from ${helperData.nationality}`);
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log('\n🎉 Successfully seeded 10 helpers to the database!');
    console.log('\n📋 Summary of created helpers:');
    helpers.forEach((helper, index) => {
      console.log(`${index + 1}. ${helper.name} (${helper.country}) - ${helper.experience} years experience`);
    });
    
    console.log('\n💡 You can now view these helpers in your app dashboard.');
    
  } catch (error) {
    console.error('❌ Error seeding helpers:', error);
    throw error;
  }
}

// Run the seeding script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedHelpers()
    .then(() => {
      console.log('✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedHelpers, generateHelperData };