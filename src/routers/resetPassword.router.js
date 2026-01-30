import express from "express";
import {
    changePassword
} from "../controllers/Authentication/resetPassword.controller.js";

const router = express.Router();

router.post("/change-password/:id", changePassword);

export default router;
