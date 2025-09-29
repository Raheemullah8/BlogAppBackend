import express from "express";
import { createComment, getComments,deleteComment, getAllComment } from "../controllers/commentController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/createcomment/:postid",authMiddleWare,createComment);
router.get("/getcomment/:postid",getComments);
router.get("/getallcomment",authMiddleWare,authMiddleWare,getAllComment);
router.delete("/deletecomment/:commentid",authMiddleWare,deleteComment)

export default router;