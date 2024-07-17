const express = require("express");
const router = express.Router();
const cors = require("cors");
const commentController = require("../controller/comment.controller");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

// Routes for post comments
router.get("/", commentController.getAllComments);
router.post("/", commentController.createComment);
router.post("/user", isAuth, commentController.getAllCommentsByUserId);
router.post("/reply", isAuth, commentController.createReplyComment);
router.post("/:id/like", isAuth, commentController.likeComment);
router.delete(
  "/delete-one/:id",
  commentController.deleteOneCommentById
);
router.post("/delete-many", commentController.deleteManyComments);
router.post("/:id/approve", commentController.approveCommentById);
router.post("/approve-many", commentController.approveManyComments);

module.exports = router;
