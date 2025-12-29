
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import employerAuth from "../middlewares/employerAuth.js";
import { getEmployerJobs, getAllJobs, getJobById, postJob, updateJob, deleteJob, getJobsByCompany, searchJobs } from "../controllers/job.controller.js";
const router = express.Router();




router.route("/get").get(getAllJobs);
router.route("/search").get(searchJobs);
router.route("/get/:id").get( getJobById);

router.route("/post").post(isAuthenticated, employerAuth, postJob);
router.route("/employer/jobs").get(isAuthenticated, employerAuth, getEmployerJobs);
router.route("/company/:companyId").get(isAuthenticated, employerAuth, getJobsByCompany);
router.route("/update/:id").put(isAuthenticated, employerAuth, updateJob);
router.route("/delete/:id").delete(isAuthenticated, employerAuth, deleteJob);
export default router;