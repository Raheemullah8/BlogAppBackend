import express from 'express';
import { getUser, login, logout, Register, updateProfile,deleteUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();



router.post("/register",upload.single("profileImage"),Register)
router.post("/login",login)
router.get("/getuser",getUser)
router.post("/logout",logout)
router.delete("/deleteuser/:id",deleteUser)
router.patch("/updateusers/:id",upload.single("profileImage"),updateProfile)

export default router;