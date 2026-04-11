
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
  bulkApproveApplications,
  bulkRejectApplications,
  getApprovalStats,
  getPendingApplications
} from "../controllers/application.controller.js";

const router = express.Router();


router.route("/apply/:id").post(isAuthenticated, applyJob);


router.route("/my-applications").get(getAppliedJobs);


router.route("/all").get(adminAuth, getAllApplications);


router.route("/job/:id/applicants").get(isAuthenticated, getApplicants);


// Application status update routes
router.route("/:id/status").put(isAuthenticated, updateStatus);

// Admin specific routes with proper authentication
router.route("/admin/applications/:id/approve")
  .put(adminAuth, approveApplication);

router.route("/admin/applications/:id/reject")
  .put(adminAuth, rejectApplication);

// Bulk approval routes
router.route("/admin/applications/bulk-approve")
  .put(adminAuth, bulkApproveApplications);

router.route("/admin/applications/bulk-reject")
  .put(adminAuth, bulkRejectApplications);

// Approval statistics and pending applications
router.route("/admin/applications/stats")
  .get(adminAuth, getApprovalStats);

router.route("/admin/applications/pending")
  .get(adminAuth, getPendingApplications);

export default router;

