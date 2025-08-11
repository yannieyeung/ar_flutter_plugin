import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    console.log('🔍 Debug: Testing async APIs...');
    
    // Test headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    
    return NextResponse.json({
      success: true,
      message: 'Async APIs working correctly',
      headers: {
        userAgent: userAgent?.substring(0, 50) + '...'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Async API test failed'
    }, { status: 500 });
  }
}