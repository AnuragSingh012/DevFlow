import Post from "../mongodb/models/post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate({ path: "author" });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "author",
    });
    if (post == null) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      res.status(201).json({
        title: post.title,
        description: post.description,
        img: post.img,
        tags: post.tags,
        upvotes: post.upvotes,
        date: post.date,
        author: post.author,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const { title, description, tags } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Use req.file.path to get the uploaded file URL from Cloudinary if it exists

  const newPostData = {
    title,
    description,
    tags,
    author: req.user._id, // Assuming you're using authentication to get user ID
  };

  if (imageUrl) {
    newPostData.img = imageUrl; // Add the image URL only if it exists
  }

  const newPost = new Post(newPostData);

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Only use the new image URL if a file is uploaded

  const updateData = {
    title,
    description,
    tags,
  };

  if (imageUrl) {
    updateData.img = imageUrl; // Only update the image URL if a new file is uploaded
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Page not found" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Sucessfully" });
  } catch (err) {
    res.status(500).json({ message: "internal server Error" });
  }
};

export const upvotePost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = post.upvotedBy.includes(userId);

    if (hasUpvoted) {
      post.upvotes -= 1;
      post.upvotedBy.pull(userId);
    } else {
      post.upvotes += 1;
      post.upvotedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      upvotes: post.upvotes,
      upvoteStatus: !hasUpvoted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
