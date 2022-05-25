const mongoose = require("mongoose");
const { User } = require(".");

const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
    },
    comment: {
      type: [String],
      default:""
    },
    commentusername: {
      type: [String],
      default:""
    },
    commentpicture: {
      type: [String],
    }
  },
  {
    timestamps: true,
  }
);
const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
