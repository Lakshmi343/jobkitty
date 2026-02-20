
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
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


router.route("/all").get(isAuthenticated, isAdmin, getAllApplications);


router.route("/job/:id/applicants").get(isAuthenticated, getApplicants);


// Application status update routes
router.route("/:id/status").put(isAuthenticated, updateStatus);

// Admin specific routes with proper authentication
router.route("/admin/applications/:id/approve")
  .put(isAuthenticated, isAdmin, approveApplication);
  
router.route("/admin/applications/:id/reject")
  .put(isAuthenticated, isAdmin, rejectApplication);

// Bulk approval routes
router.route("/admin/applications/bulk-approve")
  .put(isAuthenticated, isAdmin, bulkApproveApplications);

router.route("/admin/applications/bulk-reject")
  .put(isAuthenticated, isAdmin, bulkRejectApplications);

// Approval statistics and pending applications
router.route("/admin/applications/stats")
  .get(isAuthenticated, isAdmin, getApprovalStats);

router.route("/admin/applications/pending")
  .get(isAuthenticated, isAdmin, getPendingApplications);

export default router;

