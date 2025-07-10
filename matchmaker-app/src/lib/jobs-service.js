// Database service for job operations

export class JobService {
  static async createJob(jobData) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      const job = {
        ...jobData,
        status: 'active',
        datePosted: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        views: 0,
        applicationsCount: 0,
        // Set expiry to 30 days from now if not provided
        expiryDate: jobData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const jobRef = await db.collection('jobs').add(job);
      return {
        id: jobRef.id,
        ...job
      };
    } catch (error) {
      console.error('❌ JobService: Error creating job:', error);
      throw error;
    }
  }

  static async getJobById(jobId) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      
      if (!jobDoc.exists) {
        return null;
      }

      return {
        id: jobDoc.id,
        ...jobDoc.data()
      };
    } catch (error) {
      console.error('❌ JobService: Error getting job:', error);
      throw error;
    }
  }

  static async getJobsByEmployer(employerId) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      const snapshot = await db.collection('jobs')
        .where('employerId', '==', employerId)
        .orderBy('datePosted', 'desc')
        .get();

      const jobs = [];
      snapshot.forEach(doc => {
        jobs.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return jobs;
    } catch (error) {
      console.error('❌ JobService: Error getting employer jobs:', error);
      throw error;
    }
  }

  static async getAllActiveJobs() {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      const snapshot = await db.collection('jobs')
        .where('status', '==', 'active')
        .orderBy('datePosted', 'desc')
        .get();

      const jobs = [];
      
      for (const doc of snapshot.docs) {
        const jobData = doc.data();
        
        // Get employer information
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
          console.error('❌ JobService: Error fetching employer data:', employerError);
          jobData.employer = { name: 'Anonymous' };
        }

        jobs.push({
          id: doc.id,
          ...jobData
        });
      }

      return jobs;
    } catch (error) {
      console.error('❌ JobService: Error getting active jobs:', error);
      throw error;
    }
  }

  static async updateJob(jobId, updateData) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      const updatePayload = {
        ...updateData,
        lastUpdated: new Date().toISOString()
      };

      await db.collection('jobs').doc(jobId).update(updatePayload);
      
      return await this.getJobById(jobId);
    } catch (error) {
      console.error('❌ JobService: Error updating job:', error);
      throw error;
    }
  }

  static async deleteJob(jobId) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      await db.collection('jobs').doc(jobId).delete();
      return true;
    } catch (error) {
      console.error('❌ JobService: Error deleting job:', error);
      throw error;
    }
  }

  static async incrementJobViews(jobId) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      await db.collection('jobs').doc(jobId).update({
        views: db.FieldValue.increment(1)
      });
    } catch (error) {
      console.error('❌ JobService: Error incrementing job views:', error);
      throw error;
    }
  }

  static async searchJobs(filters = {}) {
    try {
      const { db } = await import('@/lib/firebase-admin');
      
      let query = db.collection('jobs').where('status', '==', 'active');

      // Add filters
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      if (filters.location) {
        query = query.where('location.district', '==', filters.location);
      }

      if (filters.salaryMin) {
        query = query.where('salary.amount', '>=', filters.salaryMin);
      }

      if (filters.salaryMax) {
        query = query.where('salary.amount', '<=', filters.salaryMax);
      }

      // Order by date posted (most recent first)
      query = query.orderBy('datePosted', 'desc');

      const snapshot = await query.get();
      const jobs = [];

      for (const doc of snapshot.docs) {
        const jobData = doc.data();
        
        // Get employer information
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
          console.error('❌ JobService: Error fetching employer data:', employerError);
          jobData.employer = { name: 'Anonymous' };
        }

        jobs.push({
          id: doc.id,
          ...jobData
        });
      }

      return jobs;
    } catch (error) {
      console.error('❌ JobService: Error searching jobs:', error);
      throw error;
    }
  }
}

// Client-side job service (for use in React components)
export class ClientJobService {
  static async getJobs(userType, userId) {
    try {
      const response = await fetch(`/api/jobs?userType=${userType}&userId=${userId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.jobs;
    } catch (error) {
      console.error('❌ ClientJobService: Error getting jobs:', error);
      throw error;
    }
  }

  static async createJob(jobData) {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.job;
    } catch (error) {
      console.error('❌ ClientJobService: Error creating job:', error);
      throw error;
    }
  }

  static async getJobById(jobId) {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.job;
    } catch (error) {
      console.error('❌ ClientJobService: Error getting job:', error);
      throw error;
    }
  }

  static async updateJob(jobId, updateData) {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.job;
    } catch (error) {
      console.error('❌ ClientJobService: Error updating job:', error);
      throw error;
    }
  }

  static async deleteJob(jobId) {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return true;
    } catch (error) {
      console.error('❌ ClientJobService: Error deleting job:', error);
      throw error;
    }
  }
}