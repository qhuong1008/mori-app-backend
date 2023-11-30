const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");

// Enable CORS
// router.use(cors());

// Routes for tags
router.post("/add-tag", cors(), tagController.createTag);
router.get("/get-tags", cors(), tagController.getAllTags);
router.get("/get-tag/:id", cors(), tagController.findById);
router.patch("/update/:id", cors(), tagController.updateTag);
router.delete("/delete/:id", cors(), tagController.deleteTag);

module.exports = router;
