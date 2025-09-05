import express  from "express";
import { createCategory } from "../controllers/categorycontroller.js";
import isAdmin from "../middleware/isAdmin.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",authMiddleWare,isAdmin,createCategory)






export default router