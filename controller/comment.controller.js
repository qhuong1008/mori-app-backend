const type = require("../types");
const Comment = require("../model/comment.model");
const notiController = require("../controller/notification.controller");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const axios = require("axios");

exports.createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    res.status(200).json({
      message: "Thêm bình luận thành công!",
      statusCode: 200,
    });
    // Classify the comment before saving
    const classificationResult = await classifyCommentHandler(
      newComment.content
    );
    if (classificationResult.sentiment === "NEGATIVE") {
      newComment.is_toxic = true;
    }
    // Lưu comment vào cơ sở dữ liệu
    await newComment.save();
  } catch (error) {
    console.error("Error creating comment:", error);
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

    // Classify the comment before saving
    const classificationResult = await classifyCommentHandler(
      newComment.content
    );
    if (classificationResult.sentiment === "NEGATIVE") {
      newComment.is_toxic = true;
    }

    // Save the comment
    const savedComment = await newComment.save();

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
      data: savedComment,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
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
      .populate("parent_comment")
      .exec();
    return res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Error getting all comments:", error);
    return res.status(500).json({ error: "Something wrong occured!" });
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
      is_approved: true,
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
      .populate("parent_comment")
      .exec();
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

exports.deleteOneCommentById = async (req, res) => {
  try {
    // Get the comment ID from the request parameter
    const commentId = req.params.id;

    // Check if commentId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    // Delete the comment with the given ID
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    // Notify to user that the comment is not approved
    await notiController.notifyCommentDisapproval(deletedComment);

    // Check if comment was found and deleted
    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "error", message: error.message });
  }
};

exports.deleteManyComments = async (req, res) => {
  try {
    // Get the comment IDs from the request body (assuming an array)
    const commentIds = req.body.commentIds;

    // Check if commentIds is an array and not empty
    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      return res.status(400).json({ error: "Invalid comment IDs format" });
    }

    // Validate all comment IDs
    const invalidIds = commentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({ error: "Invalid comment IDs", invalidIds });
    }
    // Delete comments using the $in operator
    const deletedComments = await Comment.find({ _id: { $in: commentIds } });
    for (const deletedComment of deletedComments) {
      await notiController.notifyCommentDisapproval(deletedComment);
    }
    const deletedCount = await Comment.deleteMany({ _id: { $in: commentIds } });

    // Find the deleted comments by their IDs (separate query)

    // Send notifications for each deleted comment
    res.status(200).json({
      message: `Deleted ${deletedCount.deletedCount} comments successfully!`,
    });
  } catch (error) {
    console.error("Error deleting comments:", error);
    res.status(500).json({ error: "error", message: error.message });
  }
};

// Function to classify comment
async function classifyCommentHandler(text) {
  try {
    console.log("type.NLP_URL", type.NLP_URL);
    const response = await axios.post(`${type.NLP_URL}/nlp/comment/classify`, {
      text,
    });
    return response.data; // Return the classification data
  } catch (error) {
    console.error("Error classifying comment:", error);
    throw error; // Re-throw the error for handling in the main function
  }
}

exports.approveCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        is_approved: true,
      },
      { new: true }
    );
    await notiController.createNewCommentNotification(
      comment.post,
      "comment",
      comment.account,
      comment.content
    );
    await notiController.notifyCommentApproval(comment);
    if (!comment) {
      return res.status(404).send({ err: "Comment not found" });
    }

    res.status(200).json({ message: "Comment approved" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.approveManyComments = async (req, res) => {
  try {
    const commentIds = req.body.commentIds;

    const updatedComments = await Comment.updateMany(
      { _id: { $in: commentIds } },
      {
        is_approved: true,
      }
    );

    // Check if any comments were updated
    if (updatedComments.modifiedCount === 0) {
      return res.status(404).send("No comments found with the provided IDs.");
    } else {
      const approvedComments = await Comment.find({ _id: { $in: commentIds } });
      for (const approvedComment of approvedComments) {
        await notiController.notifyCommentApproval(approvedComment);
      }
    }

    res.json({
      message: `${updatedComments.modifiedCount} comments approved successfully!`,
    });
  } catch (error) {
    console.error("Error deleting comments:", error);
    res.status(500).json({ error: "error", message: error.message });
  }
};
