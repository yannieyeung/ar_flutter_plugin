// Quick debugging script to check authentication state
// Run this in browser console to debug auth issues

console.log('=== AUTHENTICATION DEBUGGING ===');

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
  console.log('✅ Firebase loaded');
  
  // Check current user
  const auth = firebase.auth();
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    console.log('✅ User authenticated:', {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
      phoneNumber: currentUser.phoneNumber,
      providerData: currentUser.providerData
    });
    
    // Test Firestore access
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(currentUser.uid);
    
    userRef.get().then((doc) => {
      if (doc.exists) {
        console.log('✅ User document found:', doc.data());
      } else {
        console.log('❌ User document not found');
      }
    }).catch((error) => {
      console.error('❌ Error accessing user document:', error);
    });
    
  } else {
    console.log('❌ No user authenticated');
    
    // Check auth state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('🔄 Auth state changed - User logged in:', user.uid);
      } else {
        console.log('🔄 Auth state changed - User logged out');
      }
    });
  }
  
} else {
  console.log('❌ Firebase not loaded');
}