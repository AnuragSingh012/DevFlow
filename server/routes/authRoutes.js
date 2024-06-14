import express from "express";
import User from "../mongodb/models/user.js";
const router = express.Router();
import passport from "passport";

// Register Route
router.post("/register", async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const user = new User({ name, username, email });
    const registeredUser = await User.register(user, password); // Register user with hashed password

    // Automatically log in the user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(201).json(registeredUser);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login Route
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, user information is stored in req.user
  res.status(200).json(req.user);
});

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
});

export default router;
