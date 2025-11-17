import express from "express";
import { loginAdmin, registerAdmin,createAdmin, getDashboardStats,getAnalytics,getAllUsers,updateUserStatus, deleteUser, getUserResume,getAllJobs,approveJob,rejectJob,deleteJob,getJobByIdAdmin,
updateJobDetailsAdmin, postJobAdmin, getJobForEdit, updateJobAdmin, getAllCompanies, getCompanyByIdAdmin,updateCompanyDetailsAdmin, updateCompanyStatus, deleteCompany,
    createCompanyAdmin,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
    bulkApproveJobs,
    getAllJobseekers,
    getAllEmployers,
    checkJobQuality,
    getUserActivity,
    warnUser,
    suspendUser,
    getAdminActivity,
    enforceCompliance,
    forgotPassword,
    resetPassword,
    getAllApplications,
    getApplicationStats,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
} from "../controllers/admin.Controller.js";

import { singleUpload } from "../middlewares/mutler.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); 
router.post('/create-admin', adminAuth, createAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/analytics', adminAuth, getAnalytics);

router.get('/users', adminAuth, getAllUsers);
router.patch('/users/:userId/status', adminAuth, updateUserStatus);
router.delete('/users/:userId', adminAuth, deleteUser);
router.get('/users/:userId/resume', adminAuth, getUserResume);
router.get("/jobseekers", adminAuth, getAllJobseekers);
router.get("/employers", adminAuth, getAllEmployers);

router.get('/users/:userId/activity', adminAuth, getUserActivity);
router.post('/users/:userId/warn', adminAuth, warnUser);
router.post('/users/:userId/suspend', adminAuth, suspendUser);

router.get('/jobs', adminAuth, getAllJobs);
router.get('/jobs/:jobId', adminAuth, getJobByIdAdmin);
router.put('/jobs/:jobId', adminAuth, updateJobDetailsAdmin);
router.patch('/jobs/:jobId/approve', adminAuth, approveJob);
router.patch('/jobs/:jobId/reject', adminAuth, rejectJob);
router.delete('/jobs/:jobId', adminAuth, deleteJob);
router.post('/jobs/:jobId/quality-check', adminAuth, checkJobQuality);
router.post('/jobs/bulk-approve', adminAuth, bulkApproveJobs);
router.post('/post-job', adminAuth, singleUpload, postJobAdmin);
router.get('/jobs/:jobId/edit', adminAuth, getJobForEdit);
router.put('/jobs/:jobId/edit', adminAuth, singleUpload, updateJobAdmin);


router.get('/companies', adminAuth, getAllCompanies);
router.post('/companies', adminAuth, singleUpload, createCompanyAdmin);
router.get('/companies/:companyId', adminAuth, getCompanyByIdAdmin);
router.patch('/companies/:companyId/status', adminAuth, updateCompanyStatus);
router.put('/companies/:companyId', adminAuth, singleUpload, updateCompanyDetailsAdmin);
router.delete('/companies/:companyId', adminAuth, deleteCompany);

router.get('/categories', adminAuth, getAllCategories);
router.post('/categories', adminAuth, createCategory);
router.put('/categories/:categoryId', adminAuth, updateCategory);
router.delete('/categories/:categoryId', adminAuth, deleteCategory);

router.get('/applications', adminAuth, getAllApplications);
router.get('/applications/stats', adminAuth, getApplicationStats);
router.get('/applications/:applicationId', adminAuth, getApplicationById);
router.patch('/applications/:applicationId/status', adminAuth, updateApplicationStatus);
router.delete('/applications/:applicationId', adminAuth, deleteApplication);
router.get('/admins', adminAuth, getAllAdmins);
router.get('/admins/:adminId', adminAuth, getAdminById);
router.put('/admins/:adminId', adminAuth, updateAdmin);
router.delete('/admins/:adminId', adminAuth, deleteAdmin);
router.patch('/admins/:adminId/status', adminAuth, toggleAdminStatus);

router.get('/activity/:adminId', adminAuth, getAdminActivity);
router.post('/compliance/:targetType/:targetId', adminAuth, enforceCompliance);

export default router;