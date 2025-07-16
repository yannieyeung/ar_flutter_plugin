#!/usr/bin/env node

// Create Supabase Storage Buckets Script
// Run this after setting up your Supabase project

console.log('🪣 Creating Supabase Storage Buckets');
console.log('=====================================');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('');
  console.error('📋 How to get these:');
  console.error('1. Go to https://supabase.com');
  console.error('2. Create a new project');
  console.error('3. Go to Settings → API');
  console.error('4. Copy Project URL and anon public key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Required buckets for the hybrid approach
const requiredBuckets = [
  {
    name: 'profile-pictures',
    description: 'User profile pictures',
    public: true
  },
  {
    name: 'portfolio-photos',
    description: 'Portfolio and work samples',
    public: true
  },
  {
    name: 'certificates',
    description: 'Certificates and qualifications',
    public: false
  },
  {
    name: 'identity-documents',
    description: 'Identity verification documents',
    public: false
  },
  {
    name: 'experience-proof',
    description: 'Work experience documentation',
    public: false
  }
];

const createBuckets = async () => {
  console.log('\n🔍 Checking existing buckets...');
  
  try {
    // List existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Failed to list buckets:', listError.message);
      console.error('   Make sure your Supabase credentials are correct');
      return;
    }
    
    console.log(`📦 Found ${existingBuckets.length} existing buckets`);
    
    // Check each required bucket
    for (const bucket of requiredBuckets) {
      const exists = existingBuckets.some(b => b.name === bucket.name);
      
      if (exists) {
        console.log(`✅ ${bucket.name}: Already exists`);
      } else {
        console.log(`🔄 Creating bucket: ${bucket.name}`);
        
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png', 
            'image/webp',
            'application/pdf'
          ],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`✅ ${bucket.name}: Already exists`);
          } else {
            console.error(`❌ ${bucket.name}: Failed to create - ${error.message}`);
          }
        } else {
          console.log(`✅ ${bucket.name}: Created successfully`);
        }
      }
    }
    
    console.log('\n📋 Final bucket list:');
    const { data: finalBuckets } = await supabase.storage.listBuckets();
    finalBuckets.forEach(bucket => {
      const isRequired = requiredBuckets.some(rb => rb.name === bucket.name);
      const icon = isRequired ? '✅' : '📦';
      console.log(`${icon} ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    console.log('\n🎉 Bucket setup complete!');
    console.log('');
    console.log('📋 What each bucket is for:');
    requiredBuckets.forEach(bucket => {
      console.log(`   • ${bucket.name}: ${bucket.description}`);
    });
    
    console.log('\n🚀 Next steps:');
    console.log('1. Try uploading images in your app');
    console.log('2. Images will be stored in these buckets');
    console.log('3. URLs will be saved to Firestore');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('   Check your internet connection and Supabase credentials');
  }
};

const testConnection = async () => {
  console.log('\n🔍 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('');
      console.error('🔧 Troubleshooting:');
      console.error('1. Check NEXT_PUBLIC_SUPABASE_URL is correct');
      console.error('2. Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct');
      console.error('3. Make sure your Supabase project is active');
      console.error('4. Try refreshing your anon key in Supabase Settings → API');
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📦 Current project: ${supabaseUrl}`);
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
};

// Main execution
const main = async () => {
  const connected = await testConnection();
  
  if (connected) {
    await createBuckets();
  } else {
    console.log('\n❌ Cannot create buckets without valid connection');
    console.log('   Please fix the connection issues first');
  }
  
  console.log('\n' + '='.repeat(50));
};

main().catch(console.error);