const express = require("express");
const router = express.Router();
const cors = require("cors");
const postController = require("../controller/post.controller");
const multer = require("multer");
const path = require("path");
// Route cho các API cần xác thực đăng nhập bằng username, password
const authMiddleware = require("../auth/auth.middlewares");
const isAuth = authMiddleware.isAuth;

// Routes for replies
router.post("/", isAuth, postController.createPost);
router.put("/:id", isAuth, postController.editPost);
router.get("/", postController.findAll);
router.get("/:id", postController.findById);
router.get("/user/:id", postController.findByUserId);
router.delete("/:id", isAuth, postController.deletePost);
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

router.post("/:id/like", postController.likePost);
router.post("/:id/share", postController.sharePost);

module.exports = router;
