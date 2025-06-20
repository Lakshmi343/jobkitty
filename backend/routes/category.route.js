import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/create").post(createCategory);
router.route("/get").get(getCategories);

export default router;
