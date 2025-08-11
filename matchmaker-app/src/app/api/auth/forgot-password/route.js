import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    console.log('🔍 ForgotPassword API: Processing request for email:', email);

    // Validate email format
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if user exists in our Firestore database
    console.log('🔍 ForgotPassword API: Checking if user exists in Firestore...');
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('❌ ForgotPassword API: User not found in Firestore');
      return NextResponse.json(
        { 
          success: false, 
          error: 'No account found with this email address. Please check your email or sign up for a new account.' 
        },
        { status: 404 }
      );
    }

    // Check if user exists in Firebase Auth
    try {
      console.log('🔍 ForgotPassword API: Checking if user exists in Firebase Auth...');
      await adminAuth.getUserByEmail(email);
      console.log('✅ ForgotPassword API: User found in Firebase Auth');
    } catch (authError) {
      console.log('❌ ForgotPassword API: User not found in Firebase Auth:', authError.code);
      
      if (authError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No account found with this email address. Please check your email or sign up for a new account.' 
          },
          { status: 404 }
        );
      }
      
      // For other auth errors, log them but don't expose details
      console.error('ForgotPassword API: Firebase Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Unable to process password reset request. Please try again.' },
        { status: 500 }
      );
    }

    // Generate password reset link
    console.log('📧 ForgotPassword API: Generating password reset link...');
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/signin`,
      handleCodeInApp: false,
    };

    try {
      const resetLink = await adminAuth.generatePasswordResetLink(email, actionCodeSettings);
      console.log('✅ ForgotPassword API: Password reset link generated');

      // In a production environment, you would send this via email service
      // For now, we'll let the client handle the email sending via Firebase
      
      return NextResponse.json({
        success: true,
        message: 'Password reset instructions have been sent to your email address.',
        // Note: We don't return the actual link for security reasons
      });

    } catch (linkError) {
      console.error('❌ ForgotPassword API: Error generating reset link:', linkError);
      
      if (linkError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No account found with this email address. Please check your email or sign up for a new account.' 
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Unable to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ ForgotPassword API: Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}