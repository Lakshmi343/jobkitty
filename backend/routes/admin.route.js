import express from "express";
import { 
    loginAdmin, 
    registerAdmin,
    createAdmin, 
    getDashboardStats,
    getAnalytics,
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getUserResume,
    getAllJobs,
    approveJob,
    rejectJob,
    deleteJob,
    getJobByIdAdmin,
    updateJobDetailsAdmin,
    getAllCompanies,
    getCompanyByIdAdmin,
    updateCompanyDetailsAdmin,
    updateCompanyStatus,
    deleteCompany,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
    getAllJobseekers,
    getAllEmployers,
    checkJobQuality,
    getUserActivity,
    warnUser,
    suspendUser,
    getAdminActivity,
    enforceCompliance,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    getApplicationStats
} from "../controllers/admin.Controller.js";

import { singleUpload } from "../middlewares/mutler.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// Authentication
router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Temporary registration endpoint
router.post('/create-admin', adminAuth, createAdmin);

// Dashboard
router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/analytics', adminAuth, getAnalytics);

// User Management
router.get('/users', adminAuth, getAllUsers);
router.patch('/users/:userId/status', adminAuth, updateUserStatus);
router.delete('/users/:userId', adminAuth, deleteUser);
router.get('/users/:userId/resume', adminAuth, getUserResume);
router.get("/jobseekers", adminAuth, getAllJobseekers);
router.get("/employers", adminAuth, getAllEmployers);

// Enhanced User Monitoring
router.get('/users/:userId/activity', adminAuth, getUserActivity);
router.post('/users/:userId/warn', adminAuth, warnUser);
router.post('/users/:userId/suspend', adminAuth, suspendUser);

// Job Management
router.get('/jobs', adminAuth, getAllJobs);
router.get('/jobs/:jobId', adminAuth, getJobByIdAdmin);
router.put('/jobs/:jobId', adminAuth, updateJobDetailsAdmin);
router.patch('/jobs/:jobId/approve', adminAuth, approveJob);
router.patch('/jobs/:jobId/reject', adminAuth, rejectJob);
router.delete('/jobs/:jobId', adminAuth, deleteJob);
router.post('/jobs/:jobId/quality-check', adminAuth, checkJobQuality);

// Company Management
router.get('/companies', adminAuth, getAllCompanies);
router.get('/companies/:companyId', adminAuth, getCompanyByIdAdmin);
router.patch('/companies/:companyId/status', adminAuth, updateCompanyStatus);
router.put('/companies/:companyId', adminAuth, singleUpload, updateCompanyDetailsAdmin);
router.delete('/companies/:companyId', adminAuth, deleteCompany);

// Category Management
router.get('/categories', adminAuth, getAllCategories);
router.post('/categories', adminAuth, createCategory);
router.put('/categories/:categoryId', adminAuth, updateCategory);
router.delete('/categories/:categoryId', adminAuth, deleteCategory);

// Applications Management
router.get('/applications', adminAuth, getAllApplications);
router.get('/applications/stats', adminAuth, getApplicationStats);
router.get('/applications/:applicationId', adminAuth, getApplicationById);
router.patch('/applications/:applicationId/status', adminAuth, updateApplicationStatus);
router.delete('/applications/:applicationId', adminAuth, deleteApplication);

// Admin Management
router.get('/admins', adminAuth, getAllAdmins);
router.get('/admins/:adminId', adminAuth, getAdminById);
router.put('/admins/:adminId', adminAuth, updateAdmin);
router.delete('/admins/:adminId', adminAuth, deleteAdmin);
router.patch('/admins/:adminId/status', adminAuth, toggleAdminStatus);

// Report Handling (commented out - controllers not implemented)
// router.get('/reports', adminAuth, getAllReports);
// router.get('/reports/:reportId', adminAuth, getReportById);
// router.patch('/reports/:reportId/assign', adminAuth, assignReport);
// router.patch('/reports/:reportId/resolve', adminAuth, resolveReport);

// Admin Activity Log
router.get('/activity/:adminId', adminAuth, getAdminActivity);

// Compliance Enforcement
router.post('/compliance/:targetType/:targetId', adminAuth, enforceCompliance);

export default router;