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
      specializations: selectedSkills.slice(0, 3)
    } : {},
    relevantSkills: selectedSkills,
    
    // Medical Information
    hasAllergies: Math.random() > 0.8 ? 'yes' : 'no', // 20% have allergies
    allergiesDetails: Math.random() > 0.8 ? getRandomAllergy() : '',
    hasPastIllness: Math.random() > 0.9 ? 'yes' : 'no', // 10% have past illness
    illnessDetails: Math.random() > 0.9 ? 'Minor health conditions, fully recovered' : '',
    hasPhysicalDisabilities: 'no', // Assume no disabilities for seed data
    disabilityDetails: '',
    
    // Food and Dietary Preferences
    foodHandlingPreferences: {
      canCookPork: Math.random() > 0.3,
      canCookBeef: Math.random() > 0.2,
      canHandleAlcohol: Math.random() > 0.4,
      dietaryRestrictions: Math.random() > 0.8 ? ['Halal', 'Vegetarian', 'No restrictions'][Math.floor(Math.random() * 3)] : 'No restrictions'
    },
    
    // Work Preferences
    requiredOffDays: Math.floor(Math.random() * 2) + 1, // 1-2 days off per week
    preferences: {
      preferredWorkingHours: ['Full-time', 'Part-time', 'Live-in'][Math.floor(Math.random() * 3)],
      preferredFamilySize: ['Small (1-3 members)', 'Medium (4-6 members)', 'Large (7+ members)'][Math.floor(Math.random() * 3)],
      comfortableWithPets: Math.random() > 0.3,
      comfortableWithElderly: Math.random() > 0.4,
      comfortableWithChildren: Math.random() > 0.2,
      preferredLocation: ['Central', 'East', 'West', 'North', 'South'][Math.floor(Math.random() * 5)] + ' Singapore'
    },
    
    // Availability & Interview
    interview: {
      availableForInterview: true,
      preferredInterviewTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
      canStartWork: getRandomStartDate()
    },
    readiness: {
      hasValidPassport: true,
      hasWorkPermit: Math.random() > 0.5,
      needsVisaSponsorship: Math.random() > 0.6,
      canRelocate: true
    },
    otherRemarks: getRandomRemarks(),
    
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