import { NextResponse } from 'next/server';
import { AuthResponse } from '@/types/user';

export async function POST() {
  try {
    // Clear the authentication cookie
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully',
      redirectUrl: '/auth/signin',
    } as AuthResponse, {
      status: 200,
      headers: {
        'Set-Cookie': `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      }
    });

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    } as AuthResponse, { status: 500 });
  }
}