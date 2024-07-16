const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");

// Routes for tags
router.post("/add-tag", tagController.createTag);
router.get("/get-tags", tagController.getAllTags);
router.get("/get-tag/:id", tagController.findById);
router.put("/:id", tagController.updateTag);
router.post("", tagController.createTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
