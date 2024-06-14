import express from "express";
import {
  postComment,
  getCommentsByPostId,
} from "../controllers/commentController.js";
const router = express.Router();

// Get Comments

router.get("/:id", getCommentsByPostId);

// Post Comment

router.post("/", postComment);

export default router;
