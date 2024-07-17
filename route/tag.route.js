const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");

// Routes for tags
router.post("/add-tag", cors(), tagController.createTag);
router.get("/get-tags", cors(), tagController.getAllTags);
router.get("/get-tag/:id", cors(), tagController.findById);
router.put("/:id", cors(), tagController.updateTag);
router.post("", cors(), tagController.createTag);
router.delete("/:id", cors(), tagController.deleteTag);

module.exports = router;
