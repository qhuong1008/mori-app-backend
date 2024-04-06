const axios = require("axios");
const post = require("../model/post.model");
const Tag = require("../model/tag.model");
const { createTag } = require("./tag.controller");
exports.findAll = async (req, res) => {
  try {
    const posts = await post.find({});
    res.json({ posts: posts, statusCode: 200 });
  } catch (err) {
    res.status(500).json({ err: NativeError });
  }
};

exports.findById = async (req, res) => {
  try {
    const postId = req.params.id;
    const postResult = await post.findById(postId);
    res.json({ post: postResult, statusCode: 200 });
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ err: err });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res
      .status(200)
      .json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: error });
  }
};

exports.createPost = async (req, res) => {
  const { postRequest } = req.body;
  console.log("post", postRequest);
  try {
    if (!postRequest.title || !postRequest.content || !postRequest.tag) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ thông tin bài viết!" });
    }

    // Tạo mới post
    const newPost = new post({ postRequest });
    await newPost.save();

    res.json({ message: "New post created successfully!" });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ error: error });
  }
};
