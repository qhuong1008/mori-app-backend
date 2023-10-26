const express = require("express");
const router = express.Router();
const cors = require("cors");
const myLibraryController = require("../controller/myLibrary.controller");

// Enable CORS
//router.use(cors());

// Routes for my libraries
// router.post("/mylibraries", cors(), myLibraryController.create);
router.post("/mylibraries", cors(), myLibraryController.addBookToMyLibrary);
router.get("/mylibraries", cors(), myLibraryController.getAllBookInMyLibrary);
router.delete("/mylibraries/:id", cors(), myLibraryController.deleteBookFromMyLibrary);

module.exports = router;