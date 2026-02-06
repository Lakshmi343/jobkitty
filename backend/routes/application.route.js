
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import { applyJob,  getApplicants,  getAppliedJobs,  updateStatus,  getAllApplications } from "../controllers/application.controller.js";

const router = express.Router();


router.route("/apply/:id").post(isAuthenticated, applyJob);


router.route("/my-applications").get(isAuthenticated, getAppliedJobs);


router.route("/all").get(isAuthenticated, isAdmin, getAllApplications);


router.route("/job/:id/applicants").get(isAuthenticated, getApplicants);


router.route("/:id/status").put(isAuthenticated, updateStatus);

export default router;

