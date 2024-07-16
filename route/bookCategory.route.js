const express = require("express");
const router = express.Router();
var cors = require("cors");
const bookCategoryController = require("../controller/bookCategory.controller");

// Routes for book categories
router.post("/add-category", bookCategoryController.createBookCategory);
router.get("/get-categories", bookCategoryController.findAll);
router.get("/get-category/:id", bookCategoryController.findById);
router.put("/update/:id", bookCategoryController.update);
router.delete("/delete/:id", bookCategoryController.delete);

module.exports = router;
