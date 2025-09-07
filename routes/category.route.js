import express  from "express";
import { createCategory, deleteCategory, getCategory,updateCategory } from "../controllers/categorycontroller.js";
import isAdmin from "../middleware/isAdmin.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createcategory",authMiddleWare,isAdmin,createCategory)
router.get("/getcategory",authMiddleWare,isAdmin,getCategory)
router.delete("/deletecategory/:id",authMiddleWare,isAdmin,deleteCategory)
router.patch("/updatecategory/:id",authMiddleWare,isAdmin,updateCategory)
export default router