import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('Make sure these are set in your .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Define buckets to create
const buckets = [
  {
    id: 'profile-images',
    name: 'Profile Images',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  {
    id: 'documents',
    name: 'Documents',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  {
    id: 'company-logos',
    name: 'Company Logos',
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  }
];

async function createBucket(bucket) {
  try {
    console.log(`🪣 Creating bucket: ${bucket.id}`);
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Bucket ${bucket.id} already exists`);
        return true;
      }
      throw error;
    }

    console.log(`✅ Successfully created bucket: ${bucket.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating bucket ${bucket.id}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase bucket creation...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log(`📍 Total buckets to create: ${buckets.length}`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const bucket of buckets) {
    const success = await createBucket(bucket);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully created/verified: ${successCount} buckets`);
  console.log(`❌ Errors: ${errorCount} buckets`);
  
  if (errorCount === 0) {
    console.log('🎉 All buckets created successfully!');
  } else {
    console.log('⚠️  Some buckets failed to create. Please check the errors above.');
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});