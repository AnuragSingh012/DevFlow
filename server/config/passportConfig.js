import passport from "passport";
import {Strategy as LocalStrategy } from "passport-local";
import User from "../mongodb/models/user.js";

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
