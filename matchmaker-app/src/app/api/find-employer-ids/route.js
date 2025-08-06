import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🔍 Find Employer IDs: Starting...');

    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      // Get all jobs and extract unique employer IDs
      const allJobsSnapshot = await db.collection('job_postings').get();
      
      const employerData = [];
      const uniqueEmployerIds = new Set();
      
      allJobsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.employerId) {
          uniqueEmployerIds.add(data.employerId);
          employerData.push({
            jobId: doc.id,
            employerId: data.employerId,
            jobTitle: data.title || 'Untitled',
            status: data.status || 'No status'
          });
        }
      });

      const employerIds = Array.from(uniqueEmployerIds);

      console.log('👥 Found employer IDs:', employerIds);

      return NextResponse.json({
        success: true,
        employerIds: employerIds,
        totalJobs: employerData.length,
        jobsByEmployer: employerData,
        testUrls: employerIds.map(id => ({
          employerId: id,
          testUrl: `http://localhost:3000/api/jobs?userType=employer&userId=${id}`
        })),
        message: 'Use one of these employer IDs to test the jobs endpoint'
      });

    } catch (importError) {
      console.error('❌ Find Employer IDs: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Find Employer IDs: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}