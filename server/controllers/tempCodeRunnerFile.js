import User from "../mongodb/models/user.js";

export const getUserDetails = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const getSavedPosts = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    // Find the user and populate the savedPosts field
    const user = await User.findById(req.user._id).populate("savedPosts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveOrUnsavePost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const { id } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the post ID is already in the savedPosts array
    const postIndex = user.savedPosts.indexOf(id);
    let message;

    if (postIndex === -1) {
      user.savedPosts.push(id);
      message = "Post saved successfully";
    } else {
      user.savedPosts.splice(postIndex, 1);
      message = "Post unsaved successfully";
    }

    await user.save();

    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
