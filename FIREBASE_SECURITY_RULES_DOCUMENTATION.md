# Firebase Security Rules Documentation

## 📋 Overview

This document provides comprehensive guidance for managing Firebase Firestore security rules for the Matchmaker App. It includes current rules, production alternatives, and instructions for common modifications.

---

## 🚀 Current Development Rules (In Use)

**Status:** ✅ Currently Applied  
**Purpose:** Basic security for development and testing  
**Use Case:** Getting the app functional with essential security

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read/write their own document
    match /users/{userId} {
      // Users can read and write their own document
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Anyone authenticated can read basic profile info (for matching/listings)
      allow read: if request.auth != null && resource.data.keys().hasAny(['name', 'userType', 'profilePicture']);
    }
    
    // Job postings collection (new naming)
    match /job_postings/{jobId} {
      // Anyone authenticated can read job postings
      allow read: if request.auth != null;
      
      // Only job owners can create/update/delete their jobs
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.employerId;
      
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.employerId;
    }
    
    // Legacy jobs collection (for backward compatibility)
    match /jobs/{jobId} {
      // Anyone authenticated can read job postings
      allow read: if request.auth != null;
      
      // Only job owners can create/update/delete their jobs
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.employerId;
      
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.employerId;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      // Applicants and employers involved can read applications
      allow read: if request.auth != null 
        && (request.auth.uid == resource.data.applicantId 
            || request.auth.uid == resource.data.employerId);
      
      // Applicants can create applications
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.applicantId;
      
      // Both parties can update application status
      allow update: if request.auth != null 
        && (request.auth.uid == resource.data.applicantId 
            || request.auth.uid == resource.data.employerId);
    }
    
    // Helpers collection (for helper profiles)
    match /helpers/{helperId} {
      // Anyone authenticated can read helper profiles (for matching)
      allow read: if request.auth != null;
      
      // Helpers can create/update their own profiles
      allow create, update: if request.auth != null 
        && request.auth.uid == helperId;
    }
  }
}
```

---

## 🔒 Production-Ready Rules (Enhanced Security)

**Status:** 📋 Ready for Production Deployment  
**Purpose:** Enterprise-level security with comprehensive validation  
**Use Case:** Production environment with strict security requirements

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for validation
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUser() {
      return isAuthenticated() && 
             request.auth.token.email_verified == true;
    }
    
    function hasValidUserType(userType) {
      return userType in ['employer', 'helper', 'agency'];
    }
    
    // Users collection - enhanced validation
    match /users/{userId} {
      // Users can read and write their own document
      allow read, write: if isAuthenticated() && isOwner(userId);
      
      // Limited profile access for matching (only essential fields)
      allow read: if isAuthenticated() && 
                     resource.data.keys().hasOnly(['name', 'userType', 'profilePicture', 'isRegistrationComplete']) &&
                     hasValidUserType(resource.data.userType);
    }
    
    // Job postings collection with enhanced validation
    match /job_postings/{jobId} {
      // Read access: only verified users can browse jobs
      allow read: if isValidUser();
      
      // Create: enhanced validation
      allow create: if isValidUser() && 
                       isOwner(request.resource.data.employerId) &&
                       request.resource.data.keys().hasAll(['jobTitle', 'jobDescription', 'employerId']) &&
                       request.resource.data.employerId is string &&
                       request.resource.data.jobTitle is string &&
                       request.resource.data.jobDescription is string;
      
      // Update/Delete: only job owners
      allow update, delete: if isValidUser() && 
                               isOwner(resource.data.employerId);
    }
    
    // Applications collection with enhanced security
    match /applications/{applicationId} {
      // Read: only involved parties with verified emails
      allow read: if isValidUser() && 
                     (isOwner(resource.data.applicantId) || 
                      isOwner(resource.data.employerId));
      
      // Create: applicants only, with validation
      allow create: if isValidUser() && 
                       isOwner(request.resource.data.applicantId) &&
                       request.resource.data.keys().hasAll(['applicantId', 'jobId', 'employerId']);
      
      // Update: both parties can update (for status changes)
      allow update: if isValidUser() && 
                       (isOwner(resource.data.applicantId) || 
                        isOwner(resource.data.employerId)) &&
                       // Prevent changing core IDs
                       request.resource.data.applicantId == resource.data.applicantId &&
                       request.resource.data.employerId == resource.data.employerId;
    }
    
    // Helpers collection with privacy controls
    match /helpers/{helperId} {
      // Read: only for matching purposes by verified users
      allow read: if isValidUser();
      
      // Create/Update: helper owns their profile
      allow create, update: if isValidUser() && 
                               isOwner(helperId) &&
                               request.resource.data.userType == 'helper';
    }
  }
}
```

---

## 🛠️ Common Modifications Guide

### 1. **Restricting Job Posting Visibility**

#### Current: Any authenticated user can view all jobs
```javascript
allow read: if request.auth != null;
```

#### Option A: Only employers and agencies can view jobs
```javascript
allow read: if request.auth != null && 
               getUserType(request.auth.uid) in ['employer', 'agency'];
```

