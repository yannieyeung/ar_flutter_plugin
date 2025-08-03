import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phoneNumber } = body;

    console.log('🔍 Check-User API: Looking for user with:', { email, phoneNumber });

    // Check if Firebase Admin is available
    try {
      const { adminAuth } = await import('@/lib/firebase-admin');
      const { UserService } = await import('@/lib/db');

      // Try to get user from Firebase Auth
      let firebaseUser = null;
      try {
        if (email) {
          firebaseUser = await adminAuth.getUserByEmail(email);
          console.log('✅ Check-User: Found Firebase user by email:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phoneNumber: firebaseUser.phoneNumber,
            providerData: firebaseUser.providerData.map(p => ({ providerId: p.providerId, uid: p.uid }))
          });
        } else if (phoneNumber) {
          firebaseUser = await adminAuth.getUserByPhoneNumber(phoneNumber);
          console.log('✅ Check-User: Found Firebase user by phone:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phoneNumber: firebaseUser.phoneNumber,
            providerData: firebaseUser.providerData.map(p => ({ providerId: p.providerId, uid: p.uid }))
          });
        }
      } catch (firebaseError) {
        console.log('❌ Check-User: Firebase user not found:', firebaseError.code);
      }

      // Try to get user from our Firestore
      let firestoreUser = null;
      if (firebaseUser) {
        try {
          firestoreUser = await UserService.getUserByUid(firebaseUser.uid);
          console.log('✅ Check-User: Found Firestore user:', {
            uid: firestoreUser?.uid,
            email: firestoreUser?.email,
            phoneNumber: firestoreUser?.phoneNumber,
            userType: firestoreUser?.userType,
            isRegistrationComplete: firestoreUser?.isRegistrationComplete,
            rawData: firestoreUser ? Object.keys(firestoreUser) : 'null',
            fullData: firestoreUser
          });
        } catch (firestoreError) {
          console.log('❌ Check-User: Firestore user not found:', firestoreError.message);
        }
      }

      return NextResponse.json({
        success: true,
        exists: !!firebaseUser,
        firebaseUser: firebaseUser ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          providers: firebaseUser.providerData.map(p => p.providerId)
        } : null,
        firestoreUser: firestoreUser ? {
          uid: firestoreUser.uid,
          email: firestoreUser.email,
          phoneNumber: firestoreUser.phoneNumber,
          userType: firestoreUser.userType,
          isRegistrationComplete: firestoreUser.isRegistrationComplete
        } : null
      });

    } catch (importError) {
      console.error('❌ Check-User: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Authentication service not available',
        exists: false
      });
    }

  } catch (error) {
    console.error('❌ Check-User API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      exists: false
    }, { status: 500 });
  }
}