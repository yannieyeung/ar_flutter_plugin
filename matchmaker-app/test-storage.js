#!/usr/bin/env node

// Firebase Storage Connectivity Test
// Run this with: node test-storage.js

console.log('🔥 Firebase Storage Connectivity Test');
console.log('=====================================');

// Test 1: Check if storage bucket is accessible
const testStorageConnectivity = async () => {
  console.log('\n🌐 Test 1: Storage Bucket Connectivity');
  console.log('--------------------------------------');
  
  const bucketUrl = 'https://firebasestorage.googleapis.com/v0/b/31671.firebasestorage.app/o';
  
  try {
    const response = await fetch(bucketUrl);
    console.log(`✅ Storage bucket accessible: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Firebase Storage is enabled and accessible');
    } else if (response.status === 404) {
      console.log('❌ Storage bucket not found - Storage may not be enabled');
      console.log('👉 Enable it at: https://console.firebase.google.com/project/31671/storage');
    } else if (response.status === 403) {
      console.log('⚠️  Storage bucket exists but access denied');
      console.log('👉 Check storage rules at: https://console.firebase.google.com/project/31671/storage/rules');
    }
  } catch (error) {
    console.log('❌ Network error accessing storage:', error.message);
    console.log('👉 Check your internet connection and Firebase project status');
  }
};

// Test 2: Check CORS with a preflight request
const testCORS = async () => {
  console.log('\n🛡️  Test 2: CORS Configuration');
  console.log('------------------------------');
  
  try {
    const response = await fetch('https://firebasestorage.googleapis.com/v0/b/31671.firebasestorage.app/o', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    
    console.log(`✅ CORS preflight response: ${response.status}`);
    
    const corsHeaders = response.headers.get('access-control-allow-origin');
    if (corsHeaders) {
      console.log('✅ CORS headers present:', corsHeaders);
    } else {
      console.log('❌ No CORS headers found');
      console.log('👉 Configure CORS: gsutil cors set cors.json gs://31671.firebasestorage.app');
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
};

// Test 3: Environment variables
const testEnvironmentVars = () => {
  console.log('\n🔧 Test 3: Environment Variables');
  console.log('---------------------------------');
  
  require('dotenv').config({ path: '.env.local' });
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  let allSet = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    const isSet = value && value !== 'your-api-key-here' && value !== 'your-messaging-sender-id' && value !== 'your-app-id';
    
    console.log(`${isSet ? '✅' : '❌'} ${varName}: ${isSet ? 'SET' : 'MISSING'}`);
    
    if (!isSet) allSet = false;
  });
  
  if (allSet) {
    console.log('✅ All environment variables configured');
  } else {
    console.log('❌ Some environment variables missing');
    console.log('👉 Update .env.local with values from: https://console.firebase.google.com/project/31671/settings/general');
  }
  
  return allSet;
};

// Test 4: Firebase project connectivity
const testFirebaseProject = async () => {
  console.log('\n🎯 Test 4: Firebase Project Status');
  console.log('-----------------------------------');
  
  try {
    // Test Firebase Realtime Database endpoint (always available)
    const response = await fetch('https://31671-default-rtdb.firebaseio.com/.json');
    console.log(`✅ Firebase project accessible: ${response.status}`);
    
    if (response.status === 404) {
      console.log('⚠️  Project may not exist or Realtime Database not enabled');
    }
  } catch (error) {
    console.log('❌ Cannot reach Firebase project:', error.message);
    console.log('👉 Verify project ID "31671" is correct');
  }
};

// Test 5: Storage rules validation
const testStorageRules = async () => {
  console.log('\n📋 Test 5: Storage Rules Check');
  console.log('------------------------------');
  
  console.log('Manual checks required:');
  console.log('1. 👉 Go to: https://console.firebase.google.com/project/31671/storage/rules');
  console.log('2. 👉 Ensure rules allow authenticated users:');
  console.log(`
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
  `);
  console.log('3. 👉 Click "Publish" to apply rules');
};

// Run all tests
const runAllTests = async () => {
  await testStorageConnectivity();
  await testCORS();
  const envVarsOk = testEnvironmentVars();
  await testFirebaseProject();
  await testStorageRules();
  
  console.log('\n📊 Summary');
  console.log('===========');
  
  if (envVarsOk) {
    console.log('Next steps:');
    console.log('1. ✅ Complete environment variable setup');
    console.log('2. 🔧 Enable Firebase Storage (if not already enabled)');
    console.log('3. 📋 Configure Storage rules');
    console.log('4. 🌐 Set up CORS');
    console.log('5. 🚀 Test file upload in your app');
  } else {
    console.log('❌ Fix environment variables first, then run this test again');
  }
  
  console.log('\n📚 Full debug guide: FIREBASE_STORAGE_DEBUG.md');
};

// Run the tests
runAllTests().catch(console.error);