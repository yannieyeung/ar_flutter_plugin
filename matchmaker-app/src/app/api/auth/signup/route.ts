import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { UserService } from '@/lib/db';
import { SignUpData, AuthResponse, BaseUser } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Signup API called');
    
    const body: SignUpData = await request.json();
    const { email, phoneNumber, password, userType } = body;

    console.log('🔍 Request data:', { email, phoneNumber, userType });

    // Validate input
    if (!password || !userType) {
      console.log('❌ Missing password or userType');
      return NextResponse.json({
        success: false,
        message: 'Password and user type are required',
      } as AuthResponse, { status: 400 });
    }

    if (!email && !phoneNumber) {
      console.log('❌ Missing email and phoneNumber');
      return NextResponse.json({
        success: false,
        message: 'Either email or phone number is required',
      } as AuthResponse, { status: 400 });
    }

    if (!['employer', 'agency', 'individual_helper'].includes(userType)) {
      console.log('❌ Invalid userType:', userType);
      return NextResponse.json({
        success: false,
        message: 'Invalid user type',
      } as AuthResponse, { status: 400 });
    }

    console.log('✅ Input validation passed');

    let userRecord;

    try {
      console.log('🔥 Creating Firebase user...');
      
      // Create user with email or phone
      if (email) {
        console.log('📧 Creating user with email');
        userRecord = await adminAuth.createUser({
          email,
          password,
          emailVerified: false,
        });
      } else if (phoneNumber) {
        console.log('📱 Creating user with phone');
        userRecord = await adminAuth.createUser({
          phoneNumber,
          password,
        });
      }

      console.log('✅ Firebase user created:', userRecord?.uid);

      // Prepare user data for Firestore (only include defined values)
      const userData: Partial<BaseUser> = {
        userType,
        isRegistrationComplete: false,
      };

      // Only add email if it exists
      if (email) {
        userData.email = email;
      }

      // Only add phoneNumber if it exists
      if (phoneNumber) {
        userData.phoneNumber = phoneNumber;
      }

      console.log('💾 Prepared user data:', userData);

      // Create user document in Firestore
      console.log('💾 Creating Firestore document...');
      await UserService.createUser(userRecord!.uid, userData);

      console.log('✅ Firestore document created');

      // Generate custom token for immediate sign in
      console.log('🎟️ Generating custom token...');
      const customToken = await adminAuth.createCustomToken(userRecord!.uid);

      console.log('✅ Custom token generated');

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
      console.error('🔥 Firebase Auth Error:', authError);
      
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
    console.error('❌ Signup error (FULL):', error);
    console.error('❌ Error stack:', (error as Error).stack);
    console.error('❌ Error message:', (error as Error).message);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    } as AuthResponse, { status: 500 });
  }
}