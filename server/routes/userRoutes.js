import express from "express";
import {
  getSavedPosts,
  getUserDetails,
  saveOrUnsavePost,
} from "../controllers/userController.js";
const router = express.Router();

//Check Authentication

router.get("/", getUserDetails);

// Get save Post

router.get("/savePost", getSavedPosts);

// Save or Unsave Post

router.patch("/savePost", saveOrUnsavePost);

export default router;
