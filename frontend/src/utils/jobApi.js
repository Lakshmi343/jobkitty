import axios from 'axios';
import { JOB_API_END_POINT, ADMIN_API_END_POINT } from './constant';
import { toast } from 'sonner';

/**
 * Utility functions for consistent job API calls across the application
 */

// Admin job API calls
export const adminJobApi = {
  // Fetch all jobs for admin
  fetchJobs: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const response = await axios.get(`${ADMIN_API_END_POINT}/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch jobs');
    }
    
    return response.data.jobs;
  },

  // Fetch job applications for admin
  fetchJobApplications: async (jobId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const response = await axios.get(`${ADMIN_API_END_POINT}/jobs/${jobId}/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch applications');
    }
    
    return response.data.applications;
  },

  // Update job status
  updateJobStatus: async (jobId, status, reason = '') => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const response = await axios.patch(
      `${ADMIN_API_END_POINT}/jobs/${jobId}/status`,
      { status, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (!response.data.success) {
      throw new Error('Failed to update job status');
    }
    
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const response = await axios.delete(`${ADMIN_API_END_POINT}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.data.success) {
      throw new Error('Failed to delete job');
    }
    
    return response.data;
  },
  
  // Fetch all applications (admin only)
  fetchAllApplications: async (filters = {}) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const { page = 1, limit = 10, status, jobId, applicantId, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    
    const params = new URLSearchParams({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(status && { status }),
      ...(jobId && { jobId }),
      ...(applicantId && { applicantId })
    });
    
    const response = await axios.get(`${ADMIN_API_END_POINT}/applications/all?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  },
  
  // Update application status (admin only)
  updateApplicationStatus: async (applicationId, { status, rejectionReason, notes }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    
    const response = await axios.put(
      `${ADMIN_API_END_POINT}/applications/${applicationId}/status`,
      { status, rejectionReason, notes },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    
    return response.data;
  }
};

// Employer job API calls
export const employerJobApi = {
  // Fetch employer's jobs
  fetchJobs: async () => {
    const response = await axios.get(`${JOB_API_END_POINT}/employer/jobs`, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch jobs');
    }
    
    return response.data.jobs;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to create job');
    }
    
    return response.data.job;
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    const response = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, jobData, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to update job');
    }
    
    return response.data.job;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to delete job');
    }
    
    return response.data;
  }
};


export const publicJobApi = {

  fetchJob: async (jobId) => {
    const response = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch job details');
    }
    
    return response.data.job;
  },

 
  fetchAllJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.salary) params.append('salary', filters.salary);
    
    const queryString = params.toString();
    const url = queryString ? `${JOB_API_END_POINT}/get?${queryString}` : `${JOB_API_END_POINT}/get`;
    
    const response = await axios.get(url, {
      withCredentials: true
    });
    
    if (!response.data.success) {
      throw new Error('Failed to fetch jobs');
    }
    
    return response.data.jobs;
  }
};


export const handleApiError = (error, navigate = null) => {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
 
    if (window.location.pathname.includes('/admin')) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('adminToken');
      if (navigate) navigate('/admin/login');
    } else {
      toast.error('Please login to continue');
      if (navigate) navigate('/login');
    }
  } else if (error.response?.status === 403) {
    toast.error('Access denied. You do not have permission to perform this action.');
    if (navigate) navigate('/');
  } else if (error.response?.status === 404) {
    toast.error('Resource not found');
  } else if (error.response?.status >= 500) {
    toast.error('Server error. Please try again later.');
  } else {
    toast.error(error.message || 'An unexpected error occurred');
  }
};


export const safeApiCall = async (apiFunction, navigate = null) => {
  try {
    return await apiFunction();
  } catch (error) {
    handleApiError(error, navigate);
    throw error;
  }
};
