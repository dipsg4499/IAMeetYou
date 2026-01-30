import express from "express";
import {
  getUserData,
  updateUserData,
} from "../controllers/Authentication/ProfileManagement.controller.js";

const router = express.Router();

router.get("/user/:id", getUserData);
router.put("/user/update/:id", updateUserData);

export default router;
