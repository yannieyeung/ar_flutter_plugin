import { NextResponse } from 'next/server';

/**
 * GET /api/debug/jobs
 * Debug endpoint to list all jobs in the database
 */
export async function GET() {
  try {
    console.log('🔍 Debug: Fetching all jobs...');
    
    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');
      console.log('✅ Firebase admin imported successfully');
      
      const snapshot = await db.collection('jobs').get();
      console.log(`📊 Found ${snapshot.size} job documents`);

      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return NextResponse.json({
        success: true,
        message: `Found ${jobs.length} jobs in database`,
        jobs: jobs.map(job => ({
          id: job.id,
          jobTitle: job.jobTitle,
          employerId: job.employerId,
          status: job.status,
          datePosted: job.datePosted,
          location: job.location
        }))
      });

    } catch (firebaseError) {
      console.error('❌ Firebase error:', firebaseError.message);
      return NextResponse.json({
        success: false,
        error: 'Firebase not configured',
        message: 'Database connection failed',
        details: firebaseError.message
      });
    }

  } catch (error) {
    console.error('❌ Debug jobs error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}