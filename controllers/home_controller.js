const express = require("express");
const router = express.Router();
const db = require("../models");
const { findById } = require("../models/Tweet");

router.get("/", async (req, res, next) => {
  try {
    const tweets = await db.Tweet.find({}).populate("user");
    const currentUser = req.session.currentUser;
    const id = req.params.id;
    const context = { tweets, currentUser, id };
    return res.render("home.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

router.get("/bookmarks", async (req, res, next) => {
  try {
    const tweets = await db.Tweet.find({}).populate("user");
    const currentUser = req.session.currentUser;
    const context = { tweets, currentUser };
    return res.render("bookmarks.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

// Future route for comments

router.get("/:id", async (req, res, next) => {
  try {
    const tweet = await db.Tweet.findById(req.params.id).populate("user");
    const currentUser = req.session.currentUser;
    const comments = tweet.comment;
    const commentusername = tweet.commentusername;
    const commentpicture = tweet.commentpicture;
    const id = req.params.id;
    const context = {
      oneTweet: tweet,
      currentUser,
      comments,
      commentpicture,
      commentusername,
      id
    };
    return res.render("show.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const updatedTweet = await db.Tweet.findById(req.params.id);
    const context = {
      tweet: updatedTweet,
    };
    return res.render("edit.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const createdTweet = await db.Tweet.create(req.body);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

//comment from here
router.post("/:id", async (req, res, next) => {
  try {
    const newCommentData = req.body;
    const tweet = await db.Tweet.findById(req.params.id);
    const newComment = await db.Comment.create(newCommentData);
    const currentUser = req.session.currentUser;

    await db.Tweet.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { commentusername: currentUser.username } }
    );
    await db.Tweet.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { commentpicture: currentUser.profilePic } }
    );
    await db.Tweet.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comment: newComment.content } }
    );
    console.log(newComment._id);

    res.redirect(`/home/${req.params.id}`);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedTweets = await db.Tweet.findByIdAndDelete(req.params.id)
    console.log(deletedTweets);
    return res.redirect("/home");
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

module.exports = router;