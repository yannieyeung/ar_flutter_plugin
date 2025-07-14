# 🗄️ **Database Design for Job Matchmaker Platform**

## 📋 **Overview**

This database design supports a job matchmaker platform where:
- **Employers** can post jobs and view their own listings
- **Agencies & Individual Helpers** can view all active job postings
- Secure role-based access control
- Future-ready for applications and messaging features

---

## 🏗️ **Collection Structure**

### **1. Users Collection** ✅ *Already Implemented*
```
Collection: 'users'
Document ID: Firebase UID
```

```javascript
{
  uid: "firebase_user_id",
  email: "user@example.com",
  phoneNumber: "+1234567890",
  userType: "employer" | "agency" | "individual_helper",
  isRegistrationComplete: true,
  createdAt: "2024-01-01T00:00:00Z",
  
  // Profile Data
  firstName: "John",
  lastName: "Doe",
  companyName: "ABC Corp", // for employers/agencies
  location: "Hong Kong",
  profilePicture: "url_to_image",
  
  // Role-specific Fields
  ...(userType === 'employer' && {
    companySize: "10-50",
    industry: "Technology"
  }),
  ...(userType === 'agency' && {
    agencyLicense: "AGY123456",
    servicesOffered: ["domestic_helpers", "caregivers"]
  }),
  ...(userType === 'individual_helper' && {
    skills: ["cleaning", "childcare"],
    experience: "2 years",
    availability: "full-time"
  })
}
```

### **2. Jobs Collection** 🆕 *New Implementation*
```
Collection: 'jobs'
Document ID: Auto-generated
```

```javascript
{
  jobId: "auto_generated_id",
  employerId: "firebase_user_id", // Links to Users collection
  
  // Basic Info
  title: "Domestic Helper Needed",
  description: "Looking for a reliable domestic helper...",
  category: "domestic_helper" | "caregiver" | "driver" | "cook" | "other",
  
  // Requirements
  requirements: {
    experience: "1-2 years",
    skills: ["cleaning", "cooking"],
    languages: ["English", "Chinese"],
    liveIn: true,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workingHours: "8:00 AM - 6:00 PM"
  },
  
  // Compensation
  salary: {
    amount: 3500,
    currency: "HKD",
    period: "monthly" | "weekly" | "daily" | "hourly"
  },
  
  // Location
  location: {
    address: "Central, Hong Kong",
    district: "Central", 
    city: "Hong Kong"
  },
  
  // Status & Metadata
  status: "active" | "paused" | "filled" | "expired",
  urgency: "immediate" | "within_week" | "within_month" | "flexible",
  datePosted: "2024-01-15T10:00:00Z",
  expiryDate: "2024-02-15T10:00:00Z",
  lastUpdated: "2024-01-15T10:00:00Z",
  views: 0,
  applicationsCount: 0,
  
  // Contact Info (optional)
  contactInfo: {
    preferredContact: "phone" | "email" | "app",
    phoneNumber: "+1234567890",
    email: "contact@example.com"
  }
}
```

### **3. Applications Collection** 🔮 *Future Implementation*
```
Collection: 'applications'
Document ID: Auto-generated
```

```javascript
{
  applicationId: "auto_generated_id",
  jobId: "job_document_id",
  applicantId: "firebase_user_id", // agency or individual_helper
  employerId: "firebase_user_id", // for easy querying
  
  // Application Data
  coverLetter: "I am interested in this position...",
  proposedSalary: 3200,
  availableStartDate: "2024-02-01",
  
  // Status & Metadata
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired",
  appliedAt: "2024-01-16T14:30:00Z",
  lastUpdated: "2024-01-16T14:30:00Z",
  
  // Communication
  messages: [
    {
      fromId: "user_id",
      message: "Hello, I'm interested...",
      timestamp: "2024-01-16T15:00:00Z"
    }
  ]
}
```

---

## 🔐 **Access Control Logic**

### **Query Patterns:**

| User Type | Can View | Query Filter |
|-----------|----------|--------------|
| **Employer** | Own jobs only | `WHERE employerId == currentUser.uid` |
| **Agency** | All active jobs | `WHERE status == 'active'` |
| **Individual Helper** | All active jobs | `WHERE status == 'active'` |

### **Security Rules:**
✅ **Implemented** - See `firestore-security-rules.txt`

