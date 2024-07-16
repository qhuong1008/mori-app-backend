const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const multer = require("multer");
const path = require("path");
const book = require("../controller/book.controller");
const recommend = require("../controller/recommendation.controller");

router.get("/get-book", book.findAll);
router.get("/get-namebook", book.findAllNameBook);
router.get("/get-book/ebook", book.findAllEBooks);

router.post("/get-book/textToSpeech", book.textToSpeech);
router.get(
  "/get-recommendations/:id",
  recommend.getRecommendationsOfBook
);
router.get("/add-recommendations", recommend.createRecommendations);

router.get("/get-book/audio-book", book.findAllAudioBooks);
router.get("/search", book.searchBookByName);
router.patch("/:id", book.update);
router.delete("/:id", book.delete);
router.get("/get-book/:id", book.findById);
router.post("/get-book/category", book.findBookByCategory);
router.post("/add-book", book.create);
router.post("/search", book.findBookWithSearchValue);
router.post("/total-read/:id", book.increaseTotalRead);
router.post("/total-hearted/:id", book.increaseTotalHearted);
router.post("/total-saved/:id", book.updateTotalSaved);

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

router.post("/upload-image", uploadBookImg.single("image"), book.uploadImage);
router.post("/upload-epub", uploadBookEpub.single("file"), book.uploadEpub);
router.post("/upload-audio", uploadBookAudio.single("file"), book.uploadAudio);

module.exports = router;
