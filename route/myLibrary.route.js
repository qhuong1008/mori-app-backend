const express = require("express");
const router = express.Router();
const cors = require("cors");
const myLibraryController = require("../controller/myLibrary.controller");

// Enable CORS
//router.use(cors());

// Routes for my libraries
// router.post("/mylibraries", cors(), myLibraryController.create);
router.post("/add-book", cors(), myLibraryController.addBookToMyLibrary);
router.get(
  "/get-books/:id",
  cors(),
  myLibraryController.getAllBooksInMyLibrary
);
router.delete("/book/:id", cors(), myLibraryController.deleteBookFromMyLibrary);

module.exports = router;
