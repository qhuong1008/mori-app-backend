const express = require("express");
const router = express.Router();
const cors = require("cors");
const postController = require("../controller/post.controller");
const multer = require("multer");
const path = require("path");

// Routes for replies
router.post("/", cors(), postController.createPost);
router.get("/", cors(), postController.findAll);
router.get("/:id", cors(), postController.findById);
router.get("/user/:id", cors(), postController.findByUserId);
router.delete("/:id", cors(), postController.deletePost);
// Multer Configuration
const postImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../data/postimg/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadPostImg = multer({
  storage: postImgStorage,
});

router.post(
  "/upload-image",
  uploadPostImg.single("image"),
  cors(),
  postController.uploadImage
);

router.post("/:id/like", cors(), postController.likePost);
router.post("/:id/share", cors(), postController.sharePost);

module.exports = router;
