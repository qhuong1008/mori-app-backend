const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const multer = require("multer");
const path = require("path");
const book = require("../controller/book.controller");

router.get("/get-book", cors(), book.findAll);
router.get("/get-book/ebook", cors(), book.findAllEBooks);
router.get("/get-book/audio-book", cors(), book.findAllAudioBooks);
router.patch("/:id", cors(), book.update);
router.delete("/:id", cors(), book.delete);
router.get("/get-book/:id", cors(), book.findById);
router.post("/get-book/category", cors(), book.findBookByCategory);
router.post("/add-book", cors(), book.create);
router.post("/search", cors(), book.findBookWithSearchValue);
router.post("/total-read/:id", cors(), book.increaseTotalRead);
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

// Multer Configuration
const bookImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../data/bookimg/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadBookImg = multer({
  storage: bookImgStorage,
});

const bookEpubStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../data/bookepub/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadBookEpub = multer({
  storage: bookEpubStorage,
});

router.post(
  "/upload-image",
  uploadBookImg.single("image"),
  cors(),
  book.uploadImage
);
router.post(
  "/upload-epub",
  uploadBookEpub.single("file"),
  cors(),
  book.uploadEpub
);

module.exports = router;
