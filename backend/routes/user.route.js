import express from "express";
import { login, logout, register, updateProfile, getUserProfile, forgotPassword, resetPassword, uploadResume,getAllEmployers,getAllJobseekers, refreshToken, updateProfilePhoto } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, resumeUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/profile/photo").post(isAuthenticated, singleUpload, updateProfilePhoto);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/upload-resume").post(isAuthenticated, resumeUpload, uploadResume);
router.route("/refresh-token").post(refreshToken);
router.route("/jobseekers").get(getAllJobseekers);
router.route("/employers").get(getAllEmployers);


export default router;

