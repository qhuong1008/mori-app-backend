const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const multer = require("multer");

const book = require("../controller/book.controller");
const { authenticateAllowedOrigins } = require("../auth/auth.middlewares");
router.get(
  "/get-book",
  cors(),

  book.findAll
);
router.get(
  "/get-book/ebook",
  cors(),

  book.findAllEBooks
);
router.get(
  "/get-book/audio-book",
  cors(),

  book.findAllAudioBooks
);
router.patch("/:id", cors(), book.update);
router.delete("/:id", cors(), book.delete);
router.get("/get-book/:id", cors(), book.findById);
router.post(
  "/get-book/category",
  cors(),

  book.findBookByCategory
);
router.post("/add-book", cors(), book.create);
router.post(
  "/search",
  cors(),

  book.findBookWithSearchValue
);
router.post(
  "/total-read/:id",
  cors(),

  book.increaseTotalRead
);
router.post(
  "/total-hearted/:id",
  cors(),

  book.increaseTotalHearted
);
router.post(
  "/total-saved/:id",
  cors(),

  book.updateTotalSaved
);

module.exports = router;
