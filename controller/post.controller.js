const post = require("../model/post.model");
const comment = require("../model/comment.model");
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
      .populate("book")
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
  const book = req.body.book;
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
      book,
    });
    await newPost.save();

    res.json({ message: "Bài viết được tạo thành công!" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Tạo bài viết thất bại! Vui lòng thử lại!" });
  }
};

exports.editPost = async (req, res) => {
  console.log("edit post handle");
  const postId = req.params.id; // Get post ID from URL parameter
  const { title, content, tag, image, book } = req.body; // Destructure updated content

  try {
    // Find the post to edit
    const updatedPost = await post.findById(postId);
    if (!updatedPost) {
      return res.status(404).json({ error: "Bài viết không tìm thấy!" });
    }

    // Update the updatedPost with new data (if provided)
    if (title) updatedPost.title = title;
    if (content) updatedPost.content = content;
    if (tag) updatedPost.tag = tag;
    if (image) updatedPost.image = image; // Assuming image updates are allowed
    if (book) updatedPost.book = book; // Assuming book updates are allowed

    await updatedPost.save();

    res.status(200).json({ message: "Bài viết được cập nhật thành công!" });
  } catch (error) {
    console.error("Error editing post:", error);
    res
      .status(500)
      .json({ error: "Cập nhật bài viết thất bại! Vui lòng thử lại!" });
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
exports.likePost = async (req, res) => {
  try {
    const postData = await post.findById(req.params.id);
    if (!postData) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    const accountId = req.body.accountId;
    const isLiked = postData.likes.includes(accountId);

    if (isLiked) {
      // Remove the account ID from the likes array
      postData.likes = postData.likes.filter(
        (like) => like.toString() !== accountId
      );
    } else {
      // Add the account ID to the likes array
      postData.likes.push(accountId);
    }

    await postData.save();
    if (isLiked) {
      return res.status(200).json({ message: "Unhearted!" });
    }
    return res.status(200).json({ message: "Hearted!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const postData = await post.findById(req.params.id);
    if (!postData) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    const accountId = req.body.accountId;

    postData.shares.push(accountId);

    await postData.save();

    return res.status(200).json({ message: "Post shared!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
