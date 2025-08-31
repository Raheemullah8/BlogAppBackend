import express from 'express';
import { login, Register } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();



router.post("/register",upload.single("profileImage"),Register)
router.post("/login",login)

export default router;