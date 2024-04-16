const post = require("../model/post.model");
const Tag = require("../model/tag.model");
const { createTag } = require("./tag.controller");
const mongoose = require("mongoose");
const imageController = require("../controller/image.controller");
const ObjectId = mongoose.Types.ObjectId;
exports.findAll = async (req, res) => {
  try {
    const posts = await post
      .find({})
      .populate("tag")
      .populate({
        path: "account",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken",
      })
      .populate("account");

    res.json({ posts: posts, statusCode: 200 });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

exports.findById = async (req, res) => {
  try {
    const postId = req.params.id;
    const postResult = await post
      .findById(postId)
      .populate({
        path: "account",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken",
      })
      .populate("tag");
    res.json({ post: postResult, statusCode: 200 });
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ err: err });
  }
};

exports.findByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const postResult = await post
      .find({ account: userId })
      .populate({
        path: "account",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken",
      })
      .populate("tag");
    res.json({ data: postResult, statusCode: 200 });
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
  console.log("create post handle");
  const title = req.body.title;
  const content = req.body.content;
  const account = req.body.account;
  const tag = req.body.tag;
  const image = req.body.image;
  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập đủ thông tin bài viết!" });
    }

    // Tạo mới post

    const newPost = new post({
      title,
      content,
      account,
      tag,
      image,
    });
    await newPost.save();

    res.json({ message: "Bài viết được tạo thành công!" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Tạo bài viết thất bại! Vui lòng thử lại!" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log(
      "!imageController.isValidImageFormat(req.file)",
      !imageController.isValidImageFormat(req.file)
    );
    if (!imageController.isValidImageFormat(req.file)) {
      return res.status(400).json({ error: "Invalid image format!" });
    }
    return res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(400).json({ err: err });
  }
};
