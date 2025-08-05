# 🔍 Jobs API Troubleshooting Guide

## Problem
Your API returns empty results despite having jobs in the database:
```json
{
    "success": true,
    "jobs": [],
    "count": 0
}
```

## 🧪 Step 1: Debug Your Data

I've created a debug endpoint to check your actual data. Call this in Postman:

```
GET http://localhost:3000/api/debug-jobs
```

This will show you:
- ✅ All jobs in your database (up to 10)
- ✅ Status distribution (active, inactive, etc.)
- ✅ All employer IDs in your database
- ✅ Complete job data structure

## 🎯 Common Issues & Solutions

### Issue 1: Wrong `userType` Parameter

**For Employers**: Use `userType=employer`
```
GET /api/jobs?userType=employer&userId=YOUR_ACTUAL_EMPLOYER_ID
```

**For Helpers/Agencies**: Use `userType=individual_helper` or `userType=agency`
```
GET /api/jobs?userType=individual_helper&userId=ANY_USER_ID
```

### Issue 2: Wrong `userId` for Employers

If you're testing as an employer, the `userId` must match the `employerId` in your job documents.

**Check your data**: Look at the `uniqueEmployerIds` from the debug endpoint, then use one of those IDs:
```
GET /api/jobs?userType=employer&userId=ACTUAL_EMPLOYER_ID_FROM_DEBUG
```

### Issue 3: Jobs Don't Have `status: 'active'`

For helpers/agencies, jobs must have `status: 'active'`. Check the `statusDistribution` from debug.

**Common status values that won't show**:
- `status: 'draft'`
- `status: 'inactive'` 
- `status: 'expired'`
- `status: undefined` (missing status field)

**Fix**: Update your job documents to have `status: 'active'`:
```javascript
// In Firestore console or your app
{
  "status": "active",  // ← This must be exactly "active"
  // ... other fields
}
```

### Issue 4: Missing Required Fields

Jobs might be missing required fields like:
- `employerId` (for employer queries)
- `status` (for helper/agency queries)  
- `datePosted` (for ordering)

## 🔧 Quick Fixes

### Fix 1: Test with Correct Parameters

Use the debug endpoint results to get the right parameters:

1. **Call debug endpoint**: `GET /api/debug-jobs`
2. **Find an employer ID** from `uniqueEmployerIds`
3. **Test employer query**: `GET /api/jobs?userType=employer&userId=THAT_EMPLOYER_ID`

### Fix 2: Update Job Status

If your jobs don't have `status: 'active'`, update them:

**In Firebase Console**:
1. Go to Firestore Database
2. Find `job_postings` collection
3. Edit each job document
4. Set `status` field to `"active"`

**Or programmatically**:
```javascript
// Update all jobs to be active
db.collection('job_postings').get().then(snapshot => {
  snapshot.docs.forEach(doc => {
    doc.ref.update({ status: 'active' });
  });
});
```

### Fix 3: Create Test Data

If you need test jobs, use your job posting form or create manually:

```javascript
// Example job document structure
{
  "employerId": "user123",
  "title": "Live-in Helper",
  "description": "Looking for a helper...",
  "status": "active",
  "datePosted": "2024-01-15T10:30:00.000Z",
  "salary": {
    "amount": 800,
    "currency": "USD",
    "period": "monthly"
  },
  "location": {
    "city": "Singapore",
    "country": "Singapore"
  }
}
```

## 🧪 Testing Different Scenarios

### Test 1: Employer View
```bash
# Replace with actual employer ID from debug
GET /api/jobs?userType=employer&userId=employer123
```

### Test 2: Helper View  
```bash
# Any user ID works for helpers, they see all active jobs
GET /api/jobs?userType=individual_helper&userId=helper123
```

### Test 3: Agency View
```bash
# Any user ID works for agencies, they see all active jobs  
GET /api/jobs?userType=agency&userId=agency123
```

## 📊 Expected Results After Fix

### Employer Query Success:
```json
{
  "success": true,
  "jobs": [
    {
      "id": "job123",
      "employerId": "employer123",
      "title": "Live-in Helper",
      "status": "active"
    }
  ],
  "count": 1
}
```

### Helper/Agency Query Success:
```json
{
  "success": true,
  "jobs": [
    {
      "id": "job123",
      "title": "Live-in Helper", 
      "status": "active",
      "employer": {
        "name": "John Smith",
        "companyName": "Smith Family"
      }
    }
  ],
  "count": 1
}
```

## 🎯 Most Likely Issues

Based on common patterns, you probably have one of these issues:

1. **Wrong userId**: Using a test ID that doesn't match any `employerId` in your jobs
2. **Wrong status**: Jobs have `status: 'draft'` instead of `status: 'active'`  
3. **Missing status**: Jobs don't have a `status` field at all

**Run the debug endpoint first** - it will show you exactly what's in your database! 🔍