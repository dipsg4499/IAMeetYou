import bcrypt from "bcryptjs";
import prisma from "../../db/prisma.js";
import sendEmail from "../../utils/sendEmail.js ";
import jwt from "jsonwebtoken";

// @desc Register a new user
// @route POST /api/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, dob, role } = req.body;

    console.log("Incoming Register Data:", req.body);

    if (!fullName || !email || !dob) {
      return res
        .status(400)
        .json({ message: "Full name, email, and DOB are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        dob,
        role: role || "user",
        otp,
        otpExpiry,
        password: null,
      },
    });

    try {
      await sendEmail(
        email,
        "Your OTP Code",
        `Hello ${fullName}, Your OTP code is: ${otp}. This code will expire in 10 minutes.`
      );
      console.log("OTP sent to:", email);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
    }

    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        dob: newUser.dob,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Verify OTP
// @route POST /api/verify-otp
// @access Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null,
        isVerified: true,
      },
    });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Set Password
// @route POST /api/set-password
// @access Public
export const setPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Email, password, and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified yet" });
    }

    // Hash password manually as Prisma doesn't have hooks like Sequelize
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password set successfully. You can now log in." });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Login With JWT
// @route POST /api/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n=== LOGIN ATTEMPT ===");
    console.log({ email });

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Account not verified. Please verify your email first.",
      });
    }

    // Compare password manually using bcrypt
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    console.log("✅ Login successful");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

