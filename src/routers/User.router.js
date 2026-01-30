import express from "express";
import {
  registerUser,
  verifyOtp,
  setPassword,
  loginUser,
} from "../controllers/Authentication/UserRegister.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", loginUser);

export default router;