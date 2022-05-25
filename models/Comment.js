const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweet: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userpic: {
      type: String,
    },
  },
  {
    timeStamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
