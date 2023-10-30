const express = require("express");
const multer = require("multer"); // This is a package that allows us to extract files from incoming requests.

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png", // This is the MIME type for PNG images.
  "image/jpeg": "jpg", // This is the MIME type for JPEG images.
  "image/jpg": "jpg", // This is the MIME type for JPG images.
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]; // This checks if the MIME type is valid.

    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }

    cb(error, "backend/images"); // This is the path where the files will be stored.
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-"); // This is the name of the file.
    const ext = MIME_TYPE_MAP[file.mimetype]; // This is the extension of the file.
    cb(null, name + "-" + Date.now() + "." + ext); // This is the full name of the file.
  },
}); // This is a configuration object that tells multer where to store the files.

router.post("", multer(storage).single("image"), (req, res, next) => {
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
