import prisma from "../../db/prisma.js";

// @desc Get user data by ID
// @route GET /api/profile/user/:id
// @access Private
export const getUserData = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        dob: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update user data
// @route PUT /api/profile/user/:id
// @access Private
export const updateUserData = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { fullName, email, dob } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!fullName || !email || !dob) {
      return res.status(400).json({
        message: "Full name, email, and date of birth are required",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { fullName, email, dob },
      select: {
        id: true,
        fullName: true,
        email: true,
        dob: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

