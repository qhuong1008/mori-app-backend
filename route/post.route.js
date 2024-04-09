const express = require("express");
const router = express.Router();
const cors = require("cors");
const postController = require("../controller/post.controller");

// Routes for replies
router.post("/", cors(), postController.createPost);
router.get("/", cors(), postController.findAll);
router.get("/:id", cors(), postController.findById);
router.get("/user/:id", cors(), postController.findByUserId);
router.delete("/:id", cors(), postController.deletePost);

module.exports = router;
