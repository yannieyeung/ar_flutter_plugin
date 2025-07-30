import { NextResponse } from 'next/server';

/**
 * GET /api/jobs/[jobId]
 * Get a specific job by ID
 */
export async function GET(request, { params }) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const { JobService } = await import('@/lib/jobs-service');
    const job = await JobService.getJobById(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);

  } catch (error) {
    console.error('❌ Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/jobs/[jobId]
 * Update a specific job by ID
 */
export async function PUT(request, { params }) {
  try {
    const { jobId } = await params;
    const body = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { 
      jobTitle, 
      jobDescription, 
      location, 
      salary, 
      startDate, 
      employerId,
      ...otherFields 
    } = body;

    if (!jobTitle || !jobDescription || !location?.city || !location?.country || !startDate || !salary?.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: jobTitle, jobDescription, location, startDate, salary' },
        { status: 400 }
      );
    }

    if (!employerId) {
      return NextResponse.json(
        { error: 'Employer ID is required' },
        { status: 401 }
      );
    }

    const { JobService } = await import('@/lib/jobs-service');
    
    // First, verify the job exists and belongs to the user
    const existingJob = await JobService.getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (existingJob.employerId !== employerId) {
      return NextResponse.json(
        { error: 'You can only edit your own job postings' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      location: {
        city: location.city.trim(),
        country: location.country.trim()
      },
      salary: {
        amount: parseFloat(salary.amount),
        currency: salary.currency || 'SGD'
      },
      startDate,
      urgency: otherFields.urgency || 'flexible',
      category: otherFields.category || '',
      requirements: otherFields.requirements || '',
      householdInfo: otherFields.householdInfo || {},
      workingConditions: otherFields.workingConditions || {},
      lastUpdated: new Date().toISOString()
    };

    // Update the job
    const updatedJob = await JobService.updateJob(jobId, updateData);

    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Failed to update job' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedJob);

  } catch (error) {
    console.error('❌ Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}