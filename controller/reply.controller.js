const Reply = require("../model/reply.model");
const Comment = require("../model/comment.model");

// Hàm tạo mới reply cho một comment
exports.createReply = async function (req, res) {
  try {
    const { commentId, content } = req.body;
    const user = res.locals.account;
    let newReply = new Reply({
      user: user.id,
      commentId: commentId,
      content: content,
    });
    await newReply.save();
    let comment = await Comment.findById(commentId);
    comment.replies.push(newReply.id);
    comment.save();
    return res.status(200).json(newReply);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

// Hàm lấy tất cả các replies của một comment
exports.getAllRepliesForComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    // Lấy tất cả các replies của comment từ cơ sở dữ liệu
    const repliesForComment = await Reply.find({ comment_id });

    return res.status(200).json({ repliesForComment });
  } catch (error) {
    console.error("Error getting replies for comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm cập nhật thông tin của một reply
exports.updateReply = async (req, res) => {
  try {
    const replyId = req.params.replyId;
    const { content } = req.body;

    const replyToUpdate = await Reply.findById(replyId);
    if (!replyToUpdate) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Cập nhật thông tin reply
    replyToUpdate.content = content;
    await replyToUpdate.save();

    return res.status(200).json({
      message: "Reply updated successfully",
      updatedReply: replyToUpdate,
    });
  } catch (error) {
    console.error("Error updating reply:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm xóa một reply
exports.deleteReply = async (req, res) => {
  try {
    const replyId = req.params.replyId;
    const deletedReply = await Reply.findByIdAndRemove(replyId);

    if (!deletedReply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    return res
      .status(200)
      .json({ message: "Reply deleted successfully", deletedReply });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