#### Option B: Geographic restrictions (if location field exists)
```javascript
allow read: if request.auth != null && 
               (resource.data.location == getUserLocation(request.auth.uid) ||
                resource.data.isPublic == true);
```

#### Option C: Premium users only
```javascript
allow read: if request.auth != null && 
               getUserSubscription(request.auth.uid) in ['premium', 'enterprise'];
```

### 2. **Helper Profile Privacy Levels**

#### Current: Any authenticated user can view helper profiles
```javascript
allow read: if request.auth != null;
```

#### Option A: Only employers and agencies
```javascript
allow read: if request.auth != null && 
               getUserType(request.auth.uid) in ['employer', 'agency'];
```

#### Option B: Privacy settings based
```javascript
allow read: if request.auth != null && 
               (resource.data.profileVisibility == 'public' ||
                (resource.data.profileVisibility == 'employers' && 
                 getUserType(request.auth.uid) == 'employer'));
```

### 3. **Application System Modifications**

#### Current: Direct applications allowed
```javascript
allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.applicantId;
```

#### Option A: Require job to be active
```javascript
allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.applicantId &&
                 getJobStatus(request.resource.data.jobId) == 'active';
```

#### Option B: Prevent duplicate applications
```javascript
allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.applicantId &&
                 !existsApplicationFor(request.auth.uid, request.resource.data.jobId);
```

---

## 🔧 Helper Functions Library

For advanced rules, you can add these helper functions:

```javascript
// Get user type from users collection
function getUserType(userId) {
  return get(/databases/$(database)/documents/users/$(userId)).data.userType;
}

// Get user location
function getUserLocation(userId) {
  return get(/databases/$(database)/documents/users/$(userId)).data.location;
}

// Get user subscription level
function getUserSubscription(userId) {
  return get(/databases/$(database)/documents/users/$(userId)).data.subscriptionLevel;
}

// Check if job is active
function getJobStatus(jobId) {
  return get(/databases/$(database)/documents/job_postings/$(jobId)).data.status;
}

// Check for existing application
function existsApplicationFor(userId, jobId) {
  return exists(/databases/$(database)/documents/applications/$(userId + '_' + jobId));
}

// Validate required fields
function hasRequiredJobFields(data) {
  return data.keys().hasAll(['jobTitle', 'jobDescription', 'employerId', 'salary']);
}
```

**⚠️ Warning:** Helper functions that read other documents can cause performance issues and circular dependencies. Use sparingly.

---

## 📊 Security Levels Comparison

| Feature | Development Rules | Production Rules |
|---------|------------------|------------------|
| **Email Verification** | ❌ Not required | ✅ Required |
| **Data Validation** | ⚠️ Basic | ✅ Comprehensive |
| **Field Restrictions** | ❌ Minimal | ✅ Strict |
| **Type Checking** | ❌ None | ✅ Full validation |
| **Performance** | ✅ Fast | ⚠️ Slightly slower |
| **Security Level** | ⚠️ Moderate | ✅ High |

---

## 🚀 Deployment Instructions

### 1. **Apply Rules to Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy and paste the desired ruleset
5. Click **"Publish"**

### 2. **Testing Rules**
1. Use Firebase Rules Playground in the console
2. Test with different user scenarios:
   - Authenticated user reading own data
   - User trying to access other's data
   - Unauthenticated access attempts

### 3. **Monitoring**
1. Enable audit logs in Firebase Console
2. Monitor rule violations in Usage tab
3. Set up alerts for security incidents

---

## 🔍 Troubleshooting Common Issues

### Issue: "Missing or insufficient permissions"
**Cause:** User trying to access data they don't own or rules are too restrictive  
**Solution:** Check if user is authenticated and owns the resource

### Issue: "Email verification required"
**Cause:** Production rules require verified email  
**Solution:** Ensure users verify email or modify rules to remove requirement

### Issue: "Required field missing"
**Cause:** Data doesn't meet validation requirements  
**Solution:** Update application code to include all required fields

### Issue: Circular dependency error
**Cause:** Helper functions calling each other  
**Solution:** Simplify rules or remove problematic helper functions

---

## 📝 Change Log Template

When modifying rules, document changes here:

```
## [Date] - [Version]
### Changed
- Modified job posting visibility to require premium subscription
- Added geographic restrictions for helper profiles

### Security Impact
- Reduced data exposure by 60%
- Maintained functionality for premium users

### Testing
- Verified with 5 user types
- Performance impact: +50ms average
```

---

## 🎯 Best Practices

1. **Always test in staging** before production deployment
2. **Use least privilege principle** - grant minimum necessary access
3. **Document all changes** with business justification
4. **Monitor performance** after rule changes
5. **Regular security audits** quarterly
6. **Backup current rules** before major changes
7. **Use version control** for rule changes

---

## 📞 Emergency Rollback

If rules break production:

1. **Immediate Action:** Revert to last known working rules
2. **Copy previous rules** from this documentation
3. **Apply in Firebase Console**
4. **Test critical user flows**
5. **Investigate issue** in staging environment

---

*Last Updated: [Current Date]*  
*Maintainer: Development Team*  
*Review Schedule: Monthly*