const Comment = require("../model/comment.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    // Lưu note vào cơ sở dữ liệu
    await newComment.save();

    res.status(200).json({
      message: "Thêm bình luận thành công!",
      statusCode: 200,
      data: newComment,
    });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "error", message: error.message });
  }
};
exports.createReplyComment = async (req, res) => {
  try {
    const { content, account, post, parent_comment } = req.body;

    // Create a new comment
    const newComment = new Comment({
      content,
      account,
      post,
      parent_comment,
    });

    // Save the comment
    await newComment.save();

    // If the comment has a parent comment, add it to the replies array
    if (parent_comment) {
      const parentComment = await Comment.findById(parent_comment);
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    }
    await newComment.populate(
      "account",
      "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken"
    );
    res.status(201).json({
      message: "Trả lời bình luận thành công!",
      data: newComment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAllCommentsByUserId = async (req, res) => {
  try {
    const userId = req.body.account;
    const postId = req.body.post;
    // Lấy tất cả các comments từ cơ sở dữ liệu
    const comments = await Comment.find({
      account: userId,
      post: postId,
    })
      .populate({
        path: "account",
        select:
          "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken",
      })
      .populate({
        path: "replies",
        populate: {
          path: "account",
          select:
            "-role -is_member -is_blocked -is_active -is_verify_email -passwordResetExpires -passwordResetToken",
        },
      })
      .populate("parent_comment");
    return res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Error getting all comments:", error);
    return res.status(500).json({ error: "Something wrong occured!" });
  }
};
exports.likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { accountId } = req.body;

    // Find the comment
    const comment = await Comment.findById(commentId);

    // Check if the account has already liked the comment
    const isLiked = comment.likes.includes(accountId);

    if (isLiked) {
      // Remove the account ID from the likes array
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== accountId
      );
    } else {
      // Add the account ID to the likes array
      comment.likes.push(accountId);
    }

    await comment.save();
    if (isLiked) {
      return res.status(200).json({ message: "Unhearted!" });
    }
    return res.status(200).json({ message: "Hearted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
