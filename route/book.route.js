const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const multer = require("multer");
const path = require("path");
const book = require("../controller/book.controller");
const recommend = require("../controller/recommendation.controller");

router.get("/get-book", cors(), book.findAll);
router.get("/get-namebook", cors(), book.findAllNameBook);
router.get("/get-book/ebook", cors(), book.findAllEBooks);

router.post("/get-book/textToSpeech", cors(), book.textToSpeech);
router.get(
  "/get-recommendations/:id",
  cors(),
  recommend.getRecommendationsOfBook
);
router.get("/add-recommendations", cors(), recommend.createRecommendations);

router.get("/get-book/audio-book", cors(), book.findAllAudioBooks);
router.get("/search", cors(), book.searchBookByName);
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

const bookAudioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../data/bookaudio/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const uploadBookAudio = multer({
  storage: bookAudioStorage,
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
router.post(
  "/upload-audio",
  uploadBookAudio.single("file"),
  cors(),
  book.uploadAudio
);

module.exports = router;
