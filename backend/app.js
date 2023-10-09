const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    "mongodb+srv://ng-admin:pxt805W2KrY7we0e@cluster0.zvalrqw.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * This middleware is used to parse the body of incoming requests.
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
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

app.get("/api/posts", (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result); // This logs the result to the console.
    res.status(200).json({ message: "Post deleted!" }); // This is the message that will be returned.
  });
});

module.exports = app;
