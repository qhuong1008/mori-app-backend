const express = require("express");
const router = express.Router();
var cors = require("cors");
const bookCategoryController = require("../controller/bookCategory.controller");

// Routes for book categories
router.post("/bookCategories", cors(), bookCategoryController.createBookCategory);
router.get("/bookCategories", cors(), bookCategoryController.findAll);
router.get("/bookCategories/:id", cors(), bookCategoryController.findOne);
router.put("/bookCategories/:id", cors(), bookCategoryController.update);
router.delete("/bookCategories/:id", cors(), bookCategoryController.delete);

module.exports = router;
