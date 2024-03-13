const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");
const { authenticateAllowedOrigins } = require("../auth/auth.middlewares");

// Enable CORS
// router.use(cors());

// Routes for tags
router.post(
  "/add-tag",
  cors(),
  authenticateAllowedOrigins,
  tagController.createTag
);
router.get(
  "/get-tags",
  cors(),
  authenticateAllowedOrigins,
  tagController.getAllTags
);
router.get(
  "/get-tag/:id",
  cors(),
  authenticateAllowedOrigins,
  tagController.findById
);
router.put("/:id", cors(), authenticateAllowedOrigins, tagController.updateTag);
router.post("", cors(), authenticateAllowedOrigins, tagController.createTag);
router.delete(
  "/:id",
  cors(),
  authenticateAllowedOrigins,
  tagController.deleteTag
);

module.exports = router;
