import express from "express";
const router = express.Router();
import passport from "passport";
import {
  logoutUser,
  loginUser,
  registerUser,
} from "../controllers/authController.js";

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", passport.authenticate("local"), loginUser);

// Logout Route
router.get("/logout", logoutUser);

export default router;
