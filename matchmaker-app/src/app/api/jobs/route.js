import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');

    console.log('📋 Jobs API: GET request', { userType, userId });

    // Check if Firebase Admin is available
    try {
      const { db } = await import('@/lib/firebase-admin');

      let jobsQuery;
      
      if (userType === 'employer') {
        // Employers see only their own jobs
        console.log('👔 Jobs API: Fetching employer jobs for:', userId);
        jobsQuery = db.collection('jobs')
          .where('employerId', '==', userId)
          .orderBy('datePosted', 'desc');
          
      } else if (userType === 'agency' || userType === 'individual_helper') {
        // Agencies and helpers see all active jobs
        console.log('🔍 Jobs API: Fetching all active jobs for:', userType);
        jobsQuery = db.collection('jobs')
          .where('status', '==', 'active')
          .orderBy('datePosted', 'desc');
          
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
      const { db } = await import('@/lib/firebase-admin');

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

      const jobRef = await db.collection('jobs').add(jobData);
      
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