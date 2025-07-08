import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { UserService } from '@/lib/db';
import { SignUpData, AuthResponse } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: SignUpData = await request.json();
    const { email, phoneNumber, password, userType } = body;

    // Validate input
    if (!password || !userType) {
      return NextResponse.json({
        success: false,
        message: 'Password and user type are required',
      } as AuthResponse, { status: 400 });
    }

    if (!email && !phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Either email or phone number is required',
      } as AuthResponse, { status: 400 });
    }

    if (!['employer', 'agency', 'individual_helper'].includes(userType)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid user type',
      } as AuthResponse, { status: 400 });
    }

    let userRecord;

    try {
      // Create user with email or phone
      if (email) {
        userRecord = await adminAuth.createUser({
          email,
          password,
          emailVerified: false,
        });
      } else if (phoneNumber) {
        userRecord = await adminAuth.createUser({
          phoneNumber,
          password,
        });
      }

      // Create user document in Firestore
      await UserService.createUser(userRecord!.uid, {
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        userType,
        isRegistrationComplete: false,
      });

      // Generate custom token for immediate sign in
      const customToken = await adminAuth.createCustomToken(userRecord!.uid);

      const redirectUrl = `/registration/${userType}`;

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        redirectUrl,
      } as AuthResponse, { 
        status: 201,
        headers: {
          'Set-Cookie': `auth_token=${customToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
        }
      });

    } catch (authError) {
      const errorCode = (authError as { code?: string }).code;
      
      if (errorCode === 'auth/email-already-exists') {
        return NextResponse.json({
          success: false,
          message: 'An account with this email already exists',
        } as AuthResponse, { status: 409 });
      }
      
      if (errorCode === 'auth/phone-number-already-exists') {
        return NextResponse.json({
          success: false,
          message: 'An account with this phone number already exists',
        } as AuthResponse, { status: 409 });
      }

      throw authError;
    }

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    } as AuthResponse, { status: 500 });
  }
}