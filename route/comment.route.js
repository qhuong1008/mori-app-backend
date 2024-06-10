const express = require("express");
const router = express.Router();
const cors = require("cors");
const commentController = require("../controller/comment.controller");

// Routes for post comments
router.post("/", cors(), commentController.createComment);
router.post("/user", cors(), commentController.getAllCommentsByUserId);
router.post("/reply", cors(), commentController.createReplyComment);
router.post("/:id/like", cors(), commentController.likeComment);
router.delete(
  "/delete-one/:id",
  cors(),
  commentController.deleteOneCommentById
);
router.post("/delete-many", cors(), commentController.deleteManyComments);

module.exports = router;