- Users can only read/write their own profile
- Employers can only create/edit/delete their own jobs
- Agencies & Helpers can read all active jobs
- Future: Application permissions based on user type

---

## 🛠️ **API Endpoints**

### **Jobs API** ✅ *Implemented*
```
GET  /api/jobs?userType={type}&userId={id}    // List jobs based on user type
POST /api/jobs                                // Create new job (employers only)
GET  /api/jobs/{jobId}                        // Get specific job
PUT  /api/jobs/{jobId}                        // Update job (employer only)
DELETE /api/jobs/{jobId}                      // Delete job (employer only)
```

### **Service Classes** ✅ *Implemented*
- `JobService` - Server-side operations
- `ClientJobService` - Client-side operations

---

## 📊 **Database Indexes** *Recommended*

### **Required Composite Indexes:**
```javascript
// For employer job queries
{
  collection: 'jobs',
  fields: [
    { field: 'employerId', order: 'ASCENDING' },
    { field: 'datePosted', order: 'DESCENDING' }
  ]
}

// For active job queries
{
  collection: 'jobs', 
  fields: [
    { field: 'status', order: 'ASCENDING' },
    { field: 'datePosted', order: 'DESCENDING' }
  ]
}

// For job search by category
{
  collection: 'jobs',
  fields: [
    { field: 'status', order: 'ASCENDING' },
    { field: 'category', order: 'ASCENDING' },
    { field: 'datePosted', order: 'DESCENDING' }
  ]
}

// For job search by location
{
  collection: 'jobs',
  fields: [
    { field: 'status', order: 'ASCENDING' },
    { field: 'location.district', order: 'ASCENDING' },
    { field: 'datePosted', order: 'DESCENDING' }
  ]
}
```

---

## 🚀 **Usage Examples**

### **Employer Creating a Job:**
```javascript
import { ClientJobService } from '@/lib/jobs-service';

const jobData = {
  employerId: user.uid,
  title: "Domestic Helper Needed",
  description: "Looking for reliable help...",
  category: "domestic_helper",
  requirements: {
    experience: "1-2 years",
    skills: ["cleaning", "cooking"],
    liveIn: true
  },
  salary: {
    amount: 3500,
    currency: "HKD", 
    period: "monthly"
  },
  location: {
    district: "Central",
    city: "Hong Kong"
  },
  urgency: "within_week"
};

const newJob = await ClientJobService.createJob(jobData);
```

### **Agency/Helper Viewing Jobs:**
```javascript
import { ClientJobService } from '@/lib/jobs-service';

// Get all active jobs
const jobs = await ClientJobService.getJobs('agency', user.uid);

// Jobs will include employer info:
jobs.forEach(job => {
  console.log(`${job.title} by ${job.employer.name}`);
  console.log(`Salary: ${job.salary.amount} ${job.salary.currency}`);
  console.log(`Location: ${job.location.district}`);
});
```

### **Employer Managing Jobs:**
```javascript
import { ClientJobService } from '@/lib/jobs-service';

// Get employer's own jobs
const myJobs = await ClientJobService.getJobs('employer', user.uid);

// Update job status
await ClientJobService.updateJob(jobId, { 
  status: 'filled',
  lastUpdated: new Date().toISOString()
});

// Delete job
await ClientJobService.deleteJob(jobId);
```

---

## 📈 **Future Enhancements**

### **Phase 2: Applications System**
- Implement Applications collection
- Add application management endpoints
- Build employer dashboard for managing applications

### **Phase 3: Advanced Features**
- **Real-time messaging** between employers and applicants
- **Job search filters** (salary range, location, skills)
- **Job recommendations** based on helper profiles
- **Rating system** for completed jobs
- **Payment integration** for premium job postings

### **Phase 4: Analytics**
- **Job performance metrics** (views, applications)
- **Employer insights** (successful hire rates)
- **Market trends** (salary ranges by category)

---

## 🎯 **Key Benefits**

✅ **Role-based Access** - Each user type sees appropriate content  
✅ **Scalable Structure** - Easy to add new features  
✅ **Security First** - Comprehensive Firestore security rules  
✅ **Developer Friendly** - Clean API design and service classes  
✅ **Future Ready** - Designed for applications and messaging features  

**Your job matchmaker platform now has a solid, scalable database foundation!** 🎉