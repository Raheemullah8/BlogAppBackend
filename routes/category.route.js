import express  from "express";
import isAdmin from "../middleware/isAdmin.js";
import authMiddleWare from "../middleware/authMiddleware.js";
import {updateCategory,createCategory,getCategory,deleteCategory} from "../controllers/categoryController.js"

const router = express.Router();

router.post("/createcategory",authMiddleWare,isAdmin,createCategory)
router.get("/getcategory",getCategory)
router.delete("/deletecategory/:id",authMiddleWare,isAdmin,deleteCategory)
router.patch("/updatecategory/:id",authMiddleWare,isAdmin,updateCategory)
export default router