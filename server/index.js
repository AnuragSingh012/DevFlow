import express from "express";
import "dotenv/config";
import connectDB from "./mongodb/connect.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import {Strategy as LocalStrategy } from "passport-local";
import User from "./mongodb/models/user.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
const app = express();

app.use(
  cors({
    origin: ["https://dev-flow-nine.vercel.app", "http://localhost:5173"], // Replace with your front-end origin
    credentials: true, // Allow cookies and credentials
  })
);


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
      sameSite: "lax", // Adjust based on your needs ('lax' or 'none')
    },
  })
);


// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Check authentication status
app.get("/checkAuthStatus", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send("Authenticated");
  } else {
    res.status(401).send("Unauthenticated");
  }
});

app.use("/post", postRoutes);
app.use("/", authRoutes);
app.use("/post/comment", commentRoutes);
app.use("/user", userRoutes);

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
