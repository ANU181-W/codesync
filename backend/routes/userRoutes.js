import express from "express";
import {
  loginUser,
  registerUser,
  sendOTPEmail,
  verifyOTP,
  googleAuth,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/send-otp", sendOTPEmail);
router.post("/verify-otp", verifyOTP);
router.post("/google-auth", googleAuth);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
