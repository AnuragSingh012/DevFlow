import express from "express";
import "dotenv/config";
import connectDB from "./mongodb/connect.js";
import cors from "cors";
import MongoStore from 'connect-mongo';
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
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

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
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
