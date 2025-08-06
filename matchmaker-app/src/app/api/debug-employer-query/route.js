import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('🔍 Debug Employer Query: Starting detailed debug for userId:', userId);

    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      // Step 1: Get ALL jobs to see what's in the database
      console.log('📊 Step 1: Getting ALL jobs...');
      const allJobsSnapshot = await db.collection('job_postings').get();
      const allJobs = [];
      
      allJobsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        allJobs.push({
          id: doc.id,
          employerId: data.employerId,
          title: data.title,
          status: data.status,
          datePosted: data.datePosted
        });
      });

      console.log(`📈 Found ${allJobs.length} total jobs in database`);

      // Step 2: Check for exact matches
      console.log('🎯 Step 2: Looking for exact employerId matches...');
      const exactMatches = allJobs.filter(job => job.employerId === userId);
      console.log(`🔍 Found ${exactMatches.length} jobs with employerId exactly matching "${userId}"`);

      // Step 3: Check for similar matches (case sensitivity, whitespace, etc.)
      console.log('🔍 Step 3: Checking for similar matches...');
      const similarMatches = allJobs.filter(job => {
        if (!job.employerId) return false;
        return job.employerId.toLowerCase().includes(userId.toLowerCase()) ||
               userId.toLowerCase().includes(job.employerId.toLowerCase());
      });
      console.log(`🔍 Found ${similarMatches.length} jobs with similar employerId`);

      // Step 4: Try the actual query that the jobs API uses
      console.log('🚀 Step 4: Executing the exact same query as jobs API...');
      let queryResult;
      try {
        const jobsQuery = db.collection('job_postings')
          .where('employerId', '==', userId)
          .orderBy('datePosted', 'desc');
        
        const snapshot = await jobsQuery.get();
        queryResult = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`✅ Query executed successfully, found ${queryResult.length} jobs`);
      } catch (queryError) {
        console.error('❌ Query failed:', queryError);
        queryResult = { error: queryError.message };
      }

      // Step 5: Check data types
      console.log('🔍 Step 5: Checking data types...');
      const dataTypeAnalysis = allJobs.map(job => ({
        jobId: job.id,
        employerId: job.employerId,
        employerIdType: typeof job.employerId,
        employerIdLength: job.employerId ? job.employerId.length : 0,
        userIdType: typeof userId,
        userIdLength: userId ? userId.length : 0,
        strictEqual: job.employerId === userId,
        looseEqual: job.employerId == userId
      }));

      return NextResponse.json({
        success: true,
        debug: true,
        input: {
          userId: userId,
          userIdType: typeof userId,
          userIdLength: userId ? userId.length : 0
        },
        results: {
          totalJobsInDatabase: allJobs.length,
          exactMatches: exactMatches.length,
          similarMatches: similarMatches.length,
          queryResult: queryResult,
          allJobs: allJobs,
          exactMatchingJobs: exactMatches,
          similarMatchingJobs: similarMatches,
          dataTypeAnalysis: dataTypeAnalysis
        },
        recommendations: {
          message: exactMatches.length > 0 
            ? "Found exact matches! The query should work." 
            : similarMatches.length > 0 
              ? "Found similar matches. Check for case sensitivity or whitespace issues."
              : "No matches found. The employerId might not exist in your database.",
          nextSteps: exactMatches.length > 0 
            ? ["The jobs API should return results. Check for index issues or query errors."]
            : similarMatches.length > 0
              ? ["Check the exact spelling and case of the employerId", "Look for extra whitespace or special characters"]
              : ["Verify the employerId exists in your database", "Use one of the employerIds from the allJobs list"]
        }
      });

    } catch (importError) {
      console.error('❌ Debug Employer Query: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Debug Employer Query: Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}