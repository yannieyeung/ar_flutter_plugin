import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('📝 Signup API called');
    
    const body = await request.json();
    const { email, phoneNumber, password, userType, firebaseUid } = body;

    console.log('🔍 Request data:', { email, phoneNumber, userType, firebaseUid });

    // Validate input
    if (!userType) {
      console.log('❌ Missing userType');
      return NextResponse.json({
        success: false,
        message: 'User type is required',
      }, { status: 400 });
    }

    if (!email && !phoneNumber) {
      console.log('❌ Missing email and phoneNumber');
      return NextResponse.json({
        success: false,
        message: 'Either email or phone number is required',
      }, { status: 400 });
    }

    // For email signup, password is required
    if (email && !password) {
      console.log('❌ Missing password for email signup');
      return NextResponse.json({
        success: false,
        message: 'Password is required for email signup',
      }, { status: 400 });
    }

    // For phone signup, firebaseUid is required (user already authenticated via OTP)
    if (phoneNumber && !firebaseUid) {
      console.log('❌ Missing firebaseUid for phone signup');
      return NextResponse.json({
        success: false,
        message: 'Phone authentication not completed',
      }, { status: 400 });
    }

    if (!['employer', 'agency', 'individual_helper'].includes(userType)) {
      console.log('❌ Invalid userType:', userType);
      return NextResponse.json({
        success: false,
        message: 'Invalid user type',
      }, { status: 400 });
    }

    console.log('✅ Input validation passed');

    // Check if Firebase Admin is properly configured
    try {
      const { adminAuth } = await import('@/lib/firebase-admin');
      const { UserService } = await import('@/lib/db');

      let userRecord;
      let customToken;

      try {
        if (email) {
          // Email signup flow
          console.log('📧 Creating user with email');
          userRecord = await adminAuth.createUser({
            email,
            password,
            emailVerified: false,
          });

          console.log('✅ Firebase user created:', userRecord?.uid);

          // Generate custom token for immediate sign in
          console.log('🎟️ Generating custom token...');
          customToken = await adminAuth.createCustomToken(userRecord.uid);
          console.log('✅ Custom token generated');

        } else if (phoneNumber && firebaseUid) {
          // Phone signup flow - user already authenticated via OTP
          console.log('📱 Using existing authenticated phone user');
          
          try {
            // Get the existing user record
            userRecord = await adminAuth.getUser(firebaseUid);
            console.log('✅ Found existing Firebase user:', userRecord.uid);

            // Generate custom token for consistency (though user is already signed in)
            customToken = await adminAuth.createCustomToken(userRecord.uid);
            console.log('✅ Custom token generated for phone user');

          } catch (userError) {
            console.error('❌ Firebase user not found:', userError);
            return NextResponse.json({
              success: false,
              message: 'Phone authentication session expired. Please try again.',
            }, { status: 400 });
          }
        }

        // Prepare user data for Firestore (only include defined values)
        const userData = {
          userType,
          isRegistrationComplete: false,
          createdAt: new Date().toISOString(),
        };

        // Only add email if it exists
        if (email) {
          userData.email = email;
          console.log('📧 Added email to user data');
        }

        // Only add phoneNumber if it exists
        if (phoneNumber) {
          userData.phoneNumber = phoneNumber;
          console.log('📱 Added phone number to user data');
        }

        console.log('💾 Prepared user data for Firestore:', userData);

        // Create user document in Firestore
        console.log('💾 Creating Firestore document for user:', userRecord.uid);
        
        try {
          await UserService.createUser(userRecord.uid, userData);
          console.log('✅ Firestore document created successfully');
        } catch (firestoreError) {
          console.error('❌ Firestore creation error:', firestoreError);
          throw firestoreError;
        }

        const redirectUrl = `/registration/${userType}`;

        const response = NextResponse.json({
          success: true,
          message: 'User created successfully',
          redirectUrl,
        }, { 
          status: 201
        });

        // Only set cookie for email signup (phone users are already signed in)
        if (email && customToken) {
          console.log('🍪 Setting auth token cookie for email signup');
          
          // Set cookie with proper attributes (NO HttpOnly since we need to read it in JavaScript)
          const cookieOptions = [
            `auth_token=${customToken}`,
            'Path=/',
            'Max-Age=3600',
            'SameSite=Strict'
          ];
          
          if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
          }
          
          response.headers.set('Set-Cookie', cookieOptions.join('; '));
          console.log('✅ Auth token cookie set successfully', { 
            cookieValue: `${customToken.substring(0, 20)}...`,
            options: cookieOptions.slice(1).join('; ')
          });
        }

        return response;

      } catch (authError) {
        console.error('🔥 Firebase Auth Error:', authError);
        
        const errorCode = authError.code;
        
        if (errorCode === 'auth/email-already-exists') {
          return NextResponse.json({
            success: false,
            message: 'An account with this email already exists',
          }, { status: 409 });
        }
        
        if (errorCode === 'auth/phone-number-already-exists') {
          return NextResponse.json({
            success: false,
            message: 'An account with this phone number already exists',
          }, { status: 409 });
        }

        throw authError;
      }

    } catch (importError) {
      console.error('❌ Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Authentication service not available',
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Signup error (FULL):', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}