import { 
  loginAdmin, 
  createAdmin, 
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobs,
  approveJob,
  rejectJob,
  deleteJob,
  getAllCompanies,
  updateCompanyStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics,
  // New super admin functions
  getAllReports,
  getReportById,
  assignReport,
  resolveReport,
  getUserActivity,
  warnUser,
  suspendUser,
  checkJobQuality,
  getAdminActivity,
  enforceCompliance,
  // Applications management
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
  // Company management
  getCompanyByIdAdmin,
  updateCompanyDetailsAdmin,
  deleteCompany,
  // Job details (admin)
  getJobByIdAdmin,
  getAllJobseekers,
  getAllEmployers,
  updateJobDetailsAdmin,
  // User resume
  getUserResume,

} from '../controllers/admin.Controller.js';
import { adminAuth, requireRole } from '../middlewares/adminAuth.js';
import { singleUpload } from '../middlewares/mutler.js';

import express from "express"
const router = express.Router();

// Authentication (no middleware needed)
router.post('/login', loginAdmin);
router.post('/register', createAdmin);

// Protected routes (require admin authentication)
router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/analytics', adminAuth, getAnalytics);

// User Management (superadmin only)
router.get('/users', adminAuth, requireRole(['superadmin']), getAllUsers);
router.patch('/users/:userId/status', adminAuth, requireRole(['superadmin']), updateUserStatus);
router.delete('/users/:userId', adminAuth, requireRole(['superadmin']), deleteUser);
router.get('/users/:userId/resume', adminAuth, requireRole(['superadmin']), getUserResume);
router.get("/jobseekers", getAllJobseekers);
router.get("/employers", getAllEmployers);

// Enhanced User Monitoring (superadmin only)
router.get('/users/:userId/activity', adminAuth, requireRole(['superadmin']), getUserActivity);
router.post('/users/:userId/warn', adminAuth, requireRole(['superadmin']), warnUser);
router.post('/users/:userId/suspend', adminAuth, requireRole(['superadmin']), suspendUser);

// Job Management (all admin roles)
router.get('/jobs', adminAuth, getAllJobs);
router.get('/jobs/:jobId', adminAuth, getJobByIdAdmin);
router.put('/jobs/:jobId', adminAuth, updateJobDetailsAdmin);
router.patch('/jobs/:jobId/approve', adminAuth, approveJob);
router.patch('/jobs/:jobId/reject', adminAuth, rejectJob);
router.delete('/jobs/:jobId', adminAuth, requireRole(['superadmin']), deleteJob);

// Job Quality Check (superadmin and moderator)
router.post('/jobs/:jobId/quality-check', adminAuth, requireRole(['superadmin', 'moderator']), checkJobQuality);

// Company Management (all admin roles)
router.get('/companies', adminAuth, getAllCompanies);
router.get('/companies/:companyId', adminAuth, getCompanyByIdAdmin);
router.patch('/companies/:companyId/status', adminAuth, updateCompanyStatus);
router.put('/companies/:companyId', adminAuth, singleUpload, updateCompanyDetailsAdmin);
router.delete('/companies/:companyId', adminAuth, requireRole(['superadmin']), deleteCompany);

// Category Management (all admin roles)
router.get('/categories', adminAuth, getAllCategories);
router.post('/categories', adminAuth, createCategory);
router.put('/categories/:categoryId', adminAuth, updateCategory);
router.delete('/categories/:categoryId', adminAuth, requireRole(['superadmin']), deleteCategory);

// Applications Management (all admin roles)
router.get('/applications', adminAuth, getAllApplications);
router.get('/applications/stats', adminAuth, getApplicationStats);
router.get('/applications/:applicationId', adminAuth, getApplicationById);
router.patch('/applications/:applicationId/status', adminAuth, updateApplicationStatus);
router.delete('/applications/:applicationId', adminAuth, requireRole(['superadmin']), deleteApplication);

// Report Handling (superadmin and moderator)
router.get('/reports', adminAuth, requireRole(['superadmin', 'moderator']), getAllReports);
router.get('/reports/:reportId', adminAuth, requireRole(['superadmin', 'moderator']), getReportById);
router.patch('/reports/:reportId/assign', adminAuth, requireRole(['superadmin', 'moderator']), assignReport);
router.patch('/reports/:reportId/resolve', adminAuth, requireRole(['superadmin', 'moderator']), resolveReport);

// Admin Activity Log (superadmin only)
router.get('/activity/:adminId', adminAuth, requireRole(['superadmin']), getAdminActivity);

// Compliance Enforcement (superadmin only)
router.post('/compliance/:targetType/:targetId', adminAuth, requireRole(['superadmin']), enforceCompliance);

export default router;