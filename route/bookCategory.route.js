const express = require("express");
const router = express.Router();
var cors = require("cors");
const bookCategoryController = require("../controller/bookCategory.controller");

// Routes for book categories
router.post("/add-category", cors(), bookCategoryController.createBookCategory);
router.get("/get-categories", cors(), bookCategoryController.findAll);
router.get("/get-category/:id", cors(), bookCategoryController.findOne);
router.put("/update/:id", cors(), bookCategoryController.update);
router.delete("/delete/:id", cors(), bookCategoryController.delete);

module.exports = router;
