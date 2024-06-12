import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  }
});

const Upvote = mongoose.model("Upvote", upvoteSchema);

export default Upvote;
