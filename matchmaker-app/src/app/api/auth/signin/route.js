import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phoneNumber, password } = body;

    // Validate input
    if (!password) {
      return NextResponse.json({
        success: false,
        message: 'Password is required',
      }, { status: 400 });
    }

    if (!email && !phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Either email or phone number is required',
      }, { status: 400 });
    }

    // Check if Firebase Admin is properly configured
    try {
      const { adminAuth } = await import('@/lib/firebase-admin');
      const { UserService } = await import('@/lib/db');

      try {
        let userRecord;
        
        // Get user by email or phone
        if (email) {
          userRecord = await adminAuth.getUserByEmail(email);
        } else if (phoneNumber) {
          userRecord = await adminAuth.getUserByPhoneNumber(phoneNumber);
        }

        if (!userRecord) {
          return NextResponse.json({
            success: false,
            message: 'User not found',
          }, { status: 404 });
        }

        // Get user data from Firestore
        const userData = await UserService.getUserByUid(userRecord.uid);
        
        if (!userData) {
          return NextResponse.json({
            success: false,
            message: 'User data not found',
          }, { status: 404 });
        }

        // Update last login
        await UserService.updateLastLogin(userRecord.uid);

        // Generate custom token
        const customToken = await adminAuth.createCustomToken(userRecord.uid);

        // Determine redirect URL based on registration status
        let redirectUrl;
        
        if (!userData.isRegistrationComplete) {
          redirectUrl = `/registration/${userData.userType}`;
        } else {
          redirectUrl = '/dashboard';
        }

        return NextResponse.json({
          success: true,
          message: 'Sign in successful',
          user: userData,
          redirectUrl,
        }, {
          status: 200,
          headers: {
            'Set-Cookie': `auth_token=${customToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
          }
        });

      } catch (authError) {
        const errorCode = authError.code;
        
        if (errorCode === 'auth/user-not-found') {
          return NextResponse.json({
            success: false,
            message: 'User not found',
          }, { status: 404 });
        }

        if (errorCode === 'auth/wrong-password') {
          return NextResponse.json({
            success: false,
            message: 'Invalid password',
          }, { status: 401 });
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
    console.error('Sign in error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}