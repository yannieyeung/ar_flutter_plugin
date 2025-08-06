# Jobs API Documentation

## 📋 Get List of Available Jobs

### Endpoint
```
GET /api/jobs
```

### Description
Fetches a list of job postings based on the user type. The endpoint returns different results depending on who is making the request.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userType` | string | Yes | Type of user making the request (`employer`, `agency`, or `individual_helper`) |
| `userId` | string | Yes | The ID of the user making the request |

### User Type Behavior

#### 🏢 **Employer** (`userType=employer`)
- Returns only jobs posted by the specific employer
- Ordered by date posted (newest first)
- Includes all job statuses

#### 🏠 **Agency/Helper** (`userType=agency` or `userType=individual_helper`)
- Returns all active jobs from all employers
- Only shows jobs with `status: 'active'`
- Ordered by date posted (newest first)
- Includes employer information for each job

### Example Requests

#### For Employers (Get My Jobs)
```javascript
fetch('/api/jobs?userType=employer&userId=employer123')
```

#### For Agencies/Helpers (Get Available Jobs)
```javascript
fetch('/api/jobs?userType=agency&userId=agency456')
// OR
fetch('/api/jobs?userType=individual_helper&userId=helper789')
```

### Response Format

#### Success Response (200)
```json
{
  "success": true,
  "jobs": [
    {
      "id": "job123",
      "employerId": "employer123",
      "title": "Live-in Domestic Helper",
      "description": "We are looking for a reliable helper...",
      "category": "domestic_help",
      "requirements": {
        "careOfInfant": {
          "required": true,
          "experience": "2+ years"
        },
        "cooking": {
          "required": true,
          "cuisines": ["Asian", "Western"]
        }
      },
      "salary": {
        "amount": 800,
        "currency": "USD",
        "period": "monthly"
      },
      "location": {
        "city": "Singapore",
        "country": "Singapore"
      },
      "status": "active",
      "urgency": "urgent",
      "datePosted": "2024-01-15T10:30:00.000Z",
      "expiryDate": "2024-02-15T10:30:00.000Z",
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "views": 25,
      "applicationsCount": 3,
      "contactInfo": {
        "email": "employer@example.com",
        "phone": "+65 1234 5678"
      },
      "employer": {
        "name": "John Smith",
        "companyName": "Smith Family",
        "location": {
          "city": "Singapore",
          "country": "Singapore"
        }
      }
    }
  ],
  "count": 1
}
```

#### Error Responses

##### Invalid User Type (400)
```json
{
  "success": false,
  "message": "Invalid user type"
}
```

##### Database Service Unavailable (503)
```json
{
  "success": false,
  "message": "Database service not available"
}
```

##### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Usage Examples

#### React/Next.js Frontend
```javascript
import { useState, useEffect } from 'react';

function JobsList({ userType, userId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(`/api/jobs?userType=${userType}&userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.jobs);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [userType, userId]);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Jobs ({jobs.length})</h2>
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>Salary: {job.salary?.amount} {job.salary?.currency}/{job.salary?.period}</p>
          <p>Location: {job.location?.city}, {job.location?.country}</p>
          {job.employer && <p>Employer: {job.employer.name}</p>}
        </div>
      ))}
    </div>
  );
}
```

#### Vanilla JavaScript
```javascript
async function getAvailableJobs(userType, userId) {
  try {
    const response = await fetch(`/api/jobs?userType=${userType}&userId=${userId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.count} jobs:`, data.jobs);
      return data.jobs;
    } else {
      console.error('API Error:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Network Error:', error);
    return [];
  }
}

// Usage
getAvailableJobs('individual_helper', 'helper123')
  .then(jobs => {
    // Process the jobs
    jobs.forEach(job => {
      console.log(`Job: ${job.title} - ${job.salary?.amount} ${job.salary?.currency}`);
    });
  });
```

### Job Data Structure

The jobs returned include these key fields:

- **Basic Info**: `id`, `title`, `description`, `category`
- **Requirements**: Detailed care requirements, skills needed
- **Compensation**: `salary` object with amount, currency, period
- **Location**: City and country information
- **Status**: Job status (`active`, `filled`, `expired`)
- **Timing**: `datePosted`, `expiryDate`, `urgency`
- **Engagement**: `views`, `applicationsCount`
- **Contact**: Contact information for applications
- **Employer Info**: (Only for agencies/helpers) Employer details

### Notes

1. **Authentication**: The endpoint doesn't currently validate authentication tokens, but relies on `userId` parameter
2. **Permissions**: Employers only see their own jobs, while agencies/helpers see all active jobs
3. **Sorting**: All results are sorted by date posted (newest first)
4. **Status Filtering**: Non-employer users only see jobs with `status: 'active'`
5. **Employer Data**: For agencies/helpers, employer information is automatically included