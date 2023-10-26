const express = require("express");
const router = express.Router();
const cors = require("cors");
const tagController = require("../controller/tag.controller");

// Enable CORS
// router.use(cors());

// Routes for tags
router.post("/tags", cors(), tagController.createTag);
router.get("/tags", cors(), tagController.getAllTags);
router.put("/tags/:id", cors(), tagController.updateTag);
router.delete("/tags/:id", cors(), tagController.deleteTag);

module.exports = router;