import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');

    console.log('📋 Jobs API: GET request', { userType, userId });

    // Check if Firebase Admin is available
    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      let jobsQuery;
      
      if (userType === 'employer') {
        // Employers see only their own jobs
        console.log('👔 Jobs API: Fetching employer jobs for:', userId);
        
        // Debug: Check what employer IDs actually exist
        const allJobsForDebug = await db.collection('job_postings').limit(5).get();
        const existingEmployerIds = allJobsForDebug.docs.map(doc => doc.data().employerId);
        console.log('🔍 Debug: Existing employer IDs in database:', existingEmployerIds);
        console.log('🔍 Debug: Looking for employerId that equals:', userId);
        console.log('🔍 Debug: Do any match?', existingEmployerIds.includes(userId));
        
        // Try query without orderBy first to see if that's the issue
        console.log('🔍 Debug: Trying query without orderBy first...');
        const testQuery = db.collection('job_postings').where('employerId', '==', userId);
        const testSnapshot = await testQuery.get();
        console.log(`🔍 Debug: Query without orderBy found ${testSnapshot.docs.length} jobs`);
        
        // Temporarily remove orderBy to test if that's causing the issue
        console.log('🔍 Debug: Using query WITHOUT orderBy to test...');
        jobsQuery = db.collection('job_postings')
          .where('employerId', '==', userId);
          // .orderBy('datePosted', 'desc'); // Commented out for debugging
          
      } else if (userType === 'agency' || userType === 'individual_helper') {
        // Agencies and helpers see all active jobs
        console.log('🔍 Jobs API: Fetching all active jobs for:', userType);
        // Temporarily remove orderBy to test if that's causing the issue
        console.log('🔍 Debug: Using helper/agency query WITHOUT orderBy to test...');
        jobsQuery = db.collection('job_postings')
          .where('status', '==', 'active');
          // .orderBy('datePosted', 'desc'); // Commented out for debugging
          
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid user type'
        }, { status: 400 });
      }

      const snapshot = await jobsQuery.get();
      const jobs = [];

      for (const doc of snapshot.docs) {
        const jobData = doc.data();
        
        // Get employer info for non-employer users
        if (userType !== 'employer') {
          try {
            const employerDoc = await db.collection('users').doc(jobData.employerId).get();
            const employerData = employerDoc.data();
            
            jobData.employer = {
              name: employerData.firstName && employerData.lastName 
                ? `${employerData.firstName} ${employerData.lastName}`
                : employerData.companyName || 'Anonymous',
              companyName: employerData.companyName,
              location: employerData.location
            };
          } catch (employerError) {
            console.error('❌ Jobs API: Error fetching employer data:', employerError);
            jobData.employer = { name: 'Anonymous' };
          }
        }

        jobs.push({
          id: doc.id,
          ...jobData
        });
      }

      console.log(`✅ Jobs API: Found ${jobs.length} jobs`);

      return NextResponse.json({
        success: true,
        jobs,
        count: jobs.length
      });

    } catch (importError) {
      console.error('❌ Jobs API: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Jobs API: GET error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      employerId, 
      title, 
      description, 
      category,
      requirements,
      salary,
      location,
      urgency,
      expiryDate,
      contactInfo
    } = body;

    console.log('📝 Jobs API: POST request', { employerId, title, category });

    // Validate required fields
    if (!employerId || !title || !description || !category) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: employerId, title, description, category'
      }, { status: 400 });
    }

    // Check if Firebase Admin is available
    try {
      const { adminDb: db } = await import('@/lib/firebase-admin');

      // Verify user is an employer
      const userDoc = await db.collection('users').doc(employerId).get();
      if (!userDoc.exists) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 });
      }

      const userData = userDoc.data();
      if (userData.userType !== 'employer') {
        return NextResponse.json({
          success: false,
          message: 'Only employers can post jobs'
        }, { status: 403 });
      }

      // Create job document
      const jobData = {
        employerId,
        title,
        description,
        category,
        requirements: requirements || {},
        salary: salary || {},
        location: location || {},
        status: 'active',
        urgency: urgency || 'flexible',
        datePosted: new Date().toISOString(),
        expiryDate: expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        lastUpdated: new Date().toISOString(),
        views: 0,
        applicationsCount: 0,
        contactInfo: contactInfo || {}
      };

      const jobRef = await db.collection('job_postings').add(jobData);
      
      console.log('✅ Jobs API: Job created successfully:', jobRef.id);

      return NextResponse.json({
        success: true,
        message: 'Job posted successfully',
        jobId: jobRef.id,
        job: {
          id: jobRef.id,
          ...jobData
        }
      }, { status: 201 });

    } catch (importError) {
      console.error('❌ Jobs API: Firebase Admin not configured:', importError);
      return NextResponse.json({
        success: false,
        message: 'Database service not available'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ Jobs API: POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}