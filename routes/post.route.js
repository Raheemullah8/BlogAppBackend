import express  from "express";
import { createPost, deletePost, getAllPost, getSinglePost } from "../controllers/postController.js";
import authMiddleWare from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/createpost',upload.single("postimage"),authMiddleWare,isAdmin,createPost)
router.get('/getallpost',getAllPost)
router.get('/getsinglepost/:id',authMiddleWare,getSinglePost)
router.delete('/deletepost/:id',authMiddleWare,isAdmin,deletePost)


export default router