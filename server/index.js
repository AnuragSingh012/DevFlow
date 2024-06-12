import express from "express";
import "dotenv/config";
import connectDB from "./mongodb/connect.js";
import cors from "cors";
import Post from "./mongodb/models/post.js";
import User from "./mongodb/models/user.js";
import Comment from "./mongodb/models/comment.js";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();

app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if you're using HTTPS
      httpOnly: true,
      sameSite: "lax", // Adjust based on your needs ('lax' or 'none')
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your front-end origin
    credentials: true, // Allow cookies and credentials
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/test", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user); // This will log the user information to the console
    res.status(200).json(req.user); // Send user information as a response
  } else {
    res.status(401).json({ message: "Unauthenticated" });
  }
});

// Check authentication status
app.get("/checkAuthStatus", (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("Auth Success");
    res.status(200).send("Authenticated");
  } else {
    console.log("Sorry not Authenticated");
    res.status(401).send("Unauthenticated");
  }
});

// All Posts
app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find().populate({ path: "author" });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Post by id
app.get("/post/:id", async (req, res) => {
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
});

// Create Route
app.post("/post", async (req, res) => {
  console.log(req.body);
  const { title, description, img, tags } = req.body;
  const newPost = new Post({
    title,
    description,
    img,
    tags,
  });

  newPost.author = req.user._id;

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Register Route
app.post("/register", async (req, res, next) => {
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
app.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, user information is stored in req.user
  res.status(200).json(req.user);
});

// Logout Route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
});

// Save or Unsave Post

app.patch("/savePost", async (req, res) => {
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
});

// Get save Post

app.get("/savePost", async (req, res) => {
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
});

// Upvote Route
app.post("/post/:id/upvote", async (req, res) => {
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
});

// Post Comment

app.post("/post/comment", async (req, res) => {
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
    const populatedComment = await Comment.findById(savedComment._id).populate('author', 'name email'); // Populate with the desired fields

    console.log(populatedComment);
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.get("/post/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'name email');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(3000, () => {
      console.log(`server running on port 3000`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
