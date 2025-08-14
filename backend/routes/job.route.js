
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import employerAuth from "../middlewares/employerAuth.js";
import { getEmployerJobs, getAllJobs, getJobById, postJob, updateJob, deleteJob, getJobsByCompany } from "../controllers/job.controller.js";
const router = express.Router();



// Public routes (for all authenticated users)
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
// Employer-specific routes
router.route("/post").post(isAuthenticated, employerAuth, postJob);
router.route("/employer/jobs").get(isAuthenticated, employerAuth, getEmployerJobs);
router.route("/company/:companyId").get(isAuthenticated, employerAuth, getJobsByCompany);
router.route("/update/:id").put(isAuthenticated, employerAuth, updateJob);
router.route("/delete/:id").delete(isAuthenticated, employerAuth, deleteJob);
export default router;