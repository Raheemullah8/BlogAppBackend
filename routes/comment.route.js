import express from "express";
import { createComment, getComments,deleteComment } from "../controllers/commentController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/createcomment/:postid",authMiddleWare,createComment);
router.get("/getcomment/:postid",getComments);
router.delete("/deletecomment/:commentid",authMiddleWare,deleteComment)

export default router;