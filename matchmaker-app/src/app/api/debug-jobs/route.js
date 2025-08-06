import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🔍 Debug Jobs API: Starting debug check...');

    // Check if Firebase Admin is available
    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      // Get ALL jobs without any filters to see what's actually in the database
      console.log('📊 Debug: Fetching ALL jobs from job_postings collection...');
      const allJobsSnapshot = await db.collection('job_postings').limit(10).get();
      
      const allJobs = [];
      allJobsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        allJobs.push({
          id: doc.id,
          employerId: data.employerId,
          status: data.status,
          title: data.title,
          datePosted: data.datePosted,
          // Include all fields to see the structure
          ...data
        });
      });

      console.log(`🎯 Debug: Found ${allJobs.length} total jobs in database`);

      // Also check for different status values
      const statusQuery = await db.collection('job_postings').get();
      const statusCounts = {};
      const employerIds = new Set();
      
      statusQuery.docs.forEach(doc => {
        const data = doc.data();
        const status = data.status || 'undefined';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        if (data.employerId) {
          employerIds.add(data.employerId);
        }
      });

      console.log('📈 Debug: Status distribution:', statusCounts);
      console.log('👥 Debug: Unique employer IDs:', Array.from(employerIds));

      return NextResponse.json({
        success: true,
        debug: true,
        totalJobs: allJobs.length,
        jobs: allJobs,
        statusDistribution: statusCounts,
        uniqueEmployerIds: Array.from(employerIds),
        message: 'This is debug data showing all jobs in your database'
      });

    } catch (importError) {
      console.error('❌ Debug API: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Debug API: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}