const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true }, // The title of the post is required.
  content: { type: String, required: true }, // The content of the post is required.
  imagePath: { type: String, required: true }, // The image path of the post is required.
});

module.exports = mongoose.model("Post", postSchema);
