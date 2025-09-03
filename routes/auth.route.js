import express from 'express';
import { getUser, login, logout, Register, updateProfile } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();



router.post("/register",upload.single("profileImage"),Register)
router.post("/login",login)
router.get("/getuser",getUser)
router.post("/logout",logout)
router.patch("/users/:id",updateProfile)

export default router;