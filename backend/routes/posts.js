const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title, // This is the title that will be returned.
    content: req.body.content, // This is the content that will be returned.
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id, // This is the message that will be returned.
    });
  }); // This saves the post to the database.
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id, // This is the ID that will be returned.
    title: req.body.title, // This is the title that will be returned.
    content: req.body.content, // This is the content that will be returned.
  });

  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Update successful!" }); // This is the message that will be returned.
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    // This is a Mongoose method that fetches all the documents from the database.
    console.log(documents);
    res.status(200).json({
      // This returns the documents as a JSON response.
      message: "Posts fetched successfully!", // This is the message that will be returned.
      posts: documents, // This is the posts that will be returned.
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    // This is a Mongoose method that fetches a single document from the database.
    if (post) {
      // This checks if the post exists.
      res.status(200).json(post); // This returns the post as a JSON response.
    } else {
      res.status(404).json({ message: "Post not found!" }); // This is the message that will be returned.
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result); // This logs the result to the console.
    res.status(200).json({ message: "Post deleted!" }); // This is the message that will be returned.
  });
});

module.exports = router;
