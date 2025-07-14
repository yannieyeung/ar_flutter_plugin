import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

console.log('🔧 Initializing Firebase Admin...');

// Debug environment variables
console.log('📊 Environment check:');
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

// Check if we're in a build environment or missing required env vars
const isBuild = process.env.NODE_ENV === 'production' && !process.env.FIREBASE_PROJECT_ID;
const missingEnvVars = !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;

let adminAuth;
let adminDb;
let app;

if (isBuild || missingEnvVars) {
  console.log('⚠️ Firebase Admin not configured - using mock implementations');
  
  // Create mock implementations for build time
  adminAuth = {
    createUser: async () => { throw new Error('Firebase Admin not configured'); },
    getUserByEmail: async () => { throw new Error('Firebase Admin not configured'); },
    getUserByPhoneNumber: async () => { throw new Error('Firebase Admin not configured'); },
    createCustomToken: async () => { throw new Error('Firebase Admin not configured'); },
  };
  
  adminDb = {
    collection: () => ({
      doc: () => ({
        set: async () => { throw new Error('Firebase Admin not configured'); },
        get: async () => ({ exists: false }),
        update: async () => { throw new Error('Firebase Admin not configured'); },
      }),
      where: () => ({
        where: () => ({
          limit: () => ({
            get: async () => ({ docs: [] }),
          }),
          get: async () => ({ docs: [] }),
        }),
        limit: () => ({
          get: async () => ({ docs: [] }),
        }),
        get: async () => ({ docs: [] }),
      }),
    }),
  };
  
  // Export a mock app
  app = { name: 'mock-app' };
} else {
  console.log('🎯 Creating Firebase Admin config...');

  let privateKey;
  try {
    privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  } catch (error) {
    console.error('❌ Error processing private key:', error);
    throw new Error('Invalid Firebase private key format');
  }

  const firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  };

  console.log('✅ Firebase Admin config created');

  // Initialize Firebase Admin
  app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
  console.log('✅ Firebase Admin app initialized');

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);

  console.log('✅ Firebase Admin services exported');
}

export { adminAuth, adminDb };
export default app;