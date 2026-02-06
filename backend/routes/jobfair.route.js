
import express from 'express';
import { adminAuth, requireRole } from '../middlewares/adminAuth.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import employerAuth from '../middlewares/employerAuth.js';
import { singleUpload } from '../middlewares/mutler.js';
import {createJobFair,updateJobFair,deleteJobFair,getJobFairsPublic,getJobFairByIdPublic,listJobFairsAdmin,registerCompanyForJobFair,listRegistrationsForJobFair,updateRegistrationStatus} from '../controllers/jobfair.controller.js';
const router = express.Router();
router.get('/', getJobFairsPublic);
router.get('/:id', getJobFairByIdPublic);
router.post('/:id/registrations', isAuthenticated, employerAuth, registerCompanyForJobFair);
const superRoles = ['super_admin', 'superadmin'];
router.get('/admin/list/all', adminAuth, requireRole(superRoles), listJobFairsAdmin);
router.post('/', adminAuth, requireRole(superRoles), singleUpload, createJobFair);
router.put('/:id', adminAuth, requireRole(superRoles), singleUpload, updateJobFair);
router.delete('/:id', adminAuth, requireRole(superRoles), deleteJobFair);
router.get('/:id/registrations', adminAuth, requireRole(superRoles), listRegistrationsForJobFair);
router.patch('/registrations/:regId/status', adminAuth, requireRole(superRoles), updateRegistrationStatus);
export default router;


