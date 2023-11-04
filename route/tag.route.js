const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");

// Enable CORS
// router.use(cors());

// Routes for tags
router.post("/new", cors(), tagController.createTag);
router.get("/get-tags", cors(), tagController.getAllTags);
router.get("/:id", cors(), tagController.findById);
router.put("/:id", cors(), tagController.updateTag);
router.delete("/:id", cors(), tagController.deleteTag);

module.exports = router;
