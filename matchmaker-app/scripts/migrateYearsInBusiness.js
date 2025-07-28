/**
 * Migration script to convert yearsInBusiness field from old format to new format
 * Run this script once to update existing data in the database
 */

const admin = require('firebase-admin');
const { convertYearsInBusiness } = require('../src/utils/dataTransformations');

// Initialize Firebase Admin (you'll need to provide your service account key)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use service account key
    // Add your Firebase config here
  });
}

const db = admin.firestore();

async function migrateYearsInBusinessData() {
  console.log('Starting migration of yearsInBusiness data...');
  
  try {
    // Get all agency users
    const usersRef = db.collection('users');
    const agencyUsersQuery = usersRef.where('userType', '==', 'agency');
    const snapshot = await agencyUsersQuery.get();
    
    if (snapshot.empty) {
      console.log('No agency users found');
      return;
    }
    
    const batch = db.batch();
    let updateCount = 0;
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const oldYearsInBusiness = userData.yearsInBusiness;
      
      if (oldYearsInBusiness) {
        const newYearsInBusiness = convertYearsInBusiness(oldYearsInBusiness);
        
        // Only update if the conversion actually changed the value
        if (newYearsInBusiness !== oldYearsInBusiness) {
          console.log(`Updating user ${doc.id}: "${oldYearsInBusiness}" -> "${newYearsInBusiness}"`);
          batch.update(doc.ref, { yearsInBusiness: newYearsInBusiness });
          updateCount++;
        }
      }
    });
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`Successfully updated ${updateCount} agency records`);
    } else {
      console.log('No records needed updating');
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
if (require.main === module) {
  migrateYearsInBusinessData()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateYearsInBusinessData };