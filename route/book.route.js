const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const multer = require("multer");

const book = require("../controller/book.controller");

router.get("/get-book", cors(), book.findAll);
router.get("/get-book/:id", cors(), book.findById);
router.post("/add-book", cors(), book.create);
router.post("/search", cors(), book.findBookWithSearchValue);
router.post("/total-read/:id", cors(), book.increaseTotalRead);
router.post("/total-saved/:id", cors(), book.updateTotalSaved);

module.exports = router;
