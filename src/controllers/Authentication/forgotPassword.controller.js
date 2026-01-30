import prisma from "../../db/prisma.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import sendEmail from "../../utils/sendEmail.js";

// @desc Update user password
// @route POST /api/forgot-password/request-password-reset
// @access Public
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpToken.create({
      data: { userId: user.id, otp, expiry },
    });

    const subject = "Password Reset Request";
    const message = `
      Hello ${user.fullName},
      You requested a password reset. Use the OTP below to reset your password:${otp}
      This OTP will expire in 10 minutes
      If you didn’t request this, you can ignore this email.
    `;
    await sendEmail(user.email, subject, message);

    console.log(`📧 Reset OTP sent to ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// @desc Reset user password
// @route POST /api/forgot-password/reset-password
// @access Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await prisma.otpToken.findFirst({
      where: { userId: user.id, otp },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.otpToken.delete({
      where: { id: otpRecord.id },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

