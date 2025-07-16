const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Buckets for different image categories
const buckets = [
  {
    name: "profile-pictures",
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  //   {
  //     name: "lifestyle-photos",
  //     public: true,
  //     fileSizeLimit: 20 * 1024 * 1024, // 10MB
  //     allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  //   },
  //   {
  //     name: "travel-photos",
  //     public: true,
  //     fileSizeLimit: 20 * 1024 * 1024, // 10MB
  //     allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  //   },
  //   {
  //     name: "hobby-photos",
  //     public: true,
  //     fileSizeLimit: 20 * 1024 * 1024, // 10MB
  //     allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  //   },
  //   {
  //     name: "workout-photos",
  //     public: true,
  //     fileSizeLimit: 20 * 1024 * 1024, // 10MB
  //     allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  //   },
  //   {
  //     name: "pet-photos",
  //     public: true,
  //     fileSizeLimit: 20 * 1024 * 1024, // 10MB
  //     allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  //   },
];

async function createBuckets() {
  console.log("Creating Supabase storage buckets...\n");

  for (const bucket of buckets) {
    try {
      // Check if bucket already exists
      const { data: existingBuckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) {
        console.error(`Error listing buckets: ${listError.message}`);
        continue;
      }

      const bucketExists = existingBuckets.some((b) => b.name === bucket.name);

      if (bucketExists) {
        console.log(`✓ Bucket '${bucket.name}' already exists`);
        continue;
      }

      // Create the bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes,
      });

      if (error) {
        console.error(
          `✗ Error creating bucket '${bucket.name}': ${error.message}`
        );
      } else {
        console.log(`✓ Created bucket '${bucket.name}'`);
      }
    } catch (error) {
      console.error(`✗ Error with bucket '${bucket.name}': ${error.message}`);
    }
  }

  console.log("\nBucket creation complete!");
}

async function listBuckets() {
  console.log("\nListing current buckets:");
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error("Error listing buckets:", error.message);
    return;
  }

  if (buckets.length === 0) {
    console.log("No buckets found");
    return;
  }

  buckets.forEach((bucket) => {
    console.log(`- ${bucket.name} (${bucket.public ? "public" : "private"})`);
  });
}

async function main() {
  await createBuckets();
  await listBuckets();
}

main().catch(console.error);
