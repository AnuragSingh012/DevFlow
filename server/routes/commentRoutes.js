import express from "express";
import Comment from "../mongodb/models/comment.js"
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "author",
      "name email"
    );
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post Comment

router.post("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  console.log(req.body);
  const newComment = new Comment({
    text: req.body.text,
    author: req.user._id,
    post: req.body.post_id,
  });

  try {
    const savedComment = await newComment.save();

    // Populate the author field with user details
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "author",
      "name email"
    ); // Populate with the desired fields

    console.log(populatedComment);
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
