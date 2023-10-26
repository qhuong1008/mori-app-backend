const Comment = require("../model/comment.model");

exports.createComment = async (req, res) => {
  try {
    const { book, content } = req.body;
    const user = res.locals.account;
    let newComment = new Comment({
      user: user.id,
      book: book,
      content: content,
    });
    await newComment.save();
    return res.status(200).json("Comment added successfully!");
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

exports.getCommentbyBookId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const comments = await Comment.find({ book: bookId });

    if (comments.length > 0) {
      res.json({ comments: comments, statusCode: 200 });
    } else {
      res.json({ message: "No comments found for the book", statusCode: 200 });
    }
  } catch (error) {
    console.error("Error finding comments:", error);
    res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const user = res.locals.account;
    let deletedComment = await Comment.findByIdAndRemove({
      id: id,
      user: user.id,
    });
    if (deletedComment) {
      res.json({ message: "Comment deleted successfully.", statusCode: 200 });
    } else {
      res.json({ message: "Comment not found.", statusCode: 404 });
    }
  } catch (err) {
    console.error("Error delete comment: ", err);
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

exports.postReact = async function (req, res) {};
