import Comment from "../mongodb/models/comment.js";

export const postComment = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
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
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "author",
      "name email"
    );
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
