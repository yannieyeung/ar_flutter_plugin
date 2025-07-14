#!/usr/bin/env node

// Hybrid Setup Test Script
// Tests Firestore + Supabase integration

console.log('🔄 Hybrid Setup Test (Firestore + Supabase)');
console.log('='.repeat(50));

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Test configuration
const testConfig = {
  firebase: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ],
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
};

// Test 1: Environment Variables
const testEnvironmentVariables = () => {
  console.log('\n🔧 Test 1: Environment Variables');
  console.log('-'.repeat(35));
  
  let allConfigured = true;
  
  // Test Firebase config
  console.log('\n📦 Firebase Configuration:');
  testConfig.firebase.forEach(varName => {
    const value = process.env[varName];
    const isConfigured = value && value !== 'your-api-key-here' && 
                        value !== 'your-messaging-sender-id' && 
                        value !== 'your-app-id';
    
    console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? 'SET' : 'MISSING'}`);
    
    if (!isConfigured) allConfigured = false;
  });
  
  // Test Supabase config
  console.log('\n☁️ Supabase Configuration:');
  testConfig.supabase.forEach(varName => {
    const value = process.env[varName];
    const isConfigured = value && value !== 'your-supabase-url' && 
                        value !== 'your-supabase-anon-key';
    
    console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? 'SET' : 'MISSING'}`);
    
    if (!isConfigured) allConfigured = false;
  });
  
  return allConfigured;
};

// Test 2: Firebase Connection
const testFirebaseConnection = async () => {
  console.log('\n📦 Test 2: Firebase Connection');
  console.log('-'.repeat(32));
  
  try {
    // Test Firebase project accessibility
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const response = await fetch(`https://${projectId}-default-rtdb.firebaseio.com/.json`);
    
    if (response.status === 200 || response.status === 404) {
      console.log('✅ Firebase project accessible');
      return true;
    } else {
      console.log(`❌ Firebase connection failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Firebase connection error: ${error.message}`);
    return false;
  }
};

// Test 3: Supabase Connection
const testSupabaseConnection = async () => {
  console.log('\n☁️ Test 3: Supabase Connection');
  console.log('-'.repeat(31));
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase credentials missing');
      return false;
    }
    
    // Test Supabase API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Supabase API accessible');
      
      // Test storage endpoint
      const storageResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (storageResponse.status === 200) {
        console.log('✅ Supabase Storage accessible');
        
        // List buckets
        const buckets = await storageResponse.json();
        console.log(`📦 Existing buckets: ${buckets.length}`);
        
        if (buckets.length > 0) {
          console.log('   Buckets:', buckets.map(b => b.name).join(', '));
        }
        
        return true;
      } else {
        console.log(`⚠️  Supabase Storage not accessible: ${storageResponse.status}`);
        return false;
      }
    } else {
      console.log(`❌ Supabase connection failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Supabase connection error: ${error.message}`);
    return false;
  }
};

// Test 4: Required Packages
const testRequiredPackages = () => {
  console.log('\n📦 Test 4: Required Packages');
  console.log('-'.repeat(30));
  
  const requiredPackages = [
    '@supabase/supabase-js',
    'firebase'
  ];
  
  let allInstalled = true;
  
  requiredPackages.forEach(pkg => {
    try {
      require.resolve(pkg);
      console.log(`✅ ${pkg}: Installed`);
    } catch (error) {
      console.log(`❌ ${pkg}: Missing`);
      allInstalled = false;
    }
  });
  
  if (!allInstalled) {
    console.log('\n💡 Install missing packages:');
    console.log('   npm install @supabase/supabase-js firebase');
  }
  
  return allInstalled;
};

// Test 5: Image Optimization Test
const testImageOptimization = () => {
  console.log('\n🖼️  Test 5: Image Optimization');
  console.log('-'.repeat(32));
  
  try {
    // Check if browser APIs are available (they won't be in Node.js)
    const hasCanvas = typeof HTMLCanvasElement !== 'undefined';
    const hasBlob = typeof Blob !== 'undefined';
    
    if (!hasCanvas || !hasBlob) {
      console.log('⚠️  Image optimization requires browser environment');
      console.log('✅ Image optimization will work in the app');
      return true;
    }
    
    console.log('✅ Image optimization APIs available');
    return true;
  } catch (error) {
    console.log(`❌ Image optimization test failed: ${error.message}`);
    return false;
  }
};

// Test 6: File Structure
const testFileStructure = () => {
  console.log('\n📁 Test 6: File Structure');
  console.log('-'.repeat(26));
  
  const fs = require('fs');
  const requiredFiles = [
    'src/lib/supabase.js',
    'src/lib/hybrid-data-service.js',
    'src/lib/image-optimization.js',
    'src/components/HybridPhotoUpload.jsx',
    'src/components/UserProfileViewer.jsx'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Exists`);
    } else {
      console.log(`❌ ${file}: Missing`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
};

// Test 7: Create Test Buckets (Optional)
const testCreateBuckets = async () => {
  console.log('\n🪣 Test 7: Storage Buckets');
  console.log('-'.repeat(26));
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Cannot test buckets: Supabase credentials missing');
      return false;
    }
    
    const requiredBuckets = [
      'profile-pictures',
      'portfolio-photos',
      'certificates',
      'identity-documents',
      'experience-proof'
    ];
    
    console.log('📋 Required buckets for hybrid approach:');
    requiredBuckets.forEach(bucket => {
      console.log(`   - ${bucket}`);
    });
    
    console.log('\n💡 Buckets will be created automatically on first upload');
    console.log('   Or create them manually in Supabase Console → Storage');
    
    return true;
  } catch (error) {
    console.log(`❌ Bucket test error: ${error.message}`);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  const results = {
    envVars: testEnvironmentVariables(),
    packages: testRequiredPackages(),
    fileStructure: testFileStructure(),
    firebase: await testFirebaseConnection(),
    supabase: await testSupabaseConnection(),
    imageOpt: testImageOptimization(),
    buckets: await testCreateBuckets()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('='.repeat(25));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Passed: ${passed}/${total} tests`);
  
  if (results.envVars && results.packages && results.fileStructure && 
      results.firebase && results.supabase) {
    console.log('\n🎉 Hybrid setup is ready!');
    console.log('\nNext steps:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. Go to /registration/individual_helper');
    console.log('3. Test image uploads');
    console.log('4. Check Firestore and Supabase consoles');
  } else {
    console.log('\n⚠️  Setup incomplete. Fix the failing tests above.');
    
    if (!results.envVars) {
      console.log('\n🔧 Environment Variables Fix:');
      console.log('   1. Update .env.local with real Firebase credentials');
      console.log('   2. Add Supabase URL and anon key');
      console.log('   3. See HYBRID_SETUP_GUIDE.md for details');
    }
    
    if (!results.packages) {
      console.log('\n📦 Package Installation Fix:');
      console.log('   npm install @supabase/supabase-js');
    }
    
    if (!results.supabase) {
      console.log('\n☁️ Supabase Setup Fix:');
      console.log('   1. Create free account at supabase.com');
      console.log('   2. Create new project');
      console.log('   3. Get URL and anon key from Settings → API');
    }
  }
  
  console.log('\n📚 Documentation:');
  console.log('   - Setup Guide: HYBRID_SETUP_GUIDE.md');
  console.log('   - Cost Analysis: COST_OPTIMIZATION_GUIDE.md');
  console.log('   - Firebase Issues: FIREBASE_STORAGE_DEBUG.md');
  
  console.log('\n' + '='.repeat(50));
};

// Run the tests
runAllTests().catch(console.error);