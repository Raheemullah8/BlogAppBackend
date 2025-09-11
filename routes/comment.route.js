import express from "express";
import { createComment } from "../controllers/commentController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/createcomment/:postid",authMiddleWare,createComment);

export default router;