// Debug script to test user fetch
// Open browser console and run this after signing in

console.log('=== USER FETCH DEBUGGING ===');

// Check if user is signed in
const auth = firebase.auth();
const currentUser = auth.currentUser;

if (currentUser) {
  console.log('✅ Firebase User:', {
    uid: currentUser.uid,
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber
  });
  
  // Test direct Firestore access
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(currentUser.uid);
  
  console.log('🔍 Attempting to fetch user document...');
  
  userRef.get()
    .then(doc => {
      if (doc.exists) {
        console.log('✅ User document exists:', doc.data());
      } else {
        console.log('❌ User document does not exist');
      }
    })
    .catch(error => {
      console.error('❌ Error fetching user document:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
    });
} else {
  console.log('❌ No user signed in');
}