import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('🔧 Fix Missing Dates: Starting to add missing datePosted fields...');

    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      // Get all jobs to check which ones are missing datePosted
      console.log('📊 Step 1: Fetching all jobs to check datePosted fields...');
      const allJobsSnapshot = await db.collection('job_postings').get();
      
      let totalJobs = 0;
      let jobsWithoutDate = 0;
      let jobsUpdated = 0;
      const updatePromises = [];

      console.log(`📈 Found ${allJobsSnapshot.docs.length} total jobs in database`);

      for (const doc of allJobsSnapshot.docs) {
        totalJobs++;
        const data = doc.data();
        
        // Check if datePosted is missing or invalid
        if (!data.datePosted || data.datePosted === '' || data.datePosted === null) {
          jobsWithoutDate++;
          console.log(`🔍 Job ${doc.id} missing datePosted, will add current timestamp`);
          
          // Add current timestamp as ISO string
          const updatePromise = doc.ref.update({
            datePosted: new Date().toISOString(),
            lastUpdated: new Date().toISOString() // Also update lastUpdated
          });
          
          updatePromises.push(updatePromise);
        } else {
          console.log(`✅ Job ${doc.id} already has datePosted: ${data.datePosted}`);
        }
      }

      // Execute all updates
      if (updatePromises.length > 0) {
        console.log(`🚀 Updating ${updatePromises.length} jobs with missing datePosted...`);
        await Promise.all(updatePromises);
        jobsUpdated = updatePromises.length;
        console.log(`✅ Successfully updated ${jobsUpdated} jobs`);
      } else {
        console.log('✅ All jobs already have datePosted fields');
      }

      return NextResponse.json({
        success: true,
        message: 'Missing datePosted fields have been added',
        results: {
          totalJobs: totalJobs,
          jobsWithoutDate: jobsWithoutDate,
          jobsUpdated: jobsUpdated,
          jobsAlreadyHadDate: totalJobs - jobsWithoutDate
        },
        nextSteps: [
          'You can now re-enable the orderBy clause in your jobs API',
          'Test the jobs endpoint to confirm ordering works',
          'The jobs will be ordered by datePosted (newest first)'
        ]
      });

    } catch (importError) {
      console.error('❌ Fix Missing Dates: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Fix Missing Dates: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

// Also support GET for checking status without updating
export async function GET(request) {
  try {
    console.log('🔍 Fix Missing Dates: Checking datePosted status...');

    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      const allJobsSnapshot = await db.collection('job_postings').get();
      
      let totalJobs = 0;
      let jobsWithoutDate = 0;
      let jobsWithDate = 0;
      const jobsStatus = [];

      for (const doc of allJobsSnapshot.docs) {
        totalJobs++;
        const data = doc.data();
        
        const hasValidDate = data.datePosted && data.datePosted !== '' && data.datePosted !== null;
        
        if (hasValidDate) {
          jobsWithDate++;
        } else {
          jobsWithoutDate++;
        }

        jobsStatus.push({
          jobId: doc.id,
          title: data.title || 'Untitled',
          hasDatePosted: hasValidDate,
          datePosted: data.datePosted || 'MISSING',
          employerId: data.employerId
        });
      }

      return NextResponse.json({
        success: true,
        status: 'check',
        results: {
          totalJobs: totalJobs,
          jobsWithDate: jobsWithDate,
          jobsWithoutDate: jobsWithoutDate,
          needsUpdate: jobsWithoutDate > 0
        },
        jobsStatus: jobsStatus,
        message: jobsWithoutDate > 0 
          ? `${jobsWithoutDate} jobs need datePosted fields added. Use POST to fix them.`
          : 'All jobs have datePosted fields!'
      });

    } catch (importError) {
      console.error('❌ Fix Missing Dates: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Fix Missing Dates: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}