import mongoose from "mongoose";

function currentDate() {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = new Date().getFullYear();
  var monthIndex = new Date().getMonth();
  var month = months[monthIndex];
  var day = new Date().getDate();

  var formattedDate = month + " " + day + ", " + year;
  return formattedDate;
}


const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: currentDate(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
