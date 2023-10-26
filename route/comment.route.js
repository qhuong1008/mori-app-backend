const express = require("express");
const router = express.Router();
const cors = require("cors");
const commentController = require("../controller/comment.controller");

// Enable CORS
//router.use(cors());

// Routes for comments
router.post("/comments", cors(), commentController.createComment);
router.get("/comments", cors(), commentController.getCommentbyBookId);
router.put("/comments/:id", cors(), commentController.postReact);
router.delete("/comments/:id", cors(), commentController.deleteComment);

module.exports = router;