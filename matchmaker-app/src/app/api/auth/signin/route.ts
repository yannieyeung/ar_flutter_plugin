import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { UserService } from '@/lib/db';
import { SignInData, AuthResponse } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: SignInData = await request.json();
    const { email, phoneNumber, password } = body;

    // Validate input
    if (!password) {
      return NextResponse.json({
        success: false,
        message: 'Password is required',
      } as AuthResponse, { status: 400 });
    }

    if (!email && !phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Either email or phone number is required',
      } as AuthResponse, { status: 400 });
    }

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
        } as AuthResponse, { status: 404 });
      }

      // Get user data from Firestore
      const userData = await UserService.getUserByUid(userRecord.uid);
      
      if (!userData) {
        return NextResponse.json({
          success: false,
          message: 'User data not found',
        } as AuthResponse, { status: 404 });
      }

      // Update last login
      await UserService.updateLastLogin(userRecord.uid);

      // Generate custom token
      const customToken = await adminAuth.createCustomToken(userRecord.uid);

      // Determine redirect URL based on registration status
      let redirectUrl: string;
      
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
      } as AuthResponse, {
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${customToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
        }
      });

    } catch (authError) {
      const errorCode = (authError as { code?: string }).code;
      
      if (errorCode === 'auth/user-not-found') {
        return NextResponse.json({
          success: false,
          message: 'User not found',
        } as AuthResponse, { status: 404 });
      }

      if (errorCode === 'auth/wrong-password') {
        return NextResponse.json({
          success: false,
          message: 'Invalid password',
        } as AuthResponse, { status: 401 });
      }

      throw authError;
    }

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    } as AuthResponse, { status: 500 });
  }
}