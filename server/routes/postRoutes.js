import express from "express";
const router = express.Router();
import upload from "../config/multerConfig.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  upvotePost,
} from "../controllers/postController.js";

// All Posts
router.get("/", getAllPosts);

// Get Single Post by id
router.get("/:id", getPostById);

// Create Post Route
router.post("/", upload.single("image"), createPost);

// Edit the Post

router.put("/:id/edit", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

// Upvote Route
router.post("/:id/upvote", upvotePost);

export default router;
