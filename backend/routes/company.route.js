import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import employerAuth from "../middlewares/employerAuth.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, getCompanyByUserId, setupCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
const router = express.Router();
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/setup").post(isAuthenticated, employerAuth, singleUpload, setupCompany);
router.route("/register").post(isAuthenticated, employerAuth, registerCompany);
router.route("/get").get(isAuthenticated, employerAuth, getCompany);
router.route("/update/:id").put(isAuthenticated, employerAuth, singleUpload, updateCompany);
router.route("/user").get(isAuthenticated, employerAuth, getCompanyByUserId);
export default router;

